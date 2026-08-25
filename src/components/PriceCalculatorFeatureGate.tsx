import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SETTING_KEY = "price_calculator_enabled";

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

const PriceCalculatorFeatureGate = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSetting = async () => {
      const { data, error } = await db
        .from("site_settings")
        .select("enabled")
        .eq("key", SETTING_KEY)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setEnabled(true);
        return;
      }

      setEnabled(Boolean(data.enabled));
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

  const toggleCalculator = async () => {
    if (!isAdmin || enabled === null || saving) return;

    const next = !enabled;
    setSaving(true);
    setEnabled(next);

    const { error } = await db
      .from("site_settings")
      .update({ enabled: next, updated_at: new Date().toISOString() })
      .eq("key", SETTING_KEY);

    if (error) {
      setEnabled(!next);
      toast.error("Prijscalculator kon niet worden aangepast.");
    } else {
      toast.success(`Prijscalculator staat nu ${next ? "AAN" : "UIT"}.`);
    }

    setSaving(false);
  };

  if (isCalculatorPath(pathname) && enabled !== true) {
    if (enabled === null) return null;
    return <Navigate to={localeRoot(pathname)} replace />;
  }

  const showAdminToggle = isAdmin && (pathname === "/admin" || pathname === "/en/admin" || pathname === "/fr/admin");

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
        <button
          type="button"
          onClick={toggleCalculator}
          disabled={enabled === null || saving}
          className={`fixed right-4 bottom-4 z-[100] rounded-full px-5 py-3 font-heading text-sm font-bold uppercase tracking-wide shadow-xl border transition-all disabled:opacity-60 ${
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
      )}
    </>
  );
};

export default PriceCalculatorFeatureGate;
