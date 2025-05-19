'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { Template } from '@/features/health-check/types/templates';

export interface Session {
  id: string;
  name: string;
  description: string;
  template: Template;
  facilitatorId: string;
  isAnonymous: boolean;
  dueDate: string;
  currentPhase?: 'welcome' | 'survey' | 'discuss' | 'review' | 'close';
}

interface SessionContextType {
  sessions: Session[];
  currentSession: Session | null;
  createSession: (session: Omit<Session, 'id'>) => Promise<Session>;
  setCurrentSession: (session: Session | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const createSession = async (
    sessionData: Omit<Session, 'id'>,
  ): Promise<Session> => {
    const newSession: Session = {
      ...sessionData,
      id: Math.random().toString(36).substring(7),
      currentPhase: 'welcome' as const,
    };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSession,
        createSession,
        setCurrentSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
