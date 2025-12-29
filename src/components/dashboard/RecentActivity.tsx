import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Ghost, FileUp, MessageSquare, CheckCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "report" | "identity" | "upload" | "discussion" | "resolution";
  message: string;
  time: string;
  zone?: string;
}

const mockActivity: ActivityItem[] = [
  { id: "1", type: "report", message: "New anonymous report submitted", time: "2m ago", zone: "Hostel 1" },
  { id: "2", type: "identity", message: "Ghost identity 'ShadowWolf' created", time: "5m ago" },
  { id: "3", type: "discussion", message: "New thread: 'Night patrol concerns'", time: "12m ago", zone: "Main Gate" },
  { id: "4", type: "resolution", message: "Issue #247 marked as resolved", time: "18m ago", zone: "Library" },
  { id: "5", type: "upload", message: "Evidence file uploaded to vault", time: "25m ago" },
  { id: "6", type: "report", message: "Critical report flagged for review", time: "32m ago", zone: "Cafeteria" },
];

const typeConfig = {
  report: { icon: Activity, color: "text-status-critical bg-status-critical/10" },
  identity: { icon: Ghost, color: "text-primary bg-primary/10" },
  upload: { icon: FileUp, color: "text-status-info bg-status-info/10" },
  discussion: { icon: MessageSquare, color: "text-status-warning bg-status-warning/10" },
  resolution: { icon: CheckCircle, color: "text-status-safe bg-status-safe/10" },
};

export function RecentActivity() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 cyber-glow">
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
        <div className="space-y-3">
          {mockActivity.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`p-1.5 rounded-md ${config.color}`}>
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
      </CardContent>
    </Card>
  );
}
