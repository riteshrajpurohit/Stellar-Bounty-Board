import { useState, useMemo } from 'react';
import { useBounties } from '../hooks/useBounties';
import { BountyCard } from '../components/BountyCard';
import { BountyFilters } from '../components/BountyFilters';
import { Loader2 } from 'lucide-react';

export const Marketplace = () => {
  const { data: bounties, isLoading, isError } = useBounties();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredBounties = useMemo(() => {
    if (!bounties) return [];

    return bounties.filter((bounty) => {
      const matchesSearch =
        bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bounty.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || bounty.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [bounties, searchQuery, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bounty Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover opportunities, contribute to the Stellar ecosystem, and earn rewards.
          </p>
        </div>
        {bounties && (
          <span className="text-sm text-muted-foreground shrink-0">
            {filteredBounties.length} of {bounties.length} bounties
          </span>
        )}
      </div>

      {/* Single responsive layout — filters on top for mobile, sidebar on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <BountyFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
          />
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-600 bg-red-50 rounded-xl border border-red-200 px-6">
              <p className="font-semibold">Failed to load bounties.</p>
              <p className="text-sm text-red-500 mt-1">Check your internet connection and Supabase credentials.</p>
            </div>
          ) : filteredBounties.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
              <h3 className="font-semibold text-lg text-foreground">No bounties found</h3>
              <p className="text-muted-foreground mt-1 mb-4">Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
                className="text-primary hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
