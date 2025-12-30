import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeTime } from "@/lib/crypto";
import { useSettings } from "@/contexts/SettingsContext";
import { mockSentimentLogs } from "@/lib/mockData";
import { CyberSpinner } from "@/components/ui/skeleton-card";

interface Zone {
  id: string;
  zone_id: string;
  zone_name: string;
  concern_level: "safe" | "warning" | "critical";
  reports_count: number;
  last_report_at: string | null;
}

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
  const { demoMode } = useSettings();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch zones from database
  useEffect(() => {
    const fetchZones = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("sentiment_logs")
        .select("*")
        .order("zone_name");

      if (error) {
        console.error("Error fetching zones:", error);
      }
      
      // Use mock data if demo mode is enabled and no real data exists
      const realData = (data as Zone[]) || [];
      if (demoMode && realData.length === 0) {
        setZones(mockSentimentLogs as Zone[]);
      } else {
        setZones(realData);
      }
      setIsLoading(false);
    };

    fetchZones();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("sentiment-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sentiment_logs",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setZones((prev) =>
              prev.map((zone) =>
                zone.id === (payload.new as Zone).id
                  ? (payload.new as Zone)
                  : zone
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [demoMode]);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <CyberSpinner size="lg" />
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No zone data available</p>
            <p className="text-xs mt-1">Enable Demo Mode in Settings to see sample data</p>
          </div>
        ) : (
          <>
            {/* Grid Layout - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              {zones.map((zone) => {
                const config = levelConfig[zone.concern_level];
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
                        <h4 className="font-medium text-sm text-foreground">{zone.zone_name}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {zone.reports_count} reports
                        </p>
                      </div>
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>

                    {/* Pulse effect for critical zones */}
                    {zone.concern_level === "critical" && (
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
                  <h4 className="font-semibold text-primary">{selectedZone.zone_name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      levelConfig[selectedZone.concern_level].color
                    }`}
                  >
                    {selectedZone.concern_level.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Active Reports</span>
                    <p className="font-mono text-lg text-foreground">
                      {selectedZone.reports_count}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Report</span>
                    <p className="font-mono text-lg text-foreground">
                      {formatRelativeTime(selectedZone.last_report_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
