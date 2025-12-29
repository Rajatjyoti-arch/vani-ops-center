import { FileText, Users, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
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
            <p className="text-2xl font-bold font-mono text-foreground group-hover:text-primary transition-colors">
              {value}
            </p>
            {change && (
              <p className={`text-xs mt-1 ${trendColors[trend || "neutral"]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:cyber-glow transition-all">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const stats = [
    {
      title: "Active Reports",
      value: 42,
      change: "+12% this week",
      icon: FileText,
      trend: "up" as const,
    },
    {
      title: "Ghost Identities",
      value: 156,
      change: "+23 new today",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Arena Discussions",
      value: 89,
      change: "15 active now",
      icon: MessageSquare,
      trend: "neutral" as const,
    },
    {
      title: "Resolved Issues",
      value: "87%",
      change: "+5% improvement",
      icon: CheckCircle,
      trend: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
