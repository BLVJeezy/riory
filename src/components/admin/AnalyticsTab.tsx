import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";

interface BreakdownItem {
  label: string;
  count: number;
}

interface Snapshot {
  id: string;
  snapshot_date: string;
  visitors: number;
  pageviews: number;
  bounce_rate: number | null;
  avg_duration_seconds: number | null;
  top_pages: BreakdownItem[];
  sources: BreakdownItem[];
  devices: BreakdownItem[];
  countries: BreakdownItem[];
  notes: string | null;
}

const RANGE_OPTIONS = [
  { value: 7, label: "Laatste 7 dagen" },
  { value: 30, label: "Laatste 30 dagen" },
  { value: 90, label: "Laatste 90 dagen" },
  { value: 365, label: "Laatste 12 maanden" },
  { value: 0, label: "Alles" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const parseBreakdown = (raw: string): BreakdownItem[] => {
  // Each line: "label, number" or "label number" or "label\tnumber"
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.*?)[\s,;\t]+(\d[\d\.\s]*)\s*$/);
      if (!m) return null;
      const label = m[1].trim();
      const count = parseInt(m[2].replace(/[^\d]/g, ""), 10);
      if (!label || isNaN(count)) return null;
      return { label, count };
    })
    .filter((x): x is BreakdownItem => !!x);
};

const formatBreakdown = (items: BreakdownItem[]) =>
  items.map((i) => `${i.label}, ${i.count}`).join("\n");

const formatDuration = (sec: number | null): string => {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
};

