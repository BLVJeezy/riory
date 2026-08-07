// Tracking van prijscalculator-sessies zodat we kunnen zien waar bezoekers
// afhaken (drop-off) en welke sessies uiteindelijk een afspraak worden.
//
// Elke browser-sessie krijgt één session_id (sessionStorage). Per betekenisvolle
// wijziging schrijven we een rij in `calculator_sessions`. In de admin nemen we
// per session_id de hoogste bereikte stap → dat is het afhaakpunt.

import { supabase } from "@/integrations/supabase/client";

const CALC_SESSION_KEY = "riory_calc_session";
const VISITOR_ID_KEY = "riory_visitor_id";

export function getCalculatorSessionId(create = false): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(CALC_SESSION_KEY);
    if (!id && create) {
      id = crypto.randomUUID();
      sessionStorage.setItem(CALC_SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function getVisitorId(): string | null {
  try {
    return sessionStorage.getItem(VISITOR_ID_KEY);
  } catch {
    return null;
  }
}

export type CalculatorStep = {
  step: number;
  service?: string | null;
  service_subtype?: string | null;
  price_eur?: number | null;
  plaats?: string | null;
  postcode?: string | null;
  distance_km?: number | null;
};

// Voorkom dubbele rijen voor exact dezelfde toestand.
let lastSignature = "";

export async function logCalculatorStep(data: CalculatorStep) {
  const session_id = getCalculatorSessionId(true);
  if (!session_id) return;

  const signature = JSON.stringify([
    data.step,
    data.service ?? null,
    data.service_subtype ?? null,
    data.price_eur ?? null,
    data.plaats ?? null,
    data.postcode ?? null,
  ]);
  if (signature === lastSignature) return;
  lastSignature = signature;

  try {
    await supabase.from("calculator_sessions").insert({
      session_id,
      visitor_id: getVisitorId(),
      step: data.step,
      service: data.service ?? null,
      service_subtype: data.service_subtype ?? null,
      price_eur: data.price_eur ?? null,
      plaats: data.plaats ?? null,
      postcode: data.postcode ?? null,
      distance_km: data.distance_km ?? null,
      page_url: window.location.href,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("logCalculatorStep failed:", err);
  }
}
