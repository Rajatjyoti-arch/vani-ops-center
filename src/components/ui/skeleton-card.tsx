import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showIcon?: boolean;
}

export function SkeletonCard({ className, lines = 3, showIcon = true }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 animate-pulse",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-primary/10 rounded w-3/4" />
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-muted/50 rounded"
              style={{ width: `${60 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CyberSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CyberSpinner({ size = "md", className }: CyberSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      {/* Inner pulse */}
      <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" />
      {/* Center dot */}
      <div className="absolute inset-1/3 rounded-full bg-primary/50" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-border/30">
        <div className="h-4 bg-primary/10 rounded w-1/4" />
        <div className="h-4 bg-primary/10 rounded w-1/3" />
        <div className="h-4 bg-primary/10 rounded w-1/6" />
        <div className="h-4 bg-primary/10 rounded w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-border/20">
          <div className="h-4 bg-muted/40 rounded w-1/4" />
          <div className="h-4 bg-muted/40 rounded w-1/3" />
          <div className="h-4 bg-muted/40 rounded w-1/6" />
          <div className="h-4 bg-muted/40 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
