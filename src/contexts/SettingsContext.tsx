import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoModeState] = useState(() => {
    const saved = localStorage.getItem("vani-demo-mode");
    return saved === "true";
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem("vani-sound-enabled");
    return saved === "true";
  });

  const setDemoMode = (value: boolean) => {
    setDemoModeState(value);
    localStorage.setItem("vani-demo-mode", value.toString());
  };

  const setSoundEnabled = (value: boolean) => {
    setSoundEnabledState(value);
    localStorage.setItem("vani-sound-enabled", value.toString());
  };

  return (
    <SettingsContext.Provider value={{ demoMode, setDemoMode, soundEnabled, setSoundEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
