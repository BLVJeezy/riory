import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SIMPLA_HOST = "http://app-02.simpla.be/callback.aspx";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { appointmentId, payload } = await req.json();
    if (!appointmentId || typeof appointmentId !== "string" || !payload || typeof payload !== "object") {
      return new Response(JSON.stringify({ error: "appointmentId and payload required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validate the appointmentId actually exists — prevents anonymous spam
    // injection of arbitrary leads into the CRM.
    const { data: appt, error: lookupErr } = await supabase
      .from("appointments")
      .select("id")
      .eq("id", appointmentId)
      .maybeSingle();

    if (lookupErr) {
      console.error("[simpla] appointment lookup failed:", lookupErr);
      return new Response(JSON.stringify({ error: "Lookup failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!appt) {
      return new Response(JSON.stringify({ error: "Invalid appointmentId" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SIMPLA_API_KEY") ?? "rioryV2";
    const simplaUrl = `${SIMPLA_HOST}?key=${encodeURIComponent(apiKey)}`;
    const body = JSON.stringify({ appointmentId, ...payload });

    // Try direct send first
    try {
      console.log(`[simpla] POST appointment=${appointmentId}`);
      const res = await fetch(simplaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const respBody = await res.text();
      if (res.ok) {
        console.log(`[simpla] sent OK appointment=${appointmentId} body=${respBody.slice(0, 200)}`);
        return new Response(JSON.stringify({ success: true, queued: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.warn(`[simpla] direct send failed status=${res.status} body=${respBody.slice(0, 300)}, enqueueing`);
    } catch (err) {
      console.warn(`[simpla] direct send threw, enqueueing:`, err);
    }

    // Failed → enqueue for retry
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
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
