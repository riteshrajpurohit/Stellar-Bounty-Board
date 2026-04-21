import type { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isAllowed: boolean;
  hasFreighter: boolean;
  network?: string;
}
