import { useState, useEffect } from "react";
import { Scroll, Lock, Unlock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LegacyThread {
  id: string;
  ghost_name: string;
  reputation: number;
  message: string;
}

// Simulated legacy threads (in production, this would be a separate table)
const LEGACY_THREADS: LegacyThread[] = [
  {
    id: "1",
    ghost_name: "ShadowMentor_99",
    reputation: 85,
    message: "Trust the process. Document everything. The system fears transparency.",
  },
  {
    id: "2",
    ghost_name: "CyberSage_42",
    reputation: 72,
    message: "Always encrypt your evidence before upload. Future you will thank present you.",
  },
  {
    id: "3",
    ghost_name: "DigitalGuardian_X",
    reputation: 90,
    message: "The Arena favors those who argue with facts, not emotion. Let data speak.",
  },
];

const TRUST_THRESHOLD = 65;

export function LegacyThreads({ collapsed }: { collapsed: boolean }) {
  const [userTrustScore, setUserTrustScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchUserReputation = async () => {
      // Fetch highest reputation from ghost_identities as a proxy for trust score
      const { data, error } = await supabase
        .from("ghost_identities")
        .select("reputation")
        .order("reputation", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching reputation:", error);
        setUserTrustScore(50); // Default
      } else {
        setUserTrustScore(data?.[0]?.reputation || 50);
      }
      setIsLoading(false);
    };

    fetchUserReputation();
  }, []);

  const hasAccess = userTrustScore !== null && userTrustScore >= TRUST_THRESHOLD;
  const accessibleThreads = LEGACY_THREADS.filter(t => 
    userTrustScore !== null && userTrustScore >= t.reputation - 20
  );

  if (collapsed) {
    return (
      <div className="px-3 py-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            hasAccess
              ? "bg-status-safe/20 text-status-safe"
              : "bg-secondary/50 text-muted-foreground"
          }`}
          title="Legacy Threads"
        >
          <Scroll className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-border/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <div className="flex items-center gap-2">
          <Scroll className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
            Legacy Threads
          </span>
        </div>
        {hasAccess ? (
          <Unlock className="w-3 h-3 text-status-safe" />
        ) : (
          <Lock className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-fade-in space-y-2 max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          ) : !hasAccess ? (
            <div className="p-2 bg-secondary/30 border border-border/30 rounded text-center">
              <Lock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                Trust Score {userTrustScore}/{TRUST_THRESHOLD} required
              </p>
              <p className="text-[10px] text-primary mt-1">
                Submit more reports to unlock
              </p>
            </div>
          ) : accessibleThreads.length === 0 ? (
            <p className="text-[10px] text-muted-foreground text-center py-2">
              No time-capsules available yet
            </p>
          ) : (
            accessibleThreads.map((thread) => (
              <div
                key={thread.id}
                className="p-2 bg-secondary/30 border border-primary/20 rounded space-y-1 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-primary">
                    {thread.ghost_name}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    Trust: {thread.reputation}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/90 italic leading-tight">
                  "{thread.message}"
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
