import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  AlertTriangle,
  Clock,
  ChevronRight,
  Building2,
  Scale
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface NegotiationStats {
  total: number;
  pending: number;
  approved: number;
  inProgress: number;
}

interface Negotiation {
  id: string;
  grievance_text: string;
  status: string;
  priority: string | null;
  department: string | null;
  created_at: string;
  urgency_level: string | null;
}

const PRIORITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  normal: "#3b82f6",
  low: "#6b7280",
};

const STATUS_COLORS = {
  approved: "#10b981",
  in_progress: "#3b82f6",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<NegotiationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    inProgress: 0,
  });
  const [pendingQueue, setPendingQueue] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: negotiations, error } = await supabase
        .from("arena_negotiations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const pending = negotiations?.filter(n => 
        n.status === "completed" && !n.admin_approved_at
      ) || [];
      const approved = negotiations?.filter(n => n.admin_approved_at) || [];
      const inProgress = negotiations?.filter(n => n.status === "in_progress") || [];

      setStats({
        total: negotiations?.length || 0,
        pending: pending.length,
        approved: approved.length,
        inProgress: inProgress.length,
      });

      setPendingQueue(pending.slice(0, 5) as Negotiation[]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = [
    { name: "Mon", resolutions: 4 },
    { name: "Tue", resolutions: 7 },
    { name: "Wed", resolutions: 5 },
    { name: "Thu", resolutions: 8 },
    { name: "Fri", resolutions: 6 },
    { name: "Sat", resolutions: 3 },
    { name: "Sun", resolutions: 2 },
  ];

  const pieData = [
    { name: "Approved", value: stats.approved, color: STATUS_COLORS.approved },
    { name: "In Progress", value: stats.inProgress, color: STATUS_COLORS.in_progress },
    { name: "Pending Review", value: stats.pending, color: STATUS_COLORS.pending },
  ];

  const getPriorityBadge = (priority: string | null) => {
    const p = priority || "normal";
    const colors: Record<string, string> = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return colors[p] || colors.normal;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Campus Welfare Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">
              Executive overview of institutional governance metrics
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Total Cases</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Awaiting Review</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Approved</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.approved}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">In Deliberation</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">{stats.inProgress}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resolution Progress Chart */}
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">Resolution Progress (Weekly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Bar dataKey="resolutions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">Case Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Queue */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-base">Priority Queue</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald-400 hover:text-emerald-300"
              onClick={() => navigate("/admin/resolutions")}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pendingQueue.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No pending resolutions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/resolutions/${item.id}`)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {item.grievance_text.slice(0, 60)}...
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.department || "General"} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getPriorityBadge(item.priority)}
                      >
                        {item.priority || "Normal"}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                      >
                        Awaiting Approval
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
