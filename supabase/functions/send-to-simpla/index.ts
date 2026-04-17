import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIMPLA_ENDPOINT = "https://api.simpla.be/api/";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { appointmentId, payload } = await req.json();
    if (!appointmentId || !payload) {
      return new Response(JSON.stringify({ error: "appointmentId and payload required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SIMPLA_API_KEY");
    if (!apiKey) throw new Error("SIMPLA_API_KEY not configured");

    // Build URL with payload as query params (so Simpla can read from URL)
    const params = new URLSearchParams();
    params.set("appointmentId", String(appointmentId));
    for (const [k, v] of Object.entries(payload)) {
      if (v === undefined || v === null || v === "") continue;
      params.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
    }
    const urlWithParams = `${SIMPLA_ENDPOINT}?${params.toString()}`;

    // Try direct send first
    try {
      const res = await fetch(urlWithParams, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`[simpla] sent OK appointment=${appointmentId}`);
        return new Response(JSON.stringify({ success: true, queued: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.warn(`[simpla] direct send failed status=${res.status}, enqueueing`);
    } catch (err) {
      console.warn(`[simpla] direct send threw, enqueueing:`, err);
    }

    // Failed → enqueue for retry
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: enqErr } = await supabase.rpc("enqueue_email", {
      queue_name: "simpla_leads",
      payload: { appointmentId, payload, attempts: 0 },
    });

    if (enqErr) {
      console.error(`[simpla] enqueue failed:`, enqErr);
      throw enqErr;
    }

    return new Response(JSON.stringify({ success: true, queued: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[simpla] handler error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
