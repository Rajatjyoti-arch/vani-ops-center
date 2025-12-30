import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Shield,
  UserCheck,
  CheckCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  Lock,
  Scale
} from "lucide-react";
import { VaniLogo } from "@/components/ui/VaniLogo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const LandingPage = () => {
  const [stats, setStats] = useState({
    resolvedCases: 0,
    trustScore: 0,
    activeAnalytics: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch resolved cases
        const { count: resolvedCount } = await supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "resolved");

        // Fetch total ghost identities for active analytics
        const { count: identitiesCount } = await supabase
          .from("ghost_identities")
          .select("*", { count: "exact", head: true });

        // Calculate average trust score
        const { data: reputationData } = await supabase
          .from("ghost_identities")
          .select("reputation");

        const avgTrust = reputationData && reputationData.length > 0
          ? Math.round(reputationData.reduce((sum, r) => sum + r.reputation, 0) / reputationData.length)
          : 85;

        setStats({
          resolvedCases: resolvedCount || 0,
          trustScore: avgTrust,
          activeAnalytics: identitiesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <VaniLogo variant="full" size="lg" />
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Lock className="w-4 h-4 mr-2" />
                  Admin Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[hsl(var(--navy-dark))] via-[hsl(var(--navy-medium))] to-[hsl(var(--navy-light))] overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 institutional-grid opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Scale className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            VANI
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-2">
            Verifiable Anonymous Network Intelligence
          </p>
          <p className="text-base text-white/60 max-w-2xl mx-auto mb-12">
            Advanced Governance & Anonymous Resolution System for transparent,
            secure, and accountable institutional grievance management.
          </p>

          {/* Gateway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Student Portal Card */}
            <Link to="/identity" className="group">
              <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8 text-left">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent/20 text-accent shrink-0">
                      <UserCheck className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Student Portal
                      </h3>
                      <p className="text-white/70 text-sm mb-4">
                        Access anonymous credentialing and submit encrypted reports.
                        Your identity remains protected through SHA-256 cryptographic hashing.
                      </p>
                      <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                        <span className="text-sm font-medium">Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Administrative Oversight Card */}
            <Link to="/admin/login" className="group">
              <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group-hover:scale-[1.02]">
                <CardContent className="p-8 text-left">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/30 text-white shrink-0">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Administrative Oversight
                      </h3>
                      <p className="text-white/70 text-sm mb-4">
                        Secure access for authorized institutional personnel.
                        Review analytics, manage resolutions, and oversee governance processes.
                      </p>
                      <div className="flex items-center gap-2 text-white/90 group-hover:gap-3 transition-all">
                        <span className="text-sm font-medium">Secure Login</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* System Transparency Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              System Transparency
            </h3>
            <p className="text-muted-foreground">
              Real-time metrics demonstrating our commitment to accountability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Resolved Cases */}
            <Card className="border-border/50 professional-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                  <CheckCircle className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {isLoading ? "..." : stats.resolvedCases}
                </div>
                <div className="text-sm text-muted-foreground">
                  Resolved Cases
                </div>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <Card className="border-border/50 professional-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {isLoading ? "..." : `${stats.trustScore}%`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Trust Score
                </div>
              </CardContent>
            </Card>

            {/* Active Analytics */}
            <Card className="border-border/50 professional-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-status-info/10 mb-4">
                  <Activity className="w-7 h-7 text-[hsl(var(--status-info))]" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {isLoading ? "..." : stats.activeAnalytics}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Analytics
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">End-to-End Encryption</h4>
              <p className="text-sm text-muted-foreground">
                All submissions are protected with military-grade encryption protocols.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Anonymous Credentialing</h4>
              <p className="text-sm text-muted-foreground">
                Participate without revealing your identity through cryptographic hashing.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-status-warning/10 mb-4">
                <Scale className="w-6 h-6 text-[hsl(var(--status-warning))]" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Fair Resolution</h4>
              <p className="text-sm text-muted-foreground">
                AI-assisted negotiation ensures balanced and equitable outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* University Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <VaniLogo variant="full" size="md" />
              </div>
              <p className="text-sm text-muted-foreground">
                Established under the Central Universities Act, 2009.
                Committed to excellence in education, research, and transparent governance.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/identity" className="block text-muted-foreground hover:text-primary transition-colors">
                  Student Portal
                </Link>
                <Link to="/admin/login" className="block text-muted-foreground hover:text-primary transition-colors">
                  Admin Login
                </Link>
                <Link to="/public-ledger" className="block text-muted-foreground hover:text-primary transition-colors">
                  Public Ledger
                </Link>
                <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                  Help & Documentation
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/privacy-policy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/gdpr-compliance" className="block text-muted-foreground hover:text-primary transition-colors">
                  GDPR Compliance
                </Link>
                <a
                  href="https://www.cujammu.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  University Website
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Central University of Jammu. All Rights Reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              VANI - Verifiable Anonymous Network Intelligence | Secure & Confidential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
