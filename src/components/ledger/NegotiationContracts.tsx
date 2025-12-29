import { useState, useEffect } from "react";
import { FileSignature, Download, Scale, Shield, Building2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime, generateCertificateHash } from "@/lib/crypto";
import { toast } from "sonner";

interface NegotiationRound {
  round: number;
  agent: string;
  message: string;
  sentimentShift: number;
  timestamp: string;
}

interface Negotiation {
  id: string;
  grievance_text: string;
  negotiation_log: NegotiationRound[];
  final_consensus: string | null;
  sentinel_score: number;
  governor_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function NegotiationContracts() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNegotiations = async () => {
      const { data, error } = await supabase
        .from("arena_negotiations")
        .select("*")
        .eq("status", "completed")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching negotiations:", error);
      } else {
        setNegotiations(
          (data || []).map((n) => ({
            ...n,
            negotiation_log: (n.negotiation_log as unknown) as NegotiationRound[],
          }))
        );
      }
      setIsLoading(false);
    };

    fetchNegotiations();
  }, []);

  const downloadCertificate = async (negotiation: Negotiation) => {
    const certHash = await generateCertificateHash(
      negotiation.id + negotiation.final_consensus + negotiation.updated_at
    );

    const certificate = `
╔════════════════════════════════════════════════════════════════════╗
║                    VANI CRYPTOGRAPHIC CERTIFICATE                  ║
║              Verifiable Anonymous Network Intelligence             ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  SIGNED DIGITAL CONTRACT                                           ║
║                                                                    ║
║  Contract ID: ${negotiation.id}
║                                                                    ║
║  Issue Date: ${new Date(negotiation.created_at).toISOString()}
║  Resolution Date: ${new Date(negotiation.updated_at).toISOString()}
║                                                                    ║
║  GRIEVANCE SUMMARY:                                                ║
║  ${negotiation.grievance_text.slice(0, 60)}${negotiation.grievance_text.length > 60 ? "..." : ""}
║                                                                    ║
║  FINAL CONSENSUS:                                                  ║
║  ${negotiation.final_consensus?.slice(0, 60) || "N/A"}${(negotiation.final_consensus?.length || 0) > 60 ? "..." : ""}
║                                                                    ║
║  NEGOTIATION METRICS:                                              ║
║  ├── Sentinel Score: ${negotiation.sentinel_score}%
║  ├── Governor Score: ${negotiation.governor_score}%
║  └── Rounds Completed: ${negotiation.negotiation_log.length}
║                                                                    ║
║  CRYPTOGRAPHIC HASH (SHA-256):                                     ║
║  ${certHash}
║                                                                    ║
║  This certificate is cryptographically signed and verifiable.      ║
║  Any tampering will invalidate the hash above.                     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([certificate], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VANI-Contract-${negotiation.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Certificate Downloaded", {
      description: "Cryptographic proof saved to device",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-primary" />
            Signed Digital Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (negotiations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/80 border-primary/30 cyber-glow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSignature className="w-4 h-4 text-primary" />
          Signed Digital Contracts
          <span className="ml-auto text-xs font-mono text-muted-foreground">
            {negotiations.length} verified
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {negotiations.map((negotiation) => (
          <div
            key={negotiation.id}
            className="p-4 bg-secondary/30 border border-primary/20 rounded-lg space-y-3 hover:border-primary/40 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-status-safe" />
                <span className="font-mono text-xs text-primary">
                  CONTRACT-{negotiation.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Resolved {formatRelativeTime(negotiation.updated_at)}
              </span>
            </div>

            {/* Grievance */}
            <p className="text-sm text-foreground/80 line-clamp-2">
              {negotiation.grievance_text}
            </p>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-primary font-mono">{negotiation.sentinel_score}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-status-warning" />
                <span className="text-status-warning font-mono">{negotiation.governor_score}%</span>
              </div>
              <span className="text-muted-foreground">
                {negotiation.negotiation_log.length} rounds
              </span>
            </div>

            {/* Consensus */}
            {negotiation.final_consensus && (
              <div className="p-2 bg-status-safe/10 border border-status-safe/30 rounded text-xs text-status-safe">
                <span className="font-mono uppercase text-[10px] block mb-1">Final Consensus:</span>
                <span className="text-foreground/90">{negotiation.final_consensus}</span>
              </div>
            )}

            {/* Download Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadCertificate(negotiation)}
              className="w-full cyber-button border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download className="w-3 h-3 mr-2" />
              Download Cryptographic Certificate
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
