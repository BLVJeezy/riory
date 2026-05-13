import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

interface PageView {
  page: string;
  referrer: string | null;
  user_agent: string | null;
  visitor_id: string | null;
  created_at: string;
}

const detectDevice = (ua: string | null): string => {
  if (!ua) return "Desktop";
  const u = ua.toLowerCase();
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i.test(u)) return "Bot";
  if (/ipad|tablet|playbook|silk/i.test(u)) return "Tablet";
  if (/mobi|android|iphone|ipod|opera mini|iemobile/i.test(u)) return "Mobile";
  return "Desktop";
};

const cleanReferrer = (r: string | null): string => {
  if (!r) return "Direct";
  try {
    const u = new URL(r);
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("google")) return "Google";
    if (host.includes("facebook") || host.includes("fb.")) return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("bing")) return "Bing";
    if (host.includes("duckduckgo")) return "DuckDuckGo";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("riory.")) return "Direct";
    return host;
  } catch {
    return "Direct";
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const days = Math.min(Math.max(Number(body?.days) || 365, 1), 730);

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    // Fetch all page views since `since`
    const all: PageView[] = [];
    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await admin
        .from("page_views")
        .select("page, referrer, user_agent, visitor_id, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      all.push(...(data as PageView[]));
      if (data.length < pageSize) break;
      from += pageSize;
      if (all.length > 200000) break;
    }

    // Group per day
    const byDay = new Map<string, PageView[]>();
    for (const r of all) {
      const key = r.created_at.slice(0, 10);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(r);
    }

    const visitorKey = (r: PageView) =>
      r.visitor_id || `${r.user_agent || "anon"}|${r.referrer || ""}`;

    const snapshots = Array.from(byDay.entries()).map(([date, rows]) => {
      const visitorsSet = new Set(rows.map(visitorKey));
      const pageCounts: Record<string, number> = {};
      const srcCounts: Record<string, number> = {};
      const devCounts: Record<string, number> = {};
      // Bounce proxy: visitors with exactly 1 view that day
      const visitorViewCounts: Record<string, number> = {};

      for (const r of rows) {
        pageCounts[r.page] = (pageCounts[r.page] || 0) + 1;
        const src = cleanReferrer(r.referrer);
        srcCounts[src] = (srcCounts[src] || 0) + 1;
        const dev = detectDevice(r.user_agent);
        devCounts[dev] = (devCounts[dev] || 0) + 1;
        const vk = visitorKey(r);
        visitorViewCounts[vk] = (visitorViewCounts[vk] || 0) + 1;
      }

      const bounced = Object.values(visitorViewCounts).filter((c) => c === 1).length;
      const totalVisitors = visitorsSet.size;
      const bounceRate = totalVisitors > 0 ? bounced / totalVisitors : 0;

      const top = (obj: Record<string, number>, n: number) =>
        Object.entries(obj)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, n);

      return {
        snapshot_date: date,
        pageviews: rows.length,
        visitors: totalVisitors,
        bounce_rate: Number(bounceRate.toFixed(4)),
        avg_duration_seconds: null,
        top_pages: top(pageCounts, 20),
        sources: top(srcCounts, 20),
        devices: top(devCounts, 10),
        countries: [],
        updated_at: new Date().toISOString(),
      };
    });

    if (snapshots.length > 0) {
      const { error: upErr } = await admin
        .from("analytics_snapshots")
        .upsert(snapshots, { onConflict: "snapshot_date" });
      if (upErr) throw upErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        days_synced: snapshots.length,
        rows_processed: all.length,
        synced_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-analytics error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
