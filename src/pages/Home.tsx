import { useNavigate, Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { Button } from "../components/ui/button";
import { ProfileForm } from "../components/ProfileForm";
import { Rocket, ShieldCheck, Zap, Loader2 } from "lucide-react";

export const Home = () => {
  const { address, connect, isInitializing } = useWallet() as any;
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await connect();
    } catch {
      // Error handling is managed by useToast inside Navbar/hook conceptually,
      // but here we just catch to prevent unhandled promise rejection.
    }
  };

  const handleProfileSuccess = () => {
    navigate("/dashboard");
  };

  if (isInitializing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-8">
      {!address ? (
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Ship Faster. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Earn on Stellar.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The premier bounty board for the Stellar ecosystem. Connect your
              Freighter wallet to claim bounties, build reputation, and get paid
              instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleConnect}
              className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/25"
            >
              Connect Freighter Wallet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto"
              asChild
            >
              <Link to="/bounties">Explore Bounties</Link>
            </Button>
          </div>

          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Instant Payouts</h3>
              <p className="text-sm text-muted-foreground">
                Smart contracts ensure you get paid the moment your work is
                approved.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Rocket className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg">Accelerate Growth</h3>
              <p className="text-sm text-muted-foreground">
                Find high-impact tasks and build your decentralized portfolio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-green-500/10 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg">Secure & Trustless</h3>
              <p className="text-sm text-muted-foreground">
                Leverage the power of Stellar Soroban for verifiable bounty
                logic.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full animate-in fade-in zoom-in-95 duration-500">
          <ProfileForm onSuccess={handleProfileSuccess} />
        </div>
      )}
    </div>
  );
};
