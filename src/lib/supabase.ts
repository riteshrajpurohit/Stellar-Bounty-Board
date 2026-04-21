import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Supabase configuration
// Using placeholders; the end-user will configure this via .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
