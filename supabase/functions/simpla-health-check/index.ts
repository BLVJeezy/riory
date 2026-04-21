import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIMPLA_CALLBACK_URL = "http://app-02.simpla.be/callback.aspx?key=rioryV2";
const TIMEOUT_MS = 10_000;
const ALERT_AFTER_CONSECUTIVE_FAILURES = 3;
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 500; // 500ms, 1000ms, 2000ms (+ jitter)

async function probeSimpla(payload: unknown): Promise<{
  ok: boolean;
  httpStatus: number | null;
  error: string | null;
  attempts: number;
}> {
  let lastError: string | null = null;
  let lastStatus: number | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(SIMPLA_CALLBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      lastStatus = res.status;
      const respBody = await res.text();

      if (res.ok) return { ok: true, httpStatus: res.status, error: null, attempts: attempt };

      lastError = `HTTP ${res.status}: ${respBody.slice(0, 300)}`;
      // Only retry on 5xx, 408, 429 — don't retry permanent client errors
      if (!(res.status >= 500 || res.status === 408 || res.status === 429)) {
        return { ok: false, httpStatus: res.status, error: lastError, attempts: attempt };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err instanceof Error ? err.message : String(err);
      if (lastError.includes("aborted")) lastError = `Timeout after ${TIMEOUT_MS}ms`;
    }

    if (attempt < MAX_ATTEMPTS) {
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      const delay = backoff + jitter;
      console.warn(`[simpla-health] attempt ${attempt} failed (${lastError}), retrying in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return { ok: false, httpStatus: lastStatus, error: lastError, attempts: MAX_ATTEMPTS };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const startedAt = Date.now();

  const probePayload = {
    appointmentId: "health-check",
    healthCheck: true,
    timestamp: new Date().toISOString(),
  };

  const result = await probeSimpla(probePayload);
  const latencyMs = Date.now() - startedAt;
  const status = result.ok ? "ok" : "fail";
  const httpStatus = result.httpStatus;
  const errorMessage = result.ok
    ? null
    : `${result.error} (after ${result.attempts} attempts)`;

  // Persist result
  const { error: insertErr } = await supabase.from("simpla_health_checks").insert({
    status,
    http_status: httpStatus,
    latency_ms: latencyMs,
    error_message: errorMessage,
  });
  if (insertErr) console.error("[simpla-health] insert failed:", insertErr);

  // Alert on consecutive failures
  let alerted = false;
  if (status === "fail") {
    const { data: recent } = await supabase
      .from("simpla_health_checks")
      .select("status")
      .order("checked_at", { ascending: false })
      .limit(ALERT_AFTER_CONSECUTIVE_FAILURES);

    const consecutiveFails =
      recent && recent.length >= ALERT_AFTER_CONSECUTIVE_FAILURES &&
      recent.every((r) => r.status === "fail");

    if (consecutiveFails) {
      alerted = true;
      console.error(
        `🚨 [simpla-health] ALERT: Simpla callback URL failed ${ALERT_AFTER_CONSECUTIVE_FAILURES}x in a row. ` +
        `Last error: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms total)`,
      );
    } else {
      console.warn(`[simpla-health] failure: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms total)`);
    }
  } else {
    console.log(`[simpla-health] OK (HTTP ${httpStatus}, ${latencyMs}ms, ${result.attempts} attempt${result.attempts > 1 ? "s" : ""})`);
  }

  return new Response(
    JSON.stringify({
      status,
      httpStatus,
      latencyMs,
      errorMessage,
      attempts: result.attempts,
      alerted,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
