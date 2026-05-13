import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

interface PageViewRow {
  page: string;
  referrer: string | null;
  user_agent: string | null;
  visitor_id: string | null;
  created_at: string;
}

const RANGE_OPTIONS = [
  { value: 7, label: "Laatste 7 dagen" },
  { value: 30, label: "Laatste 30 dagen" },
  { value: 90, label: "Laatste 90 dagen" },
  { value: 365, label: "Laatste 12 maanden" },
];

const PALETTE = [
  "hsl(217 91% 60%)",
  "hsl(24 95% 53%)",
  "hsl(142 71% 45%)",
  "hsl(280 65% 60%)",
  "hsl(346 77% 49%)",
  "hsl(48 96% 53%)",
  "hsl(189 94% 43%)",
  "hsl(330 81% 60%)",
];

const detectDevice = (ua: string | null): "Mobile" | "Tablet" | "Desktop" | "Bot" => {
  if (!ua) return "Desktop";
  const u = ua.toLowerCase();
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i.test(u)) return "Bot";
  if (/ipad|tablet|playbook|silk/i.test(u)) return "Tablet";
  if (/mobi|android|iphone|ipod|opera mini|iemobile/i.test(u)) return "Mobile";
  return "Desktop";
};

const detectBrowser = (ua: string | null): string => {
  if (!ua) return "Onbekend";
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome/i.test(ua) && !/edg|opr/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  return "Anders";
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

const formatDay = (d: Date) =>
  d.toLocaleDateString("nl-BE", { day: "2-digit", month: "short" });

const AnalyticsTab = () => {
  const [rows, setRows] = useState<PageViewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - days);
      // Pull in batches to bypass 1000 row default
      const all: PageViewRow[] = [];
      const pageSize = 1000;
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from("page_views")
          .select("page, referrer, user_agent, visitor_id, created_at")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .range(from, from + pageSize - 1);
        if (error) {
          toast.error("Kon analytics niet laden.");
          break;
        }
        if (!data || data.length === 0) break;
        all.push(...(data as PageViewRow[]));
        if (data.length < pageSize) break;
        from += pageSize;
        if (all.length > 50000) break;
      }
      if (!cancelled) {
        setRows(all);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const stats = useMemo(() => {
    const totalViews = rows.length;
    const uniqueVisitors = new Set(
      rows.map((r) => r.visitor_id || `${r.user_agent || "anon"}|${r.referrer || ""}`)
    ).size;
    const viewsPerVisitor =
      uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0";

    // Daily series
    const dayMap = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { date: key, views: 0, visitors: new Set() });
    }
    rows.forEach((r) => {
      const key = r.created_at.slice(0, 10);
      const entry = dayMap.get(key);
      if (entry) {
        entry.views++;
        entry.visitors.add(
          r.visitor_id || `${r.user_agent || "anon"}|${r.referrer || ""}`
        );
      }
    });
    const daily = Array.from(dayMap.values()).map((d) => ({
      date: formatDay(new Date(d.date)),
      Bezoeken: d.views,
      Bezoekers: d.visitors.size,
    }));

    // Top pages
    const pageCounts: Record<string, number> = {};
    rows.forEach((r) => {
      pageCounts[r.page] = (pageCounts[r.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Referrers
    const refCounts: Record<string, number> = {};
    rows.forEach((r) => {
      const k = cleanReferrer(r.referrer);
      refCounts[k] = (refCounts[k] || 0) + 1;
    });
    const referrers = Object.entries(refCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Devices
    const devCounts: Record<string, number> = {};
    rows.forEach((r) => {
      const d = detectDevice(r.user_agent);
      devCounts[d] = (devCounts[d] || 0) + 1;
    });
    const devices = Object.entries(devCounts).map(([label, count]) => ({
      label,
      count,
    }));

    // Browsers
    const brCounts: Record<string, number> = {};
    rows.forEach((r) => {
      const b = detectBrowser(r.user_agent);
      brCounts[b] = (brCounts[b] || 0) + 1;
    });
    const browsers = Object.entries(brCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalViews,
      uniqueVisitors,
      viewsPerVisitor,
      daily,
      topPages,
      referrers,
      devices,
      browsers,
    };
  }, [rows, days]);

  const exportCSV = () => {
    const headers = ["Datum", "Bezoeken", "Unieke bezoekers"];
    const csv = [
      headers,
      ...stats.daily.map((d) => [d.date, d.Bezoeken, d.Bezoekers]),
    ]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riory-analytics-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV geëxporteerd.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading font-semibold text-foreground">
            Website analytics
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Realtime data uit je eigen database — geen externe tool nodig.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm font-body text-foreground"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={exportCSV}
            disabled={!stats.totalViews}
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Laden...</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <KPI label="Totaal bezoeken" value={stats.totalViews.toLocaleString("nl-BE")} />
            <KPI label="Unieke bezoekers" value={stats.uniqueVisitors.toLocaleString("nl-BE")} />
            <KPI label="Pagina's per bezoeker" value={stats.viewsPerVisitor} />
            <KPI
              label="Top pagina"
              value={stats.topPages[0]?.page || "—"}
              small
            />
          </div>

          {/* Daily chart */}
          <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Verkeer per dag
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Line
                    type="monotone"
                    dataKey="Bezoeken"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Bezoekers"
                    stroke="hsl(24 95% 53%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Top pages */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Top pagina's
              </h3>
              {stats.topPages.length ? (
                <RankedBars
                  items={stats.topPages.map((p) => ({ label: p.page, count: p.count }))}
                />
              ) : (
                <p className="text-sm text-muted-foreground font-body">Geen data.</p>
              )}
            </div>

            {/* Referrers */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Verkeersbronnen
              </h3>
              {stats.referrers.length ? (
                <RankedBars items={stats.referrers} />
              ) : (
                <p className="text-sm text-muted-foreground font-body">Geen data.</p>
              )}
            </div>

            {/* Devices */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Apparaten
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.devices}
                      dataKey="count"
                      nameKey="label"
                      innerRadius="45%"
                      outerRadius="78%"
                      paddingAngle={2}
                      label={(e: any) =>
                        `${e.label} ${Math.round((e.count / stats.totalViews) * 100)}%`
                      }
                      labelLine={false}
                    >
                      {stats.devices.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Browsers
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.browsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="label"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const KPI = ({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) => (
  <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
    <p className="text-xs sm:text-sm font-body text-muted-foreground">{label}</p>
    <p
      className={`font-heading font-bold text-foreground mt-1 truncate ${
        small ? "text-base sm:text-lg" : "text-2xl sm:text-3xl"
      }`}
      title={value}
    >
      {value}
    </p>
  </div>
);

const RankedBars = ({ items }: { items: { label: string; count: number }[] }) => {
  const max = items[0]?.count || 1;
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <div className="space-y-2">
      {items.map((r) => {
        const pct = total ? Math.round((r.count / total) * 100) : 0;
        return (
          <div key={r.label} className="flex items-center gap-3">
            <span
              className="text-xs sm:text-sm font-body text-foreground w-32 sm:w-44 shrink-0 truncate"
              title={r.label}
            >
              {r.label}
            </span>
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden min-w-0">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-heading font-semibold text-foreground w-16 text-right shrink-0">
              {r.count} ({pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsTab;
