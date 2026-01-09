import { useState, useEffect } from "react";
import { Shield, Lock, Scale, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
}

const slides: SlideContent[] = [
  {
    id: 1,
    title: "Anonymous Identity",
    subtitle: "SHA-256 hashed credentials protect your identity",
    icon: Users,
    gradient: "from-primary/20 via-primary/5 to-transparent",
    accentColor: "primary"
  },
  {
    id: 2,
    title: "Secure Evidence Vault",
    subtitle: "Military-grade encryption for all submissions",
    icon: Lock,
    gradient: "from-accent/20 via-accent/5 to-transparent",
    accentColor: "accent"
  },
  {
    id: 3,
    title: "AI-Powered Resolution",
    subtitle: "Gemini AI provides unbiased case analysis",
    icon: Scale,
    gradient: "from-[#4285F4]/20 via-[#9B72CB]/10 to-transparent",
    accentColor: "[#4285F4]"
  },
  {
    id: 4,
    title: "Immutable Ledger",
    subtitle: "Transparent and tamper-proof record keeping",
    icon: FileText,
    gradient: "from-status-warning/20 via-status-warning/5 to-transparent",
    accentColor: "status-warning"
  },
  {
    id: 5,
    title: "Institutional Trust",
    subtitle: "Built for universities, corporations & government",
    icon: Shield,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accentColor: "emerald-500"
  }
];

export function HeroBackgroundSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background" />
      
      {/* Animated slides */}
      {slides.map((slide, index) => {
        const Icon = slide.icon;
        const isActive = index === currentSlide;
        
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Gradient background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b",
              slide.gradient
            )} />
            
            {/* Floating icon */}
            <div className={cn(
              "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000",
              isActive ? "opacity-20 scale-100" : "opacity-0 scale-75"
            )}>
              <Icon className="w-96 h-96 text-foreground/5" strokeWidth={0.5} />
            </div>
            
            {/* Animated orbs */}
            <div className={cn(
              "absolute w-64 h-64 rounded-full blur-3xl transition-all duration-1000",
              `bg-${slide.accentColor}/10`,
              isActive ? "opacity-60" : "opacity-0"
            )} 
            style={{
              top: "20%",
              left: "10%",
              animation: isActive ? "float 6s ease-in-out infinite" : "none"
            }}
            />
            <div className={cn(
              "absolute w-48 h-48 rounded-full blur-3xl transition-all duration-1000",
              `bg-${slide.accentColor}/15`,
              isActive ? "opacity-40" : "opacity-0"
            )}
            style={{
              bottom: "30%",
              right: "15%",
              animation: isActive ? "float 8s ease-in-out infinite reverse" : "none"
            }}
            />
          </div>
        );
      })}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 institutional-grid opacity-[0.02]" />
      
      {/* Slide indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "group relative flex items-center gap-2 transition-all duration-300",
              index === currentSlide ? "opacity-100" : "opacity-40 hover:opacity-70"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "bg-primary w-8" 
                : "bg-muted-foreground/50"
            )} />
            <span className={cn(
              "absolute left-full ml-2 whitespace-nowrap text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
              index === currentSlide && "text-primary"
            )}>
              {slide.title}
            </span>
          </button>
        ))}
      </div>
      
      {/* Current slide info overlay */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-10">
        <div className="flex items-center gap-2 justify-center mb-2">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div
                key={slide.id}
                className={cn(
                  "transition-all duration-500",
                  index === currentSlide 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-75 absolute"
                )}
              >
                <Icon className="w-5 h-5 text-primary" />
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground/80 font-medium transition-all duration-500">
          {slides[currentSlide].subtitle}
        </p>
      </div>
    </div>
  );
}
