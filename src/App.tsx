import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Marketplace } from "./pages/Marketplace";
import { BountyDetail } from "./pages/BountyDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/ui/toast";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "./hooks/useWallet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function WalletSessionRedirect() {
  const { address, isInitializing } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const hadConnectedSession = useRef(false);

  useEffect(() => {
    const hasAddress = Boolean(address);

    if (hasAddress) {
      hadConnectedSession.current = true;
      return;
    }

    if (!isInitializing && hadConnectedSession.current) {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
      hadConnectedSession.current = false;
    }
  }, [address, isInitializing, location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <WalletSessionRedirect />
          <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bounties" element={<Marketplace />} />
                <Route path="/bounties/:id" element={<BountyDetail />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
