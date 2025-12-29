import { useEffect, useState, useRef } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { playClickSound } from "@/lib/audio";
import { useSettings } from "@/contexts/SettingsContext";

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour } = useOnboarding();
  const { soundEnabled } = useSettings();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentTourStep = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentTourStep) return;

    const updatePosition = () => {
      const element = document.querySelector(currentTourStep.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 8;
        
        setPosition({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });

        // Calculate tooltip position
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        let tooltipTop = rect.top;
        let tooltipLeft = rect.right + 16;

        // Adjust based on placement
        switch (currentTourStep.placement) {
          case "bottom":
            tooltipTop = rect.bottom + 16;
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case "top":
            tooltipTop = rect.top - tooltipHeight - 16;
            tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case "left":
            tooltipLeft = rect.left - tooltipWidth - 16;
            break;
          case "right":
          default:
            tooltipLeft = rect.right + 16;
            break;
        }

        // Keep tooltip in viewport
        tooltipLeft = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, tooltipLeft));
        tooltipTop = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, tooltipTop));

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, currentStep, currentTourStep]);

  const handleNext = () => {
    if (soundEnabled) playClickSound();
    nextStep();
  };

  const handlePrev = () => {
    if (soundEnabled) playClickSound();
    prevStep();
  };

  const handleSkip = () => {
    if (soundEnabled) playClickSound();
    skipTour();
  };

  if (!isActive || !currentTourStep) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Dark overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={position.left}
              y={position.top}
              width={position.width}
              height={position.height}
              rx="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.85)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Highlight border */}
      <div
        className="absolute border-2 border-primary rounded-lg cyber-glow-intense pointer-events-none animate-pulse"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute bg-card border border-primary/50 rounded-lg shadow-2xl cyber-glow p-4 w-80 animate-fade-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">{currentTourStep.title}</h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {currentTourStep.content}
        </p>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span className="text-xs text-muted-foreground font-mono">
            {currentStep + 1} / {steps.length}
          </span>
          <Button
            size="sm"
            onClick={handleNext}
            className="cyber-button bg-primary text-primary-foreground"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
