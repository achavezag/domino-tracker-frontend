import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
  sessionId: number;
  setSessionId: (id: number) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: 1,
      setSessionId: (id) => set({ sessionId: id }),
    }),
    { name: "session-id" }
  )
);
