import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { GhostSessionProvider } from "@/contexts/GhostSessionContext";
import { DeadManSwitchProvider } from "@/contexts/DeadManSwitchContext";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { CommandPalette, useKeyboardShortcuts } from "@/components/command/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicLeakBroadcast } from "@/components/sidebar/PublicLeakBroadcast";
import { SentinelChatbot } from "@/components/sentinel/SentinelChatbot";
import Index from "./pages/Index";
import IdentityGhost from "./pages/IdentityGhost";
import StealthVault from "./pages/StealthVault";
import TheArena from "./pages/TheArena";
import ResolutionLedger from "./pages/ResolutionLedger";
import PublicLedger from "./pages/PublicLedger";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useKeyboardShortcuts();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <TourOverlay />
      <PublicLeakBroadcast />
      <SentinelChatbot />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/identity" element={<IdentityGhost />} />
        <Route path="/vault" element={
          <ProtectedRoute>
            <StealthVault />
          </ProtectedRoute>
        } />
        <Route path="/arena" element={
          <ProtectedRoute>
            <TheArena />
          </ProtectedRoute>
        } />
        <Route path="/ledger" element={<ResolutionLedger />} />
        <Route path="/public-ledger" element={<PublicLedger />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <GhostSessionProvider>
        <DeadManSwitchProvider>
          <BrowserRouter>
            <OnboardingProvider>
              <TooltipProvider>
                <AppContent />
              </TooltipProvider>
            </OnboardingProvider>
          </BrowserRouter>
        </DeadManSwitchProvider>
      </GhostSessionProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
