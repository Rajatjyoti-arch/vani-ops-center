import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Ghost, FileUp, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/lib/crypto";
import { CyberSpinner } from "@/components/ui/skeleton-card";

interface ActivityItem {
  id: string;
  type: "report" | "identity" | "upload" | "discussion" | "resolution" | "negotiation" | "vault";
  message: string;
  time: string;
  zone?: string;
  title?: string;
  description?: string;
}

const typeConfig = {
  report: { icon: Activity, color: "text-status-critical bg-status-critical/10" },
  identity: { icon: Ghost, color: "text-primary bg-primary/10" },
  upload: { icon: FileUp, color: "text-status-info bg-status-info/10" },
  vault: { icon: FileUp, color: "text-status-info bg-status-info/10" },
  discussion: { icon: MessageSquare, color: "text-status-warning bg-status-warning/10" },
  negotiation: { icon: MessageSquare, color: "text-status-warning bg-status-warning/10" },
  resolution: { icon: CheckCircle, color: "text-status-safe bg-status-safe/10" },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      // Fetch recent ghost identities
      const { data: identities } = await supabase
        .from("ghost_identities")
        .select("id, ghost_name, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent vault uploads
      const { data: uploads } = await supabase
        .from("stealth_vault")
        .select("id, file_name, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent reports
      const { data: reports } = await supabase
        .from("reports")
        .select("id, title, zone, status, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      const activityItems: ActivityItem[] = [];

      identities?.forEach((i) => {
        activityItems.push({
          id: `identity-${i.id}`,
          type: "identity",
          message: `Ghost identity '${i.ghost_name}' created`,
          time: formatRelativeTime(i.created_at),
        });
      });

      uploads?.forEach((u) => {
        activityItems.push({
          id: `upload-${u.id}`,
          type: "upload",
          message: `Evidence file '${u.file_name}' uploaded`,
          time: formatRelativeTime(u.created_at),
        });
      });

      reports?.forEach((r) => {
        const type = r.status === "resolved" ? "resolution" : "report";
        activityItems.push({
          id: `report-${r.id}`,
          type,
          message: r.status === "resolved"
            ? `Issue "${r.title}" marked as resolved`
            : `New report: "${r.title}"`,
          time: formatRelativeTime(r.created_at),
          zone: r.zone,
        });
      });

      // Sort by most recent
      setActivities(activityItems.sort((a, b) => 0).slice(0, 6));
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();

    // Subscribe to real-time updates for all relevant tables
    const channel = supabase
      .channel('db-activity')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ghost_identities' }, fetchActivity)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stealth_vault' }, fetchActivity)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, fetchActivity)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Live Activity Feed</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time system events
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <CyberSpinner size="md" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity in database</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((item, index) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-1.5 rounded-md ${config.color} ${index === 0 ? 'animate-pulse-slow' : ''}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">{item.time}</span>
                      {item.zone && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-primary">{item.zone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
