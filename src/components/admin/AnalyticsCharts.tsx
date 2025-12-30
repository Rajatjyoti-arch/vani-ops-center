import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Building2, Activity, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResolutionTrend {
  date: string;
  resolved: number;
  submitted: number;
}

interface DepartmentPerformance {
  department: string;
  total: number;
  resolved: number;
  pending: number;
}

interface SentimentData {
  zone: string;
  score: number;
  reports: number;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsCharts() {
  const [resolutionTrends, setResolutionTrends] = useState<ResolutionTrend[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPerformance[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch negotiations for trends and department data
      const { data: negotiations } = await supabase
        .from("arena_negotiations")
        .select("*")
        .order("created_at", { ascending: true });

      // Fetch sentiment logs
      const { data: sentimentLogs } = await supabase
        .from("sentiment_logs")
        .select("*");

      // Process resolution trends (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const trends = last7Days.map(date => {
        const dayNegotiations = negotiations?.filter(n => 
          n.created_at.startsWith(date)
        ) || [];
        const resolved = dayNegotiations.filter(n => n.admin_approved_at).length;
        return {
          date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          resolved,
          submitted: dayNegotiations.length,
        };
      });
      setResolutionTrends(trends);

      // Process department performance
      const departments: Record<string, DepartmentPerformance> = {};
      negotiations?.forEach(n => {
        const dept = n.department || "General";
        if (!departments[dept]) {
          departments[dept] = { department: dept, total: 0, resolved: 0, pending: 0 };
        }
        departments[dept].total++;
        if (n.admin_approved_at) {
          departments[dept].resolved++;
        } else if (n.status === "completed") {
          departments[dept].pending++;
        }
      });
      setDepartmentData(Object.values(departments).slice(0, 6));

      // Process sentiment data
      const sentiment = sentimentLogs?.map(log => ({
        zone: log.zone_name,
        score: log.concern_level === "low" ? 80 : log.concern_level === "moderate" ? 50 : 20,
        reports: log.reports_count,
      })) || [];
      setSentimentData(sentiment.slice(0, 8));

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Detailed Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="bg-slate-700 mb-4">
            <TabsTrigger value="trends" className="data-[state=active]:bg-emerald-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Resolution Trends
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-emerald-600">
              <Building2 className="w-4 h-4 mr-2" />
              Department Performance
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-emerald-600">
              <Calendar className="w-4 h-4 mr-2" />
              Sentiment Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Resolution activity over the past 7 days
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={resolutionTrends}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="submitted" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorSubmitted)" 
                    name="Submitted"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorResolved)" 
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-400">Submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">Resolved</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Case distribution and resolution rates by department
              </p>
              {departmentData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No department data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis dataKey="department" type="category" stroke="#64748b" fontSize={11} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1e293b", 
                        border: "1px solid #334155",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="resolved" stackId="a" fill="#10b981" name="Resolved" />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-400">Pending</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Campus zone sentiment scores based on report patterns
              </p>
              {sentimentData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No sentiment data available
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="zone" stroke="#64748b" fontSize={10} angle={-45} textAnchor="end" height={60} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1e293b", 
                          border: "1px solid #334155",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="score" name="Sentiment Score" radius={[4, 4, 0, 0]}>
                        {sentimentData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score >= 70 ? "#10b981" : entry.score >= 40 ? "#f59e0b" : "#ef4444"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="reports"
                        nameKey="zone"
                        label={({ zone, percent }) => `${zone}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {sentimentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
