import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
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
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  LogOut,
  Mail
} from "lucide-react";
import { useStudentSession } from "@/contexts/StudentSessionContext";
import { NotificationPreferences } from "@/components/identity/NotificationPreferences";
import { StudentLogin } from "@/components/auth/StudentLogin";
import { toast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { isAuthenticated, studentProfile, logout } = useStudentSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { demoMode } = useSettings();
  const [reportCounts, setReportCounts] = useState({
    resolved: 0,
    pending: 0,
    underReview: 0
  });

  useEffect(() => {
    const fetchReportCounts = async () => {
      if (!studentProfile) return;

      const { data, error } = await supabase
        .from("reports")
        .select("status")
        .eq("ghost_identity_id", studentProfile.id);

      if (error) {
        console.error("Error fetching report counts:", error);
        return;
      }

      if (demoMode && (!data || data.length === 0)) {
        setReportCounts({
          resolved: 3,
          pending: 1,
          underReview: 2
        });
      } else {
        const counts = {
          resolved: data?.filter(r => r.status === "resolved").length || 0,
          pending: data?.filter(r => r.status === "open").length || 0,
          underReview: data?.filter(r => r.status === "in_review").length || 0
        };
        setReportCounts(counts);
      }
    };

    fetchReportCounts();
  }, [studentProfile, demoMode]);

  // If not authenticated, show the Student Login
  if (!isAuthenticated) {
    return <StudentLogin />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Session Ended",
      description: "Your session has been securely terminated.",
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
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome, {studentProfile?.ghost_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your session is active and secure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-accent/10 text-accent border-accent/30 px-3 py-1.5"
            >
              <Mail className="w-3 h-3 mr-1.5" />
              Verified Student
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
                    {studentProfile?.ghost_name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {studentProfile?.enrollment_no}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Trust Score: {studentProfile?.reputation}%</span>
                  <span>•</span>
                  <span>{studentProfile?.reports_submitted} submissions</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs text-accent mb-1">
                  <Shield className="w-3 h-3" />
                  <span>Email Verified</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {studentProfile?.email}
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
        {studentProfile && (
          <NotificationPreferences
            ghostIdentityId={studentProfile.id}
            currentEmail={studentProfile.email}
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
                  <div className="font-semibold text-foreground">{reportCounts.resolved}</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Clock className="w-5 h-5 text-[hsl(var(--status-warning))]" />
                <div>
                  <div className="font-semibold text-foreground">{reportCounts.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <AlertCircle className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">{reportCounts.underReview}</div>
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
