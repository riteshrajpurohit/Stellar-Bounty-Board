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
