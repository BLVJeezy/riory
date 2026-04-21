import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIMPLA_CALLBACK_URL = "http://app-02.simpla.be/callback.aspx?key=rioryV2";
const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 10;
const VT_SECONDS = 60;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let dlq = 0;

  try {
    const { data: messages, error: readErr } = await supabase.rpc("read_email_batch", {
      queue_name: "simpla_leads",
      batch_size: BATCH_SIZE,
      vt: VT_SECONDS,
    });

    if (readErr) throw readErr;
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const msg of messages) {
      processed++;
      const { msg_id, message, read_ct } = msg;
      const { appointmentId, payload } = message;
      const attempts = (message.attempts ?? 0) + 1;

      try {
        const body = JSON.stringify({ appointmentId, ...(payload ?? {}) });

        const res = await fetch(SIMPLA_CALLBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (res.ok) {
          await supabase.rpc("delete_email", { queue_name: "simpla_leads", message_id: msg_id });
          console.log(`[simpla-queue] sent OK appointment=${appointmentId} attempt=${attempts}`);
          succeeded++;
          continue;
        }

        const respBody = await res.text();
        console.warn(`[simpla-queue] send failed appointment=${appointmentId} status=${res.status} body=${respBody}`);
        failed++;

        if (read_ct >= MAX_ATTEMPTS || attempts >= MAX_ATTEMPTS) {
          await supabase.rpc("move_to_dlq", {
            source_queue: "simpla_leads",
            dlq_name: "simpla_leads_dlq",
            message_id: msg_id,
            payload: { ...message, attempts, lastError: `${res.status}: ${respBody}` },
          });
          dlq++;
          console.error(`[simpla-queue] moved to DLQ appointment=${appointmentId}`);
        }
      } catch (err) {
        console.error(`[simpla-queue] exception appointment=${appointmentId}:`, err);
        failed++;
        if (read_ct >= MAX_ATTEMPTS) {
          await supabase.rpc("move_to_dlq", {
            source_queue: "simpla_leads",
            dlq_name: "simpla_leads_dlq",
            message_id: msg_id,
            payload: { ...message, attempts, lastError: String(err) },
          });
          dlq++;
        }
      }
    }

    return new Response(JSON.stringify({ processed, succeeded, failed, dlq }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[simpla-queue] fatal:", err);
    return new Response(JSON.stringify({ error: String(err), processed, succeeded, failed, dlq }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
