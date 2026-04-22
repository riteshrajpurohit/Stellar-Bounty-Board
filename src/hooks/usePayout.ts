import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createAndSendPayment } from '../lib/stellar/payments';
import { insertPayoutRecord, updateBountyStatus } from '../lib/submission';

export type PayoutStatus = 'idle' | 'signing' | 'submitting' | 'success' | 'error';

export const usePayout = (bountyId: string) => {
  const [status, setStatus] = useState<PayoutStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [txHash, setTxHash] = useState('');
  const queryClient = useQueryClient();

  const handlePayout = async ({ creatorWallet, winnerWallet, amount, asset }: { creatorWallet: string, winnerWallet: string, amount: number, asset: string }) => {
    try {
      setStatus('signing');
      setErrorMsg('');
      
      const horizonResult: any = await createAndSendPayment({
        creatorWallet,
        winnerWallet,
        amount,
        assetCode: asset
      });
      
      setStatus('submitting');
      
      const hash = horizonResult.hash;
      setTxHash(hash);

      // Save to database
      await insertPayoutRecord({
        bounty_id: bountyId,
        winner_wallet: winnerWallet,
        tx_hash: hash,
        amount: amount,
        asset: asset,
        status: 'success'
      });

      // Update bounty status
      await updateBountyStatus(bountyId, 'awarded');
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
      queryClient.invalidateQueries({ queryKey: ['bounties', bountyId] });
      queryClient.invalidateQueries({ queryKey: ['payouts', bountyId] });

      setStatus('success');
      return true;

    } catch (error: any) {
      console.error("Payout failed:", error);
      setStatus('error');
      setErrorMsg(error.message || 'Transaction failed or rejected signature');
      return false;
    }
  };

  return {
    status,
    errorMsg,
    txHash,
    handlePayout
  };
};
