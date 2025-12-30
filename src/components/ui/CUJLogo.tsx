interface CUJLogoProps {
  className?: string;
  size?: number;
}

export function CUJLogo({ className = "", size = 40 }: CUJLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-primary"
      />
      
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className="text-primary/60"
      />

      {/* Tree trunk */}
      <rect
        x="46"
        y="60"
        width="8"
        height="20"
        fill="currentColor"
        className="text-primary"
      />

      {/* Tree foliage - stylized tree shape */}
      <path
        d="M50 18 L65 40 L58 40 L70 55 L60 55 L68 68 L32 68 L40 55 L30 55 L42 40 L35 40 Z"
        fill="currentColor"
        className="text-primary"
      />

      {/* Ground line */}
      <path
        d="M25 82 Q50 78 75 82"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-primary/80"
      />

      {/* Text arc - top */}
      <path
        id="topArc"
        d="M 15,50 A 35,35 0 0,1 85,50"
        fill="none"
      />
      
      {/* Decorative dots */}
      <circle cx="15" cy="50" r="2" fill="currentColor" className="text-primary" />
      <circle cx="85" cy="50" r="2" fill="currentColor" className="text-primary" />
    </svg>
  );
}
