import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "./ui/toast";
import { Button } from "./ui/button";
import { truncateAddress } from "../lib/stellar";
import { Rocket, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      navigate("/");
    } catch (err: any) {
      const msg: string = err?.message || "";
      if (msg === "FREIGHTER_NOT_INSTALLED") {
        toast(
          "Freighter wallet not detected. Opening the install page...",
          "info",
        );
      } else if (
        msg.toLowerCase().includes("reject") ||
        msg.toLowerCase().includes("cancel")
      ) {
        toast("Wallet connection was cancelled.", "info");
      } else {
        toast(msg || "Failed to connect wallet. Please try again.", "error");
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
    setMobileOpen(false);
    toast("Wallet disconnected.", "info");
  };

  const navLinks = [
    { to: "/bounties", label: "Marketplace" },
    ...(isConnected && address
      ? [{ to: "/dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                Stellar Bounty
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-emerald-600 font-semibold">
                    ● Connected
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {truncateAddress(address)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  size="sm"
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnect} size="sm" className="shadow-sm">
                Connect Wallet
              </Button>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2.5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isConnected && address && (
            <div className="pt-2 mt-2 border-t">
              <div className="px-3 py-1 text-xs text-muted-foreground font-mono truncate">
                {address}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
