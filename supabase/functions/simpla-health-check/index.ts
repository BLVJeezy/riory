import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIMPLA_CALLBACK_URL = "http://app-02.simpla.be/callback.aspx?key=rioryV2";
const TIMEOUT_MS = 10_000;
const ALERT_AFTER_CONSECUTIVE_FAILURES = 3;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const startedAt = Date.now();
  let status = "ok";
  let httpStatus: number | null = null;
  let errorMessage: string | null = null;

  // Health probe payload — Simpla side ignores unknown appointmentIds
  const probePayload = {
    appointmentId: "health-check",
    healthCheck: true,
    timestamp: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(SIMPLA_CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(probePayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    httpStatus = res.status;
    const respBody = await res.text();

    if (!res.ok) {
      status = "fail";
      errorMessage = `HTTP ${res.status}: ${respBody.slice(0, 300)}`;
    }
  } catch (err) {
    status = "fail";
    errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes("aborted")) errorMessage = `Timeout after ${TIMEOUT_MS}ms`;
  }

  const latencyMs = Date.now() - startedAt;

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
        `Last error: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms)`,
      );
    } else {
      console.warn(`[simpla-health] failure: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms)`);
    }
  } else {
    console.log(`[simpla-health] OK (HTTP ${httpStatus}, ${latencyMs}ms)`);
  }

  return new Response(
    JSON.stringify({ status, httpStatus, latencyMs, errorMessage, alerted }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
