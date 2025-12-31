import { cn } from "@/lib/utils";

interface VaniLogoProps {
    variant?: "full" | "icon";
    size?: "sm" | "md" | "lg";
    className?: string;
    showUniversity?: boolean;
}

const sizeMap = {
    sm: { icon: 44, text: 17, gap: 10, university: 11 },
    md: { icon: 56, text: 22, gap: 14, university: 12 },
    lg: { icon: 68, text: 26, gap: 16, university: 13 },
};

export function VaniLogo({
    variant = "full",
    size = "md",
    className = "",
    showUniversity = false
}: VaniLogoProps) {
    const dimensions = sizeMap[size];

    return (
        <div
            className={cn(
                "flex items-center group",
                className
            )}
            style={{ gap: dimensions.gap }}
            role="img"
            aria-label="VANI - Verifiable Anonymous Network Intelligence"
        >
            {/* Official VANI Logo Image */}
            <img
                src="/vani-logo-final.png"
                alt="VANI Logo"
                width={dimensions.icon}
                height={dimensions.icon}
                className="shrink-0 object-contain rounded-full"
                style={{
                    width: dimensions.icon,
                    height: dimensions.icon,
                }}
            />

            {/* Text and University branding */}
            {variant === "full" && (
                <div className="flex flex-col">
                    <span
                        className={cn(
                            "font-semibold tracking-[0.08em] uppercase transition-colors duration-300",
                            "text-foreground"
                        )}
                        style={{
                            fontSize: dimensions.text,
                            fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                            letterSpacing: '0.12em'
                        }}
                    >
                        VANI
                    </span>
                    {showUniversity && (
                        <span
                            className="text-muted-foreground/70 font-normal tracking-wide transition-colors duration-300"
                            style={{
                                fontSize: dimensions.university,
                                fontFamily: "'Inter', sans-serif"
                            }}
                        >
                            Central University of Jammu
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Compact branding block for header/footer with university affiliation
export function VaniBrandingBlock({
    size = "md",
    className = ""
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const dimensions = sizeMap[size];

    return (
        <div className={cn("flex items-center gap-3 group", className)}>
            {/* VANI Logo */}
            <VaniLogo variant="icon" size={size} />

            {/* Text block */}
            <div className="flex flex-col">
                <span
                    className="font-semibold tracking-[0.12em] uppercase text-foreground transition-colors duration-300"
                    style={{
                        fontSize: dimensions.text,
                        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif"
                    }}
                >
                    VANI
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                    {/* CUJ Mini Logo */}
                    <CUJMiniLogo size={12} />
                    <span
                        className="text-muted-foreground/60 font-normal tracking-wide"
                        style={{
                            fontSize: dimensions.university,
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        Central University of Jammu
                    </span>
                </div>
            </div>
        </div>
    );
}

// Central University of Jammu mini logo
export function CUJMiniLogo({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
        >
            <title>Central University of Jammu</title>
            {/* Simplified institution emblem - open book with torch */}
            <path
                d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                className="stroke-muted-foreground"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Torch/pillar */}
            <path
                d="M12 8V16M10 16H14"
                className="stroke-muted-foreground"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* Flame */}
            <circle
                cx="12"
                cy="6"
                r="1.5"
                className="fill-muted-foreground"
            />
        </svg>
    );
}

// Export for backward compatibility
export { VaniLogo as CUJLogo };
