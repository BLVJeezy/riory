import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIMPLA_CALLBACK_URL = `http://app-02.simpla.be/callback.aspx?key=${encodeURIComponent(Deno.env.get("SIMPLA_API_KEY") ?? "rioryV2")}`;
const TIMEOUT_MS = 10_000;
const ALERT_AFTER_CONSECUTIVE_FAILURES = 3;
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 500;
const REMINDER_INTERVAL_HOURS = 24;

async function probeSimpla(): Promise<{
  ok: boolean;
  httpStatus: number | null;
  error: string | null;
  attempts: number;
}> {
  let lastError: string | null = null;
  let lastStatus: number | null = null;

  // Health probe uses GET (not POST) so Simpla's appointment-lookup code path
  // is NOT invoked. Posting a fake appointmentId returns HTTP 500
  // (NullReferenceException in their .NET handler), which is NOT an outage —
  // it just means our test payload doesn't match a real record. A simple GET
  // returns 200 when the endpoint is reachable, which is what we actually
  // want to monitor.
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(SIMPLA_CALLBACK_URL, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      lastStatus = res.status;
      // Drain body to free the connection
      await res.text().catch(() => "");

      // Treat any non-5xx response as "endpoint is up" — 4xx means Simpla
      // is alive and answering, just not happy with the request shape.
      if (res.status < 500) {
        return { ok: true, httpStatus: res.status, error: null, attempts: attempt };
      }

      lastError = `HTTP ${res.status}`;
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

function fmt(ts: string | null | undefined): string {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString("nl-BE", { timeZone: "Europe/Brussels" });
  } catch {
    return ts;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  // verify_jwt = true in config.toml ensures only project-issued tokens
  // (anon or service_role) can reach this endpoint. The cron job calls it
  // with the anon key — that's fine, this is an internal monitor.

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const startedAt = Date.now();
  const result = await probeSimpla();
  const latencyMs = Date.now() - startedAt;
  const status = result.ok ? "ok" : "fail";
  const httpStatus = result.httpStatus;
  const errorMessage = result.ok
    ? null
    : `${result.error} (after ${result.attempts} attempts)`;

  const { error: insertErr } = await supabase.from("simpla_health_checks").insert({
    status,
    http_status: httpStatus,
    latency_ms: latencyMs,
    error_message: errorMessage,
  });
  if (insertErr) console.error("[simpla-health] insert failed:", insertErr);

  let alerted = false;
  let alertType: "incident" | "reminder" | null = null;

  // Get currently open incident, if any
  const { data: openIncidents } = await supabase
    .from("simpla_health_incidents")
    .select("*")
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1);
  const openIncident = openIncidents?.[0] ?? null;

  if (status === "fail") {
    // Count recent consecutive failures
    const { data: recent } = await supabase
      .from("simpla_health_checks")
      .select("status, checked_at")
      .order("checked_at", { ascending: false })
      .limit(ALERT_AFTER_CONSECUTIVE_FAILURES);

    const consecutiveFails =
      recent && recent.length >= ALERT_AFTER_CONSECUTIVE_FAILURES &&
      recent.every((r) => r.status === "fail");

    if (consecutiveFails) {
      const now = new Date().toISOString();
      let incident = openIncident;

      // If no open incident yet, create one and send first alert
      if (!incident) {
        const firstFailedAt = recent[recent.length - 1]?.checked_at ?? now;
        const { data: created } = await supabase
          .from("simpla_health_incidents")
          .insert({
            status: "open",
            opened_at: firstFailedAt,
            last_alert_at: now,
            alert_count: 1,
            last_error_message: errorMessage,
            last_http_status: httpStatus,
            consecutive_failures: ALERT_AFTER_CONSECUTIVE_FAILURES,
          })
          .select()
          .single();
        incident = created;
        alertType = "incident";
      } else {
        // Update incident state
        await supabase
          .from("simpla_health_incidents")
          .update({
            last_error_message: errorMessage,
            last_http_status: httpStatus,
            consecutive_failures: (incident.consecutive_failures ?? 0) + 1,
          })
          .eq("id", incident.id);

        // Check if 24h reminder is due
        const lastAlertAt = incident.last_alert_at ? new Date(incident.last_alert_at).getTime() : 0;
        const hoursSinceLastAlert = (Date.now() - lastAlertAt) / (1000 * 60 * 60);
        if (hoursSinceLastAlert >= REMINDER_INTERVAL_HOURS) {
          await supabase
            .from("simpla_health_incidents")
            .update({
              last_alert_at: now,
              alert_count: (incident.alert_count ?? 0) + 1,
            })
            .eq("id", incident.id);
          alertType = "reminder";
        }
      }

      // Send alert email if needed
      if (alertType && incident) {
        try {
          const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "simpla-health-alert",
              recipientEmail: "jasonbalongo@gmail.com",
              idempotencyKey: `simpla-alert-${incident.id}-${alertType}-${incident.alert_count ?? 1}`,
              templateData: {
                alertType,
                consecutiveFailures: (incident.consecutive_failures ?? ALERT_AFTER_CONSECUTIVE_FAILURES) + (alertType === "reminder" ? 1 : 0),
                errorMessage: errorMessage ?? "onbekend",
                httpStatus: httpStatus ?? "geen respons",
                latencyMs,
                attempts: result.attempts,
                firstFailedAt: fmt(incident.opened_at),
                lastCheckedAt: fmt(now),
              },
            },
          });
          if (emailErr) {
            console.error("[simpla-health] alert email failed:", emailErr);
          } else {
            alerted = true;
            console.error(
              `🚨 [simpla-health] ALERT (${alertType}) sent. ` +
              `Last error: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms, ${result.attempts} attempts)`,
            );
          }
        } catch (e) {
          console.error("[simpla-health] alert send threw:", e);
        }
      } else {
        console.warn(`[simpla-health] failure: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms)`);
      }
    } else {
      console.warn(`[simpla-health] failure: ${errorMessage} (HTTP ${httpStatus}, ${latencyMs}ms)`);
    }
  } else {
    // Success: resolve any open incident
    if (openIncident) {
      await supabase
        .from("simpla_health_incidents")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          consecutive_failures: 0,
        })
        .eq("id", openIncident.id);
      console.log(`[simpla-health] incident ${openIncident.id} resolved`);
    }
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
      alertType,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
