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

ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

-- Submissions Security
CREATE POLICY "Public submissions viewing" ON bounty_submissions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own submissions" ON bounty_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Bounty creators can update status of submissions" ON bounty_submissions
  FOR UPDATE USING (true);

-- Payouts Security
CREATE POLICY "Public payouts viewing" ON payout_transactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert payout records" ON payout_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update payout records" ON payout_transactions
  FOR UPDATE USING (true);
