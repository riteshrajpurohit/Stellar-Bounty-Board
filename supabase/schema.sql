-- COMPLETELY RESET AND INITIALIZE DATABASE SCHEMA --

-- Step 0: Clean up everything safely first so we don't get "already exists" errors
DROP TABLE IF EXISTS payout_transactions CASCADE;
DROP TABLE IF EXISTS bounty_submissions CASCADE;
DROP TABLE IF EXISTS bounties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS payout_status CASCADE;
DROP TYPE IF EXISTS submission_status CASCADE;
DROP TYPE IF EXISTS bounty_status CASCADE;

-----------------------------------------------------
-- 1. PROFILES TABLE
-----------------------------------------------------
CREATE TABLE profiles (
  wallet_address text primary key,
  name text not null,
  email text not null,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." on profiles for select using (true);
CREATE POLICY "Users can insert their own profile." on profiles for insert with check (true); 
CREATE POLICY "Users can update their own profile." on profiles for update using (true);


-----------------------------------------------------
-- 2. BOUNTIES TABLE
-----------------------------------------------------
CREATE TYPE bounty_status AS ENUM ('draft', 'open', 'in_review', 'awarded', 'closed');

CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL,
  reward_asset TEXT NOT NULL DEFAULT 'XLM',
  difficulty TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status bounty_status NOT NULL DEFAULT 'open',
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public bounties are viewable by everyone" ON bounties for select using (true);
CREATE POLICY "Users can insert their own bounties" ON bounties for insert with check (true);
CREATE POLICY "Creators can update their own bounties" ON bounties for update using (true);


-----------------------------------------------------
-- 3. SUBMISSIONS TABLE
-----------------------------------------------------
CREATE TYPE submission_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected');

CREATE TABLE bounty_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  submitter_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  submission_link TEXT,
  notes TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submissions viewing" ON bounty_submissions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own submissions" ON bounty_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Bounty creators can update status of submissions" ON bounty_submissions FOR UPDATE USING (true);


-----------------------------------------------------
-- 4. PAYOUTS TABLE
-----------------------------------------------------
CREATE TYPE payout_status AS ENUM ('pending', 'success', 'failed');

CREATE TABLE payout_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  winner_wallet TEXT NOT NULL REFERENCES profiles(wallet_address) ON DELETE CASCADE,
  tx_hash TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  asset TEXT NOT NULL DEFAULT 'XLM',
  status payout_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public payouts viewing" ON payout_transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert payout records" ON payout_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payout records" ON payout_transactions FOR UPDATE USING (true);
