import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Share2, Download, BarChart3 } from "lucide-react";
import { toast } from "sonner";



interface SourceRow {
  id?: string;
  gevonden_via: string | null;
  gevonden_detail: string | null;
  created_at: string;
  dienst: string;
  klant_type?: string | null;
  urgent?: boolean | null;
  beschrijving?: string | null;
  woning_ouder_dan_10_jaar?: boolean | null;
  akkoord_voorwaarden?: boolean | null;
  fact_naam: string | null;
  fact_voornaam: string | null;
  fact_email: string;
  fact_telefoon?: string | null;
  fact_straat?: string | null;
  fact_huisnummer?: string | null;
  fact_postcode?: string | null;
  fact_plaats: string | null;
  fact_bedrijfsnaam?: string | null;
  fact_btw_nummer?: string | null;
  fact_kbo_nummer?: string | null;
  fact_facturatie_email?: string | null;
  werf_straat?: string | null;
  werf_huisnummer?: string | null;
  werf_postcode?: string | null;
  werf_plaats: string | null;
  werf_contactpersoon?: string | null;
  werf_telefoon?: string | null;
  werf_projectnaam?: string | null;
  werfadres_is_facturatieadres?: boolean | null;
  syndicus_kantoor?: string | null;
  syndicus_naam?: string | null;
  syndicus_voornaam?: string | null;
  syndicus_email?: string | null;
  syndicus_telefoon?: string | null;
  syndicus_straat?: string | null;
  syndicus_huisnummer?: string | null;
  syndicus_postcode?: string | null;
  syndicus_plaats?: string | null;
  syndicus_naam_vme?: string | null;
  syndicus_kbo_nummer?: string | null;
  syndicus_facturatie_email?: string | null;
  lead_bron: string | null;
  lead_bron_prijs: string | null;
  calculator_session_id: string | null;
}


interface CalcSessionRow {
  session_id: string;
  step: number;
  service: string | null;
  price_eur: number | null;
  plaats: string | null;
  created_at: string;
}

interface PhoneClickRow {
  id: string;
  created_at: string;
  phone: string;
  cta_label: string | null;
  page_url: string | null;
  visitor_id: string | null;
  device: string | null;
  referrer: string | null;
}



const CALC_STEP_LABELS = [
  "Calculator geopend",
  "Adres ingevuld",
  "Dienst gekozen",
  "Prijs bekeken",
];


