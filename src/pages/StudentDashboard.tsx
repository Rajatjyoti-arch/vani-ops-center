import { Link, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Fingerprint, 
  FileText, 
  Scale, 
  BookOpen, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  LogOut
} from "lucide-react";
import { useGhostSession } from "@/contexts/GhostSessionContext";
import { NotificationPreferences } from "@/components/identity/NotificationPreferences";
import { ZeroKnowledgeLogin } from "@/components/auth/ZeroKnowledgeLogin";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { isAuthenticated, ghostIdentity, logout } = useGhostSession();
  const navigate = useNavigate();

  // If not authenticated, show the Zero-Knowledge Login
  if (!isAuthenticated) {
    return <ZeroKnowledgeLogin />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Session Ended",
      description: "Your anonymous session has been securely terminated.",
    });
    navigate("/student-dashboard");
  };

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
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="bg-accent/10 text-accent border-accent/30 px-3 py-1.5"
            >
              <Lock className="w-3 h-3 mr-1.5" />
              Zero-Knowledge Protected
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              End Session
            </Button>
          </div>
        </div>

        {/* Security Status Card */}
        <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Fingerprint className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">
                    {ghostIdentity?.ghost_name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    ID: 0x{ghostIdentity?.roll_number_hash.slice(-8).toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Trust Score: {ghostIdentity?.reputation}%</span>
                  <span>•</span>
                  <span>{ghostIdentity?.reports_submitted} submissions</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs text-accent mb-1">
                  <Shield className="w-3 h-3" />
                  <span>Mathematically Private</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  No server logs of your access phrase
                </p>
              </div>
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

        {/* Notification Preferences */}
        {ghostIdentity && (
          <NotificationPreferences
            ghostIdentityId={ghostIdentity.id}
            currentEmail={(ghostIdentity as any).notification_email || null}
          />
        )}

        {/* Activity Summary */}
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
