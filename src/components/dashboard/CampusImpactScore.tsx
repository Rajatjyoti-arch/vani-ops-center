import { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export function CampusImpactScore() {
  const [score, setScore] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImpactScore = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("status");

      if (error) {
        console.error("Error fetching impact score:", error);
        setIsLoading(false);
        return;
      }

      const totalReports = data?.length || 0;
      const resolvedReports = data?.filter(r => r.status === "resolved").length || 0;
      const impactScore = totalReports > 0
        ? Math.round((resolvedReports / totalReports) * 100)
        : 0;

      setTotal(totalReports);
      setResolved(resolvedReports);
      setScore(impactScore);
      setIsLoading(false);
    };

    fetchImpactScore();
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/30 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Campus Impact Score
            </p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-primary">
                  {score}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {resolved} / {total} resolved
                </span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/20 group-hover:cyber-glow transition-all">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>

        {!isLoading && (
          <Progress value={score} className="h-1.5 mt-3" />
        )}
      </CardContent>
    </Card>
  );
}
