import { Link, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  FileText, 
  Scale, 
  BookOpen, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useGhostSession } from "@/contexts/GhostSessionContext";

const StudentDashboard = () => {
  const { isAuthenticated, ghostIdentity } = useGhostSession();

  // If not authenticated, redirect to identity page
  if (!isAuthenticated) {
    return <Navigate to="/identity" state={{ from: "/student-dashboard" }} />;
  }

  const quickActions = [
    {
      title: "Evidence Vault",
      description: "Upload and manage encrypted evidence files",
      icon: FileText,
      href: "/vault",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Governance Arena",
      description: "Submit grievances for AI-assisted negotiation",
      icon: Scale,
      href: "/arena",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Resolution Ledger",
      description: "Track status of your submissions",
      icon: BookOpen,
      href: "/ledger",
      color: "text-[hsl(var(--status-info))]",
      bgColor: "bg-[hsl(var(--status-info))]/10",
    },
    {
      title: "Help & Documentation",
      description: "Learn how to use the VANI system",
      icon: Shield,
      href: "/help",
      color: "text-[hsl(var(--status-warning))]",
      bgColor: "bg-[hsl(var(--status-warning))]/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {ghostIdentity?.ghost_name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your anonymous credential is active and secure
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-medium text-accent">PROTECTED</span>
          </div>
        </div>

        {/* Credential Status Card */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Fingerprint className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {ghostIdentity?.ghost_name}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>Trust Score: {ghostIdentity?.reputation}%</span>
                  <span>•</span>
                  <span>{ghostIdentity?.reports_submitted} submissions</span>
                </div>
              </div>
              <Link to="/identity">
                <Button variant="outline" size="sm">
                  Manage Credential
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href} className="group">
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 group-hover:scale-[1.01]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.bgColor} shrink-0`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {action.description}
                        </p>
                        <div className="flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                          <span>Open</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <CheckCircle className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Clock className="w-5 h-5 text-[hsl(var(--status-warning))]" />
                <div>
                  <div className="font-semibold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <AlertCircle className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground">Under Review</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
