import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { truncateAddress } from '../lib/stellar';

export const BountyCard = ({ bounty }: { bounty: any }) => {
  const isExpired = new Date(bounty.deadline) < new Date();
  
  return (
    <Link to={`/bounties/${bounty.id}`} className="block group">
      <Card className="h-full glass-shadow border-primary/10 transition-all duration-300 hover:shadow-lg hover:border-primary/30 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {bounty.category}
              </Badge>
              <Badge variant={bounty.status === 'awarded' || bounty.status === 'closed' ? "outline" : "default"} 
                     className={bounty.status === 'awarded' ? 'bg-emerald-500 text-white' : bounty.status === 'open' ? 'bg-blue-500' : 'capitalize'}>
                {bounty.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1 font-bold text-lg text-primary shrink-0">
              {bounty.reward_amount} {bounty.reward_asset}
            </div>
          </div>
          <CardTitle className="mt-3 text-xl group-hover:text-primary transition-colors line-clamp-2">
            {bounty.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {bounty.description}
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">
              {bounty.profiles?.name || truncateAddress(bounty.creator_wallet)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className={isExpired ? "text-destructive" : ""}>
              {isExpired ? "Expired" : formatDistanceToNow(new Date(bounty.deadline), { addSuffix: true })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
