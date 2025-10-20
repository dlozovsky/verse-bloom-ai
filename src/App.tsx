import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import PoemDetail from "./pages/PoemDetail";
import PoetProfile from "./pages/PoetProfile";
import Discover from "./pages/Discover";
import Random from "./pages/Random";
import Themes from "./pages/Themes";
import Poets from "./pages/Poets";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import DataLoader from "./pages/DataLoader";
import NotFound from "./pages/NotFound";
import PoetAnalytics from "./pages/PoetAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/poem/:id" element={<PoemDetail />} />
            <Route path="/poet/:id" element={<PoetProfile />} />
            <Route path="/poet/:id/analytics" element={<PoetAnalytics />} />
            <Route path="/random" element={<Random />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/data-loader" element={<DataLoader />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
