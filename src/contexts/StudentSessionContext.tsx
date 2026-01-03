import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface StudentProfile {
  id: string;
  enrollment_no: string;
  email: string;
  ghost_name: string;
  avatar: string;
  reputation: number;
  reports_submitted: number;
  created_at: string;
}

interface StudentSessionContextType {
  studentProfile: StudentProfile | null;
  isAuthenticated: boolean;
  login: (profile: StudentProfile) => void;
  logout: () => void;
}

const StudentSessionContext = createContext<StudentSessionContextType | undefined>(undefined);

const SESSION_KEY = 'vani_student_session';

export function StudentSessionProvider({ children }: { children: ReactNode }) {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    // Restore session from localStorage on mount
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStudentProfile(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (profile: StudentProfile) => {
    setStudentProfile(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setStudentProfile(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <StudentSessionContext.Provider
      value={{
        studentProfile,
        isAuthenticated: !!studentProfile,
        login,
        logout,
      }}
    >
      {children}
    </StudentSessionContext.Provider>
  );
}

export function useStudentSession() {
  const context = useContext(StudentSessionContext);
  if (context === undefined) {
    throw new Error('useStudentSession must be used within a StudentSessionProvider');
  }
  return context;
}
