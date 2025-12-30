import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { GhostSessionProvider } from "@/contexts/GhostSessionContext";
import { DeadManSwitchProvider } from "@/contexts/DeadManSwitchContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { CommandPalette, useKeyboardShortcuts } from "@/components/command/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { PublicLeakBroadcast } from "@/components/sidebar/PublicLeakBroadcast";
import { ComplianceAssistant } from "@/components/assistant/ComplianceAssistant";
import Index from "./pages/Index";
import AnonymousCredentialing from "./pages/AnonymousCredentialing";
import EvidenceRepository from "./pages/EvidenceRepository";
import GovernanceMatrix from "./pages/GovernanceMatrix";
import ResolutionLedger from "./pages/ResolutionLedger";
import PublicLedger from "./pages/PublicLedger";
import HelpDocumentation from "./pages/HelpDocumentation";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResolutions from "./pages/admin/AdminResolutions";
import AdminResolutionDetail from "./pages/admin/AdminResolutionDetail";
import NotFound from "./pages/NotFound";
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
      <ComplianceAssistant />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/identity" element={<AnonymousCredentialing />} />
        <Route path="/vault" element={
          <ProtectedRoute>
            <EvidenceRepository />
          </ProtectedRoute>
        } />
        <Route path="/arena" element={
          <ProtectedRoute>
            <GovernanceMatrix />
          </ProtectedRoute>
        } />
        <Route path="/ledger" element={<ResolutionLedger />} />
        <Route path="/public-ledger" element={<PublicLedger />} />
        <Route path="/help" element={<HelpDocumentation />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/resolutions" element={<AdminProtectedRoute><AdminResolutions /></AdminProtectedRoute>} />
        <Route path="/admin/resolutions/:id" element={<AdminProtectedRoute><AdminResolutionDetail /></AdminProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <GhostSessionProvider>
          <DeadManSwitchProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <OnboardingProvider>
                  <TooltipProvider>
                    <AppContent />
                  </TooltipProvider>
                </OnboardingProvider>
              </BrowserRouter>
            </AdminAuthProvider>
          </DeadManSwitchProvider>
        </GhostSessionProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
