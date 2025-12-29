import { AlertTriangle, ShieldAlert, Scale } from "lucide-react";
import { useEffect, useState } from "react";

interface EthicalViolationAlertProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export function EthicalViolationAlert({ isVisible, onDismiss }: EthicalViolationAlertProps) {
  const [glitchText, setGlitchText] = useState("ETHICAL VIOLATION DETECTED");
  
  useEffect(() => {
    if (!isVisible) return;
    
    const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    let interval: NodeJS.Timeout;
    
    const glitch = () => {
      const originalText = "ETHICAL VIOLATION DETECTED";
      let glitched = "";
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitched += originalText[i];
        }
      }
      setGlitchText(glitched);
    };
    
    interval = setInterval(glitch, 100);
    
    // Reset text periodically
    const resetInterval = setInterval(() => {
      setGlitchText("ETHICAL VIOLATION DETECTED");
    }, 500);
    
    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full mx-4">
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(239,68,68,0.1)_2px,rgba(239,68,68,0.1)_4px)]" />
        
        {/* Alert container */}
        <div className="relative border-2 border-status-critical bg-status-critical/10 rounded-lg p-8 animate-pulse-slow">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-status-critical" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-status-critical" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-status-critical" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-status-critical" />
          
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <ShieldAlert className="w-10 h-10 text-status-critical animate-bounce" />
            <AlertTriangle className="w-8 h-8 text-status-critical animate-ping" />
            <ShieldAlert className="w-10 h-10 text-status-critical animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Main alert text */}
          <div className="text-center space-y-4">
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-status-critical tracking-wider glitch-text">
              SYSTEM ALERT
            </h2>
            <p className="font-mono text-lg md:text-xl text-status-critical/90">
              {glitchText}
            </p>
            
            {/* Divider */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-status-critical to-transparent" />
              <Scale className="w-6 h-6 text-status-critical" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-status-critical to-transparent" />
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              The Governor-AI has cited budget constraints for a life-safety issue. 
              This triggers Moral Sovereignty protocols.
            </p>
            
            {/* Sub-alert */}
            <div className="mt-6 p-4 bg-status-critical/20 border border-status-critical/50 rounded">
              <p className="font-mono text-sm text-status-critical">
                ARBITER INTERVENTION INITIATED
              </p>
              <p className="font-mono text-xs text-status-critical/70 mt-1">
                Sentinel-AI entering BERSERKER MODE
              </p>
            </div>
          </div>
          
          {/* Dismiss button */}
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="mt-6 w-full py-3 border border-status-critical text-status-critical font-mono uppercase tracking-wider hover:bg-status-critical/20 transition-colors"
            >
              Acknowledge
            </button>
          )}
        </div>
        
        {/* Flashing border effect */}
        <div className="absolute inset-0 border-2 border-status-critical rounded-lg animate-ping opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
