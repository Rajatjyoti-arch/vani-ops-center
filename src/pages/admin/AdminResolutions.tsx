import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ChevronRight,
  Building2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Negotiation {
  id: string;
  grievance_text: string;
  status: string;
  priority: string | null;
  department: string | null;
  created_at: string;
  urgency_level: string | null;
  admin_approved_at: string | null;
  final_consensus: string | null;
}

export default function AdminResolutions() {
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [filteredNegotiations, setFilteredNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchNegotiations();
  }, []);

  useEffect(() => {
    filterNegotiations();
  }, [negotiations, searchQuery, statusFilter, priorityFilter]);

  const fetchNegotiations = async () => {
    try {
      const { data, error } = await supabase
        .from("arena_negotiations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNegotiations(data as Negotiation[]);
    } catch (err) {
      console.error("Error fetching negotiations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNegotiations = () => {
    let filtered = [...negotiations];

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.grievance_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        filtered = filtered.filter(n => n.status === "completed" && !n.admin_approved_at);
      } else if (statusFilter === "approved") {
        filtered = filtered.filter(n => n.admin_approved_at);
      } else if (statusFilter === "in_progress") {
        filtered = filtered.filter(n => n.status === "in_progress");
      }
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(n => (n.priority || "normal") === priorityFilter);
    }

    setFilteredNegotiations(filtered);
  };

  const getStatusBadge = (negotiation: Negotiation) => {
    if (negotiation.admin_approved_at) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Approved
        </Badge>
      );
    }
    if (negotiation.status === "completed") {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          Awaiting Approval
        </Badge>
      );
    }
    if (negotiation.status === "in_progress") {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          In Deliberation
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
        {negotiation.status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string | null) => {
    const p = priority || "normal";
    const config: Record<string, { className: string; label: string }> = {
      critical: { className: "bg-red-500/20 text-red-400 border-red-500/30", label: "Critical" },
      high: { className: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "High" },
      normal: { className: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Normal" },
      low: { className: "bg-slate-500/20 text-slate-400 border-slate-500/30", label: "Low" },
    };
    const { className, label } = config[p] || config.normal;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Resolutions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and approve resolution agreements
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by grievance or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Awaiting Approval</SelectItem>
                  <SelectItem value="in_progress">In Deliberation</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resolutions List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">
                Resolution Queue ({filteredNegotiations.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredNegotiations.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No resolutions found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNegotiations.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-700/50"
                    onClick={() => navigate(`/admin/resolutions/${item.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {item.grievance_text.slice(0, 80)}...
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">
                            {item.department || "General Department"}
                          </span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item)}
                      <ChevronRight className="w-5 h-5 text-slate-500" />
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
