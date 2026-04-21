
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/button';
import { truncateAddress } from '../lib/stellar';
import { Rocket } from 'lucide-react';

export const Navbar = () => {
  const { isConnected, address, connect, disconnect } = useWallet();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                Stellar Bounty
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium">Connected</span>
                  <span className="text-xs text-muted-foreground">{truncateAddress(address)}</span>
                </div>
                <Button variant="outline" onClick={disconnect} size="sm">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} size="sm">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
