import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  level: "safe" | "warning" | "critical";
  reports: number;
  lastReport: string;
}

const mockZones: Zone[] = [
  { id: "hostel-1", name: "Hostel 1", level: "critical", reports: 12, lastReport: "2h ago" },
  { id: "hostel-2", name: "Hostel 2", level: "warning", reports: 5, lastReport: "4h ago" },
  { id: "academic", name: "Academic Block", level: "safe", reports: 2, lastReport: "1d ago" },
  { id: "library", name: "Library", level: "safe", reports: 1, lastReport: "3d ago" },
  { id: "cafeteria", name: "Cafeteria", level: "warning", reports: 7, lastReport: "6h ago" },
  { id: "sports", name: "Sports Complex", level: "safe", reports: 0, lastReport: "Never" },
  { id: "admin", name: "Admin Block", level: "safe", reports: 3, lastReport: "2d ago" },
  { id: "parking", name: "Parking Area", level: "warning", reports: 4, lastReport: "12h ago" },
  { id: "gate", name: "Main Gate", level: "critical", reports: 8, lastReport: "1h ago" },
];

const levelConfig = {
  safe: {
    color: "bg-status-safe/20 border-status-safe/50",
    glow: "shadow-[0_0_20px_hsl(142_76%_45%/0.3)]",
    icon: CheckCircle,
    iconColor: "text-status-safe",
  },
  warning: {
    color: "bg-status-warning/20 border-status-warning/50",
    glow: "shadow-[0_0_20px_hsl(45_93%_55%/0.3)]",
    icon: Info,
    iconColor: "text-status-warning",
  },
  critical: {
    color: "bg-status-critical/20 border-status-critical/50",
    glow: "shadow-[0_0_20px_hsl(0_84%_60%/0.3)]",
    icon: AlertTriangle,
    iconColor: "text-status-critical",
  },
};

export function SentimentMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 cyber-glow">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Campus Sentiment Map</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time concern levels by area
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-status-safe" />
              <span className="text-muted-foreground">Safe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-status-warning" />
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-status-critical" />
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {mockZones.map((zone) => {
            const config = levelConfig[zone.level];
            const Icon = config.icon;
            const isSelected = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`
                  relative p-4 rounded-lg border transition-all duration-300
                  ${config.color} ${config.glow}
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected ? "ring-2 ring-primary" : ""}
                  cyber-button
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <h4 className="font-medium text-sm text-foreground">{zone.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {zone.reports} reports
                    </p>
                  </div>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                
                {/* Pulse effect for critical zones */}
                {zone.level === "critical" && (
                  <div className="absolute inset-0 rounded-lg border-2 border-status-critical/50 animate-ping opacity-30" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Zone Details */}
        {selectedZone && (
          <div className="animate-fade-in p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-primary">{selectedZone.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${levelConfig[selectedZone.level].color}`}>
                {selectedZone.level.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Active Reports</span>
                <p className="font-mono text-lg text-foreground">{selectedZone.reports}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Report</span>
                <p className="font-mono text-lg text-foreground">{selectedZone.lastReport}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
