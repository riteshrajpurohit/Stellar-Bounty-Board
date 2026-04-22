export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          wallet_address: string
          name: string
          email: string
          bio: string | null
          created_at: string
          last_seen: string
        }
        Insert: {
          wallet_address: string
          name: string
          email: string
          bio?: string | null
          created_at?: string
          last_seen?: string
        }
        Update: {
          wallet_address?: string
          name?: string
          email?: string
          bio?: string | null
          created_at?: string
          last_seen?: string
        }
      }
      bounties: {
        Row: {
          id: string
          creator_wallet: string
          title: string
          description: string
          category: string
          reward_amount: number
          reward_asset: string
          difficulty: string | null
          deadline: string
          status: 'draft' | 'open' | 'in_review' | 'awarded' | 'closed'
          external_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_wallet: string
          title: string
          description: string
          category: string
          reward_amount: number
          reward_asset?: string
          difficulty?: string | null
          deadline: string
          status?: 'draft' | 'open' | 'in_review' | 'awarded' | 'closed'
          external_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_wallet?: string
          title?: string
          description?: string
          category?: string
          reward_amount?: number
          reward_asset?: string
          difficulty?: string | null
          deadline?: string
          status?: 'draft' | 'open' | 'in_review' | 'awarded' | 'closed'
          external_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bounty_submissions: {
        Row: {
          id: string
          bounty_id: string
          submitter_wallet: string
          submission_link: string | null
          notes: string
          status: 'submitted' | 'under_review' | 'approved' | 'rejected'
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          bounty_id: string
          submitter_wallet: string
          submission_link?: string | null
          notes: string
          status?: 'submitted' | 'under_review' | 'approved' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          status?: 'submitted' | 'under_review' | 'approved' | 'rejected'
          reviewed_at?: string | null
        }
      }
      payout_transactions: {
        Row: {
          id: string
          bounty_id: string
          winner_wallet: string
          tx_hash: string
          amount: number
          asset: string
          status: 'pending' | 'success' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          bounty_id: string
          winner_wallet: string
          tx_hash: string
          amount: number
          asset?: string
          status?: 'pending' | 'success' | 'failed'
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'success' | 'failed'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
