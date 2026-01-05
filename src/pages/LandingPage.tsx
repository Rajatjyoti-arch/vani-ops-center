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
import { VaniLogo, VaniBrandingBlock } from "@/components/ui/VaniLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStudentSession } from "@/contexts/StudentSessionContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStudentSession();
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
    navigate("/portal");
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* VANI Branding with University Affiliation */}
          <div className="flex items-center gap-4 group cursor-pointer transition-all duration-300 hover:opacity-90">
            <VaniLogo variant="icon" size="sm" />
            <div className="flex flex-col leading-tight">
              <span
                className="font-semibold text-foreground tracking-[0.15em] uppercase transition-colors duration-300"
                style={{
                  fontSize: '17px',
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif"
                }}
              >
                VANI
              </span>
              <span className="text-[11px] text-muted-foreground/60 font-normal tracking-wide hidden sm:block">
                Central University of Jammu
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={scrollToHowItWorks}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hidden sm:flex"
            >
              How it Works
            </Button>
            <Button
              onClick={handleEnterSystem}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Enter System
            </Button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-40 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 -z-20 institutional-grid opacity-[0.03] animate-grid-flow" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow-green" />
            <span className="text-xs font-medium text-emerald-500 tracking-wide uppercase">System Operational</span>
          </div>

          {/* Modern VANI Wordmark - Neo-Grotesk Typography */}
          <h1
            className="text-6xl md:text-8xl font-semibold text-foreground mb-6 animate-fade-in-up"
            style={{
              animationDelay: "0.1s",
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '0.15em',
              fontWeight: 600
            }}
          >
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
              className="group/btn w-full sm:w-auto text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 ease-out bg-primary hover:bg-primary/90 hover:-translate-y-1"
            >
              Enter System
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 ease-out hover:-translate-y-1"
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
              <div key={i} className="group relative bg-background pt-4 cursor-default">
                <div className="w-16 h-16 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 ease-out z-10 relative">
                  <step.icon className={cn("w-8 h-8 transition-transform duration-300 group-hover:scale-105", step.color)} />
                </div>
                <h3 className="text-lg font-bold text-center mb-3 transition-colors duration-300 group-hover:text-primary">{step.title}</h3>
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
            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
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

            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
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

            <Card className="group border-border/50 bg-card/50 hover:bg-card hover:border-status-info/30 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-status-info/10 flex items-center justify-center mb-6 group-hover:bg-status-info/20 transition-all duration-300 group-hover:scale-110">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300">
              <Building2 className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Universities</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300">
              <Network className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Corporations</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300">
              <Scale className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Government</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300">
              <Shield className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Oversight Bodies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Partnership - Google Gemini */}
      <section className="py-24 bg-gradient-to-b from-background via-[#4285F4]/5 to-background relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9B72CB]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#D96570]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#4285F4] animate-pulse" />
              <span className="text-xs font-medium bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent tracking-wide uppercase">AI-Powered Governance</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powered by{" "}
              <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
                Google Gemini
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              VANI leverages Google's most advanced AI model for intelligent governance, unbiased analysis, and fair resolution recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Gemini Branding Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 animate-gemini-rotate">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="gemini-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="50%" stopColor="#9B72CB" />
                        <stop offset="100%" stopColor="#D96570" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="url(#gemini-ring-gradient)" strokeWidth="2" strokeDasharray="20 10" opacity="0.6" />
                  </svg>
                </div>

                {/* Middle pulsing ring */}
                <div className="absolute inset-4 animate-gemini-pulse">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="url(#gemini-ring-gradient)" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>

                {/* Inner rotating ring (opposite direction) */}
                <div className="absolute inset-8 animate-gemini-rotate" style={{ animationDirection: "reverse", animationDuration: "15s" }}>
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="url(#gemini-ring-gradient)" strokeWidth="1.5" strokeDasharray="12 8" opacity="0.4" />
                  </svg>
                </div>

                {/* Center Gemini Star */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 animate-gemini-sparkle">
                      <defs>
                        <linearGradient id="gemini-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4285F4" />
                          <stop offset="50%" stopColor="#9B72CB" />
                          <stop offset="100%" stopColor="#D96570" />
                        </linearGradient>
                        <filter id="gemini-glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <path 
                        d="M50 5L58 42L95 50L58 58L50 95L42 58L5 50L42 42L50 5Z" 
                        fill="url(#gemini-star-gradient)"
                        filter="url(#gemini-glow)"
                      />
                    </svg>

                    {/* Orbiting sparkle dots */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[#4285F4] animate-ping" style={{ animationDuration: "2s" }} />
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-[#9B72CB] animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
                    <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-[#D96570] animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="space-y-6">
              <Card className="group border-[#4285F4]/20 bg-card/50 hover:bg-card hover:border-[#4285F4]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#4285F4]/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#4285F4]/10 flex items-center justify-center shrink-0 group-hover:bg-[#4285F4]/20 transition-all duration-300">
                    <Scale className="w-6 h-6 text-[#4285F4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI-Powered Resolution</h3>
                    <p className="text-sm text-muted-foreground">Three specialized AI agents—Sentinel, Governor, and Arbiter—collaborate to analyze cases and recommend fair, unbiased resolutions.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-[#9B72CB]/20 bg-card/50 hover:bg-card hover:border-[#9B72CB]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#9B72CB]/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#9B72CB]/10 flex items-center justify-center shrink-0 group-hover:bg-[#9B72CB]/20 transition-all duration-300">
                    <Users className="w-6 h-6 text-[#9B72CB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Irene - Your Compliance Guide</h3>
                    <p className="text-sm text-muted-foreground">Meet Irene, our AI assistant powered by Gemini 2.5 Flash. She provides real-time guidance on policies, procedures, and your rights.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-[#D96570]/20 bg-card/50 hover:bg-card hover:border-[#D96570]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D96570]/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#D96570]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D96570]/20 transition-all duration-300">
                    <Activity className="w-6 h-6 text-[#D96570]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Intelligent Analytics</h3>
                    <p className="text-sm text-muted-foreground">Advanced sentiment analysis and pattern recognition identify systemic issues before they escalate, enabling proactive governance.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Google Partnership Badge */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/30">
                <svg viewBox="0 0 24 24" className="w-8 h-8">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Official Technology Partner</p>
                  <p className="font-semibold bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
                    Google Cloud AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Team CYNOX */}
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
              <div key={member} className="flex flex-col items-center gap-3 group cursor-default">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-1 transition-all duration-300 ease-out">
                  <Users className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary/50 transition-colors duration-300" />
                </div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">{member}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 group">
            <VaniLogo variant="icon" size="sm" />
            <div className="flex flex-col">
              <span
                className="text-sm font-semibold text-foreground tracking-[0.1em] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                VANI Platform
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground/60">Central University of Jammu</span>
                <span className="text-[10px] text-muted-foreground/40">•</span>
                <span className="text-[10px] text-muted-foreground/50">© {new Date().getFullYear()} Team CYNOX</span>
              </div>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="relative group/link hover:text-primary transition-colors duration-300">
              <span>Privacy Policy</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
            </Link>
            <Link to="/gdpr-compliance" className="relative group/link hover:text-primary transition-colors duration-300">
              <span>GDPR Compliance</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
            </Link>
            <Link to="/help" className="relative group/link hover:text-primary transition-colors duration-300">
              <span>Documentation</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
