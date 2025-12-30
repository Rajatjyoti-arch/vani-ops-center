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
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
