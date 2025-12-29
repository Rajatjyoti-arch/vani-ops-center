import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface HeatBarProps {
  sentinelScore: number;
  governorScore: number;
  isActive: boolean;
  ethicalViolation?: boolean;
}

export function HeatBar({ sentinelScore, governorScore, isActive, ethicalViolation }: HeatBarProps) {
  const [sparks, setSparks] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [isFlickering, setIsFlickering] = useState(false);
  
  const scoreDiff = Math.abs(sentinelScore - governorScore);
  const tension = Math.min(100, scoreDiff * 2); // Higher difference = more tension
  
  useEffect(() => {
    if (!isActive && !ethicalViolation) return;
    
    // Generate sparks when there's tension
    const sparkInterval = setInterval(() => {
      if (tension > 20 || ethicalViolation) {
        const newSparks = Array.from({ length: ethicalViolation ? 5 : 2 }, (_, i) => ({
          id: Date.now() + i,
          left: 40 + Math.random() * 20, // Center area
          delay: Math.random() * 0.3,
        }));
        setSparks(prev => [...prev.slice(-10), ...newSparks]);
      }
    }, ethicalViolation ? 100 : 300);
    
    // Flickering effect
    const flickerInterval = setInterval(() => {
      if (tension > 40 || ethicalViolation) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 100);
      }
    }, ethicalViolation ? 150 : 500);
    
    return () => {
      clearInterval(sparkInterval);
      clearInterval(flickerInterval);
    };
  }, [tension, isActive, ethicalViolation]);
  
  // Remove old sparks
  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparks(prev => prev.filter(s => Date.now() - s.id < 1000));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="relative py-6">
      {/* Label */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Zap className={`w-4 h-4 ${ethicalViolation ? 'text-status-critical animate-pulse' : 'text-status-warning'}`} />
        <span className={`font-mono text-xs uppercase tracking-wider ${ethicalViolation ? 'text-status-critical' : 'text-muted-foreground'}`}>
          {ethicalViolation ? 'CRITICAL TENSION' : 'Conflict Heat'}
        </span>
        <Zap className={`w-4 h-4 ${ethicalViolation ? 'text-status-critical animate-pulse' : 'text-status-warning'}`} />
      </div>
      
      {/* Heat Bar Container */}
      <div className="relative h-3 mx-8">
        {/* Base wire */}
        <div 
          className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${ethicalViolation 
              ? 'bg-status-critical/30 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-gradient-to-r from-primary/30 via-status-warning/30 to-status-critical/30'
            }
            ${isFlickering ? 'opacity-50' : 'opacity-100'}
          `}
        />
        
        {/* Tension fill */}
        <div 
          className={`
            absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-500
            ${ethicalViolation 
              ? 'bg-status-critical animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.8)]' 
              : tension > 60 
                ? 'bg-status-critical shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                : tension > 30 
                  ? 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                  : 'bg-primary/50'
            }
          `}
          style={{ width: `${Math.max(10, tension)}%` }}
        />
        
        {/* Center collision point */}
        <div 
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-4 h-4 rounded-full border-2 z-10
            ${ethicalViolation 
              ? 'bg-status-critical border-status-critical animate-ping' 
              : 'bg-background border-status-warning'
            }
          `}
        />
        
        {/* Sparks */}
        {sparks.map(spark => (
          <div
            key={spark.id}
            className={`
              absolute w-1 h-4 rounded-full
              ${ethicalViolation ? 'bg-status-critical' : 'bg-status-warning'}
              animate-spark
            `}
            style={{
              left: `${spark.left}%`,
              top: '-8px',
              animationDelay: `${spark.delay}s`,
              boxShadow: ethicalViolation 
                ? '0 0 10px 2px rgba(239,68,68,0.8)' 
                : '0 0 8px 2px rgba(245,158,11,0.6)',
            }}
          />
        ))}
        
        {/* Agent indicators */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary-foreground">S</span>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-status-warning border-2 border-status-warning flex items-center justify-center">
          <span className="text-[10px] font-bold text-background">G</span>
        </div>
      </div>
      
      {/* Tension percentage */}
      <div className="text-center mt-3">
        <span className={`font-mono text-lg font-bold ${
          ethicalViolation ? 'text-status-critical animate-pulse' : 
          tension > 60 ? 'text-status-critical' : 
          tension > 30 ? 'text-status-warning' : 'text-primary'
        }`}>
          {ethicalViolation ? 'MAX' : `${tension}%`}
        </span>
        <span className="text-xs text-muted-foreground ml-2">tension</span>
      </div>
    </div>
  );
}
