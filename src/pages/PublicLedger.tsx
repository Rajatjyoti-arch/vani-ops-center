import { useState, useEffect } from "react";
import { Radio, AlertTriangle, Eye, Clock, FileWarning } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeakEntry {
  id: string;
  text: string;
  timestamp: string;
  type: string;
}

export default function PublicLedger() {
  const [entries, setEntries] = useState<LeakEntry[]>([]);

  useEffect(() => {
    // Load from localStorage (simulated public ledger)
    const stored = localStorage.getItem("public_ledger");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Radio className="w-7 h-7 text-status-critical animate-pulse" />
              Public Transparency Node
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Immutable record of released evidence • Cannot be censored or deleted
            </p>
          </div>
          <Badge variant="destructive" className="font-mono animate-pulse">
            <Eye className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>

        {/* Warning banner */}
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-status-critical shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-status-critical">
              This ledger contains evidence released via Dead Man's Switch activation
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All entries are cryptographically signed and timestamp-verified. This data exists independently 
              of any administrative control and serves as proof of grievances that could not be resolved 
              through normal negotiation channels.
            </p>
          </div>
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <FileWarning className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Public Leaks
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This transparency node is empty. Evidence is only released here when a Dead Man's Switch 
                is triggered due to failed negotiations or lack of check-in.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-mono">
                {entries.length} ENTRIES IN PUBLIC LEDGER
              </span>
            </div>
            
            {entries.map((entry, index) => (
              <Card 
                key={entry.id} 
                className="bg-card/50 border-status-critical/30 hover:border-status-critical/50 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="font-mono text-[10px]">
                        {entry.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{String(entries.length - index).padStart(4, "0")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 border border-border/50 rounded p-3">
                    <p className="text-sm text-foreground/90 font-mono">
                      {entry.text}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                    <span>HASH: {entry.id.slice(0, 8)}...{entry.id.slice(-4)}</span>
                    <span>VERIFIED: TRUE</span>
                    <span>IMMUTABLE: TRUE</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="text-center py-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-mono">
            "The truth cannot be silenced. This node operates independently of all administrative control."
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
