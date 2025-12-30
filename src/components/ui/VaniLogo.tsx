import { cn } from "@/lib/utils";

interface VaniLogoProps {
    variant?: "full" | "icon";
    size?: "sm" | "md" | "lg";
    className?: string;
    animate?: boolean;
}

const sizeMap = {
    sm: { icon: 32, text: 14, gap: 8 },
    md: { icon: 40, text: 18, gap: 12 },
    lg: { icon: 48, text: 22, gap: 14 },
};

export function VaniLogo({
    variant = "full",
    size = "md",
    className = "",
    animate = false
}: VaniLogoProps) {
    const dimensions = sizeMap[size];

    return (
        <div
            className={cn(
                "flex items-center transition-all duration-300 hover:opacity-90 hover:scale-[1.02]",
                className
            )}
            style={{ gap: dimensions.gap }}
            role="img"
            aria-label="VANI - Verifiable Anonymous Network Intelligence"
        >
            {/* Shield Icon */}
            <svg
                width={dimensions.icon}
                height={dimensions.icon}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                    "shrink-0 transition-all duration-300",
                    animate && "animate-logo-stroke"
                )}
            >
                <title>VANI Shield</title>

                {/* Shield Outer Shape */}
                <path
                    d="M50 5 L90 20 L90 50 C90 75 70 90 50 95 C30 90 10 75 10 50 L10 20 Z"
                    className="fill-[hsl(var(--vani-blue-dark))] dark:fill-[hsl(var(--vani-blue-light))]"
                    stroke="currentColor"
                    strokeWidth="0"
                />

                {/* Shield Inner Border */}
                <path
                    d="M50 10 L85 23 L85 50 C85 72 67 85 50 90 C33 85 15 72 15 50 L15 23 Z"
                    className="fill-[hsl(var(--vani-blue))] dark:fill-[hsl(var(--vani-blue-dark))]"
                    stroke="currentColor"
                    strokeWidth="0"
                />

                {/* Hood Silhouette */}
                <ellipse
                    cx="50"
                    cy="35"
                    rx="15"
                    ry="12"
                    className="fill-[hsl(var(--vani-blue-light))] dark:fill-[hsl(var(--vani-slate))]"
                />
                <path
                    d="M35 38 Q50 20 65 38 Q65 55 50 60 Q35 55 35 38"
                    className="fill-[hsl(var(--vani-blue-dark))] dark:fill-[hsl(var(--vani-blue))]"
                />

                {/* Face shadow area */}
                <ellipse
                    cx="50"
                    cy="48"
                    rx="10"
                    ry="7"
                    className="fill-[hsl(var(--vani-blue-dark)/0.8)] dark:fill-[hsl(var(--vani-blue)/0.8)]"
                />

                {/* Circuit lines - left */}
                <circle cx="25" cy="40" r="3" className="fill-[hsl(var(--vani-blue-light))]" />
                <circle cx="22" cy="50" r="2" className="fill-[hsl(var(--vani-blue-light))]" />
                <circle cx="25" cy="58" r="2.5" className="fill-[hsl(var(--vani-blue-light))]" />
                <path
                    d="M25 43 L25 47 M22 50 L25 50 L25 55.5"
                    className="stroke-[hsl(var(--vani-blue-light))]"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* Network cubes - right */}
                <rect x="68" y="35" width="8" height="8" rx="1" className="fill-[hsl(var(--vani-blue-light))] opacity-80" transform="rotate(10 72 39)" />
                <rect x="72" y="43" width="6" height="6" rx="1" className="fill-[hsl(var(--vani-blue-light))] opacity-60" transform="rotate(-5 75 46)" />
                <rect x="65" y="48" width="7" height="7" rx="1" className="fill-[hsl(var(--vani-blue-light))] opacity-70" transform="rotate(5 68.5 51.5)" />

                {/* Lock body */}
                <rect
                    x="38"
                    y="62"
                    width="24"
                    height="18"
                    rx="3"
                    className="fill-[hsl(var(--vani-blue-light))] dark:fill-[hsl(var(--vani-blue-light))]"
                />

                {/* Lock shackle */}
                <path
                    d="M43 62 L43 56 Q43 52 50 52 Q57 52 57 56 L57 62"
                    className="stroke-[hsl(var(--vani-blue-light))] dark:stroke-[hsl(var(--vani-blue-light))]"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Checkmark inside lock */}
                <path
                    d="M44 70 L48 74 L56 66"
                    className="stroke-[hsl(var(--vani-blue-dark))] dark:stroke-[hsl(var(--vani-blue-dark))]"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Text - only show for full variant */}
            {variant === "full" && (
                <span
                    className={cn(
                        "font-bold tracking-tight transition-colors duration-300",
                        "text-[hsl(var(--vani-blue-dark))] dark:text-white"
                    )}
                    style={{ fontSize: dimensions.text }}
                >
                    VANI
                </span>
            )}
        </div>
    );
}

// Export for backward compatibility - can be removed later
export { VaniLogo as CUJLogo };
