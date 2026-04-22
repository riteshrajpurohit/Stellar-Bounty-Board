import { useParams, Link } from 'react-router-dom';
import { useBounty } from '../hooks/useBounties';
import { useWallet } from '../hooks/useWallet';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Loader2, ArrowLeft, ExternalLink, Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';
import { truncateAddress } from '../lib/stellar';
import { format } from 'date-fns';
import { SubmissionForm } from '../components/SubmissionForm';
import { ReviewPanel } from '../components/ReviewPanel';
import { useBountyPayouts } from '../hooks/useSubmissions';

export const BountyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bounty, isLoading, isError } = useBounty(id || "");
  const { address } = useWallet();
  const { data: payouts } = useBountyPayouts(id || "");

  const isCreator = address && bounty?.creator_wallet === address;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError || !bounty) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Bounty Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">This bounty may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link to="/bounties">Return to Marketplace</Link>
        </Button>
      </div>
    </div>
  );

  const isExpired = new Date(bounty.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <Link to="/bounties" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to bounties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">{bounty.category}</Badge>
              {bounty.status && <Badge variant="outline" className="capitalize">{bounty.status.replace('_', ' ')}</Badge>}
              {bounty.difficulty && <Badge variant="outline">{bounty.difficulty}</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {bounty.title}
            </h1>
            <div className="flex items-center gap-2 text-primary font-bold text-2xl mb-6">
              {bounty.reward_amount} {bounty.reward_asset}
            </div>
          </div>

          <div className="prose prose-sm sm:prose max-w-none text-foreground bg-card glass-shadow rounded-xl p-6 sm:p-8 border border-border">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 border-b pb-2">
              <AlignLeft className="h-5 w-5" /> Requirements
            </h3>
            <div className="whitespace-pre-wrap">{bounty.description}</div>
            
            {bounty.external_url && (
              <div className="mt-8 pt-6 border-t font-medium">
                <a href={bounty.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                  View External Reference <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t">
            {isCreator ? (
              <ReviewPanel bounty={bounty} creatorWallet={address} />
            ) : (
              bounty.status === 'open' && !isExpired && address ? (
                <SubmissionForm bountyId={bounty.id} />
              ) : bounty.status !== 'open' ? (
                <Card className="bg-muted/50">
                  <CardContent className="py-6 text-center text-muted-foreground">
                    This bounty is no longer accepting new submissions.
                  </CardContent>
                </Card>
              ) : !address ? (
                 <Card className="bg-muted/50">
                  <CardContent className="py-6 text-center text-muted-foreground">
                    Please connect your wallet to submit your work.
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {payouts && payouts.length > 0 && payouts[0].status === 'success' && (
            <Card className="glass-shadow border-emerald-500 bg-emerald-50/20">
              <CardContent className="py-6 px-6 text-center">
                <h3 className="font-bold text-emerald-600 flex justify-center items-center gap-2 mb-2">
                  <User className="h-5 w-5" /> Bounty Awarded
                </h3>
                <p className="text-sm font-medium">Winner: {truncateAddress(payouts[0].winner_wallet)}</p>
                <div className="mt-4">
                  <a href={`https://testnet.stellarchain.io/transactions/${payouts[0].tx_hash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition-colors">
                    Verify Payout on Chain <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-shadow">
            <CardContent className="p-6">
              <Button 
                size="lg" 
                className="w-full mb-4 shadow-lg text-wrap h-auto py-3" 
                disabled={isExpired || bounty.status !== 'open'}
              >
                {bounty.status === 'awarded' || bounty.status === 'closed' ? "Bounty Completed" :
                 isExpired ? "Deadline Passed" : 
                 "Accepting Submissions"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Payment protected by the Stellar network.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-shadow">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold border-b pb-2">Bounty Details</h3>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Creator</p>
                  <p className="text-sm text-muted-foreground">{bounty.profiles?.name || truncateAddress(bounty.creator_wallet)}</p>
                  {bounty.profiles?.email && (
                     <p className="text-xs text-muted-foreground truncate">{bounty.profiles?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(bounty.deadline), 'PPP')}</p>
                  <p className={`text-xs ${isExpired ? "text-red-500" : "text-emerald-500"}`}>
                    {isExpired ? "Expired" : "Accepting submissions"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
