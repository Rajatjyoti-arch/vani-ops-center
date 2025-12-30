import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, AlertCircle, ScanLine } from "lucide-react";

interface NeuralScannerProps {
  isScanning: boolean;
  onScanComplete: () => void;
}

export function NeuralScanner({ isScanning, onScanComplete }: NeuralScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState<"idle" | "scanning" | "analyzing" | "complete">("idle");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isScanning && scanPhase === "idle") {
      startCamera();
      setScanPhase("scanning");
    }
  }, [isScanning, startCamera, scanPhase]);

  useEffect(() => {
    if (scanPhase !== "scanning") return;

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setScanPhase("analyzing");
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [scanPhase]);

  useEffect(() => {
    if (scanPhase === "analyzing") {
      const timeout = setTimeout(() => {
        setScanPhase("complete");
        stopCamera();
        onScanComplete();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [scanPhase, stopCamera, onScanComplete]);

  // Draw face geometry overlay
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || scanPhase !== "scanning") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const drawOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw scanning grid
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + Math.sin(frame * 0.1) * 0.2})`;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw face geometry points (simulated)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const points = [
        // Eyes
        { x: centerX - 60, y: centerY - 30 },
        { x: centerX + 60, y: centerY - 30 },
        // Nose
        { x: centerX, y: centerY + 10 },
        // Mouth
        { x: centerX - 40, y: centerY + 50 },
        { x: centerX + 40, y: centerY + 50 },
        // Chin
        { x: centerX, y: centerY + 80 },
        // Forehead
        { x: centerX, y: centerY - 80 },
        // Cheeks
        { x: centerX - 80, y: centerY + 20 },
        { x: centerX + 80, y: centerY + 20 },
      ];

      // Draw points with pulsing effect
      points.forEach((point, i) => {
        const offset = Math.sin(frame * 0.15 + i * 0.5) * 3;
        ctx.beginPath();
        ctx.arc(point.x + offset, point.y + offset, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.8 + Math.sin(frame * 0.2 + i) * 0.2})`;
        ctx.fill();
      });

      // Draw connecting lines
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 + Math.sin(frame * 0.08) * 0.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Face outline
      ctx.moveTo(points[6].x, points[6].y); // Forehead
      ctx.lineTo(points[0].x, points[0].y); // Left eye
      ctx.lineTo(points[7].x, points[7].y); // Left cheek
      ctx.lineTo(points[3].x, points[3].y); // Left mouth
      ctx.lineTo(points[5].x, points[5].y); // Chin
      ctx.lineTo(points[4].x, points[4].y); // Right mouth
      ctx.lineTo(points[8].x, points[8].y); // Right cheek
      ctx.lineTo(points[1].x, points[1].y); // Right eye
      ctx.lineTo(points[6].x, points[6].y); // Back to forehead
      ctx.stroke();

      // Draw scanning line
      const scanY = (frame * 3) % canvas.height;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Glow effect for scan line
      const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(0, 240, 255, 0.3)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      frame++;
      animationId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return () => cancelAnimationFrame(animationId);
  }, [scanPhase]);

  if (!isScanning && scanPhase === "idle") return null;

  return (
    <div className="relative w-full aspect-video bg-slate-dark rounded-lg overflow-hidden border border-primary/30">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          scanPhase === "complete" ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      />

      {/* Overlay canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Corner brackets */}

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />

      {/* Status overlay */}
      <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-background/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-wider">
              {scanPhase === "scanning" && "Neural Geometry Scan in Progress"}
              {scanPhase === "analyzing" && "Analyzing Biometric Data..."}
              {scanPhase === "complete" && "Scan Complete"}
            </span>
          </div>
          <span className="text-xs font-mono text-primary">{scanProgress}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute inset-x-4 bottom-4">
        <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>

      {/* Permission denied state */}
      {hasPermission === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90">
          <AlertCircle className="w-12 h-12 text-status-warning mb-4" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Camera access denied. Neural scan will proceed with ID hash only.
          </p>
        </div>
      )}

      {/* Waiting for camera */}
      {hasPermission === null && scanPhase === "scanning" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90">
          <Camera className="w-12 h-12 text-primary animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Requesting camera access...</p>
        </div>
      )}
    </div>
  );
}
