import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LogOut, FileText, BarChart3, Trash2, Eye, Calendar, Users, TrendingUp, Volume2, ImageIcon, Share2, Download,
} from "lucide-react";
import { toast } from "sonner";

interface QuoteRequest {
  id: string;
  naam: string;
  email: string;
  telefoon: string | null;
  locatie: string | null;
  dienst: string | null;
  beschrijving: string | null;
  schatting_project_type: string | null;
  schatting_min: number | null;
  schatting_max: number | null;
  audio_url: string | null;
  photo_urls: string[] | null;
  created_at: string;
}

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  topPages: { page: string; count: number }[];
  viewsByDay: { date: string; count: number }[];
}

interface SourceRow {
  gevonden_via: string | null;
  gevonden_detail: string | null;
  created_at: string;
  dienst: string;
  fact_naam: string | null;
  fact_voornaam: string | null;
  fact_email: string;
}

const SOURCE_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  aanbeveling: "Aanbeveling",
  doorverwijzing: "Doorverwijzing",
  voertuig: "Bedrijfsvoertuig",
  flyer: "Flyer / Folder",
  krant: "Krant / Magazine",
  radio: "Radio",
  tv: "TV",
  beurs: "Beurs / Event",
  anders: "Anders",
};

const labelFor = (v: string | null) => {
  if (!v) return "Onbekend";
  return SOURCE_LABELS[v.toLowerCase()] || v;
};

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"quotes" | "analytics" | "sources">("quotes");
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const sourcesReportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, tab]);

  const fetchData = async () => {
    setLoadingData(true);
    if (tab === "quotes") {
      const { data } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setQuotes((data as QuoteRequest[]) || []);
    } else if (tab === "analytics") {
      const { data: views } = await supabase.from("page_views").select("*");
      if (views) {
        const today = new Date().toISOString().split("T")[0];
        const todayViews = views.filter((v) => v.created_at.startsWith(today)).length;

        const pageCounts: Record<string, number> = {};
        const dayCounts: Record<string, number> = {};
        views.forEach((v) => {
          pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
          const day = v.created_at.split("T")[0];
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        const viewsByDay = Object.entries(dayCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14);

        setAnalytics({
          totalViews: views.length,
          todayViews,
          topPages,
          viewsByDay,
        });
      }
    } else if (tab === "sources") {
      const { data } = await supabase
        .from("appointments")
        .select("gevonden_via, gevonden_detail, created_at, dienst, fact_naam, fact_voornaam, fact_email")
        .order("created_at", { ascending: false });
      setSources((data as SourceRow[]) || []);
    }
    setLoadingData(false);
  };

  const exportSourcesCSV = () => {
    const headers = ["Datum", "Bron", "Detail", "Dienst", "Naam", "Email"];
    const rows = sources.map((s) => [
      new Date(s.created_at).toLocaleString("nl-BE"),
      labelFor(s.gevonden_via),
      s.gevonden_detail || "",
      s.dienst || "",
      `${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim(),
      s.fact_email || "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riory-bronnen-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV geëxporteerd.");
  };

  const exportSourcesPDF = async () => {
    if (!sourcesReportRef.current) return;
    try {
      toast.loading("PDF wordt voorbereid...", { id: "pdf-export" });
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(sourcesReportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Header
      pdf.setFontSize(16);
      pdf.text("Riory — Bronnen rapport", margin, 14);
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(new Date().toLocaleString("nl-BE"), margin, 19);
      pdf.setTextColor(0);

      let y = 24;
      let remainingH = imgH;
      let srcY = 0;
      const usableH = pageH - y - margin;

      if (imgH <= usableH) {
        pdf.addImage(imgData, "PNG", margin, y, imgW, imgH);
      } else {
        // Multi-page: slice the canvas
        const pxPerMm = canvas.width / imgW;
        while (remainingH > 0) {
          const sliceH = Math.min(usableH, remainingH);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceH * pxPerMm;
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0, srcY * pxPerMm, canvas.width, sliceH * pxPerMm,
            0, 0, canvas.width, sliceH * pxPerMm
          );
          pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, y, imgW, sliceH);
          remainingH -= sliceH;
          srcY += sliceH;
          if (remainingH > 0) {
            pdf.addPage();
            y = margin;
          }
        }
      }

      pdf.save(`riory-bronnen-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF geëxporteerd.", { id: "pdf-export" });
    } catch (e) {
      console.error(e);
      toast.error("PDF export mislukt.", { id: "pdf-export" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) {
      toast.error("Verwijderen mislukt.");
    } else {
      toast.success("Offerte verwijderd.");
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground font-body">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground">
          Riory Admin
        </h1>
        <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
          <LogOut className="w-4 h-4" />
          Uitloggen
        </Button>
      </header>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-4">
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "quotes" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setTab("quotes")}
          >
            <FileText className="w-4 h-4" />
            Offertes
          </Button>
          <Button
            variant={tab === "analytics" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setTab("analytics")}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            variant={tab === "sources" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setTab("sources")}
          >
            <Share2 className="w-4 h-4" />
            Bronnen
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-8">
        {loadingData ? (
          <p className="text-muted-foreground font-body">Laden...</p>
        ) : tab === "quotes" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              {quotes.length} offerte{quotes.length !== 1 ? "s" : ""} ontvangen
            </p>
            {quotes.length === 0 ? (
              <div className="bg-background rounded-xl p-8 border border-border text-center">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground font-body">Nog geen offertes ontvangen.</p>
              </div>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{q.naam}</h3>
                      <p className="text-sm text-muted-foreground font-body">{q.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-body">
                        {new Date(q.created_at).toLocaleDateString("nl-BE")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-body">
                    {q.telefoon && (
                      <div>
                        <span className="text-muted-foreground">Tel: </span>
                        <span className="text-foreground">{q.telefoon}</span>
                      </div>
                    )}
                    {q.locatie && (
                      <div>
                        <span className="text-muted-foreground">Locatie: </span>
                        <span className="text-foreground">{q.locatie}</span>
                      </div>
                    )}
                    {q.dienst && (
                      <div>
                        <span className="text-muted-foreground">Dienst: </span>
                        <span className="text-foreground">{q.dienst}</span>
                      </div>
                    )}
                  </div>

                  {q.beschrijving && (
                    <p className="text-sm text-foreground font-body mt-2 bg-muted p-3 rounded-lg">
                      {q.beschrijving}
                    </p>
                  )}

                  {q.schatting_project_type && (
                    <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <p className="text-xs font-heading font-semibold uppercase tracking-wider text-primary mb-1">
                        Kostenraming
                      </p>
                      <p className="text-sm font-body text-foreground">
                        {q.schatting_project_type} — €{q.schatting_min?.toLocaleString("nl-BE")} – €
                        {q.schatting_max?.toLocaleString("nl-BE")}
                      </p>
                    </div>
                  )}

                  {/* Audio attachment */}
                  {q.audio_url && (
                    <div className="mt-3 p-3 rounded-lg border border-border bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-primary" />
                        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                          Spraakbericht
                        </p>
                      </div>
                      <audio src={q.audio_url} controls className="w-full h-10" />
                    </div>
                  )}

                  {/* Photo attachments */}
                  {q.photo_urls && q.photo_urls.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg border border-border bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                          Foto's ({q.photo_urls.length})
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.photo_urls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all">
                            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : tab === "analytics" ? (
          /* Analytics Tab */
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm text-center">
                <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {analytics?.totalViews || 0}
                </p>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Totaal weergaven
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {analytics?.todayViews || 0}
                </p>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Vandaag
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {analytics?.topPages.length || 0}
                </p>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Pagina's
                </p>
              </div>
            </div>

            {/* Views by day */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Weergaven per dag (laatste 14 dagen)
              </h3>
              {analytics?.viewsByDay.length ? (
                <div className="space-y-2">
                  {analytics.viewsByDay.map((d) => (
                    <div key={d.date} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-body w-20 shrink-0">
                        {new Date(d.date).toLocaleDateString("nl-BE", { day: "numeric", month: "short" })}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              5,
                              (d.count / Math.max(...analytics.viewsByDay.map((v) => v.count))) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-heading font-semibold text-foreground w-8 text-right">
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-body">Nog geen data beschikbaar.</p>
              )}
            </div>

            {/* Top pages */}
            <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">Top pagina's</h3>
              {analytics?.topPages.length ? (
                <div className="space-y-2">
                  {analytics.topPages.map((p) => (
                    <div
                      key={p.page}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm font-body text-foreground">{p.page}</span>
                      <span className="text-sm font-heading font-semibold text-primary">
                        {p.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-body">Nog geen data beschikbaar.</p>
              )}
            </div>
          </div>
        ) : (
          /* Sources Tab */
          (() => {
            const counts: Record<string, number> = {};
            sources.forEach((s) => {
              const k = labelFor(s.gevonden_via);
              counts[k] = (counts[k] || 0) + 1;
            });
            const ranked = Object.entries(counts)
              .map(([label, count]) => ({ label, count }))
              .sort((a, b) => b.count - a.count);
            const total = sources.length;
            const max = ranked[0]?.count || 1;
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-heading font-semibold text-foreground">Hoe vinden klanten je?</h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Op basis van {total} afspra{total === 1 ? "ak" : "ken"}.
                    </p>
                  </div>
                  <Button size="sm" className="gap-2" onClick={exportSourcesCSV} disabled={total === 0}>
                    <Download className="w-4 h-4" />
                    Exporteer CSV
                  </Button>
                </div>

                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Verdeling per kanaal</h3>
                  {ranked.length ? (
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ranked}
                              dataKey="count"
                              nameKey="label"
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={90}
                              paddingAngle={2}
                              label={(e: any) => `${Math.round((e.count / total) * 100)}%`}
                              labelLine={false}
                            >
                              {ranked.map((_, i) => {
                                const palette = [
                                  "hsl(217 91% 60%)",   // blue
                                  "hsl(24 95% 53%)",    // orange
                                  "hsl(142 71% 45%)",   // green
                                  "hsl(346 77% 49%)",   // red
                                  "hsl(280 65% 60%)",   // purple
                                  "hsl(48 96% 53%)",    // yellow
                                  "hsl(189 94% 43%)",   // cyan
                                  "hsl(330 81% 60%)",   // pink
                                  "hsl(160 84% 39%)",   // teal
                                  "hsl(15 79% 35%)",    // brown
                                  "hsl(258 90% 66%)",   // violet
                                  "hsl(75 64% 45%)",    // lime
                                ];
                                return <Cell key={i} fill={palette[i % palette.length]} />;
                              })}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.5rem",
                                fontSize: "0.875rem",
                              }}
                              formatter={(v: number, n: string) => [`${v} (${Math.round((v / total) * 100)}%)`, n]}
                            />
                            <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {ranked.map((r) => {
                          const pct = total ? Math.round((r.count / total) * 100) : 0;
                          return (
                            <div key={r.label} className="flex items-center gap-3">
                              <span className="text-sm font-body text-foreground w-32 sm:w-40 shrink-0 truncate">
                                {r.label}
                              </span>
                              <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full transition-all"
                                  style={{ width: `${Math.max(5, (r.count / max) * 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-heading font-semibold text-foreground w-20 text-right">
                                {r.count} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Nog geen data beschikbaar.</p>
                  )}
                </div>

                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Recente afspraken</h3>
                  {sources.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-body">
                        <thead>
                          <tr className="text-left text-muted-foreground border-b border-border">
                            <th className="py-2 pr-3">Datum</th>
                            <th className="py-2 pr-3">Bron</th>
                            <th className="py-2 pr-3">Detail</th>
                            <th className="py-2 pr-3">Dienst</th>
                            <th className="py-2 pr-3">Klant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sources.slice(0, 50).map((s, i) => (
                            <tr key={i} className="border-b border-border last:border-0">
                              <td className="py-2 pr-3 text-foreground whitespace-nowrap">
                                {new Date(s.created_at).toLocaleDateString("nl-BE")}
                              </td>
                              <td className="py-2 pr-3 text-foreground">{labelFor(s.gevonden_via)}</td>
                              <td className="py-2 pr-3 text-muted-foreground">{s.gevonden_detail || "—"}</td>
                              <td className="py-2 pr-3 text-muted-foreground">{s.dienst}</td>
                              <td className="py-2 pr-3 text-muted-foreground">
                                {`${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim() || s.fact_email}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Nog geen afspraken.</p>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default Admin;
