import { useEffect, useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { TypewriterText } from "@/components/effects/TypewriterText";

interface NeuralScanResultProps {
  isVisible: boolean;
  ghostName: string;
  hashSuffix: string;
  isNewIdentity: boolean;
}

export function NeuralScanResult({ isVisible, ghostName, hashSuffix, isNewIdentity }: NeuralScanResultProps) {
  const [showContent, setShowContent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowContent(true), 300);
      setTimeout(() => setShowWelcome(true), 2000);
    } else {
      setShowContent(false);
      setShowWelcome(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative p-6 bg-gradient-to-b from-primary/10 to-transparent border border-primary/30 rounded-lg overflow-hidden">
      {/* Success icon */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Shield className="w-16 h-16 text-primary cyber-glow" />
          <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-status-safe" />
        </div>
      </div>

      {/* Status messages */}
      {showContent && (
        <div className="space-y-3 text-center">
          <div className="space-y-1">
            <p className="text-sm font-mono text-status-safe">
              <TypewriterText text="✓ Bio-data Purged" speed={30} />
            </p>
            <p className="text-sm font-mono text-status-safe">
              <TypewriterText text="✓ Identity Obfuscated" speed={30} delay={500} />
            </p>
            <p className="text-sm font-mono text-status-safe">
              <TypewriterText text="✓ Neural Signature Scrambled" speed={30} delay={1000} />
            </p>
          </div>

          {showWelcome && (
            <div className="pt-4 animate-fade-in">
              <p className="text-lg font-mono text-primary text-glow">
                Welcome, Ghost 0x{hashSuffix}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {isNewIdentity
                  ? `New identity "${ghostName}" has been forged`
                  : `Identity verified as "${ghostName}"`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50" />

      {/* Scanlines */}
      <div className="absolute inset-0 scan-lines pointer-events-none opacity-20" />
    </div>
  );
}
