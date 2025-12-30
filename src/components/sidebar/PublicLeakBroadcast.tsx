import { useEffect, useState } from "react";
import { AlertTriangle, Radio, Skull, X } from "lucide-react";
import { useDeadManSwitch } from "@/contexts/DeadManSwitchContext";
import { supabase } from "@/integrations/supabase/client";
import { MatrixRain } from "@/components/effects/MatrixRain";

export function PublicLeakBroadcast() {
  const { hasTriggered, resetTrigger } = useDeadManSwitch();
  const [leakedData, setLeakedData] = useState<string[]>([]);
  const [isLeaking, setIsLeaking] = useState(false);
  const [leakComplete, setLeakComplete] = useState(false);

  useEffect(() => {
    if (hasTriggered && !isLeaking && !leakComplete) {
      triggerLeak();
    }
  }, [hasTriggered]);

  const triggerLeak = async () => {
    setIsLeaking(true);
    
    // Fetch grievances from vault
    const { data: vaultFiles } = await supabase
      .from("stealth_vault")
      .select("secret_metadata, file_name, created_at")
      .limit(5);

    // Simulate webhook POST to public ledger
    const leakPayload = vaultFiles?.map((file) => {
      const metadata = file.secret_metadata as unknown as Record<string, unknown> | null;
      return (metadata?.grievance_text as string) || `Encrypted evidence: ${file.file_name}`;
    }) || ["No evidence found - system integrity maintained"];

    // Simulate delay for dramatic effect
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setLeakedData(leakPayload);
    
    // Store in localStorage as "Public Ledger" (simulated)
    const existingLedger = JSON.parse(localStorage.getItem("public_ledger") || "[]");
    const newEntries = leakPayload.map((text, i) => ({
      id: `leak-${Date.now()}-${i}`,
      text,
      timestamp: new Date().toISOString(),
      type: "DEAD_MAN_SWITCH_TRIGGER",
    }));
    localStorage.setItem("public_ledger", JSON.stringify([...newEntries, ...existingLedger]));
    
    setIsLeaking(false);
    setLeakComplete(true);
  };

  const handleDismiss = () => {
    resetTrigger();
    setLeakedData([]);
    setLeakComplete(false);
  };

  if (!hasTriggered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Background lock overlay */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      
      {/* Matrix rain effect */}
      <div className="absolute inset-0 opacity-30">
        <MatrixRain />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 scan-lines pointer-events-none" />

      {/* Main broadcast window */}
      <div className="relative z-10 max-w-2xl w-full mx-4 animate-scale-in">
        {/* Flashing warning border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-status-critical via-destructive to-status-critical rounded-lg opacity-75 animate-pulse" />
        
        <div className="relative bg-background border-2 border-status-critical rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-status-critical/20 border-b border-status-critical p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skull className="w-8 h-8 text-status-critical animate-pulse" />
                <div>
                  <h2 className="font-mono text-xl font-bold text-status-critical glitch-text">
                    SYSTEM LOCKDOWN
                  </h2>
                  <p className="text-xs text-status-critical/80 font-mono">
                    DEAD MAN'S SWITCH ACTIVATED
                  </p>
                </div>
              </div>
              <Radio className="w-6 h-6 text-status-critical animate-pulse" />
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 space-y-4">
            {/* Alert message */}
            <div className="flex items-center gap-3 p-4 bg-status-critical/10 border border-status-critical/50 rounded">
              <AlertTriangle className="w-6 h-6 text-status-critical shrink-0" />
              <div className="font-mono text-sm">
                <p className="text-status-critical font-bold">
                  NEGOTIATION FAILED
                </p>
                <p className="text-foreground/80 mt-1">
                  RELEASING ENCRYPTED EVIDENCE TO PUBLIC TRANSPARENCY NODE
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-sm font-mono">
              <div className={`w-3 h-3 rounded-full ${isLeaking ? "bg-status-warning animate-pulse" : "bg-status-critical"}`} />
              <span className="text-muted-foreground">
                {isLeaking ? "TRANSMITTING..." : leakComplete ? "BROADCAST COMPLETE" : "INITIALIZING..."}
              </span>
            </div>

            {/* Leaked data preview */}
            {leakedData.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Evidence Released to Public Ledger:
                </p>
                <div className="bg-slate-dark/50 border border-border/50 rounded p-3 max-h-48 overflow-y-auto">
                  {leakedData.map((text, i) => (
                    <div key={i} className="flex items-start gap-2 py-1 text-sm font-mono">
                      <span className="text-status-critical">▸</span>
                      <span className="text-foreground/80">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Independence note */}
            <p className="text-[10px] text-center text-muted-foreground font-mono">
              This broadcast is now permanent and cannot be recalled.
              <br />
              The truth has been set free.
            </p>
          </div>

          {/* Footer */}
          {leakComplete && (
            <div className="border-t border-status-critical/30 p-4 bg-status-critical/5">
              <button
                onClick={handleDismiss}
                className="w-full py-2 px-4 bg-status-critical/20 border border-status-critical/50 rounded text-status-critical font-mono text-sm hover:bg-status-critical/30 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                ACKNOWLEDGE & RESET SYSTEM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
