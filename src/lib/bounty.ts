import { supabase } from './supabase';
import type { BountyInsert } from '../types';

export const fetchBounties = async () => {
  const { data, error } = await supabase
    .from('bounties')
    .select(`
      *,
      profiles:creator_wallet (name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as any[]; 
};

export const fetchBountyById = async (id: string) => {
  const { data, error } = await supabase
    .from('bounties')
    .select(`
      *,
      profiles:creator_wallet (name, email, bio)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as any;
};

export const insertBounty = async (bounty: BountyInsert) => {
  const { data, error }: any = await (supabase as any)
    .from('bounties')
    .insert([bounty])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
