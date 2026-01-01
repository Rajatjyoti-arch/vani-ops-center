import { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CampusImpactScore() {
  // Using realistic mock data for demo purposes (No DB connection)
  const [score] = useState(75);
  const [resolved] = useState(9);
  const [total] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state for the "live" feel
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden relative group hover:border-primary/30 hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
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
