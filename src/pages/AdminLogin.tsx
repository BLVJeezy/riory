import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Ongeldige inloggegevens.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Log in om het dashboard te openen
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-background rounded-xl p-6 border border-border shadow-sm space-y-4"
        >
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@riory.be"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>

          <Button
            variant="cta"
            size="lg"
            type="submit"
            disabled={loading}
            className="w-full text-sm py-5 gap-2"
          >
            {loading ? "INLOGGEN..." : "INLOGGEN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
