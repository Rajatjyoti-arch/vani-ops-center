import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GhostIdentity {
  id: string;
  roll_number_hash: string;
  ghost_name: string;
  avatar: string;
  reputation: number;
  reports_submitted: number;
  created_at: string;
}

interface GhostSessionContextType {
  ghostIdentity: GhostIdentity | null;
  isAuthenticated: boolean;
  login: (identity: GhostIdentity) => void;
  logout: () => void;
}

const GhostSessionContext = createContext<GhostSessionContextType | undefined>(undefined);

const SESSION_KEY = 'vani_ghost_session';

export function GhostSessionProvider({ children }: { children: ReactNode }) {
  const [ghostIdentity, setGhostIdentity] = useState<GhostIdentity | null>(null);

  useEffect(() => {
    // Restore session from localStorage on mount
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGhostIdentity(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (identity: GhostIdentity) => {
    setGhostIdentity(identity);
    localStorage.setItem(SESSION_KEY, JSON.stringify(identity));
  };

  const logout = () => {
    setGhostIdentity(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <GhostSessionContext.Provider
      value={{
        ghostIdentity,
        isAuthenticated: !!ghostIdentity,
        login,
        logout,
      }}
    >
      {children}
    </GhostSessionContext.Provider>
  );
}

export function useGhostSession() {
  const context = useContext(GhostSessionContext);
  if (context === undefined) {
    throw new Error('useGhostSession must be used within a GhostSessionProvider');
  }
  return context;
}
