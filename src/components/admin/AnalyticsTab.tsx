import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

type Bucket = { label: string; count: number };

interface SnapshotRow {
  snapshot_date: string;
  pageviews: number;
  visitors: number;
  bounce_rate: number | null;
  avg_duration_seconds: number | null;
  top_pages: Bucket[];
  sources: Bucket[];
  devices: Bucket[];
  countries: Bucket[];
  updated_at: string;
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

const formatDay = (d: Date) =>
  d.toLocaleDateString("nl-BE", { day: "2-digit", month: "short" });

const timeAgo = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "zojuist";
  if (diff < 3600) return `${Math.floor(diff / 60)} min geleden`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} uur geleden`;
  return `${Math.floor(diff / 86400)} dagen geleden`;
};

const AnalyticsTab = () => {
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("analytics_snapshots")
      .select(
        "snapshot_date, pageviews, visitors, bounce_rate, avg_duration_seconds, top_pages, sources, devices, countries, updated_at"
      )
      .gte("snapshot_date", since.toISOString().slice(0, 10))
      .order("snapshot_date", { ascending: true });
    if (error) {
      toast.error("Kon analytics niet laden.");
      setLoading(false);
      return;
    }
    const rows = (data || []) as unknown as SnapshotRow[];
    setSnapshots(rows);
    const latest = rows.reduce<string | null>(
      (acc, r) => (!acc || r.updated_at > acc ? r.updated_at : acc),
      null
    );
    setLastSync(latest);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const sync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-analytics", {
        body: { days: 365 },
      });
      if (error) throw error;
      toast.success(
        `Gesynchroniseerd: ${data?.days_synced ?? 0} dagen, ${data?.rows_processed ?? 0} bezoeken.`
      );
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync mislukt.");
    } finally {
      setSyncing(false);
    }
  };

  const stats = useMemo(() => {
    const totalViews = snapshots.reduce((s, r) => s + (r.pageviews || 0), 0);
    const totalVisitors = snapshots.reduce((s, r) => s + (r.visitors || 0), 0);
    const viewsPerVisitor =
      totalVisitors > 0 ? (totalViews / totalVisitors).toFixed(1) : "0";

    const weighted = snapshots.reduce(
      (acc, r) => {
        if (r.bounce_rate != null && r.visitors > 0) {
          acc.sum += r.bounce_rate * r.visitors;
          acc.w += r.visitors;
        }
        return acc;
      },
      { sum: 0, w: 0 }
    );
    const bounceRate = weighted.w > 0 ? Math.round((weighted.sum / weighted.w) * 100) : 0;

    // Build daily buckets with zero-fill
    const dayMap = new Map<string, { Bezoeken: number; Bezoekers: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      dayMap.set(d.toISOString().slice(0, 10), { Bezoeken: 0, Bezoekers: 0 });
    }
    snapshots.forEach((r) => {
      if (dayMap.has(r.snapshot_date)) {
        dayMap.set(r.snapshot_date, {
          Bezoeken: r.pageviews,
          Bezoekers: r.visitors,
        });
      }
    });
    const daily = Array.from(dayMap.entries()).map(([date, v]) => ({
      date: formatDay(new Date(date)),
      ...v,
    }));

    const merge = (key: keyof SnapshotRow, n: number) => {
      const map: Record<string, number> = {};
      snapshots.forEach((r) => {
        const arr = (r[key] as Bucket[]) || [];
        arr.forEach((b) => {
          map[b.label] = (map[b.label] || 0) + b.count;
        });
      });
      return Object.entries(map)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
    };

    return {
      totalViews,
      totalVisitors,
      viewsPerVisitor,
      bounceRate,
      daily,
      topPages: merge("top_pages", 10),
      sources: merge("sources", 8),
      devices: merge("devices", 10),
    };
  }, [snapshots, days]);

  const exportCSV = () => {
    const headers = ["Datum", "Bezoeken", "Bezoekers"];
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
            {lastSync
              ? `Laatst gesynct: ${timeAgo(lastSync)}`
              : "Nog niet gesynchroniseerd. Klik op 'Sync nu'."}
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
          <Button size="sm" className="gap-2" onClick={sync} disabled={syncing}>
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchroniseren..." : "Sync nu"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Laden...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <KPI label="Pageviews" value={stats.totalViews.toLocaleString("nl-BE")} />
            <KPI label="Unieke bezoekers" value={stats.totalVisitors.toLocaleString("nl-BE")} />
            <KPI label="Pagina's per bezoeker" value={stats.viewsPerVisitor} />
            <KPI label="Bounce rate" value={`${stats.bounceRate}%`} />
          </div>

          <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Verkeer per dag
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Line type="monotone" dataKey="Bezoeken" stroke="hsl(217 91% 60%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Bezoekers" stroke="hsl(24 95% 53%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">Top pagina's</h3>
              {stats.topPages.length ? (
                <RankedBars items={stats.topPages} />
              ) : (
                <p className="text-sm text-muted-foreground font-body">Geen data.</p>
              )}
            </div>

            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">Verkeersbronnen</h3>
              {stats.sources.length ? (
                <RankedBars items={stats.sources} />
              ) : (
                <p className="text-sm text-muted-foreground font-body">Geen data.</p>
              )}
            </div>

            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm lg:col-span-2">
              <h3 className="font-heading font-semibold text-foreground mb-4">Apparaten</h3>
              <div className="h-56">
                {stats.devices.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.devices}
                        dataKey="count"
                        nameKey="label"
                        innerRadius="45%"
                        outerRadius="78%"
                        paddingAngle={2}
                        label={(e: { label?: string; count?: number }) =>
                          `${e.label} ${Math.round(((e.count || 0) / Math.max(stats.totalViews, 1)) * 100)}%`
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
                ) : (
                  <p className="text-sm text-muted-foreground font-body">Geen data.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const KPI = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
    <p className="text-xs sm:text-sm font-body text-muted-foreground">{label}</p>
    <p className="font-heading font-bold text-foreground mt-1 truncate text-2xl sm:text-3xl" title={value}>
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
