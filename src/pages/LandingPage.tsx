import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Scale,
  ArrowRight,
  Users,
  Eye,
  FileText,
  Server,
  Activity,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Network,
  Building2,
  ChevronDown
} from "lucide-react";
import { VaniLogo } from "@/components/ui/VaniLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const navigate = useNavigate();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = [
    "Anonymous, yet accountable",
    "Truth without fear",
    "Governance without bias"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterSystem = () => {
    navigate("/dashboard");
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VaniLogo variant="icon" size="sm" />
            <span className="font-bold text-lg tracking-tight text-foreground">VANI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToHowItWorks}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              How it Works
            </button>
            <Button
              onClick={handleEnterSystem}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              Enter System
            </Button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 -z-20 institutional-grid opacity-[0.03] animate-grid-flow" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow-green" />
            <span className="text-xs font-medium text-emerald-500 tracking-wide uppercase">System Operational</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            VANI
          </h1>

          <div className="h-8 mb-8 overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-xl md:text-2xl font-light text-primary/80 transition-all duration-500 transform">
              {taglines[taglineIndex]}
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Verifiable Anonymous Network Intelligence. <br className="hidden md:block" />
            Advanced governance for institutional transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              onClick={handleEnterSystem}
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 bg-primary hover:bg-primary/90 hover:-translate-y-0.5"
            >
              Enter System
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-border/50 hover:bg-secondary/50"
            >
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </section>

      {/* 2. The Problem VANI Solves */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Problem: <span className="text-destructive/80">Institutional Silence</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Fear of Retaliation</h3>
                    <p className="text-sm text-muted-foreground">Valid grievances go unreported because whistleblowers fear academic or professional backlash.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <Network className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Broken Feedback Loops</h3>
                    <p className="text-sm text-muted-foreground">Reports get lost in bureaucracy with no way to track progress or ensure accountability.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <Eye className="w-6 h-6 text-slate-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Lack of Transparency</h3>
                    <p className="text-sm text-muted-foreground">Decisions are made behind closed doors without data-driven justification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30" />
              <Card className="relative border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8 space-y-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">How VANI Fixes This</h3>

                  <div className="relative pl-8 border-l-2 border-primary/20 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                      <h4 className="font-semibold text-primary mb-1">Cryptographic Anonymity</h4>
                      <p className="text-sm text-muted-foreground">Identity is hashed (SHA-256). We verify *who* you are without knowing *which* one you are.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-accent border-4 border-background" />
                      <h4 className="font-semibold text-accent mb-1">Immutable Evidence</h4>
                      <p className="text-sm text-muted-foreground">All submissions are encrypted and time-stamped. Nothing gets "lost".</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-foreground border-4 border-background" />
                      <h4 className="font-semibold text-foreground mb-1">AI-Assisted Resolution</h4>
                      <p className="text-sm text-muted-foreground">Unbiased algorithms categorize issues and suggest fair resolutions based on precedent.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Visual Flow) */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Architecture of Trust</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From submission to resolution, every step is designed for security and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            {[
              {
                icon: Lock,
                title: "1. Secure Entry",
                desc: "User logs in. Zero-knowledge proofs verify credentials without revealing identity.",
                color: "text-primary"
              },
              {
                icon: FileCheck,
                title: "2. Submission",
                desc: "Grievance is submitted. Content is encrypted; metadata is stripped.",
                color: "text-accent"
              },
              {
                icon: Server,
                title: "3. AI Processing",
                desc: "VANI AI analyzes the report, categorizes urgency, and routes to the correct body.",
                color: "text-status-info"
              },
              {
                icon: Scale,
                title: "4. Resolution",
                desc: "Admins resolve the issue. Outcome is recorded on the public ledger.",
                color: "text-status-warning"
              }
            ].map((step, i) => (
              <div key={i} className="group relative bg-background pt-4">
                <div className="w-16 h-16 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative">
                  <step.icon className={cn("w-8 h-8", step.color)} />
                </div>
                <h3 className="text-lg font-bold text-center mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Deep Feature Breakdown */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Core Principles</h2>
            <p className="text-muted-foreground">The pillars of our secure governance architecture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Anonymous Identity</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We use SHA-256 hashing to create irreversible identity tokens.
                  This ensures that while your right to speak is verified, your personal identity remains mathematically private.
                </p>
                <div className="h-1 w-12 bg-primary/30 group-hover:w-full transition-all duration-500 rounded-full" />
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Evidence</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Military-grade encryption protects all submitted documentation.
                  Evidence is stored in a tamper-proof vault, accessible only to authorized resolution committees.
                </p>
                <div className="h-1 w-12 bg-accent/30 group-hover:w-full transition-all duration-500 rounded-full" />
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-status-info/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-status-info/10 flex items-center justify-center mb-6 group-hover:bg-status-info/20 transition-colors">
                  <Activity className="w-6 h-6 text-status-info" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Live dashboards track institutional health.
                  Sentiment analysis provides early warnings for systemic issues before they escalate.
                </p>
                <div className="h-1 w-12 bg-status-info/30 group-hover:w-full transition-all duration-500 rounded-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Trust Section */}
      <section className="py-20 bg-background border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            Built for Institutions That Matter
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex flex-col items-center gap-2">
              <Building2 className="w-8 h-8" />
              <span className="font-semibold">Universities</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Network className="w-8 h-8" />
              <span className="font-semibold">Corporations</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Scale className="w-8 h-8" />
              <span className="font-semibold">Government</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8" />
              <span className="font-semibold">Oversight Bodies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Team CYNOX */}
      <section className="py-24 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Built by Team CYNOX</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Engineered by students committed to the future of digital governance.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              "Rajatjyoti Biswas",
              "Priyanshu Gupta",
              "Sakshi",
              "Mantavya Kumar"
            ].map((member) => (
              <div key={member} className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors">
                  <Users className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                </div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{member}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <VaniLogo variant="icon" size="sm" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">VANI Platform</span>
              <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Team CYNOX</span>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/gdpr-compliance" className="hover:text-primary transition-colors">GDPR Compliance</Link>
            <Link to="/help" className="hover:text-primary transition-colors">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
