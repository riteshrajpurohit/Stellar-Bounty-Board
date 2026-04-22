import { useQuery } from '@tanstack/react-query';
import { fetchBounties, fetchBountyById } from '../lib/bounty';

export const useBounties = () => {
  return useQuery({
    queryKey: ['bounties'],
    queryFn: fetchBounties,
  });
};

export const useBounty = (id: string) => {
  return useQuery({
    queryKey: ['bounties', id],
    queryFn: () => fetchBountyById(id),
    enabled: !!id,
  });
};