const regioFor = (s: { werf_plaats: string | null; fact_plaats: string | null }) => {
  const raw = (s.werf_plaats || s.fact_plaats || "").trim();
  if (!raw) return "Onbekend";
  // Normalize: capitalize first letter of each word
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

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
  const [apptDatePreset, setApptDatePreset] = useState<string>("today");
  const [apptCustomFrom, setApptCustomFrom] = useState<string>("");
  const [apptCustomTo, setApptCustomTo] = useState<string>("");

  const getApptDateRange = (preset: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    switch (preset) {
      case "today": return { from: today, to: tomorrow };
      case "48h": { const f = new Date(now); f.setHours(f.getHours() - 48); return { from: f, to: now }; }
      case "week": { const f = new Date(today); f.setDate(f.getDate() - 7); return { from: f, to: tomorrow }; }
      case "month": { const f = new Date(today); f.setMonth(f.getMonth() - 1); return { from: f, to: tomorrow }; }
      case "3months": { const f = new Date(today); f.setMonth(f.getMonth() - 3); return { from: f, to: tomorrow }; }
      case "all": return { from: null, to: null };
      default: return {
        from: apptCustomFrom ? new Date(apptCustomFrom) : null,
        to: apptCustomTo ? new Date(new Date(apptCustomTo).setDate(new Date(apptCustomTo).getDate() + 1)) : null,
      };
    }
  };

  // Placeholder — echte filtering staat verder (filteredSources) zodat maand- en
  // bronfilter samen met de datumfilter op ALLE data toegepast worden.

  const [showCustom, setShowCustom] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [showAllRegios, setShowAllRegios] = useState(false);
  const [calcSessions, setCalcSessions] = useState<CalcSessionRow[]>([]);
  const [showAllDropoffs, setShowAllDropoffs] = useState(false);
  const [phoneClicks, setPhoneClicks] = useState<PhoneClickRow[]>([]);
  const [showAllPhoneClicks, setShowAllPhoneClicks] = useState(false);
  const [showAllPhoneLabels, setShowAllPhoneLabels] = useState(false);

  // Eén gedeelde filter (datum + maand) die op ALLE data wordt toegepast.
  const activeRange = useMemo(() => {
    let { from, to } = getApptDateRange(apptDatePreset);
    if (monthFilter !== "all") {
      const [y, m] = monthFilter.split("-").map(Number);
      const mFrom = new Date(y, m - 1, 1);
      const mTo = new Date(y, m, 1);
      from = from && from > mFrom ? from : mFrom;
      to = to && to < mTo ? to : mTo;
    }
    return { from, to };
  }, [apptDatePreset, apptCustomFrom, apptCustomTo, monthFilter]);

  const inActiveRange = (date: string) => {
    const d = new Date(date);
    if (activeRange.from && d < activeRange.from) return false;
    if (activeRange.to && d >= activeRange.to) return false;
    return true;
  };

  const filteredPhoneClicks = useMemo(
    () => phoneClicks.filter((c) => inActiveRange(c.created_at)),
    [phoneClicks, activeRange],
  );

  const phoneStats = useMemo(() => {
    const now = Date.now();
    const inLast = (d: string, days: number) =>
      now - new Date(d).getTime() <= days * 864e5;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const counts: Record<string, number> = {};
    filteredPhoneClicks.forEach((c) => {
      const k = c.cta_label || "belknop";
      counts[k] = (counts[k] || 0) + 1;
    });
    const ranked = Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
    return {
      total: filteredPhoneClicks.length,
      today: filteredPhoneClicks.filter((c) => new Date(c.created_at) >= startToday).length,
      week: filteredPhoneClicks.filter((c) => inLast(c.created_at, 7)).length,
      month: filteredPhoneClicks.filter((c) => inLast(c.created_at, 30)).length,
      ranked,
      maxCount: ranked[0]?.count || 1,
    };
  }, [filteredPhoneClicks]);


  const getDateRange = (preset: string): { from: Date | null; to: Date | null } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    switch (preset) {
      case "today": return { from: today, to: tomorrow };
      case "48h": { const f = new Date(now); f.setHours(f.getHours() - 48); return { from: f, to: now }; }
      case "week": { const f = new Date(today); f.setDate(f.getDate() - 7); return { from: f, to: tomorrow }; }
      case "month": { const f = new Date(today); f.setMonth(f.getMonth() - 1); return { from: f, to: tomorrow }; }
      case "3months": { const f = new Date(today); f.setMonth(f.getMonth() - 3); return { from: f, to: tomorrow }; }
      case "all": return { from: null, to: null };
      case "custom": return {
        from: apptCustomFrom ? new Date(apptCustomFrom) : null,
        to: apptCustomTo ? new Date(new Date(apptCustomTo).setDate(new Date(apptCustomTo).getDate() + 1)) : null,
      };
      default: return { from: null, to: null };
    }
  };
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

  const calculatorStats = useMemo(() => {
    const viaCalculator = filteredSources.filter((s) => s.lead_bron === "calculator").length;
    const rechtstreeks = filteredSources.length - viaCalculator;
    const totaal = filteredSources.length;
    const percentage = totaal > 0 ? Math.round((viaCalculator / totaal) * 100) : 0;
    return { viaCalculator, rechtstreeks, totaal, percentage };
  }, [filteredSources]);

  // Drop-off analyse: per calculator-sessie de hoogst bereikte stap +
  // of die sessie uiteindelijk een afspraak werd.
  const calcFunnel = useMemo(() => {
    const converted = new Set(
      sources.map((s) => s.calculator_session_id).filter(Boolean) as string[],
    );
    const bySession = new Map<
      string,
      { maxStep: number; service: string | null; price: number | null; plaats: string | null; last: string }
    >();
    calcSessions.forEach((r) => {
      const cur = bySession.get(r.session_id);
      if (!cur) {
        bySession.set(r.session_id, {
          maxStep: r.step,
          service: r.service,
          price: r.price_eur,
          plaats: r.plaats,
          last: r.created_at,
        });
        return;
      }
      if (r.step >= cur.maxStep) {
        cur.maxStep = r.step;
        cur.service = r.service ?? cur.service;
        cur.price = r.price_eur ?? cur.price;
      }
      cur.plaats = cur.plaats ?? r.plaats;
      if (r.created_at > cur.last) cur.last = r.created_at;
    });

    const items = Array.from(bySession.entries()).map(([session_id, v]) => ({
      session_id,
      ...v,
      converted: converted.has(session_id),
    }));

    const totalSessions = items.length;
    const convertedCount = items.filter((i) => i.converted).length;
    const steps = CALC_STEP_LABELS.map((label, idx) => {
      const reached = items.filter((i) => i.maxStep >= idx).length;
      const droppedHere = items.filter((i) => i.maxStep === idx && !i.converted).length;
      return { label, reached, droppedHere };
    });

    const dropoffs = items
      .filter((i) => !i.converted)
      .sort((a, b) => (a.last < b.last ? 1 : -1));

    return {
      totalSessions,
      convertedCount,
      conversionPct: totalSessions ? Math.round((convertedCount / totalSessions) * 100) : 0,
      steps,
      dropoffs,
    };
  }, [calcSessions, sources]);

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
    const [{ data }, { data: calcData }, { data: phoneData }] = await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("calculator_sessions")
        .select("session_id, step, service, price_eur, plaats, created_at")
        .order("created_at", { ascending: false })
        .limit(5000),
      supabase
        .from("phone_clicks")
        .select("id, created_at, phone, cta_label, page_url, visitor_id, device, referrer")
        .order("created_at", { ascending: false })
        .limit(2000),
    ]);
    setSources((data as SourceRow[]) || []);
    setCalcSessions((calcData as CalcSessionRow[]) || []);
    setPhoneClicks((phoneData as PhoneClickRow[]) || []);

    setLoadingData(false);
  };


  const exportSourcesCSV = () => {
    const headers = ["Datum", "Bron", "Detail", "Dienst", "Regio", "Naam", "Email"];
    const rows = filteredSources.map((s) => [
      new Date(s.created_at).toLocaleString("nl-BE"),
      labelFor(s.gevonden_via),
      s.gevonden_detail || "",
      s.dienst || "",
      regioFor(s),
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
        pdf.text("Volledig rapport", margin, margin + 7);
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

      const tableBase = {
        margin: { left: margin, right: margin, top: margin + 14, bottom: 14 },
        styles: {
          fontSize: 8,
          cellPadding: { top: 1.8, right: 2, bottom: 1.8, left: 2 },
          overflow: "linebreak" as const,
          textColor: 40,
          valign: "middle" as const,
        },
        headStyles: {
          fillColor: [25, 25, 25] as [number, number, number],
          textColor: 255,
          fontStyle: "bold" as const,
          fontSize: 8.5,
        },
        alternateRowStyles: { fillColor: [248, 248, 248] as [number, number, number] },
        didDrawPage: () => drawHeader(),
      };

      const lastY = () => (pdf as any).lastAutoTable.finalY as number;

      const sectionTitle = (title: string, sub?: string) => {
        let ty = lastY() + 12;
        if (ty > pageH - 40) {
          pdf.addPage();
          drawHeader();
          ty = margin + 18;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(20);
        pdf.text(title, margin, ty);
        if (sub) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9.5);
          pdf.setTextColor(110);
          pdf.text(sub, margin, ty + 5);
          ty += 5;
        }
        pdf.setTextColor(0);
        return ty + 5;
      };

      // ===== PAGINA 1-2: calculator-info, kanalen en diensten =====

      // 1. Prijscalculator: funnel
      autoTable(pdf, {
        ...tableBase,
        startY: (() => {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.setTextColor(20);
          pdf.text("Prijscalculator", margin, y);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9.5);
          pdf.setTextColor(110);
          pdf.text(
            `${calculatorStats.viaCalculator} van ${calculatorStats.totaal} afspraken via de calculator (${calculatorStats.percentage}%) · ${calcFunnel.totalSessions} sessies · ${calcFunnel.conversionPct}% conversie`,
            margin,
            y + 5,
          );
          pdf.setTextColor(0);
          return y + 10;
        })(),
        head: [["Stap", "Bereikt", "Afgehaakt hier"]],
        body: calcFunnel.steps.map((st) => [st.label, String(st.reached), String(st.droppedHere)]),
        columnStyles: { 1: { cellWidth: 26 }, 2: { cellWidth: 32 } },
      });

      // 2. Afhakers na de calculator
      if (calcFunnel.dropoffs.length > 0) {
        autoTable(pdf, {
          ...tableBase,
          startY: sectionTitle("Afhakers na de calculator", `${calcFunnel.dropoffs.length} sessies zonder afspraak`),
          head: [["Laatste stap", "Dienst", "Regio", "Prijs", "Moment"]],
          body: calcFunnel.dropoffs.slice(0, 40).map((d) => [
            CALC_STEP_LABELS[d.maxStep] || `Stap ${d.maxStep}`,
            d.service || "—",
            d.plaats || "—",
            d.price != null ? `EUR ${d.price}` : "—",
            new Date(d.last).toLocaleString("nl-BE"),
          ]),
          columnStyles: { 3: { cellWidth: 22 }, 4: { cellWidth: 34 } },
        });
      }

      // 3. Grafiek: welke diensten worden aangevraagd (vergelijking)
      const dienstCounts: Record<string, number> = {};
      filteredSources.forEach((s) => {
        const k = s.dienst || "Onbekend";
        dienstCounts[k] = (dienstCounts[k] || 0) + 1;
      });
      const dienstRanked = Object.entries(dienstCounts).sort((a, b) => b[1] - a[1]);

      {
        const barH = 6;
        const gap = 3.5;
        const neededH = dienstRanked.length * (barH + gap) + 18;
        let cy = lastY() + 12;
        if (cy + neededH > pageH - 20) {
          pdf.addPage();
          drawHeader();
          cy = margin + 18;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(20);
        pdf.text("Welke diensten worden aangevraagd?", margin, cy);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.5);
        pdf.setTextColor(110);
        pdf.text(`Vergelijking over ${total} aanvra${total === 1 ? "ag" : "gen"}.`, margin, cy + 5);
        pdf.setTextColor(0);
        cy += 12;

        const labelW = 58;
        const valueW = 24;
        const barMaxW = contentW - labelW - valueW - 4;
        const maxDienst = dienstRanked[0]?.[1] || 1;
        const dPalette = [
          [59, 130, 246], [249, 115, 22], [34, 197, 94], [239, 68, 68],
          [168, 85, 247], [234, 179, 8], [6, 182, 212], [236, 72, 153],
          [20, 184, 166], [120, 53, 15], [139, 92, 246], [132, 204, 22],
        ];
        dienstRanked.forEach(([dienst, count], i) => {
          if (cy + barH + gap > pageH - 18) {
            pdf.addPage();
            drawHeader();
            cy = margin + 18;
          }
          const [rC, gC, bC] = dPalette[i % dPalette.length];
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8.5);
          pdf.setTextColor(40);
          const label = dienst.length > 34 ? `${dienst.slice(0, 33)}…` : dienst;
          pdf.text(label, margin, cy + barH - 1.6);
          pdf.setFillColor(238, 238, 238);
          pdf.rect(margin + labelW, cy, barMaxW, barH, "F");
          pdf.setFillColor(rC, gC, bC);
          pdf.rect(margin + labelW, cy, Math.max(1.5, (barMaxW * count) / maxDienst), barH, "F");
          const pct = total ? Math.round((count / total) * 100) : 0;
          pdf.setTextColor(40);
          pdf.text(`${count} (${pct}%)`, pageW - margin, cy + barH - 1.6, { align: "right" });
          cy += barH + gap;
        });
        (pdf as any).lastAutoTable = { finalY: cy };
      }

      // ===== PAGINA 3+: klantinformatie =====
      pdf.addPage();
      drawHeader();
      (pdf as any).lastAutoTable = { finalY: margin + 6 };

      // 4. Overzichtstabel van alle afspraken
      autoTable(pdf, {
        ...tableBase,
        startY: sectionTitle("Overzicht afspraken", `${total} aanvra${total === 1 ? "ag" : "gen"}`),
        head: [["Datum", "Type", "Dienst", "Klant", "Regio", "Bron", "Lead", "Urgent"]],
        body: filteredSources.map((s) => [
          new Date(s.created_at).toLocaleDateString("nl-BE"),
          s.klant_type || "—",
          s.dienst || "—",
          `${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim() || "—",
          regioFor(s),
          labelFor(s.gevonden_via),
          s.lead_bron === "calculator"
            ? `Calculator${s.lead_bron_prijs ? ` (${s.lead_bron_prijs})` : ""}`
            : "Rechtstreeks",
          s.urgent ? "Ja" : "Nee",
        ]),
        columnStyles: {
          0: { cellWidth: 19 },
          1: { cellWidth: 20 },
          2: { cellWidth: 32 },
          3: { cellWidth: 30 },
          4: { cellWidth: 24 },
          5: { cellWidth: 22 },
          6: { cellWidth: "auto" },
          7: { cellWidth: 14 },
        },
      });

      // 5. Verdeling per regio
      const regioCounts: Record<string, number> = {};
      filteredSources.forEach((s) => {
        const k = regioFor(s);
        regioCounts[k] = (regioCounts[k] || 0) + 1;
      });
      const regioRanked = Object.entries(regioCounts).sort((a, b) => b[1] - a[1]);
      autoTable(pdf, {
        ...tableBase,
        startY: sectionTitle("Verdeling per regio", `${regioRanked.length} regio's`),
        head: [["#", "Regio", "Aantal", "Aandeel"]],
        body: regioRanked.map(([regio, count], i) => [
          String(i + 1),
          regio,
          String(count),
          `${total ? Math.round((count / total) * 100) : 0}%`,
        ]),
        columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 22 }, 3: { cellWidth: 22 } },
      });


      drawFooter();
      pdf.save(`riory-rapport-${new Date().toISOString().split("T")[0]}.pdf`);
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
      <div className="px-4 sm:px-6 pb-8 pt-6">
        <div className="space-y-6">
          <div className="flex justify-end">
            <a
              href="https://analytics.google.com/analytics/web/#/p/reports/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Open Google Analytics
              </Button>
            </a>
          </div>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="font-heading font-semibold text-foreground">Hoe vinden klanten je?</h2>
                      <p className="text-sm text-muted-foreground font-body">
                        {sources.length} afspra{sources.length === 1 ? "ak" : "ken"} in totaal · {phoneStats.total} belklik{phoneStats.total === 1 ? "" : "ken"} in totaal
                      </p>
                      <p className="text-xs text-muted-foreground/80 font-body mt-1">
                        Grafiek hieronder op basis van {total} afspra{total === 1 ? "ak" : "ken"} binnen de gekozen filters.
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
                      <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="h-9 rounded-md border border-border bg-background px-3 text-sm font-body text-foreground"
                      >
                        <option value="all">Alle bronnen</option>
                        {sourceOptions.map((v) => (
                          <option key={v} value={v}>{labelFor(v)}</option>
                        ))}
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

                  {/* Periode-filter voor de afsprakenlijst */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: "today", label: "Vandaag" },
                        { key: "48h", label: "48u" },
                        { key: "week", label: "1 week" },
                        { key: "month", label: "1 maand" },
                        { key: "3months", label: "3 maanden" },
                        { key: "all", label: "Alles" },
                        { key: "custom", label: "Aangepast" },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setApptDatePreset(key)}
                          className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all border ${
                            apptDatePreset === key
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {apptDatePreset === "custom" && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <div className="flex items-center gap-2 flex-1">
                          <label className="text-xs text-muted-foreground font-body whitespace-nowrap">Van</label>
                          <input
                            type="date"
                            value={apptCustomFrom}
                            onChange={(e) => setApptCustomFrom(e.target.value)}
                            className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm font-body text-foreground focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <label className="text-xs text-muted-foreground font-body whitespace-nowrap">Tot</label>
                          <input
                            type="date"
                            value={apptCustomTo}
                            onChange={(e) => setApptCustomTo(e.target.value)}
                            className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm font-body text-foreground focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">Telefoon-leads ("Bel nu")</h3>
                      <p className="text-sm text-muted-foreground font-body">
                        Elke klik op een belknop wordt geregistreerd als lead-event.
                      </p>
                      <p className="text-xs text-muted-foreground/80 font-body mt-1">
                        Meting gestart op 12/08/2026 — klikken van vóór deze datum zijn niet beschikbaar.
                      </p>

                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Vandaag</p>
                      <p className="text-2xl font-heading font-bold text-foreground">{phoneStats.today}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Laatste 7 dagen</p>
                      <p className="text-2xl font-heading font-bold text-foreground">{phoneStats.week}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Laatste 30 dagen</p>
                      <p className="text-2xl font-heading font-bold text-foreground">{phoneStats.month}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Totaal</p>
                      <p className="text-2xl font-heading font-bold text-primary">{phoneStats.total}</p>
                    </div>
                  </div>

                  {phoneStats.ranked.length > 0 && (
                    <div className="space-y-2 mb-5">
                      <p className="text-xs font-body uppercase tracking-wide text-muted-foreground">Per knop</p>
                      {phoneStats.ranked.slice(0, showAllPhoneLabels ? undefined : 5).map((r) => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex items-center justify-between gap-2 text-sm font-body">
                            <span className="text-foreground truncate">{r.label}</span>
                            <span className="text-muted-foreground shrink-0">{r.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.round((r.count / phoneStats.maxCount) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {phoneStats.ranked.length > 5 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => setShowAllPhoneLabels((v) => !v)}
                        >
                          {showAllPhoneLabels ? "Toon minder" : `Bekijk alle knoppen (${phoneStats.ranked.length})`}
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-body uppercase tracking-wide text-muted-foreground">Recente klikken</p>
                    {phoneClicks.length === 0 ? (
                      <p className="text-sm text-muted-foreground font-body">Nog geen telefoonklikken geregistreerd.</p>
                    ) : (
                      phoneClicks.slice(0, showAllPhoneClicks ? undefined : 10).map((c) => (
                        <div
                          key={c.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-border p-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-body text-foreground truncate">{c.cta_label || "belknop"}</p>
                            <p className="text-xs text-muted-foreground font-body truncate">
                              {c.page_url || "-"}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground font-body sm:text-right shrink-0">
                            <p>{new Date(c.created_at).toLocaleString("nl-BE")}</p>
                            <p>{c.device || "-"}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {phoneClicks.length > 10 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowAllPhoneClicks((v) => !v)}
                      >
                        {showAllPhoneClicks ? "Toon minder" : `Bekijk alle klikken (${phoneClicks.length})`}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Prijscalculator — conversie</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Via calculator</p>
                      <p className="text-2xl font-heading font-bold text-foreground">{calculatorStats.viaCalculator}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">Rechtstreeks</p>
                      <p className="text-2xl font-heading font-bold text-foreground">{calculatorStats.rechtstreeks}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground font-body mb-1">% via calculator</p>
                      <p className="text-2xl font-heading font-bold text-primary">{calculatorStats.percentage}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-3">
                    Van {calculatorStats.totaal} afspra{calculatorStats.totaal === 1 ? "ak" : "ken"} kwam {calculatorStats.viaCalculator} via de prijscalculator — wie eerst een prijs berekende, boekte daarna wél een afspraak.
                  </p>
                </div>

                <div ref={sourcesReportRef} className="space-y-6 bg-background">
                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Verdeling per kanaal</h3>
                  {ranked.length ? (() => {
                    const palette = [
                      "hsl(217 91% 60%)",
                      "hsl(24 95% 53%)",
                      "hsl(142 71% 45%)",
                      "hsl(346 77% 49%)",
                      "hsl(280 65% 60%)",
                      "hsl(48 96% 53%)",
                      "hsl(189 94% 43%)",
                      "hsl(330 81% 60%)",
                      "hsl(160 84% 39%)",
                      "hsl(15 79% 35%)",
                      "hsl(258 90% 66%)",
                      "hsl(75 64% 45%)",
                    ];
                    return (
                      <div className="flex flex-col gap-4">
                        {/* Pie chart — compact on mobile */}
                        <div className="h-44 sm:h-56 w-full max-w-xs mx-auto sm:max-w-none" data-pdf-chart>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ranked}
                                dataKey="count"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius="35%"
                                outerRadius="72%"
                                paddingAngle={2}
                                label={(e: any) => `${Math.round((e.count / total) * 100)}%`}
                                labelLine={false}
                              >
                                {ranked.map((_, i) => (
                                  <Cell key={i} fill={palette[i % palette.length]} />
                                ))}
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
                        {/* Bar legend — colors match pie */}
                        <div className="space-y-2">
                          {ranked.map((r, i) => {
                            const pct = total ? Math.round((r.count / total) * 100) : 0;
                            const color = palette[i % palette.length];
                            return (
                              <div key={r.label} className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ background: color }}
                                />
                                <span className="text-xs font-body text-foreground w-28 sm:w-40 shrink-0 truncate">
                                  {r.label}
                                </span>
                                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden min-w-0">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${Math.max(5, (r.count / max) * 100)}%`,
                                      background: color,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-heading font-semibold text-foreground w-16 text-right shrink-0">
                                  {r.count} ({pct}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })() : (
                    <p className="text-sm text-muted-foreground font-body">Nog geen data beschikbaar.</p>
                  )}
                </div>

                {/* Verdeling per regio */}
                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold text-foreground">Top regio's</h3>
                    <span className="text-xs text-muted-foreground font-body bg-muted px-2 py-1 rounded-full">
                      {(() => {
                        const set = new Set(filteredSources.map((s) => regioFor(s)));
                        return `${set.size} regio's`;
                      })()}
                    </span>
                  </div>
                  {(() => {
                    const regioCounts: Record<string, number> = {};
                    filteredSources.forEach((s) => {
                      const k = regioFor(s);
                      regioCounts[k] = (regioCounts[k] || 0) + 1;
                    });
                    const regioRanked = Object.entries(regioCounts)
                      .map(([label, count]) => ({ label, count }))
                      .sort((a, b) => b.count - a.count);
                    const regioMax = regioRanked[0]?.count || 1;
                    if (!regioRanked.length) {
                      return <p className="text-sm text-muted-foreground font-body">Nog geen data beschikbaar.</p>;
                    }
                    const hasMore = regioRanked.length > 5;
                    const visible = showAllRegios ? regioRanked : regioRanked.slice(0, 5);
                    return (
                      <div className="space-y-2.5">
                        {visible.map((r, i) => {
                          const pct = total ? Math.round((r.count / total) * 100) : 0;
                          const barPct = Math.max(6, (r.count / regioMax) * 100);
                          return (
                            <div key={r.label} className="group">
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10px] font-heading font-bold text-muted-foreground w-4 shrink-0">
                                    #{i + 1}
                                  </span>
                                  <span className="text-sm font-body font-medium text-foreground truncate">
                                    {r.label}
                                  </span>
                                </div>
                                <span className="text-xs font-heading font-semibold text-foreground shrink-0 tabular-nums">
                                  {r.count}
                                  <span className="text-muted-foreground font-body font-normal ml-1">
                                    ({pct}%)
                                  </span>
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        {hasMore && (
                          <button
                            type="button"
                            onClick={() => setShowAllRegios((v) => !v)}
                            className="w-full mt-3 py-2 px-4 rounded-lg border border-border bg-muted/50 hover:bg-muted text-sm font-body font-medium text-foreground transition-colors"
                          >
                            {showAllRegios ? "Toon top 5 regio's" : `Bekijk alle ${regioRanked.length} regio's`}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Calculator drop-off */}
                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h3 className="font-heading font-semibold text-foreground">Afhakers na de calculator</h3>
                    <span className="text-xs text-muted-foreground font-body bg-muted px-2 py-1 rounded-full shrink-0">
                      {calcFunnel.totalSessions} sessies
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mb-4">
                    {calcFunnel.convertedCount} van {calcFunnel.totalSessions} calculator-sessies werden een afspraak ({calcFunnel.conversionPct}%).
                  </p>

                  {calcFunnel.totalSessions === 0 ? (
                    <p className="text-sm text-muted-foreground font-body">
                      Nog geen calculator-sessies gemeten. Data wordt vanaf nu opgebouwd.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2.5">
                        {calcFunnel.steps.map((s, i) => {
                          const pct = calcFunnel.totalSessions
                            ? Math.round((s.reached / calcFunnel.totalSessions) * 100)
                            : 0;
                          return (
                            <div key={s.label}>
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10px] font-heading font-bold text-muted-foreground w-4 shrink-0">
                                    {i + 1}.
                                  </span>
                                  <span className="text-sm font-body font-medium text-foreground truncate">
                                    {s.label}
                                  </span>
                                </div>
                                <span className="text-xs font-heading font-semibold text-foreground shrink-0 tabular-nums">
                                  {s.reached}
                                  <span className="text-muted-foreground font-body font-normal ml-1">({pct}%)</span>
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(4, pct)}%` }} />
                              </div>
                              {s.droppedHere > 0 && (
                                <p className="text-[11px] text-muted-foreground font-body mt-1 ml-6">
                                  {s.droppedHere} afgehaakt op deze stap
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {calcFunnel.dropoffs.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-border">
                          <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
                            Recente afhakers
                          </h4>
                          <div className="space-y-2">
                            {(showAllDropoffs ? calcFunnel.dropoffs : calcFunnel.dropoffs.slice(0, 5)).map((d) => (
                              <div
                                key={d.session_id}
                                className="flex items-center justify-between gap-2 bg-muted/40 rounded-lg px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-body font-medium text-foreground truncate">
                                    {d.service || "Geen dienst gekozen"}
                                    {d.plaats ? ` · ${d.plaats}` : ""}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground font-body">
                                    Gestopt bij: {CALC_STEP_LABELS[d.maxStep] || `Stap ${d.maxStep}`} ·{" "}
                                    {new Date(d.last).toLocaleString("nl-BE")}
                                  </p>
                                </div>
                                <span className="text-xs font-heading font-semibold text-foreground shrink-0 tabular-nums">
                                  {d.price != null ? `€ ${d.price.toFixed(0)}` : "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                          {calcFunnel.dropoffs.length > 5 && (
                            <button
                              type="button"
                              onClick={() => setShowAllDropoffs((v) => !v)}
                              className="w-full mt-3 py-2 px-4 rounded-lg border border-border bg-muted/50 hover:bg-muted text-sm font-body font-medium text-foreground transition-colors"
                            >
                              {showAllDropoffs
                                ? "Toon laatste 5 afhakers"
                                : `Bekijk alle ${calcFunnel.dropoffs.length} afhakers`}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>


                <div className="bg-background rounded-xl p-4 sm:p-6 border border-border shadow-sm">
                  {/* Header + Filter */}
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-foreground">Afspraken</h3>
                      <span className="text-xs text-muted-foreground font-body bg-muted px-2 py-1 rounded-full">
                        {filteredAppointments.length} resultaten
                      </span>
                    </div>
                  </div>


                  {filteredAppointments.length ? (
                    <>
                      {/* Mobile: card list */}
                      <div className="space-y-3 sm:hidden">
                        {filteredAppointments.slice(0, 50).map((s, i) => {
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
                              <p className="text-xs text-primary font-body font-semibold truncate">📍 {regioFor(s)}</p>
                              <p className="text-xs text-muted-foreground font-body truncate">{s.dienst}</p>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-heading font-semibold px-1.5 py-0.5 rounded-full ${s.lead_bron === "calculator" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                  {s.lead_bron === "calculator" ? "🧮 Calculator" : "Rechtstreeks"}
                                </span>
                                {s.lead_bron === "calculator" && s.lead_bron_prijs && (
                                  <span className="text-[10px] text-muted-foreground font-body">{s.lead_bron_prijs}</span>
                                )}
                              </div>
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
                              <th className="py-2 pr-3">Regio</th>
                              <th className="py-2 pr-3">Klant</th>
                              <th className="py-2 pr-3">Lead-bron</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAppointments.slice(0, 50).map((s, i) => (
                              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="py-2 pr-3 text-foreground whitespace-nowrap">
                                  {new Date(s.created_at).toLocaleDateString("nl-BE")}
                                </td>
                                <td className="py-2 pr-3 text-foreground">{labelFor(s.gevonden_via)}</td>
                                <td className="py-2 pr-3 text-muted-foreground">{s.gevonden_detail || "—"}</td>
                                <td className="py-2 pr-3 text-muted-foreground">{s.dienst}</td>
                                <td className="py-2 pr-3 text-foreground font-medium">{regioFor(s)}</td>
                                <td className="py-2 pr-3 text-muted-foreground">
                                  {`${s.fact_voornaam || ""} ${s.fact_naam || ""}`.trim() || s.fact_email}
                                </td>
                                <td className="py-2 pr-3">
                                  <span className={`text-xs font-heading font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${s.lead_bron === "calculator" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    {s.lead_bron === "calculator" ? "🧮 Calculator" : "Rechtstreeks"}
                                  </span>
                                  {s.lead_bron === "calculator" && s.lead_bron_prijs && (
                                    <span className="block text-[11px] text-muted-foreground mt-0.5">{s.lead_bron_prijs}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">Geen afspraken in deze periode.</p>
                  )}
                </div>
              </div>
            </div>
            );
          })()
        )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
