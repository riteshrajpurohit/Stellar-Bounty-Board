import {
  TransactionBuilder,
  Networks,
  Horizon,
  Asset,
  Operation,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

/**
 * Parse a Horizon SubmitTransactionResponse error into a human-readable string.
 * Horizon wraps error details inside `extras.result_codes`.
 */
function parseHorizonError(error: unknown): string {
  if (!error || typeof error !== "object") return "Transaction failed.";

  const err = error as any;

  // Axios-style Horizon error
  const resultCodes = err?.response?.data?.extras?.result_codes;
  if (resultCodes) {
    const txResult: string = resultCodes.transaction || "";
    const opResults: string[] = resultCodes.operations || [];

    if (txResult === "tx_insufficient_fee")
      return "Insufficient fee. Please try again.";
    if (txResult === "tx_bad_auth")
      return "Bad signature — did you reject in Freighter?";
    if (
      txResult === "tx_insufficient_balance" ||
      opResults.includes("op_underfunded")
    ) {
      return "Insufficient XLM balance. Fund your testnet wallet at friendbot.stellar.org.";
    }
    if (opResults.includes("op_no_destination")) {
      return "Recipient wallet does not exist on the network. They need a funded account first.";
    }
    // Return the raw code as fallback
    if (txResult) return `Transaction failed: ${txResult}`;
    if (opResults.length > 0)
      return `Operation failed: ${opResults.join(", ")}`;
  }

  // Freighter rejection
  const msg: string = err?.message || "";
  if (
    msg.toLowerCase().includes("reject") ||
    msg.toLowerCase().includes("cancel")
  ) {
    return "Transaction rejected in Freighter wallet.";
  }
  if (msg.toLowerCase().includes("user declined")) {
    return "You declined the transaction in Freighter.";
  }

  return msg || "An unknown error occurred. Please try again.";
}

export const createAndSendPayment = async ({
  creatorWallet,
  winnerWallet,
  amount,
  assetCode = "XLM",
}: {
  creatorWallet: string;
  winnerWallet: string;
  amount: number;
  assetCode?: string;
}) => {
  if (assetCode !== "XLM") {
    throw new Error("Only native XLM is supported in this implementation.");
  }

  // 1. Fetch account sequence number from Horizon
  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(creatorWallet);
  } catch {
    throw new Error(
      "Could not load your wallet from the Stellar testnet. Make sure your wallet is funded at friendbot.stellar.org.",
    );
  }

  // 2. Build the payment transaction
  const amountString = amount.toFixed(7); // Stellar requires up to 7 decimal places

  const tx = new TransactionBuilder(sourceAccount, {
    fee: "200", // Slightly above base to avoid fee bump issues
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: winnerWallet,
        asset: Asset.native(),
        amount: amountString,
      }),
    )
    .setTimeout(180) // 3-minute window
    .build();

  // 3. Serialize to XDR and request Freighter to sign
  const xdr = tx.toXDR();

  let signedResponse: any;
  try {
    signedResponse = await signTransaction(xdr, {
      networkPassphrase: Networks.TESTNET,
    });
  } catch (freighterErr: any) {
    // User rejected the signing prompt
    const msg = freighterErr?.message || String(freighterErr);
    throw new Error(
      msg.toLowerCase().includes("user") ||
        msg.toLowerCase().includes("cancel") ||
        msg.toLowerCase().includes("reject")
        ? "Transaction rejected in Freighter wallet."
        : `Signing error: ${msg}`,
    );
  }

  if (signedResponse?.error) {
    throw new Error(`Freighter signing error: ${signedResponse.error}`);
  }

  // 4. Extract the signed XDR string
  // Freighter API commonly returns { signedTxXdr }, with some legacy variants.
  const signedXdr: string =
    typeof signedResponse === "string"
      ? signedResponse
      : (signedResponse?.signedTxXdr ??
        signedResponse?.signedTx ??
        signedResponse?.signedTransaction ??
        signedResponse?.xdr ??
        null);

  if (!signedXdr || typeof signedXdr !== "string") {
    throw new Error(
      "Freighter did not return a signed transaction. Please try again.",
    );
  }

  // 5. Deserialize and submit to Horizon
  let submitResult: Horizon.HorizonApi.SubmitTransactionResponse;
  try {
    const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    submitResult = await server.submitTransaction(signedTx);
  } catch (submitErr: unknown) {
    throw new Error(parseHorizonError(submitErr));
  }

  if (!submitResult.successful) {
    throw new Error(
      "Transaction was submitted but Horizon reported it as unsuccessful.",
    );
  }

  return submitResult; // Contains submitResult.hash
};
