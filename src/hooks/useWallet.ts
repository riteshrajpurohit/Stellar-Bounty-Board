import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetworkDetails,
} from "@stellar/freighter-api";
import type { WalletState } from "../types";

type WalletStoreState = WalletState & { isInitializing: boolean };

const initialWalletState: WalletStoreState = {
  address: null,
  isConnected: false,
  isAllowed: false,
  hasFreighter: false,
  isInitializing: true,
};

let walletStore: WalletStoreState = initialWalletState;
const walletSubscribers = new Set<(state: WalletStoreState) => void>();

const setWalletStore = (
  updater: WalletStoreState | ((prev: WalletStoreState) => WalletStoreState),
) => {
  walletStore =
    typeof updater === "function"
      ? (updater as (prev: WalletStoreState) => WalletStoreState)(walletStore)
      : updater;
  walletSubscribers.forEach((subscriber) => subscriber(walletStore));
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletStoreState>(walletStore);

  useEffect(() => {
    walletSubscribers.add(setWallet);
    return () => {
      walletSubscribers.delete(setWallet);
    };
  }, []);

  const checkFreighterInstall = useCallback(async () => {
    try {
      const response = await isConnected();
      const connected = response.isConnected;
      setWalletStore((prev) => ({
        ...prev,
        hasFreighter: connected,
      }));

      if (!connected) {
        setWalletStore((prev) => ({
          ...prev,
          address: null,
          isConnected: false,
          isAllowed: false,
        }));
      }

      return connected;
    } catch (e) {
      console.error("Freighter is not installed or available", e);
      return false;
    }
  }, []);

  const fetchWalletState = useCallback(async () => {
    const installed = await checkFreighterInstall();
    if (!installed) {
      setWalletStore((prev) => ({ ...prev, isInitializing: false }));
      return;
    }

    try {
      const allowedResponse = await isAllowed();
      if (allowedResponse.isAllowed) {
        const addressResponse = await getAddress();
        const network = await getNetworkDetails();

        setWalletStore({
          address: addressResponse.address || null,
          isConnected: true,
          isAllowed: true,
          hasFreighter: true,
          network: network?.network || "unknown",
          isInitializing: false,
        });
      } else {
        setWalletStore((prev) => ({
          ...prev,
          address: null,
          isConnected: false,
          isAllowed: false,
          isInitializing: false,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch wallet state:", error);
      setWalletStore((prev) => ({ ...prev, isInitializing: false }));
    }
  }, [checkFreighterInstall]);

  useEffect(() => {
    if (walletStore.isInitializing) {
      fetchWalletState();
    }
  }, [fetchWalletState]);

  const connect = async () => {
    try {
      const installed = await checkFreighterInstall();
      if (!installed) {
        window.open("https://freighter.app/", "_blank");
        throw new Error("FREIGHTER_NOT_INSTALLED");
      }

      const accessResponse = await requestAccess();

      if (accessResponse.error) {
        throw new Error(accessResponse.error);
      }

      const addressResponse = await getAddress();
      const network = await getNetworkDetails();
      setWalletStore({
        address: addressResponse.address || null,
        isConnected: !!addressResponse.address,
        isAllowed: true,
        hasFreighter: true,
        network: network?.network || "unknown",
        isInitializing: false,
      });
    } catch (error) {
      console.error("User rejected wallet connection", error);
      throw error;
    }
  };

  const disconnect = () => {
    setWalletStore({
      address: null,
      isConnected: false,
      isAllowed: false,
      hasFreighter: walletStore.hasFreighter,
      network: walletStore.network,
      isInitializing: false,
    });
  };

  return {
    ...wallet,
    connect,
    disconnect,
  };
}
