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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, '')) || 0;
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = numericValue / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';

  const trendColors = {
    up: "text-status-safe",
    down: "text-status-critical",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group hover:shadow-primary/5 hover:-translate-y-0.5">
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
                  {displayValue}{suffix}
                </p>
                {change && (
                  <p className={`text-xs mt-1 ${trendColors[trend || "neutral"]}`}>
                    {change}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const [stats, setStats] = useState({
    reports: 8, // MOCK DATA
    identities: 0, // REAL DATA
    vaultFiles: 0, // REAL DATA
    resolutionRate: 58, // MOCK DATA
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // Fetch counts from DB for Identities and Vault Files
        const [identitiesRes, vaultRes] = await Promise.all([
          supabase.from("ghost_identities").select("id", { count: "exact" }),
          supabase.from("stealth_vault").select("id", { count: "exact" }),
        ]);

        setStats(prev => ({
          ...prev,
          identities: identitiesRes.count || 0,
          vaultFiles: vaultRes.count || 0,
        }));
      } catch (error) {
        console.error("Error fetching real stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealStats();

    // Set up real-time listeners for identities and vault
    const identityChannel = supabase
      .channel('public:ghost_identities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ghost_identities' }, fetchRealStats)
      .subscribe();

    const vaultChannel = supabase
      .channel('public:stealth_vault')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stealth_vault' }, fetchRealStats)
      .subscribe();

    return () => {
      supabase.removeChannel(identityChannel);
      supabase.removeChannel(vaultChannel);
    };
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
        change="Active personas"
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
        change="System efficiency"
        icon={CheckCircle}
        trend={stats.resolutionRate > 50 ? "up" : "neutral"}
        isLoading={isLoading}
      />
    </div>
  );
}
