import { Card, CardContent } from './ui/card';
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import type { PayoutStatus } from '../hooks/usePayout';

export const PayoutStatusCard = ({
  status,
  errorMsg,
  txHash
}: {
  status: PayoutStatus;
  errorMsg: string;
  txHash: string;
}) => {
  if (status === 'idle') return null;

  return (
    <Card className="glass-shadow overflow-hidden relative shadow-lg">
      <div className={`absolute top-0 left-0 w-full h-1 ${
        status === 'success' ? 'bg-emerald-500' :
        status === 'error' ? 'bg-red-500' :
        'bg-primary animate-pulse'
      }`} />
      
      <CardContent className="pt-6">
        {status === 'signing' && (
          <div className="flex flex-col items-center py-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-lg">Waiting for Signature</h3>
            <p className="text-sm text-muted-foreground mt-1">Please approve the transaction in your Freighter wallet.</p>
          </div>
        )}

        {status === 'submitting' && (
          <div className="flex flex-col items-center py-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-lg">Broadcasting to Stellar</h3>
            <p className="text-sm text-muted-foreground mt-1">Submitting transaction to the Horizon node...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
            <h3 className="font-semibold text-lg text-emerald-600">Payout Complete!</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">The bounty reward has been securely remitted.</p>
            {txHash && (
              <a 
                href={`https://testnet.stellarchain.io/transactions/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4 text-center">
            <XCircle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="font-semibold text-lg text-red-600">Transaction Failed</h3>
            <p className="text-sm text-muted-foreground mt-1 px-4">{errorMsg}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
