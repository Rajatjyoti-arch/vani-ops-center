import { useState } from "react";
import { Settings, Volume2, VolumeX, Eye, EyeOff, ChevronDown, ChevronUp, HelpCircle, Keyboard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { playClickSound } from "@/lib/audio";

export function SettingsPanel({ collapsed }: { collapsed: boolean }) {
  const { demoMode, setDemoMode, soundEnabled, setSoundEnabled } = useSettings();
  const { startTour, hasCompletedTour } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleDemoMode = (value: boolean) => {
    setDemoMode(value);
    if (soundEnabled) playClickSound();
  };

  const handleToggleSound = (value: boolean) => {
    setSoundEnabled(value);
    if (value) playClickSound();
  };

  const handleStartTour = () => {
    if (soundEnabled) playClickSound();
    startTour();
  };

  if (collapsed) {
    return (
      <div className="px-3 py-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary/50 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          title="Settings"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Settings className="w-4 h-4" />
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
          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
            Settings
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-fade-in space-y-3">
          {/* Demo Mode */}
          <div className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-border/30">
            <div className="flex items-center gap-2">
              {demoMode ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <span className="text-xs font-medium text-foreground">Demo Mode</span>
                <p className="text-[10px] text-muted-foreground">Show sample data</p>
              </div>
            </div>
            <Switch
              checked={demoMode}
              onCheckedChange={handleToggleDemoMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-border/30">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <span className="text-xs font-medium text-foreground">Sound Effects</span>
                <p className="text-[10px] text-muted-foreground">Click & transition audio</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={handleToggleSound}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Tour Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartTour}
            className="w-full cyber-button text-xs gap-2"
          >
            <HelpCircle className="w-3 h-3" />
            {hasCompletedTour ? "Restart Tour" : "Start Tour"}
          </Button>

          {/* Keyboard Shortcuts Hint */}
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded border border-primary/20 text-[10px] text-muted-foreground">
            <Keyboard className="w-3 h-3 text-primary" />
            <span>Press <kbd className="font-mono bg-secondary px-1 rounded">Ctrl+K</kbd> for commands</span>
          </div>
        </div>
      )}
    </div>
  );
}
