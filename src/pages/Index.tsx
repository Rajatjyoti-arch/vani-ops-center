import { Link } from "react-router-dom";
import { Shield, UserCheck, Activity, Lock, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SentimentMap } from "@/components/dashboard/SentimentMap";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CampusImpactScore } from "@/components/dashboard/CampusImpactScore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UniversityBranding } from "@/components/ui/UniversityBranding";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Operational Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Operational Command Center
            </h1>
            <UniversityBranding size="sm" className="mt-2 mb-3 opacity-90" />
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-500">System Active</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                VANI-OS v2.4.0
              </span>
            </div>
          </div>

        </div>

        {/* Access Control / Portal Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Portal Entry */}
          <Card className="border-border/50 hover:border-accent/50 transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-accent" />
                Student Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Access anonymous credentialing, evidence vault, and grievance submission.
              </p>
              <Link to="/identity">
                <Button className="w-full bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Portal Entry */}
          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Administrative Oversight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Restricted access for governance officers and resolution committees.
              </p>
              <Link to="/admin/login">
                <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Secure Login
                  <Lock className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Live System Metrics */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Live Network Intelligence
          </h2>

          {/* Quick Stats + Impact Score */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            <div className="lg:col-span-4">
              <QuickStats />
            </div>
            <div className="lg:col-span-1">
              <CampusImpactScore />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SentimentMap />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <RecentActivity />
              
              {/* AI Branding Card */}
              <Card className="border-border/50 bg-gradient-to-br from-[#4285F4]/5 via-[#9B72CB]/5 to-[#D96570]/5 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0">
                      {/* Gemini animated icon */}
                      <div className="absolute inset-0 animate-gemini-rotate opacity-30">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                          <defs>
                            <linearGradient id="gemini-home-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#4285F4" />
                              <stop offset="50%" stopColor="#9B72CB" />
                              <stop offset="100%" stopColor="#D96570" />
                            </linearGradient>
                          </defs>
                          <circle cx="12" cy="12" r="10" fill="none" stroke="url(#gemini-home-gradient)" strokeWidth="1.5" strokeDasharray="8 4" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <defs>
                            <linearGradient id="gemini-star-home" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#4285F4" />
                              <stop offset="50%" stopColor="#9B72CB" />
                              <stop offset="100%" stopColor="#D96570" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
                            fill="url(#gemini-star-home)"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Powered by</p>
                      <p className="font-semibold bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
                        Google Gemini
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Advanced AI governance and resolution intelligence powered by Google's Gemini 2.5 Flash model.
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[10px] text-muted-foreground">Google Cloud AI Partner</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
