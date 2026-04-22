import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetworkDetails,
  setAllowed
} from '@stellar/freighter-api';
import type { WalletState } from '../types';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState & { isInitializing: boolean }>({
    address: null,
    isConnected: false,
    isAllowed: false,
    hasFreighter: false,
    isInitializing: true,
  });

  const checkFreighterInstall = useCallback(async () => {
    try {
      const response = await isConnected();
      const connected = response.isConnected;
      setWallet(prev => ({ ...prev, hasFreighter: connected, isConnected: connected }));
      return connected;
    } catch (e) {
      console.error("Freighter is not installed or available", e);
      return false;
    }
  }, []);

  const fetchWalletState = useCallback(async () => {
    const installed = await checkFreighterInstall();
    if (!installed) {
      setWallet(prev => ({ ...prev, isInitializing: false }));
      return;
    }
    
    try {
      const allowedResponse = await isAllowed();
      if (allowedResponse.isAllowed) {
        const addressResponse = await getAddress();
        const network = await getNetworkDetails();
        
        setWallet({
          address: addressResponse.address || null,
          isConnected: true,
          isAllowed: true,
          hasFreighter: true,
          network: network?.network || 'unknown',
          isInitializing: false
        });
      } else {
        setWallet(prev => ({ ...prev, isInitializing: false }));
      }
    } catch (error) {
      console.error("Failed to fetch wallet state:", error);
      setWallet(prev => ({ ...prev, isInitializing: false }));
    }
  }, [checkFreighterInstall]);

  useEffect(() => {
    fetchWalletState();
  }, [fetchWalletState]);

  const connect = async () => {
    try {
      const installed = await checkFreighterInstall();
      if (!installed) {
        window.open("https://freighter.app/", "_blank");
        throw new Error("FREIGHTER_NOT_INSTALLED");
      }

      await setAllowed();
      const accessResponse = await requestAccess();
      
      if (accessResponse.error) {
        throw new Error(accessResponse.error);
      }

      await fetchWalletState();
    } catch (error) {
      console.error("User rejected wallet connection", error);
      throw error;
    }
  };

  const disconnect = () => {
    // Freighter doesn't have a hard disconnect method that clears permissions programmatically,
    // but we clear the local state to emulate log out.
    setWallet({
      address: null,
      isConnected: true, // Still installed
      isAllowed: false,
      hasFreighter: true,
      isInitializing: false,
    });
  };

  return {
    ...wallet,
    connect,
    disconnect
  };
}
