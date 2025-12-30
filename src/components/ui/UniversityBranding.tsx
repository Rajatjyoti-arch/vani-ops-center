

interface UniversityBrandingProps {
    className?: string;
    size?: "sm" | "md";
    showText?: boolean;
}

export function UniversityBranding({ className = "", size = "md", showText = true }: UniversityBrandingProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`
        flex items-center justify-center rounded-sm overflow-hidden
        ${size === "sm" ? "w-8 h-8" : "w-10 h-10"}
      `}>
                <img
                    src="/cuj-logo.png"
                    alt="Central University of Jammu Logo"
                    className="w-full h-full object-contain"
                />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={`font-bold leading-none tracking-tight ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
                        Central University of Jammu
                    </span>
                    <span className={`text-muted-foreground ${size === "sm" ? "text-[8px]" : "text-[10px]"}`}>
                        Official Governance Portal
                    </span>
                </div>
            )}
        </div>
    );
}
