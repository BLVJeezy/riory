import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SETTING_KEY = "price_calculator_enabled";
const LOCAL_KEY = "riory_price_calculator_enabled";

const db = supabase as any;

const localeRoot = (pathname: string) => {
  if (pathname.startsWith("/en/")) return "/en/";
  if (pathname.startsWith("/fr/")) return "/fr/";
  return "/";
};

const isCalculatorPath = (pathname: string) =>
  pathname === "/prijscalculator" ||
  pathname === "/en/prijscalculator" ||
  pathname === "/fr/prijscalculator";

const readLocalSetting = (): boolean | null => {
  try {
    const value = localStorage.getItem(LOCAL_KEY);
    if (value === "true") return true;
    if (value === "false") return false;
  } catch {
    // Ignore unavailable storage.
  }
  return null;
};

const writeLocalSetting = (value: boolean) => {
  try {
    localStorage.setItem(LOCAL_KEY, String(value));
  } catch {
    // Ignore unavailable storage.
  }
};

const PriceCalculatorFeatureGate = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSetting = async () => {
      const { data, error } = await db
        .from("site_settings")
        .select("enabled")
        .eq("key", SETTING_KEY)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data) {
        const value = Boolean(data.enabled);
        setEnabled(value);
        setUsingLocalFallback(false);
        writeLocalSetting(value);
        return;
      }

      // Fail closed instead of silently showing the calculator when the
      // database feature flag is unavailable. A local value can still be used
      // by admins on this browser until the migration is deployed.
      const local = readLocalSetting();
      setEnabled(local ?? false);
      setUsingLocalFallback(true);
    };

    loadSetting();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const state = enabled === null ? "loading" : enabled ? "on" : "off";
    document.documentElement.dataset.priceCalculatorEnabled = state;

    return () => {
      delete document.documentElement.dataset.priceCalculatorEnabled;
    };
  }, [enabled]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LOCAL_KEY) return;
      if (event.newValue === "true") setEnabled(true);
      if (event.newValue === "false") setEnabled(false);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleCalculator = async () => {
    if (!isAdmin || enabled === null || saving) return;

    const next = !enabled;
    setSaving(true);

    const { data, error } = await db
      .from("site_settings")
      .update({ enabled: next, updated_at: new Date().toISOString() })
      .eq("key", SETTING_KEY)
      .select("enabled")
      .maybeSingle();

    if (!error && data) {
      const value = Boolean(data.enabled);
      setEnabled(value);
      setUsingLocalFallback(false);
      writeLocalSetting(value);
      toast.success(`Prijscalculator staat nu ${value ? "AAN" : "UIT"}.`);
      setSaving(false);
      return;
    }

    // Temporary browser-level fallback if the production migration is missing.
    setEnabled(next);
    setUsingLocalFallback(true);
    writeLocalSetting(next);
    toast.warning(
      `Prijscalculator staat ${next ? "AAN" : "UIT"} in deze browser. Databasekoppeling ontbreekt nog voor alle bezoekers.`,
    );
    setSaving(false);
  };

  if (isCalculatorPath(pathname) && enabled !== true) {
    if (enabled === null) return null;
    return <Navigate to={localeRoot(pathname)} replace />;
  }

  const showAdminToggle =
    isAdmin && (pathname === "/admin" || pathname === "/en/admin" || pathname === "/fr/admin");

  return (
    <>
      <style>{`
        html[data-price-calculator-enabled="off"] #prijscalculator,
        html[data-price-calculator-enabled="loading"] #prijscalculator,
        html[data-price-calculator-enabled="off"] .price-calculator-feature,
        html[data-price-calculator-enabled="loading"] .price-calculator-feature,
        html[data-price-calculator-enabled="off"] a[href*="prijscalculator"],
        html[data-price-calculator-enabled="loading"] a[href*="prijscalculator"],
        html[data-price-calculator-enabled="off"] div:has(> a[href*="/prijscalculator"]),
        html[data-price-calculator-enabled="loading"] div:has(> a[href*="/prijscalculator"]),
        html[data-price-calculator-enabled="off"] li:has(> a[href*="prijscalculator"]),
        html[data-price-calculator-enabled="loading"] li:has(> a[href*="prijscalculator"]) {
          display: none !important;
        }
      `}</style>

      {children}

      {showAdminToggle && (
        <div className="fixed right-4 bottom-4 z-[100] flex flex-col items-end gap-2">
          {usingLocalFallback && (
            <span className="max-w-[260px] rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] font-medium text-amber-900 shadow-lg">
              Tijdelijke lokale modus — Supabase migratie ontbreekt nog voor globale werking.
            </span>
          )}
          <button
            type="button"
            onClick={toggleCalculator}
            disabled={enabled === null || saving}
            className={`rounded-full px-5 py-3 font-heading text-sm font-bold uppercase tracking-wide shadow-xl border transition-all disabled:opacity-60 ${
              enabled
                ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
                : "bg-red-600 text-white border-red-500 hover:bg-red-700"
            }`}
            aria-pressed={enabled === true}
            aria-label="Prijscalculator aan of uit zetten"
          >
            {saving || enabled === null
              ? "Prijscalculator: laden..."
              : `Prijscalculator: ${enabled ? "AAN" : "UIT"}`}
          </button>
        </div>
      )}
    </>
  );
};

export default PriceCalculatorFeatureGate;
