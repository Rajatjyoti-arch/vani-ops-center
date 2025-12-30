import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface DeadManSwitchContextType {
  isActive: boolean;
  timeRemaining: number;
  hasTriggered: boolean;
  setIsActive: (active: boolean) => void;
  checkIn: () => void;
  resetTrigger: () => void;
}

const COUNTDOWN_DURATION = 48 * 60 * 60; // 48 hours in seconds
// For demo purposes, use a shorter time (30 seconds)
const DEMO_COUNTDOWN = 30;

const DeadManSwitchContext = createContext<DeadManSwitchContextType | undefined>(undefined);

export function DeadManSwitchProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DEMO_COUNTDOWN);
  const [hasTriggered, setHasTriggered] = useState(false);

  const checkIn = useCallback(() => {
    setTimeRemaining(DEMO_COUNTDOWN);
  }, []);

  const resetTrigger = useCallback(() => {
    setHasTriggered(false);
    setIsActive(false);
    setTimeRemaining(DEMO_COUNTDOWN);
  }, []);

  useEffect(() => {
    if (!isActive || hasTriggered) {
      if (!isActive) setTimeRemaining(DEMO_COUNTDOWN);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setHasTriggered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, hasTriggered]);

  return (
    <DeadManSwitchContext.Provider
      value={{
        isActive,
        timeRemaining,
        hasTriggered,
        setIsActive,
        checkIn,
        resetTrigger,
      }}
    >
      {children}
    </DeadManSwitchContext.Provider>
  );
}

export function useDeadManSwitch() {
  const context = useContext(DeadManSwitchContext);
  if (!context) {
    throw new Error("useDeadManSwitch must be used within a DeadManSwitchProvider");
  }
  return context;
}
