import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Eye, X, Binary, Database } from "lucide-react";
import { decodeTextFromImage } from "@/lib/steganography";
import { supabase } from "@/integrations/supabase/client";

interface DeepScanRevealProps {
  vaultFileId: string;
  filePath: string;
  fileName: string;
}

export function DeepScanReveal({ vaultFileId, filePath, fileName }: DeepScanRevealProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Get signed URL for the image
    const getImageUrl = async () => {
      const { data } = await supabase.storage
        .from('decoy-images')
        .createSignedUrl(filePath, 3600);
      
      if (data?.signedUrl) {
        setImageUrl(data.signedUrl);
      }
    };
    getImageUrl();
  }, [filePath]);

  const startDeepScan = async () => {
    if (!imageUrl) return;
    
    setIsScanning(true);
    setShowReveal(true);
    setScanProgress(0);
    setDecodedText(null);

    // Animate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Actually decode the steganographic message
      const hidden = await decodeTextFromImage(imageUrl);
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setDecodedText(hidden || "No hidden payload detected in pixel data.");
        setIsScanning(false);
      }, 500);
    } catch (error) {
      console.error('Deep scan failed:', error);
      clearInterval(progressInterval);
      setScanProgress(100);
      setDecodedText("Scan failed: Unable to extract pixel data.");
      setIsScanning(false);
    }
  };

  // Matrix rain effect on canvas
  useEffect(() => {
    if (!showReveal || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "01VANI深層走査ピクセル抽出";
    const charArray = chars.split("");
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient from cyan to green
        const hue = 160 + Math.random() * 30;
        const opacity = 0.5 + Math.random() * 0.5;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showReveal]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={startDeepScan}
        disabled={!imageUrl || isScanning}
        className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
      >
        <Scan className="w-4 h-4" />
        Deep Scan
      </Button>

      {showReveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
          {/* Matrix rain background */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />

          <Card className="relative z-10 w-full max-w-2xl mx-4 bg-card/95 border-primary/50 cyber-glow">
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
                    <Binary className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-mono text-lg font-bold text-foreground">
                      DEEP-PIXEL EXTRACTION
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      LSB Steganography Decoder
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReveal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* File info */}
              <div className="p-3 bg-secondary/30 rounded border border-border/50">
                <p className="text-xs text-muted-foreground font-mono">TARGET FILE:</p>
                <p className="text-sm text-foreground font-mono truncate">{fileName}</p>
              </div>

              {/* Progress bar during scan */}
              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-primary">EXTRACTING PIXEL DATA...</span>
                    <span className="text-foreground">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-status-safe transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono text-muted-foreground">
                    <span className={scanProgress > 10 ? "text-status-safe" : ""}>→ Reading LSB</span>
                    <span className={scanProgress > 35 ? "text-status-safe" : ""}>→ RGB Channels</span>
                    <span className={scanProgress > 60 ? "text-status-safe" : ""}>→ Binary Parse</span>
                    <span className={scanProgress > 85 ? "text-status-safe" : ""}>→ Text Decode</span>
                  </div>
                </div>
              )}

              {/* Decoded result */}
              {decodedText !== null && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-status-safe">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider">
                      Hidden Payload Extracted
                    </span>
                  </div>
                  <div className="p-4 bg-black/50 rounded border border-status-safe/30 font-mono">
                    <p className="text-status-safe whitespace-pre-wrap text-sm leading-relaxed">
                      {decodedText}
                    </p>
                  </div>
                </div>
              )}

              {/* Database independence note */}
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded border border-primary/20">
                <Database className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-mono text-primary font-medium">
                    DATABASE INDEPENDENT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Even if our servers are wiped, this image carries its own truth.
                    The grievance is encoded in the pixel data itself.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
