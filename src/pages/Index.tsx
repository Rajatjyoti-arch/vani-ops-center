import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SentimentMap } from "@/components/dashboard/SentimentMap";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CampusImpactScore } from "@/components/dashboard/CampusImpactScore";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Administrative Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Verifiable Anonymous Network Intelligence Overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="text-xs">
                <Shield className="w-3 h-3 mr-1.5" />
                Admin Portal
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-mono text-primary">LIVE</span>
            </div>
          </div>
        </div>

        {/* Quick Stats + Impact Score */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
    </DashboardLayout>
  );
};

export default Index;
