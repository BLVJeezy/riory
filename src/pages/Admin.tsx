import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Share2, Download } from "lucide-react";
import { toast } from "sonner";



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
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [loadingData, setLoadingData] = useState(true);
  const sourcesReportRef = useRef<HTMLDivElement>(null);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    sources.forEach((s) => {
      const d = new Date(s.created_at);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return Array.from(set).sort().reverse();
  }, [sources]);

  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    sources.forEach((s) => set.add((s.gevonden_via || "onbekend").toLowerCase()));
    return Array.from(set).sort();
  }, [sources]);

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      if (monthFilter !== "all") {
        const d = new Date(s.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (key !== monthFilter) return false;
      }
      if (sourceFilter !== "all") {
        const v = (s.gevonden_via || "onbekend").toLowerCase();
        if (v !== sourceFilter) return false;
      }
      return true;
    });
  }, [sources, monthFilter, sourceFilter]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("appointments")
      .select("gevonden_via, gevonden_detail, created_at, dienst, fact_naam, fact_voornaam, fact_email")
      .order("created_at", { ascending: false });
    setSources((data as SourceRow[]) || []);
    setLoadingData(false);
  };

  const exportSourcesCSV = () => {
    const headers = ["Datum", "Bron", "Detail", "Dienst", "Naam", "Email"];
    const rows = filteredSources.map((s) => [
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
    if (filteredSources.length === 0) return;
    try {
      toast.loading("PDF wordt voorbereid...", { id: "pdf-export" });
      const [{ default: html2canvas }, { default: jsPDF }, autoTableMod] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = (autoTableMod as any).default || (autoTableMod as any);

      // Build aggregated data
      const counts: Record<string, number> = {};
      filteredSources.forEach((s) => {
        const k = labelFor(s.gevonden_via);
        counts[k] = (counts[k] || 0) + 1;
      });
      const ranked = Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
      const total = filteredSources.length;

      // PDF setup
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentW = pageW - margin * 2;

      const drawHeader = () => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(20);
        pdf.text("RIORY", margin, margin + 2);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(120);
        pdf.text("Bronnen rapport", margin, margin + 7);
        pdf.text(
          new Date().toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" }),
          pageW - margin,
          margin + 7,
          { align: "right" }
        );
        pdf.setDrawColor(220);
        pdf.setLineWidth(0.3);
        pdf.line(margin, margin + 10, pageW - margin, margin + 10);
        pdf.setTextColor(0);
      };

      const drawFooter = () => {
        const total = (pdf as any).internal.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
          pdf.setPage(i);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(140);
          pdf.text("riory.be", margin, pageH - 8);
          pdf.text(`Pagina ${i} / ${total}`, pageW - margin, pageH - 8, { align: "right" });
          pdf.setTextColor(0);
        }
      };

      drawHeader();
      let y = margin + 18;

      // Summary
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Hoe vinden klanten je?", margin, y);
      y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(110);
      pdf.text(`Op basis van ${total} afspraak${total === 1 ? "" : "ken"}.`, margin, y);
      pdf.setTextColor(0);
      y += 8;

      // Capture only the chart
      const chartEl = document.querySelector<HTMLDivElement>("[data-pdf-chart]");
      // Auto-size chart so chart + legend rows always fit beside each other
      const rowH = 6.5;
      const minChart = 55;
      const maxChart = 80;
      const desiredChartH = Math.max(minChart, Math.min(maxChart, ranked.length * rowH + 6));

      if (chartEl) {
        const chartCanvas = await html2canvas(chartEl, {
          backgroundColor: "#ffffff",
          scale: 3,
          useCORS: true,
        });
        const aspect = chartCanvas.width / chartCanvas.height;
        let chartH = desiredChartH;
        let chartW = chartH * aspect;
        // Ensure chart doesn't overpower legend (max 45% of content width)
        const maxChartW = contentW * 0.45;
        if (chartW > maxChartW) {
          chartW = maxChartW;
          chartH = chartW / aspect;
        }
        pdf.addImage(chartCanvas.toDataURL("image/png"), "PNG", margin, y, chartW, chartH);

        // Legend / bars next to chart
        const legendX = margin + chartW + 8;
        const legendW = contentW - chartW - 8;
        const palette = [
          [59, 130, 246], [249, 115, 22], [34, 197, 94], [239, 68, 68],
          [168, 85, 247], [234, 179, 8], [6, 182, 212], [236, 72, 153],
          [20, 184, 166], [120, 53, 15], [139, 92, 246], [132, 204, 22],
        ];
        const max = ranked[0]?.count || 1;
        // Center legend rows vertically next to chart
        const totalLegendH = ranked.length * rowH;
        let ly = y + Math.max(0, (chartH - totalLegendH) / 2);
        ranked.forEach((r, i) => {
          const [rC, gC, bC] = palette[i % palette.length];
          pdf.setFillColor(rC, gC, bC);
          pdf.circle(legendX + 1.6, ly + 1.8, 1.6, "F");
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(40);
          const pct = total ? Math.round((r.count / total) * 100) : 0;
          pdf.text(r.label, legendX + 5.5, ly + 2.6);
          pdf.text(`${r.count} (${pct}%)`, legendX + legendW, ly + 2.6, { align: "right" });
          pdf.setFillColor(238, 238, 238);
          pdf.rect(legendX + 5.5, ly + 3.8, legendW - 5.5, 1.2, "F");
          pdf.setFillColor(rC, gC, bC);
          pdf.rect(legendX + 5.5, ly + 3.8, Math.max(2, ((legendW - 5.5) * r.count) / max), 1.2, "F");
          ly += rowH;
        });
        y += Math.max(chartH, totalLegendH) + 10;
      }

      // Table of recent appointments — single line per row, ellipsis on overflow
      autoTable(pdf, {
        startY: y,
        head: [["Datum", "Bron", "Detail", "Dienst", "Klant", "Email"]],
        body: filteredSources.map((s) => [
          new Date(s.created_at).toLocaleDateString("nl-BE"),
          labelFor(s.gevonden_via),
          s.gevonden_detail || "—",
          s.dienst || "",
          `${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim() || "—",
          s.fact_email || "",
        ]),
        margin: { left: margin, right: margin, top: margin + 14, bottom: 14 },
        styles: {
          fontSize: 8,
          cellPadding: { top: 1.8, right: 2, bottom: 1.8, left: 2 },
          overflow: "ellipsize",
          textColor: 40,
          valign: "middle",
        },
        headStyles: {
          fillColor: [25, 25, 25],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8.5,
          overflow: "ellipsize",
        },
        alternateRowStyles: { fillColor: [248, 248, 248] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 22 },
          2: { cellWidth: 28 },
          3: { cellWidth: 36 },
          4: { cellWidth: 32, overflow: "ellipsize" },
          5: { cellWidth: "auto", overflow: "ellipsize" },
        },
        didDrawPage: () => {
          drawHeader();
        },
      });

      drawFooter();
      pdf.save(`riory-bronnen-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF geëxporteerd.", { id: "pdf-export" });
    } catch (e) {
      console.error(e);
      toast.error("PDF export mislukt.", { id: "pdf-export" });
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


      {/* Content */}
      <div className="px-4 sm:px-6 pb-8">
        {loadingData ? (
          <p className="text-muted-foreground font-body">Laden...</p>
        ) : (
          /* Sources Tab */
          (() => {
            const counts: Record<string, number> = {};
            filteredSources.forEach((s) => {
              const k = labelFor(s.gevonden_via);
              counts[k] = (counts[k] || 0) + 1;
            });
            const ranked = Object.entries(counts)
              .map(([label, count]) => ({ label, count }))
              .sort((a, b) => b.count - a.count);
            const total = filteredSources.length;
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
                  <div className="flex flex-wrap gap-2 items-center">
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm font-body text-foreground"
                    >
                      <option value="all">Alle maanden</option>
                      {monthOptions.map((m) => {
                        const [y, mo] = m.split("-");
                        const label = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString("nl-BE", { month: "long", year: "numeric" });
                        return <option key={m} value={m}>{label}</option>;
                      })}
                    </select>
                    <Button size="sm" variant="outline" className="gap-2" onClick={exportSourcesCSV} disabled={total === 0}>
                      <Download className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button size="sm" className="gap-2" onClick={exportSourcesPDF} disabled={total === 0}>
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div ref={sourcesReportRef} className="space-y-6 bg-background">
                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Verdeling per kanaal</h3>
                  {ranked.length ? (
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
                      <div className="h-56 sm:h-64 w-full" data-pdf-chart>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ranked}
                              dataKey="count"
                              nameKey="label"
                              cx="50%"
                              cy="50%"
                              innerRadius="40%"
                              outerRadius="78%"
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
                                fontSize: "0.75rem",
                              }}
                              formatter={(v: number, n: string) => [`${v} (${Math.round((v / total) * 100)}%)`, n]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {ranked.map((r) => {
                          const pct = total ? Math.round((r.count / total) * 100) : 0;
                          return (
                            <div key={r.label} className="flex items-center gap-2 sm:gap-3">
                              <span className="text-xs sm:text-sm font-body text-foreground w-20 sm:w-40 shrink-0 truncate">
                                {r.label}
                              </span>
                              <div className="flex-1 bg-muted rounded-full h-4 sm:h-5 overflow-hidden min-w-0">
                                <div
                                  className="bg-primary h-full rounded-full transition-all"
                                  style={{ width: `${Math.max(5, (r.count / max) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs sm:text-sm font-heading font-semibold text-foreground w-14 sm:w-20 text-right shrink-0">
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
                  {filteredSources.length ? (
                    <>
                      {/* Mobile: card list */}
                      <div className="space-y-3 sm:hidden">
                        {filteredSources.slice(0, 50).map((s, i) => {
                          const klant = `${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim() || s.fact_email;
                          return (
                            <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground font-body">
                                  {new Date(s.created_at).toLocaleDateString("nl-BE")}
                                </span>
                                <span className="text-xs font-heading font-semibold text-primary truncate">
                                  {labelFor(s.gevonden_via)}
                                </span>
                              </div>
                              <p className="text-sm font-body text-foreground truncate">{klant}</p>
                              <p className="text-xs text-muted-foreground font-body truncate">{s.dienst}</p>
                              {s.gevonden_detail && (
                                <p className="text-xs text-muted-foreground font-body italic truncate">
                                  {s.gevonden_detail}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {/* Desktop: table */}
                      <div className="hidden sm:block overflow-x-auto">
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
                            {filteredSources.slice(0, 50).map((s, i) => (
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
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Nog geen afspraken.</p>
                  )}
                </div>
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
