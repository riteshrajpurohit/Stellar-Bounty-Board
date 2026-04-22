import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertBounty } from '../lib/bounty';
import type { BountyInsert } from '../types';

export const useCreateBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBounty: BountyInsert) => insertBounty(newBounty),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};
