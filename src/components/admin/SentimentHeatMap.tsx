import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SentimentLog {
  id: string;
  zone_id: string;
  zone_name: string;
  concern_level: string;
  reports_count: number;
}

const CONCERN_COLORS = {
  safe: { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-400" },
  warning: { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-400" },
  critical: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-400" },
};

export function SentimentHeatMap() {
  const [sentimentData, setSentimentData] = useState<SentimentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      const { data, error } = await supabase
        .from("sentiment_logs")
        .select("*")
        .order("reports_count", { ascending: false });

      if (error) throw error;
      setSentimentData(data || []);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorScheme = (level: string) => {
    return CONCERN_COLORS[level as keyof typeof CONCERN_COLORS] || CONCERN_COLORS.safe;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (sentimentData.length === 0) {
    // Show placeholder zones
    const placeholderZones = [
      { zone_name: "Chanakya Building", concern_level: "safe", reports_count: 2 },
      { zone_name: "Rhya-Bus Stand", concern_level: "warning", reports_count: 5 },
      { zone_name: "DDE Building", concern_level: "safe", reports_count: 1 },
      { zone_name: "Shailputri Bhawan", concern_level: "safe", reports_count: 0 },
      { zone_name: "Aryabhatta Building", concern_level: "safe", reports_count: 1 },
      { zone_name: "SPM", concern_level: "safe", reports_count: 0 },
      { zone_name: "BRS Hostel", concern_level: "warning", reports_count: 3 },
      { zone_name: "Health Center", concern_level: "critical", reports_count: 7 },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {placeholderZones.map((zone, i) => {
          const colors = getColorScheme(zone.concern_level);
          return (
            <div
              key={i}
              className={`p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:scale-[1.02]`}
            >
              <p className="text-xs text-slate-400 truncate">{zone.zone_name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-lg font-bold ${colors.text}`}>
                  {zone.reports_count}
                </span>
                <span className={`text-[10px] uppercase ${colors.text}`}>
                  {zone.concern_level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {sentimentData.map((zone) => {
        const colors = getColorScheme(zone.concern_level);
        return (
          <div
            key={zone.id}
            className={`p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:scale-[1.02] cursor-pointer`}
          >
            <p className="text-xs text-slate-400 truncate">{zone.zone_name}</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-lg font-bold ${colors.text}`}>
                {zone.reports_count}
              </span>
              <span className={`text-[10px] uppercase ${colors.text}`}>
                {zone.concern_level}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
