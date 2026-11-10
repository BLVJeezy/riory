import { useState, useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContext {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // Admin-check per gebruiker-ID: een nieuwe sessie (token refresh, dubbele
  // getSession/onAuthStateChange) voor dezelfde gebruiker mag "laden" nooit
  // opnieuw aanzetten zonder dat er ook een check loopt.
  const checkedFor = useRef<string | null>(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    const apply = (next: Session | null) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (!next?.user) {
        checkedFor.current = null;
        setIsAdmin(false);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => apply(next));
    supabase.auth.getSession().then(
      ({ data: { session: next } }) => apply(next),
      () => apply(null),
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || checkedFor.current === userId) return;

    let cancelled = false;
    setLoading(true);

    const finish = (admin: boolean) => {
      if (cancelled) return;
      checkedFor.current = userId;
      setIsAdmin(admin);
      setLoading(false);
    };

    // Vangnet: blijft de rol-check hangen, dan na 8 s toch verder (als geen admin).
    const timeout = setTimeout(() => finish(false), 8000);

    Promise.resolve(supabase.rpc("has_role", { _user_id: userId, _role: "admin" }))
      .then(({ data, error }) => finish(!error && !!data))
      .catch(() => finish(false))
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [userId]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
