import type { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bounty = Database['public']['Tables']['bounties']['Row']
export type BountyInsert = Database['public']['Tables']['bounties']['Insert']
export type BountySubmission = Database['public']['Tables']['bounty_submissions']['Row']
export type SubmissionInsert = Database['public']['Tables']['bounty_submissions']['Insert']
export type PayoutTransaction = Database['public']['Tables']['payout_transactions']['Row']

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isAllowed: boolean;
  hasFreighter: boolean;
  network?: string;
}
