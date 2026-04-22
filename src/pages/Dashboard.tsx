import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BountyCreateDialog } from '../components/BountyCreateDialog';
import { Terminal, Copy, ExternalLink, Loader2, CheckCircle2, Trophy } from 'lucide-react';

interface DashboardStats {
  activeBounties: number;
  earnedXLM: number;
}

export const Dashboard = () => {
  const { isConnected, address, isInitializing } = useWallet() as any;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ activeBounties: 0, earnedXLM: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch real stats in parallel
      const [bountiesResult, payoutsResult] = await Promise.all([
        supabase
          .from('bounties')
          .select('id', { count: 'exact', head: true })
          .eq('creator_wallet', address)
          .in('status', ['open', 'in_review']),
        supabase
          .from('payout_transactions')
          .select('amount')
          .eq('winner_wallet', address)
          .eq('status', 'success'),
      ]);

      const activeBounties = bountiesResult.count ?? 0;
      const earnedXLM = (payoutsResult.data ?? []).reduce(
        (sum: number, p: any) => sum + Number(p.amount),
        0
      );

      setStats({ activeBounties, earnedXLM });
      setLoading(false);
    };

    if (isConnected && address && !isInitializing) {
      fetchData();
    } else if (!isConnected && !isInitializing) {
      setLoading(false);
    }
  }, [isConnected, address, isInitializing]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!loading && (!isConnected || !address)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium text-foreground">{profile?.name || 'Explorer'}</span>
          </p>
        </div>
        <BountyCreateDialog />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bounties Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stats.activeBounties}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Open or in-review tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Earned (XLM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : stats.earnedXLM.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved payouts received</p>
          </CardContent>
        </Card>

        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reputation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              {loading ? '...' : stats.earnedXLM > 0 ? 'Active' : 'New'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on payout history</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Card */}
        <Card className="lg:col-span-2 glass-shadow border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your latest bounty interactions on the Stellar network.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl shadow-inner my-2">
              <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary/10">
                <Terminal className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Ready to get started?</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Post a bounty for others to complete, or browse the marketplace for open tasks.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <BountyCreateDialog />
                <Button variant="outline" asChild>
                  <Link to="/bounties">Browse Marketplace</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="glass-shadow">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {profile?.name && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <p className="font-medium mt-0.5">{profile.name}</p>
                </div>
              )}
              {profile?.email && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-0.5">{profile.email}</p>
                </div>
              )}
              {profile?.bio && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Bio</label>
                  <p className="text-sm mt-1">{profile.bio}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Wallet Address</label>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg text-xs font-mono">
                  <span className="truncate mr-2">{address}</span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={copyAddress}
                      title="Copy address"
                    >
                      {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${address}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View on Stellar Explorer (Testnet)"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">Stellar Testnet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
