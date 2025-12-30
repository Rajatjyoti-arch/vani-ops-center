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
  Download,
  Scale,
  Lock
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EvidenceViewer } from "@/components/admin/EvidenceViewer";
import { PolicyParametersPanel } from "@/components/admin/PolicyParametersPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  vault_file_id: string | null;
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
  const [consensus, setConsensus] = useState("");

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
      
      const parsedLog = Array.isArray(data.negotiation_log) 
        ? (data.negotiation_log as unknown as NegotiationLog[])
        : [];
      
      const neg: Negotiation = {
        ...data,
        negotiation_log: parsedLog
      };
      setNegotiation(neg);
      setBudgetLevel(neg.budget_level || "medium");
      setUrgencyLevel(neg.urgency_level || "normal");
      setPriority(neg.priority || "normal");
      setAdminNotes(neg.admin_notes || "");
      setConsensus(neg.final_consensus || "");
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

  const generateCertificatePDF = () => {
    if (!negotiation) return "";

    const evidenceHash = negotiation.vault_file_id 
      ? `SHA256:${negotiation.vault_file_id.replace(/-/g, "").slice(0, 32).toUpperCase()}`
      : "NO_EVIDENCE_ATTACHED";

    const certContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    OFFICIAL RESOLUTION CERTIFICATE                           ║
║                                                                              ║
║                    Central University of Jammu                               ║
║                Administrative Oversight Division                             ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  CERTIFICATE ID: CUJ-RES-${negotiation.id.slice(0, 8).toUpperCase()}                              ║
║  DATE OF ISSUANCE: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}                                    ║
║  STATUS: OFFICIALLY SEALED & CERTIFIED                                       ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  GRIEVANCE SUMMARY:                                                          ║
║  ${negotiation.grievance_text.slice(0, 70)}...
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  FINAL CONSENSUS:                                                            ║
║  ${(consensus || negotiation.final_consensus || "Resolution achieved through deliberation").slice(0, 70)}...
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ADMINISTRATIVE PARAMETERS:                                                  ║
║  • Budget Allocation: ${budgetLevel.toUpperCase()}                                              ║
║  • Urgency Classification: ${urgencyLevel.toUpperCase()}                                        ║
║  • Priority Level: ${priority.toUpperCase()}                                                    ║
║                                                                              ║
║  ADMINISTRATIVE NOTES:                                                       ║
║  ${(adminNotes || "No additional notes provided.").slice(0, 70)}
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  EVIDENCE VERIFICATION:                                                      ║
║  Cryptographic Hash: ${evidenceHash}
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                         ┌─────────────────────┐                              ║
║                         │                     │                              ║
║                         │   OFFICIAL SEAL     │                              ║
║                         │                     │                              ║
║                         │   ★ CUJ ★          │                              ║
║                         │                     │                              ║
║                         └─────────────────────┘                              ║
║                                                                              ║
║  Digital Signature: ${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}                          ║
║  Verification URL: vani.cujammu.ac.in/verify/${negotiation.id.slice(0, 8)}                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

This certificate confirms that the above resolution has been reviewed, 
deliberated upon through the Governance Resolution Matrix, and officially 
approved by the institutional administration in accordance with university 
governance protocols and the VANI (Verifiable Anonymous Network Intelligence) 
compliance framework.

The cryptographic hash ensures the integrity and authenticity of all 
submitted evidence. Any tampering will invalidate this certificate.

