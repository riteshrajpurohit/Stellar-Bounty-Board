import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertSubmission, updateSubmissionStatus } from '../lib/submission';
import type { SubmissionInsert } from '../types';

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSubmission: SubmissionInsert) => insertSubmission(newSubmission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.bounty_id] });
    },
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, status }: { submissionId: string, status: string, bountyId: string }) => 
      updateSubmissionStatus(submissionId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.bountyId] });
    },
  });
};
