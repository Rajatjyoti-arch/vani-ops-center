import { useState, useEffect } from "react";
import { Menu, Activity, Clock, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppHeader() {
  const [integrity, setIntegrity] = useState(97);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fluctuate system integrity between 94-99%
  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrity((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(94, Math.min(99, newValue));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="cyber-button text-muted-foreground hover:text-primary">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-primary animate-pulse" />
          <span className="font-mono">VANI://SECURE_CHANNEL</span>
        </div>
      </div>

      {/* System Integrity Bar */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            System Integrity
          </span>
          <div className="flex items-center gap-2">
            <Progress 
              value={integrity} 
              className="w-24 h-2 bg-secondary"
            />
            <span 
              className={`
                font-mono text-sm font-bold transition-all duration-300
                ${integrity >= 97 ? "text-status-safe" : integrity >= 95 ? "text-status-warning" : "text-status-critical"}
              `}
            >
              {integrity}%
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <div className="font-mono">
            <span className="text-primary">{formatTime(currentTime)}</span>
            <span className="text-muted-foreground ml-2 hidden lg:inline">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