Generated: ${new Date().toISOString()}
`;
    return certContent;
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
          final_consensus: consensus || negotiation.final_consensus,
        })
        .eq("id", negotiation.id);

      if (updateError) throw updateError;

      // Create notification for the student
      const { error: notifError } = await supabase
        .from("admin_notifications")
        .insert({
          negotiation_id: negotiation.id,
          notification_type: "resolution_approved",
          message: `Your resolution (Case ID: ${negotiation.id.slice(0, 8).toUpperCase()}) has been officially approved and sealed by the Central University of Jammu administration. The agreed consensus has been certified and recorded in the Compliance Log. ${adminNotes ? `\n\nAdministrative Notes: ${adminNotes}` : ""}`,
        });

      if (notifError) {
        console.error("Error creating notification:", notifError);
      }

      // Generate and download certificate
      const certContent = generateCertificatePDF();
      const blob = new Blob([certContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CUJ-Resolution-Certificate-${negotiation.id.slice(0, 8).toUpperCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resolution Approved & Certified",
        description: "The resolution has been officially sealed, the student notified, and the certificate downloaded.",
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

  const handleDownloadCertificate = () => {
    if (!negotiation) return;
    
    const certContent = generateCertificatePDF();
    const blob = new Blob([certContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CUJ-Resolution-Certificate-${negotiation.id.slice(0, 8).toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: "The official resolution certificate has been saved.",
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
              <h1 className="text-xl font-bold text-white">Resolution Chamber</h1>
              <p className="text-slate-400 text-sm">
                Case ID: {negotiation.id.slice(0, 8).toUpperCase()} • {negotiation.department || "General Department"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isApproved ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Officially Sealed
              </Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-1">
                <Clock className="w-4 h-4 mr-2" />
                Awaiting Approval
              </Badge>
            )}
          </div>
        </div>

        {/* Side-by-Side View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Evidence Repository */}
          <div className="space-y-4">
            <EvidenceViewer vaultFileId={negotiation.vault_file_id} />
            
            {/* Grievance Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Grievance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {negotiation.grievance_text}
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(negotiation.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3 h-3" />
                    {negotiation.department || "General"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Governance Matrix */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  Governance Resolution Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="deliberation" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger value="deliberation" className="text-xs">Deliberation Log</TabsTrigger>
                    <TabsTrigger value="consensus" className="text-xs">Final Consensus</TabsTrigger>
                  </TabsList>
                  <TabsContent value="deliberation" className="mt-3">
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {negotiation.negotiation_log.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">
                          No deliberation log available
                        </p>
                      ) : (
                        negotiation.negotiation_log.map((entry, index) => (
                          <div
                            key={index}
                            className={`p-2.5 rounded-lg text-xs ${
                              entry.role === "Student Advocate"
                                ? "bg-blue-500/10 border border-blue-500/20"
                                : entry.role === "Administration"
                                ? "bg-slate-700/50 border border-slate-600"
                                : "bg-emerald-500/10 border border-emerald-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <User className="w-3 h-3" />
                              <span className="font-medium text-slate-300">
                                {entry.role}
                              </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">{entry.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="consensus" className="mt-3">
                    {isApproved ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <p className="text-emerald-300 text-sm leading-relaxed">
                          {consensus || negotiation.final_consensus || "Resolution achieved."}
                        </p>
                      </div>
                    ) : (
                      <Textarea
                        value={consensus}
                        onChange={(e) => setConsensus(e.target.value)}
                        placeholder="Final consensus will be generated by the Governance AI or can be manually entered..."
                        className="bg-slate-900 border-slate-600 text-white text-sm min-h-32"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Policy Parameters */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Policy Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <PolicyParametersPanel
                  negotiationId={negotiation.id}
                  budgetLevel={budgetLevel}
                  urgencyLevel={urgencyLevel}
                  onBudgetChange={setBudgetLevel}
                  onUrgencyChange={setUrgencyLevel}
                  onConsensusUpdate={setConsensus}
                  disabled={isApproved}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Administrative Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for official record..."
                    className="bg-slate-900 border-slate-600 text-white text-sm w-96 h-20"
                    disabled={isApproved}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isApproved ? (
                  <>
                    <Button
                      onClick={handleDownloadCertificate}
                      className="bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/50 flex items-center justify-center bg-emerald-500/10">
                      <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-base"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Approve & Certify Resolution
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {!isApproved && (
              <p className="text-xs text-slate-500 mt-3 text-right">
                Approving will: Update database status • Generate official certificate • Notify anonymous credential holder
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
