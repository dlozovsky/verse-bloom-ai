import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const GuestBanner = () => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if logged in or if user dismissed it this session
  if (user || dismissed) return null;

  // Check sessionStorage so it doesn't re-appear on every page
  const storageKey = "guest-banner-dismissed";
  if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, "true");
    setDismissed(true);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container flex items-center justify-between py-2 px-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm text-foreground/80 truncate">
            <span className="font-medium">You're browsing as a guest.</span>
            <span className="hidden sm:inline"> Sign up to save favorites, create collections & track your reading.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" asChild className="h-7 text-xs">
            <Link to="/auth">Sign Up Free</Link>
          </Button>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestBanner;
