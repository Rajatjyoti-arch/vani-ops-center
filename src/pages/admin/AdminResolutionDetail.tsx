import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Shield, 
  FileCheck, 
  AlertTriangle,
  Clock,
  User,
  Building2,
  CheckCircle2,
  Loader2,
  Download
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "@/hooks/use-toast";

interface NegotiationLog {
  role: string;
  content: string;
  timestamp?: string;
}

interface Negotiation {
  id: string;
  grievance_text: string;
  status: string;
  priority: string | null;
  department: string | null;
  created_at: string;
  urgency_level: string | null;
  budget_level: string | null;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  admin_notes: string | null;
  final_consensus: string | null;
  negotiation_log: NegotiationLog[];
  sentinel_score: number | null;
  governor_score: number | null;
}

export default function AdminResolutionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [budgetLevel, setBudgetLevel] = useState("medium");
  const [urgencyLevel, setUrgencyLevel] = useState("normal");
  const [priority, setPriority] = useState("normal");

  useEffect(() => {
    if (id) {
      fetchNegotiation();
    }
  }, [id]);

  const fetchNegotiation = async () => {
    try {
      const { data, error } = await supabase
        .from("arena_negotiations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      const neg = {
        ...data,
        negotiation_log: Array.isArray(data.negotiation_log) ? data.negotiation_log : []
      } as Negotiation;
      setNegotiation(neg);
      setBudgetLevel(neg.budget_level || "medium");
      setUrgencyLevel(neg.urgency_level || "normal");
      setPriority(neg.priority || "normal");
      setAdminNotes(neg.admin_notes || "");
    } catch (err) {
      console.error("Error fetching negotiation:", err);
      toast({
        title: "Error",
        description: "Failed to load resolution details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!negotiation || !user) return;
    
    setIsApproving(true);
    try {
      // Update negotiation with approval
      const { error: updateError } = await supabase
        .from("arena_negotiations")
        .update({
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: user.id,
          admin_notes: adminNotes,
          budget_level: budgetLevel,
          urgency_level: urgencyLevel,
          priority: priority,
          status: "approved",
        })
        .eq("id", negotiation.id);

      if (updateError) throw updateError;

      // Create notification for the student (if we had ghost_identity_id linked)
      // For now, we'll create a general notification
      const { error: notifError } = await supabase
        .from("admin_notifications")
        .insert({
          negotiation_id: negotiation.id,
          notification_type: "resolution_approved",
          message: `Your resolution has been officially approved and sealed by the administration. ${adminNotes ? `Admin notes: ${adminNotes}` : ""}`,
        });

      if (notifError) {
        console.error("Error creating notification:", notifError);
      }

      toast({
        title: "Resolution Approved",
        description: "The resolution has been officially sealed and the student has been notified.",
      });

      navigate("/admin/resolutions");
    } catch (err) {
      console.error("Error approving resolution:", err);
      toast({
        title: "Approval Failed",
        description: "Failed to approve the resolution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const generateCertificate = () => {
    if (!negotiation) return;
    
    const certificateContent = `
OFFICIAL RESOLUTION CERTIFICATE
================================
Central University of Jammu
Administrative Oversight Division

Resolution ID: ${negotiation.id.slice(0, 8).toUpperCase()}
Date Approved: ${new Date().toLocaleDateString()}
Status: OFFICIALLY SEALED

GRIEVANCE SUMMARY:
${negotiation.grievance_text}

FINAL CONSENSUS:
${negotiation.final_consensus || "Resolution reached through governance matrix deliberation."}

ADMINISTRATIVE NOTES:
${adminNotes || "No additional notes."}

---
This certificate confirms that the above resolution has been reviewed and 
approved by the institutional administration in accordance with university 
governance protocols.

Digital Seal: CUJ-${Date.now().toString(36).toUpperCase()}
    `;

    const blob = new Blob([certificateContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resolution-certificate-${negotiation.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Generated",
      description: "The resolution certificate has been downloaded.",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!negotiation) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Resolution not found</p>
          <Button
            variant="ghost"
            className="mt-4 text-emerald-400"
            onClick={() => navigate("/admin/resolutions")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resolutions
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const isApproved = !!negotiation.admin_approved_at;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/resolutions")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Consensus Matrix</h1>
              <p className="text-slate-400 text-sm">
                Case ID: {negotiation.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          {isApproved && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Officially Sealed
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grievance Details */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Grievance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {negotiation.grievance_text}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    Submitted: {new Date(negotiation.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Building2 className="w-3 h-3" />
                    {negotiation.department || "General Department"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Consensus */}
            {negotiation.final_consensus && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Final Consensus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-emerald-300 text-sm leading-relaxed">
                      {negotiation.final_consensus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deliberation Log */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Deliberation Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {negotiation.negotiation_log.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        entry.role === "Student Advocate"
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : entry.role === "Administration"
                          ? "bg-slate-700/50 border border-slate-600"
                          : "bg-emerald-500/10 border border-emerald-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium text-slate-300">
                          {entry.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Policy Settings */}
          <div className="space-y-6">
            {/* Policy Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Policy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Budget Availability</Label>
                  <Select value={budgetLevel} onValueChange={setBudgetLevel} disabled={isApproved}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low">Low Budget</SelectItem>
                      <SelectItem value="medium">Medium Budget</SelectItem>
                      <SelectItem value="high">High Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Urgency Level</Label>
                  <Select value={urgencyLevel} onValueChange={setUrgencyLevel} disabled={isApproved}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Case Priority</Label>
                  <Select value={priority} onValueChange={setPriority} disabled={isApproved}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Administrative Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this resolution..."
                  className="bg-slate-900 border-slate-600 text-white min-h-24"
                  disabled={isApproved}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 space-y-3">
                {!isApproved ? (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Approve & Seal Resolution
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={generateCertificate}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-6"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Certificate
                  </Button>
                )}
                <p className="text-xs text-slate-500 text-center">
                  {isApproved
                    ? "This resolution has been officially sealed."
                    : "Approving will update the Compliance Log and notify the student."}
                </p>
              </CardContent>
            </Card>

            {/* Official Seal Placeholder */}
            {isApproved && (
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-emerald-500/50 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-emerald-400 font-semibold">Official Seal</p>
                  <p className="text-xs text-emerald-500/70 mt-1">
                    Central University of Jammu
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Approved: {new Date(negotiation.admin_approved_at!).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
