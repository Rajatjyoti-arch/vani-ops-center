import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Filter, Clock, CheckCircle, AlertCircle, Search as SearchIcon, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/lib/crypto";
import { NegotiationContracts } from "@/components/ledger/NegotiationContracts";
import { useSettings } from "@/contexts/SettingsContext";
import { mockReports } from "@/lib/mockData";
import { CyberSpinner } from "@/components/ui/skeleton-card";

interface Report {
  id: string;
  report_id: string;
  title: string;
  zone: string;
  status: "submitted" | "under_review" | "investigating" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  created_at: string;
  updated_at: string;
  ghost_identity_id: string | null;
}

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-muted text-muted-foreground", icon: Clock },
  under_review: { label: "Under Review", color: "bg-status-info/20 text-status-info", icon: Eye },
  investigating: { label: "Investigating", color: "bg-status-warning/20 text-status-warning", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-status-safe/20 text-status-safe", icon: CheckCircle },
};

const severityConfig = {
  low: "text-muted-foreground",
  medium: "text-status-warning",
  high: "text-status-critical",
  critical: "text-status-critical font-bold animate-pulse",
};

const ResolutionLedger = () => {
  const { demoMode } = useSettings();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    }
    
    const realData = (data as Report[]) || [];
    if (demoMode && realData.length === 0) {
      setReports(mockReports as Report[]);
    } else {
      setReports(realData);
    }
    setIsLoading(false);
  }, [demoMode]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter((report) => {
    if (statusFilter && report.status !== statusFilter) return false;
    if (
      searchQuery &&
      !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.report_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: reports.length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    pending: reports.filter((r) => r.status !== "resolved").length,
    resolutionRate: reports.length > 0 
      ? Math.round((reports.filter((r) => r.status === "resolved").length / reports.length) * 100)
      : 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-primary" />
              Resolution Ledger
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and monitor all submitted reports and their resolution status
            </p>
          </div>
        </div>

        {/* Signed Digital Contracts */}
        <NegotiationContracts />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Reports</p>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-bold font-mono text-status-safe mt-1">{stats.resolved}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold font-mono text-status-warning mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolution Rate</p>
              <p className="text-2xl font-bold font-mono text-primary mt-1">{stats.resolutionRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search by title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border-border/50 pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="cyber-button text-xs"
            >
              All
            </Button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(key)}
                className="cyber-button text-xs"
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Reports Timeline */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Report Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <CyberSpinner size="lg" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reports found</p>
                <p className="text-sm">Submit a report via Identity Ghost or Stealth Vault</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report, index) => {
                  const statusInfo = statusConfig[report.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={report.id}
                      className="relative flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        {index < filteredReports.length - 1 && (
                          <div className="w-px h-full bg-border/50 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-primary">{report.report_id}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span
                                className={`text-[10px] uppercase tracking-wider ${severityConfig[report.severity]}`}
                              >
                                {report.severity}
                              </span>
                            </div>
                            <h4 className="font-medium text-foreground">{report.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{report.zone}</span>
                              <span>•</span>
                              <span>Updated {formatRelativeTime(report.updated_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionLedger;
