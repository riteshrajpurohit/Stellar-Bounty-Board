import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Terminal, Copy, ExternalLink, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { isConnected, address } = useWallet();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!address) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();
        
      if (data) {
        setProfile(data);
      } else {
        console.error("Failed to load profile", error);
      }
      setLoading(false);
    };

    if (isConnected && address) {
      fetchProfile();
    } else if (!isConnected) {
      setLoading(false);
    }
  }, [isConnected, address]);

  if (!loading && (!isConnected || !address)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.name || 'Explorer'}
          </p>
        </div>
        
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Bounty
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bounties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Earned (XLM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00</div>
          </CardContent>
        </Card>

        <Card className="glass-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reputation Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">New</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-shadow border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bounty interactions on the Stellar network.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
              <Terminal className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium">No activity yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                You haven't participated in any bounties. Discover open tasks to start building your reputation.
              </p>
              <Button variant="outline" className="mt-6">Browse Bounties</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shadow">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{loading ? '...' : profile?.name}</p>
               </div>
               <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{loading ? '...' : profile?.email}</p>
               </div>
               {profile?.bio && (
                 <div>
                    <label className="text-xs font-medium text-muted-foreground">Bio</label>
                    <p className="text-sm mt-1">{profile.bio}</p>
                 </div>
               )}
               <div className="pt-4 border-t">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Wallet Address</label>
                  <div className="flex items-center justify-between p-2 bg-muted rounded text-xs font-mono">
                     <span className="truncate mr-2">{address}</span>
                     <div className="flex gap-1 shrink-0">
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(address || '')}>
                          <Copy className="h-3 w-3" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                          <a href={`https://stellar.expert/explorer/public/account/${address}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                       </Button>
                     </div>
                  </div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
