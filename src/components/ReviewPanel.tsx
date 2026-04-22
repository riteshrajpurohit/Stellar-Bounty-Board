import { useBountySubmissions } from '../hooks/useSubmissions';
import { useReviewSubmission } from '../hooks/useSubmissionActions';
import { usePayout } from '../hooks/usePayout';
import { useToast } from './ui/toast';
import type { Bounty } from '../types';
import { PayoutStatusCard } from './PayoutStatusCard';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, ExternalLink, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ReviewPanel = ({ bounty, creatorWallet }: { bounty: Bounty; creatorWallet: string }) => {
  const { data: submissions, isLoading } = useBountySubmissions(bounty.id);
  const reviewSubmission = useReviewSubmission();
  const { status: payoutStatus, errorMsg, txHash, handlePayout } = usePayout(bounty.id);
  const { toast } = useToast();

  const handleApprove = async (submission: any) => {
    try {
      // 1. Trigger the real Stellar payment FIRST — before touching DB
      const payoutSucceeded = await handlePayout({
        creatorWallet,
        winnerWallet: submission.submitter_wallet,
        amount: bounty.reward_amount,
        asset: bounty.reward_asset,
      });

      if (!payoutSucceeded) {
        // handlePayout already set status to 'error'; don't update DB
        return;
      }

      // 2. Only after tx confirmed: mark submission as approved in DB
      await reviewSubmission.mutateAsync({
        submissionId: submission.id,
        status: 'approved',
        bountyId: bounty.id,
      });

      toast('Payout complete! The bounty has been awarded and the transaction recorded.', 'success');
    } catch (err: any) {
      toast(err?.message || 'Approval failed. Please try again.', 'error');
    }
  };

  if (isLoading)
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-xl font-bold border-b pb-4">
        <Activity className="h-5 w-5 text-primary" /> Creator Review Panel
      </h3>

      {payoutStatus !== 'idle' && (
        <div className="mb-6">
          <PayoutStatusCard status={payoutStatus} errorMsg={errorMsg} txHash={txHash} />
        </div>
      )}

      {!submissions || submissions.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            No submissions yet. Wait for contributors to complete the work!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub: any) => (
            <Card
              key={sub.id}
              className={`glass-shadow transition-all ${
                sub.status === 'approved' ? 'border-emerald-500 bg-emerald-50/10 shadow-emerald-500/10' : ''
              }`}
            >
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{sub.profiles?.name || 'Anonymous Submitter'}</CardTitle>
                  <p
                    className="text-xs text-muted-foreground font-mono mt-1 blur-[1px] hover:blur-none transition-all cursor-help"
                    title={sub.submitter_wallet}
                  >
                    {sub.submitter_wallet.slice(0, 6)}...{sub.submitter_wallet.slice(-6)}
                  </p>
                </div>
                <Badge
                  variant={sub.status === 'approved' ? 'default' : 'secondary'}
                  className={sub.status === 'approved' ? 'bg-emerald-500' : 'capitalize'}
                >
                  {sub.status.replace('_', ' ')}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-4 text-sm mb-4 whitespace-pre-wrap">{sub.notes}</div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-4 text-sm">
                    {sub.submission_link && (
                      <a
                        href={sub.submission_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        View Work <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {bounty.status === 'open' &&
                    sub.status === 'submitted' &&
                    payoutStatus === 'idle' && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleApprove(sub)}
                        disabled={reviewSubmission.isPending}
                      >
                        {reviewSubmission.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing...
                          </>
                        ) : (
                          'Approve & Pay Award'
                        )}
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
