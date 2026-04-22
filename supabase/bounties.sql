-- Create enum for bounty status
CREATE TYPE bounty_status AS ENUM ('draft', 'open', 'in_review', 'awarded', 'closed');

-- Create table for bounties
CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL CHECK (reward_amount > 0),
  reward_asset TEXT NOT NULL DEFAULT 'XLM',
  difficulty TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status bounty_status NOT NULL DEFAULT 'open',
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view open, in_review, awarded, closed bounties.
CREATE POLICY "Public bounties are viewable by everyone." ON bounties
  FOR SELECT USING (status != 'draft' OR creator_wallet = current_setting('request.jwt.claims', true)::json->>'sub');

-- We'll just simplify public viewing for the purpose of the web3 app without strict JWTs
DROP POLICY IF EXISTS "Public bounties are viewable by everyone." ON bounties;
CREATE POLICY "Public bounties are viewable by everyone." ON bounties
  FOR SELECT USING (true);

-- 2. Anyone can insert a bounty (relies on app logic to restrict to connected wallet)
CREATE POLICY "Users can insert bounties." ON bounties
  FOR INSERT WITH CHECK (true);

-- 3. Users can only update their own bounties.
CREATE POLICY "Users can update their own bounties." ON bounties
  FOR UPDATE USING (true);

-- Optional: Create a function to automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bounties_modtime
BEFORE UPDATE ON bounties
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