const AnalyticsTab = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Snapshot | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("analytics_snapshots")
      .select("*")
      .order("snapshot_date", { ascending: false });
    if (error) {
      toast.error("Kon snapshots niet laden.");
    } else {
      setSnapshots((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (days === 0) return snapshots;
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - days);
    return snapshots.filter((s) => new Date(s.snapshot_date) >= since);
  }, [snapshots, days]);

  const totals = useMemo(() => {
    const totalVisitors = filtered.reduce((s, x) => s + (x.visitors || 0), 0);
    const totalPageviews = filtered.reduce((s, x) => s + (x.pageviews || 0), 0);
    const bounceVals = filtered
      .map((x) => x.bounce_rate)
      .filter((v): v is number => v != null);
    const avgBounce = bounceVals.length
      ? bounceVals.reduce((a, b) => a + b, 0) / bounceVals.length
      : null;
    const durVals = filtered
      .map((x) => x.avg_duration_seconds)
      .filter((v): v is number => v != null);
    const avgDur = durVals.length
      ? Math.round(durVals.reduce((a, b) => a + b, 0) / durVals.length)
      : null;
    return { totalVisitors, totalPageviews, avgBounce, avgDur };
  }, [filtered]);

  const chartData = useMemo(() => {
    return [...filtered]
      .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
      .map((s) => ({
        date: new Date(s.snapshot_date).toLocaleDateString("nl-BE", {
          day: "2-digit",
          month: "short",
        }),
        Bezoekers: s.visitors,
        Pageviews: s.pageviews,
      }));
  }, [filtered]);

  const handleDelete = async (id: string) => {
    if (!confirm("Snapshot verwijderen?")) return;
    const { error } = await supabase
      .from("analytics_snapshots")
      .delete()
      .eq("id", id);
    if (error) return toast.error("Verwijderen mislukt.");
    toast.success("Verwijderd.");
    load();
  };

  const exportCSV = () => {
    const headers = [
      "Datum",
      "Bezoekers",
      "Pageviews",
      "Bounce %",
      "Sessieduur (s)",
      "Notities",
    ];
    const rows = filtered.map((s) => [
      s.snapshot_date,
      s.visitors,
      s.pageviews,
      s.bounce_rate ?? "",
      s.avg_duration_seconds ?? "",
      (s.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riory-analytics-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV geëxporteerd.");
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (s: Snapshot) => {
    setEditing(s);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading font-semibold text-foreground">
            Lovable Analytics — manuele snapshots
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Voeg per dag de cijfers in die je in Lovable Analytics ziet. Zo bouw je een
            historiek op die 100% identiek is aan de bron.
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
            disabled={!filtered.length}
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button size="sm" className="gap-2" onClick={openNew}>
            <Plus className="w-4 h-4" />
            Nieuwe snapshot
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Laden...</p>
      ) : snapshots.length === 0 ? (
        <div className="bg-background rounded-xl p-8 border border-dashed border-border text-center space-y-3">
          <p className="font-heading font-semibold text-foreground">
            Nog geen snapshots
          </p>
          <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
            Open Lovable Analytics, kies een datum en kopieer de cijfers naar een
            nieuwe snapshot. Doe dit elke dag voor een volledige historiek.
          </p>
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Eerste snapshot toevoegen
          </Button>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <KPI
              label={`Bezoekers (${filtered.length} dag${filtered.length === 1 ? "" : "en"})`}
              value={totals.totalVisitors.toLocaleString("nl-BE")}
            />
            <KPI
              label="Pageviews"
              value={totals.totalPageviews.toLocaleString("nl-BE")}
            />
            <KPI
              label="Gem. bounce"
              value={totals.avgBounce != null ? `${totals.avgBounce.toFixed(1)}%` : "—"}
            />
            <KPI
              label="Gem. sessieduur"
              value={formatDuration(totals.avgDur)}
            />
          </div>

          {/* Trend chart */}
          {chartData.length > 1 && (
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Verkeer per dag
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
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
                    <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                    <Line
                      type="monotone"
                      dataKey="Bezoekers"
                      stroke="hsl(217 91% 60%)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Pageviews"
                      stroke="hsl(24 95% 53%)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Snapshot list */}
          <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Snapshots
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-3">Datum</th>
                    <th className="py-2 pr-3 text-right">Bezoekers</th>
                    <th className="py-2 pr-3 text-right">Pageviews</th>
                    <th className="py-2 pr-3 text-right">Bounce</th>
                    <th className="py-2 pr-3 text-right">Duur</th>
                    <th className="py-2 pr-3">Top bron</th>
                    <th className="py-2 pr-3 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const topSource = s.sources?.[0]?.label || "—";
                    return (
                      <tr key={s.id} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3 text-foreground whitespace-nowrap">
                          {new Date(s.snapshot_date).toLocaleDateString("nl-BE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-2 pr-3 text-right text-foreground">
                          {s.visitors.toLocaleString("nl-BE")}
                        </td>
                        <td className="py-2 pr-3 text-right text-foreground">
                          {s.pageviews.toLocaleString("nl-BE")}
                        </td>
                        <td className="py-2 pr-3 text-right text-muted-foreground">
                          {s.bounce_rate != null ? `${s.bounce_rate}%` : "—"}
                        </td>
                        <td className="py-2 pr-3 text-right text-muted-foreground">
                          {formatDuration(s.avg_duration_seconds)}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground truncate max-w-[160px]">
                          {topSource}
                        </td>
                        <td className="py-2 pr-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEdit(s)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(s.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-muted-foreground"
                      >
                        Geen snapshots in deze periode.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <SnapshotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        existingDates={snapshots.map((s) => s.snapshot_date)}
        onSaved={load}
      />
    </div>
  );
};

const KPI = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
    <p className="text-xs sm:text-sm font-body text-muted-foreground">{label}</p>
    <p
      className="font-heading font-bold text-foreground mt-1 text-2xl sm:text-3xl truncate"
      title={value}
    >
      {value}
    </p>
  </div>
);

interface DialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Snapshot | null;
  existingDates: string[];
  onSaved: () => void;
}

const SnapshotDialog = ({
  open,
  onOpenChange,
  editing,
  existingDates,
  onSaved,
}: DialogProps) => {
  const [date, setDate] = useState(todayISO());
  const [visitors, setVisitors] = useState("");
  const [pageviews, setPageviews] = useState("");
  const [bounce, setBounce] = useState("");
  const [duration, setDuration] = useState("");
  const [topPages, setTopPages] = useState("");
  const [sources, setSources] = useState("");
  const [devices, setDevices] = useState("");
  const [countries, setCountries] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDate(editing.snapshot_date);
      setVisitors(String(editing.visitors));
      setPageviews(String(editing.pageviews));
      setBounce(editing.bounce_rate != null ? String(editing.bounce_rate) : "");
      setDuration(
        editing.avg_duration_seconds != null
          ? String(editing.avg_duration_seconds)
          : ""
      );
      setTopPages(formatBreakdown(editing.top_pages || []));
      setSources(formatBreakdown(editing.sources || []));
      setDevices(formatBreakdown(editing.devices || []));
      setCountries(formatBreakdown(editing.countries || []));
      setNotes(editing.notes || "");
    } else {
      setDate(todayISO());
      setVisitors("");
      setPageviews("");
      setBounce("");
      setDuration("");
      setTopPages("");
      setSources("");
      setDevices("");
      setCountries("");
      setNotes("");
    }
  }, [open, editing]);

  const handleSave = async () => {
    if (!date) return toast.error("Datum is verplicht.");
    if (!editing && existingDates.includes(date)) {
      return toast.error(
        "Er bestaat al een snapshot voor deze datum. Bewerk die in plaats van een nieuwe te maken."
      );
    }
    const v = parseInt(visitors, 10);
    const p = parseInt(pageviews, 10);
    if (isNaN(v) || isNaN(p)) {
      return toast.error("Bezoekers en pageviews moeten getallen zijn.");
    }
    setSaving(true);
    const payload = {
      snapshot_date: date,
      visitors: v,
      pageviews: p,
      bounce_rate: bounce ? Number(bounce) : null,
      avg_duration_seconds: duration ? parseInt(duration, 10) : null,
      top_pages: parseBreakdown(topPages),
      sources: parseBreakdown(sources),
      devices: parseBreakdown(devices),
      countries: parseBreakdown(countries),
      notes: notes.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing
      ? await supabase
          .from("analytics_snapshots")
          .update(payload)
          .eq("id", editing.id)
      : await supabase.from("analytics_snapshots").insert(payload);
    setSaving(false);
    if (error) {
      console.error(error);
      return toast.error("Opslaan mislukt: " + error.message);
    }
    toast.success(editing ? "Snapshot bijgewerkt." : "Snapshot toegevoegd.");
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Snapshot bewerken" : "Nieuwe snapshot"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!!editing}
              />
            </div>
            <div>
              <Label htmlFor="visitors">Bezoekers</Label>
              <Input
                id="visitors"
                type="number"
                value={visitors}
                onChange={(e) => setVisitors(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="pageviews">Pageviews</Label>
              <Input
                id="pageviews"
                type="number"
                value={pageviews}
                onChange={(e) => setPageviews(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="bounce">Bounce %</Label>
              <Input
                id="bounce"
                type="number"
                step="0.1"
                value={bounce}
                onChange={(e) => setBounce(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="duration">Sessieduur (sec)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Tip: kopieer voor onderstaande velden de lijst zoals die in Lovable
            Analytics staat. Eén regel per item, formaat: <code>label, getal</code>
          </p>

          <BreakdownField
            label="Top pagina's"
            value={topPages}
            onChange={setTopPages}
            placeholder="/, 450&#10;/diensten, 230&#10;/afspraak, 180"
          />
          <BreakdownField
            label="Verkeersbronnen"
            value={sources}
            onChange={setSources}
            placeholder="Google, 320&#10;Direct, 180&#10;Facebook, 90"
          />
          <BreakdownField
            label="Apparaten"
            value={devices}
            onChange={setDevices}
            placeholder="Mobile, 420&#10;Desktop, 280&#10;Tablet, 60"
          />
          <BreakdownField
            label="Landen"
            value={countries}
            onChange={setCountries}
            placeholder="België, 580&#10;Nederland, 90&#10;Frankrijk, 30"
          />

          <div>
            <Label htmlFor="notes">Notities (optioneel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Bijv. campagne live, promo verstuurd, ..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Opslaan..." : "Opslaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BreakdownField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div>
    <Label>{label}</Label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      placeholder={placeholder}
      className="font-mono text-xs"
    />
  </div>
);

export default AnalyticsTab;
