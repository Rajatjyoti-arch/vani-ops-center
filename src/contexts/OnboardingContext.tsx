import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='logo']",
    title: "Welcome to VANI",
    content: "Verifiable Anonymous Network Intelligence - Your secure platform for anonymous reporting and grievance resolution.",
    placement: "right",
  },
  {
    id: "command-center",
    target: "[data-tour='nav-command']",
    title: "Administrative Dashboard",
    content: "Your dashboard showing real-time campus sentiment, activity feed, and key metrics.",
    placement: "right",
  },
  {
    id: "identity-credential",
    target: "[data-tour='nav-identity']",
    title: "Anonymous Credentialing",
    content: "Generate verified credentials using SHA-256 encryption. Your identity is cryptographically protected.",
    placement: "right",
  },
  {
    id: "encrypted-repository",
    target: "[data-tour='nav-vault']",
    title: "Encrypted Evidence Repository",
    content: "Upload encrypted evidence and submit grievances. All files are securely archived.",
    placement: "right",
  },
  {
    id: "governance-matrix",
    target: "[data-tour='nav-arena']",
    title: "Governance Resolution Matrix",
    content: "Observe AI-facilitated resolution processes in real-time using the Multi-Agent Deliberation Framework.",
    placement: "right",
  },
  {
    id: "ledger",
    target: "[data-tour='nav-ledger']",
    title: "Compliance Log",
    content: "Track all reports and download cryptographic certificates for resolved cases.",
    placement: "right",
  },
  {
    id: "settings",
    target: "[data-tour='settings']",
    title: "Settings & Features",
    content: "Toggle Demo Mode for sample data, enable sound effects, and access advanced features like Emergency Disclosure.",
    placement: "right",
  },
];

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  hasCompletedTour: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem("vani-tour-completed") === "true";
  });

  // Auto-start tour for new users after a delay
  useEffect(() => {
    if (!hasCompletedTour) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour]);

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const endTour = () => {
    setIsActive(false);
    setHasCompletedTour(true);
    localStorage.setItem("vani-tour-completed", "true");
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    endTour();
  };

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps: TOUR_STEPS,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        hasCompletedTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
