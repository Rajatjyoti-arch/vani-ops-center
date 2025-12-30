import { useEffect, useState, useRef } from "react";

interface DigitalShredderProps {
  isActive: boolean;
  inputData: string;
  outputHash: string;
  onComplete: () => void;
}

interface ShredParticle {
  id: number;
  x: number;
  y: number;
  char: string;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  scale: number;
}

export function DigitalShredder({ isActive, inputData, outputHash, onComplete }: DigitalShredderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "shredding" | "forming" | "complete">("idle");
  const [displayHash, setDisplayHash] = useState("");
  const particlesRef = useRef<ShredParticle[]>([]);

  useEffect(() => {
    if (isActive && phase === "idle") {
      setPhase("shredding");
    }
  }, [isActive, phase]);

  useEffect(() => {
    if (phase !== "shredding" && phase !== "forming") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles from input data
    if (phase === "shredding" && particlesRef.current.length === 0) {
      const chars = (inputData + "BIODATA_SCAN_" + Date.now().toString()).split("");
      particlesRef.current = chars.slice(0, 100).map((char, i) => ({
        id: i,
        x: 150 + (i % 20) * 15,
        y: 80 + Math.floor(i / 20) * 20,
        char,
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: Math.random() * 5 + 2,
        },
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
        scale: 1,
      }));
    }

    let frameCount = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw shredder blades at the center
      const bladeY = canvas.height / 2;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 2;

      // Animated shredder teeth
      for (let x = 0; x < canvas.width; x += 20) {
        const offset = Math.sin(frameCount * 0.2 + x * 0.1) * 5;
        ctx.beginPath();
        ctx.moveTo(x, bladeY - 10 + offset);
        ctx.lineTo(x + 10, bladeY + offset);
        ctx.lineTo(x + 20, bladeY - 10 + offset);
        ctx.stroke();
      }

      // Glowing line
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, bladeY);
      ctx.lineTo(canvas.width, bladeY);
      ctx.stroke();

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        if (phase === "shredding") {
          // Move particles toward shredder
          if (particle.y < bladeY) {
            particle.y += particle.velocity.y;
            particle.x += particle.velocity.x * 0.3;
          } else {
            // After passing through shredder
            particle.velocity.y = Math.random() * 3 + 2;
            particle.velocity.x = (Math.random() - 0.5) * 4;
            particle.y += particle.velocity.y;
            particle.x += particle.velocity.x;
            particle.rotation += particle.rotationSpeed;
            particle.opacity -= 0.02;
            particle.scale *= 0.98;

            // Transform character to hex
            if (Math.random() > 0.7) {
              particle.char = "0123456789abcdef"[Math.floor(Math.random() * 16)];
            }
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.scale(particle.scale, particle.scale);
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
        ctx.fillText(particle.char, 0, 0);
        ctx.restore();
      });

      // Check if shredding is complete
      if (phase === "shredding") {
        const allShredded = particlesRef.current.every((p) => p.opacity <= 0);
        if (allShredded || frameCount > 180) {
          setPhase("forming");
          particlesRef.current = [];
        }
      }

      // Form hash at bottom
      if (phase === "forming") {
        const progress = Math.min(frameCount / 60, 1);
        const charsToShow = Math.floor(outputHash.length * progress);
        setDisplayHash(outputHash.substring(0, charsToShow));

        if (progress >= 1) {
          setTimeout(() => {
            setPhase("complete");
            onComplete();
          }, 500);
        }
      }

      frameCount++;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [phase, inputData, outputHash, onComplete]);

  if (!isActive && phase === "idle") return null;

  return (
    <div className="relative w-full bg-slate-dark rounded-lg overflow-hidden border border-primary/30">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="w-full h-48"
      />

      {/* Status text */}
      <div className="absolute top-4 left-4 right-4">
        <p className="text-xs font-mono text-primary uppercase tracking-wider animate-pulse">
          {phase === "shredding" && "⚡ Digital Shredder Active - Purging Bio-Data..."}
          {phase === "forming" && "⚡ Generating Cryptographic Hash..."}
          {phase === "complete" && "⚡ Identity Obfuscation Complete"}
        </p>
      </div>

      {/* Hash output */}
      {displayHash && (
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs text-muted-foreground mb-1">SHA-256 Output:</p>
          <p className="font-mono text-sm text-primary break-all">
            {displayHash}
            {phase === "forming" && <span className="animate-pulse">█</span>}
          </p>
        </div>
      )}
    </div>
  );
}
