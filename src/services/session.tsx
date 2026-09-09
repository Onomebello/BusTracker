/**
 * Auth, stubbed. No real provider yet — this is where a real sign-in
 * (Firebase, a school's own API, whatever) gets wired in later. Every
 * screen should read auth state through `useSession`, never touch this
 * module's internals directly.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileComplete: boolean;
};

type SessionState = {
  user: SessionUser | null;
  isLoading: boolean;
};

type SessionContextValue = SessionState & {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  completeProfile: (details: { phone: string }) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SessionState>({
    user: null,
    isLoading: false,
  });

  const signIn = useCallback(async (email: string, _password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await delay(600);
    setState({
      isLoading: false,
      user: {
        id: "parent-1",
        name: "Damilola Adewale",
        email,
        phone: "+2348012345678",
        profileComplete: true,
      },
    });
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, _password: string) => {
      setState((s) => ({ ...s, isLoading: true }));
      await delay(600);
      setState({
        isLoading: false,
        user: {
          id: "parent-1",
          name,
          email,
          phone: "",
          profileComplete: false,
        },
      });
    },
    [],
  );

  const completeProfile = useCallback(
    async (details: { phone: string }) => {
      setState((s) => ({ ...s, isLoading: true }));
      await delay(400);
      setState((s) => ({
        isLoading: false,
        user: s.user
          ? { ...s.user, phone: details.phone, profileComplete: true }
          : s.user,
      }));
    },
    [],
  );

  const signOut = useCallback(() => {
    setState({ user: null, isLoading: false });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      isAuthenticated: state.user !== null,
      signIn,
      signUp,
      completeProfile,
      signOut,
    }),
    [state, signIn, signUp, completeProfile, signOut],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
