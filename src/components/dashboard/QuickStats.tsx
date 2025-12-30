import { useState, useEffect } from "react";
import { FileText, Users, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

function StatCard({ title, value, change, icon: Icon, trend, isLoading }: StatCardProps) {
  const trendColors = {
    up: "text-status-safe",
    down: "text-status-critical",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                  {value}
                </p>
                {change && (
                  <p className={`text-xs mt-1 ${trendColors[trend || "neutral"]}`}>
                    {change}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const [stats, setStats] = useState({
    reports: 0,
    identities: 0,
    vaultFiles: 0,
    resolutionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch counts from all tables
      const [reportsRes, identitiesRes, vaultRes] = await Promise.all([
        supabase.from("reports").select("id, status", { count: "exact" }),
        supabase.from("ghost_identities").select("id", { count: "exact" }),
        supabase.from("stealth_vault").select("id", { count: "exact" }),
      ]);

      const totalReports = reportsRes.count || 0;
      const resolvedReports = reportsRes.data?.filter((r) => r.status === "resolved").length || 0;
      const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

      setStats({
        reports: totalReports,
        identities: identitiesRes.count || 0,
        vaultFiles: vaultRes.count || 0,
        resolutionRate,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Reports"
        value={stats.reports}
        change="Real-time tracking"
        icon={FileText}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatCard
        title="Ghost Identities"
        value={stats.identities}
        change="Anonymous users"
        icon={Users}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatCard
        title="Vault Files"
        value={stats.vaultFiles}
        change="Encrypted evidence"
        icon={MessageSquare}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatCard
        title="Resolution Rate"
        value={`${stats.resolutionRate}%`}
        change="Issues resolved"
        icon={CheckCircle}
        trend={stats.resolutionRate > 70 ? "up" : "neutral"}
        isLoading={isLoading}
      />
    </div>
  );
}
