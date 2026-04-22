import { supabase } from './supabase';
import type { SubmissionInsert } from '../types';

export const fetchSubmissionsForBounty = async (bountyId: string) => {
  const { data, error } = await supabase
    .from('bounty_submissions')
    .select(`
      *,
      profiles:submitter_wallet (name, email)
    `)
    .eq('bounty_id', bountyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as any[];
};

export const fetchPayoutsForBounty = async (bountyId: string) => {
  const { data, error } = await supabase
    .from('payout_transactions')
    .select('*')
    .eq('bounty_id', bountyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as any[];
};

export const insertSubmission = async (submission: SubmissionInsert) => {
  const { data, error }: any = await (supabase as any)
    .from('bounty_submissions')
    .insert([submission])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateSubmissionStatus = async (submissionId: string, status: string) => {
  const { data, error }: any = await (supabase as any)
    .from('bounty_submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', submissionId)
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateBountyStatus = async (bountyId: string, status: string) => {
  const { data, error }: any = await (supabase as any)
    .from('bounties')
    .update({ status })
    .eq('id', bountyId)
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data;
};

export const insertPayoutRecord = async (payout: any) => {
  const { data, error }: any = await (supabase as any)
    .from('payout_transactions')
    .insert([payout])
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data;
};
