import { useState, useEffect, createContext, useContext } from "react";
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

  const updateSessionState = (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (!session?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
  };

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    }).then(({ data }) => {
      if (!cancelled) {
        setIsAdmin(!!data);
      }
    }).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateSessionState(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSessionState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
