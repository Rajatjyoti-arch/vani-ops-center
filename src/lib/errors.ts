import { toast } from "sonner";

export function handleSystemError(error: unknown, context: string) {
  console.error(`[VANI Error - ${context}]:`, error);

  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

  // Check for rate limit errors
  if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
    toast.error("⚠️ System Interrupted", {
      description: "Rate limit exceeded. Please wait a moment before trying again.",
      className: "bg-status-warning/20 border-status-warning text-foreground",
      duration: 6000,
    });
    return;
  }

  // Check for payment/quota errors
  if (errorMessage.includes("402") || errorMessage.toLowerCase().includes("payment")) {
    toast.error("⚠️ System Interrupted", {
      description: "AI credits exhausted. Contact administrator to restore service.",
      className: "bg-status-critical/20 border-status-critical text-foreground",
      duration: 8000,
    });
    return;
  }

  // Check for network errors
  if (errorMessage.toLowerCase().includes("network") || errorMessage.toLowerCase().includes("fetch")) {
    toast.error("⚠️ System Interrupted", {
      description: "Network connection lost. Check your connection and retry.",
      className: "bg-status-critical/20 border-status-critical text-foreground",
      duration: 5000,
    });
    return;
  }

  // Check for file upload errors
  if (context.toLowerCase().includes("upload")) {
    toast.error("⚠️ System Interrupted", {
      description: "File upload failed. Check file size (max 50MB) and format, then retry.",
      className: "bg-status-critical/20 border-status-critical text-foreground",
      duration: 5000,
    });
    return;
  }

  // Check for storage errors
  if (errorMessage.toLowerCase().includes("storage") || errorMessage.toLowerCase().includes("bucket")) {
    toast.error("⚠️ System Interrupted", {
      description: "Vault storage error. The file could not be secured. Please retry.",
      className: "bg-status-critical/20 border-status-critical text-foreground",
      duration: 5000,
    });
    return;
  }

  // Generic error
  toast.error("⚠️ System Interrupted", {
    description: `Operation failed: ${context}. Please try again or contact support.`,
    className: "bg-status-critical/20 border-status-critical text-foreground",
    duration: 5000,
  });
}

export function handleAIError(error: unknown) {
  console.error("[VANI AI Error]:", error);

  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("429")) {
    toast.error("⚠️ Negotiation Matrix Overloaded", {
      description: "The AI agents are busy. Please wait 30 seconds and try again.",
      className: "bg-status-warning/20 border-status-warning text-foreground",
      duration: 6000,
    });
    return;
  }

  if (errorMessage.includes("402")) {
    toast.error("⚠️ AI Credits Depleted", {
      description: "The negotiation matrix requires additional credits. Contact your administrator.",
      className: "bg-status-critical/20 border-status-critical text-foreground",
      duration: 8000,
    });
    return;
  }

  toast.error("⚠️ Negotiation Interrupted", {
    description: "The AI agents encountered an error. The session has been paused.",
    className: "bg-status-critical/20 border-status-critical text-foreground",
    duration: 5000,
  });
}
