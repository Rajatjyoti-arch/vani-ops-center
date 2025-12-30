import { useCallback } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useDeadManSwitch } from "@/contexts/DeadManSwitchContext";

export function DeadManSwitch({ collapsed }: { collapsed: boolean }) {
  const { isActive, timeRemaining, hasTriggered, setIsActive, checkIn } = useDeadManSwitch();

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleCheckIn = () => {
    checkIn();
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
            className={`w-4 h-4 ${isActive ? "text-destructive" : "text-muted-foreground"}`}
          />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Emergency Disclosure
          </span>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-destructive"
        />
      </div>

      {isActive && (
        <div className="animate-fade-in space-y-2">
          <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded">
            <Clock className="w-4 h-4 text-destructive" />
            <span className="font-mono text-lg text-destructive font-bold">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            If no check-in occurs within the timeframe, evidence will be released to the Public Disclosure archive.
          </p>
          <button
            onClick={handleCheckIn}
            className="w-full py-2 text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30 rounded hover:bg-destructive/20 transition-colors"
          >
            Confirm Check-In
          </button>
        </div>
      )}
    </div>
  );
}
