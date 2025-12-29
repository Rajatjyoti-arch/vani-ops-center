import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const COUNTDOWN_DURATION = 48 * 60 * 60; // 48 hours in seconds

export function DeadManSwitch({ collapsed }: { collapsed: boolean }) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(COUNTDOWN_DURATION);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Trigger broadcast (simulated)
          console.log("Dead Man's Switch triggered - Broadcasting to Public Transparency Node");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleCheckIn = () => {
    setTimeRemaining(COUNTDOWN_DURATION);
  };

  if (collapsed) {
    return (
      <div className="px-3 py-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isActive
              ? "bg-status-critical/20 text-status-critical animate-pulse"
              : "bg-secondary/50 text-muted-foreground"
          }`}
          title="Dead Man's Switch"
        >
          <AlertTriangle className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-border/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`w-4 h-4 ${isActive ? "text-status-critical animate-pulse" : "text-muted-foreground"}`}
          />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Dead Man's Switch
          </span>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-status-critical"
        />
      </div>

      {isActive && (
        <div className="animate-fade-in space-y-2">
          <div className="flex items-center gap-2 p-2 bg-status-critical/10 border border-status-critical/30 rounded">
            <Clock className="w-4 h-4 text-status-critical" />
            <span className="font-mono text-lg text-status-critical font-bold">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="text-[10px] text-status-critical/80 leading-tight">
            If no check-in occurs, encrypted evidence will be broadcast to the Public Transparency Node.
          </p>
          <button
            onClick={handleCheckIn}
            className="w-full py-1.5 text-xs font-mono bg-status-critical/20 text-status-critical border border-status-critical/30 rounded hover:bg-status-critical/30 transition-colors"
          >
            CHECK IN
          </button>
        </div>
      )}
    </div>
  );
}
