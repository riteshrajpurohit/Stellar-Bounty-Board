import { useQuery } from '@tanstack/react-query';
import { fetchSubmissionsForBounty, fetchPayoutsForBounty } from '../lib/submission';

export const useBountySubmissions = (bountyId: string) => {
  return useQuery({
    queryKey: ['submissions', bountyId],
    queryFn: () => fetchSubmissionsForBounty(bountyId),
    enabled: !!bountyId,
  });
};

export const useBountyPayouts = (bountyId: string) => {
  return useQuery({
    queryKey: ['payouts', bountyId],
    queryFn: () => fetchPayoutsForBounty(bountyId),
    enabled: !!bountyId,
  });
};
