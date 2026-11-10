import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Clock, GitBranch, Printer, Search, Target, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminLoading from "@/components/AdminLoading";
import { Button } from "@/components/ui/button";
import { fases, PROCES_VERSIE, type Fase, type Stap, type Status, type Systeem } from "@/lib/werkingsproces";

const SYS: Record<Systeem, { label: string; cls: string }> = {
  site: { label: "Website", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  app: { label: "Werkbonnen-app", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  extern: { label: "Extern", cls: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30" },
  mens: { label: "Manueel", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
};

const STATUS: Record<Exclude<Status, "actief">, { label: string; cls: string }> = {
  deels: { label: "Deels", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  open: { label: "Nog te doen", cls: "bg-red-500/15 text-red-700 dark:text-red-300" },
};

const matches = (s: Stap, q: string): boolean => {
  if (!q) return true;
  const hay = `${s.titel} ${s.uitleg ?? ""} ${s.wie ?? ""} ${(s.details ?? []).join(" ")}`.toLowerCase();
  if (hay.includes(q)) return true;
  if (s.stappen?.some((c) => matches(c, q))) return true;
  return !!s.takken?.some((t) => t.label.toLowerCase().includes(q) || t.stappen.some((c) => matches(c, q)));
};

const telStappen = (lijst: Stap[]): number =>
  lijst.reduce((n, s) => n + 1 + telStappen(s.stappen ?? []) + (s.takken ?? []).reduce((m, t) => m + telStappen(t.stappen), 0), 0);

const Badge = ({ sys }: { sys?: Systeem }) =>
  sys ? (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${SYS[sys].cls}`}>
      {SYS[sys].label}
    </span>
  ) : null;

const StapKaart = ({ stap, q, details }: { stap: Stap; q: string; details: boolean }) => {
  const hit = !!q && `${stap.titel} ${stap.uitleg ?? ""} ${(stap.details ?? []).join(" ")}`.toLowerCase().includes(q);
  return (
    <div className="relative pl-5">
      {/* verbindingslijn + bolletje */}
      <span className="absolute left-[5px] top-0 bottom-0 w-px bg-border" aria-hidden />
      <span
        className={`absolute left-0 top-3 w-[11px] h-[11px] rounded-full border-2 ${
          stap.takken ? "bg-primary border-primary" : "bg-background border-primary"
        }`}
        aria-hidden
      />
      <div
        className={`rounded-lg border bg-card px-3 py-2 mb-2 ${hit ? "ring-2 ring-primary" : ""} ${
          stap.status === "open" ? "border-dashed border-red-400/60" : "border-border"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {stap.takken && <GitBranch className="w-3.5 h-3.5 text-primary shrink-0" />}
          <p className="font-heading font-semibold text-sm text-foreground">{stap.titel}</p>
          <Badge sys={stap.sys} />
          {stap.status && stap.status !== "actief" && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS[stap.status].cls}`}>
              {STATUS[stap.status].label}
            </span>
          )}
        </div>
        {stap.uitleg && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stap.uitleg}</p>}
        {(stap.wie || stap.wanneer) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px] text-foreground/80">
            {stap.wie && (
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" /> {stap.wie}
              </span>
            )}
            {stap.wanneer && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" /> {stap.wanneer}
              </span>
            )}
          </div>
        )}
        {details && stap.details && stap.details.length > 0 && (
          <ul className="mt-2 space-y-0.5 border-t border-border/60 pt-1.5">
            {stap.details.map((d) => (
              <li key={d} className="text-xs text-muted-foreground leading-relaxed flex gap-1.5">
                <span className="text-primary shrink-0" aria-hidden>•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {stap.stappen && <StappenLijst stappen={stap.stappen} q={q} details={details} />}

      {stap.takken && (
        <div className="grid gap-2 mb-3 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {stap.takken.map((tak) => (
            <div key={tak.label} className="rounded-lg border border-primary/25 bg-primary/[0.03] p-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                <span aria-hidden>↳</span> {tak.label}
              </p>
              <StappenLijst stappen={tak.stappen} q={q} details={details} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StappenLijst = ({ stappen, q, details }: { stappen: Stap[]; q: string; details: boolean }) => (
  <div>
    {stappen.filter((s) => matches(s, q)).map((s, i) => (
      <StapKaart key={`${s.titel}-${i}`} stap={s} q={q} details={details} />
    ))}
  </div>
);

const FaseKaart = ({ fase, open, onToggle, q, details }: { fase: Fase; open: boolean; onToggle: () => void; q: string; details: boolean }) => (
  <section className="relative">
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm shrink-0">
          {fase.nr}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-heading font-bold text-foreground">{fase.titel}</span>
          <span className="block text-xs text-muted-foreground">{fase.doel}</span>
        </span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">{telStappen(fase.stappen)} stappen</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-border">
          <div className="pt-3">
            <StappenLijst stappen={fase.stappen} q={q} details={details} />
          </div>
          {fase.resultaat && (
            <div className="mt-1 flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                <span className="font-semibold">Resultaat: </span>
                {fase.resultaat}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </section>
);

const Werkingsproces = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(fases.map((f) => [f.id, true])));
  const [zoek, setZoek] = useState("");
  const [details, setDetails] = useState(true);
  const q = zoek.trim().toLowerCase();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    document.title = "Werkingsproces — Riory Admin";
  }, []);

  const zichtbaar = useMemo(() => fases.filter((f) => !q || f.titel.toLowerCase().includes(q) || f.stappen.some((s) => matches(s, q))), [q]);
  const openPunten = useMemo(() => {
    const out: { fase: string; titel: string; status: Status }[] = [];
    const walk = (lijst: Stap[], fase: string) =>
      lijst.forEach((s) => {
        if (s.status && s.status !== "actief") out.push({ fase, titel: s.titel, status: s.status });
        walk(s.stappen ?? [], fase);
        s.takken?.forEach((t) => walk(t.stappen, fase));
      });
    fases.forEach((f) => walk(f.stappen, f.titel));
    return out;
  }, []);

  const allesOpen = fases.every((f) => open[f.id]);
  const toggleAlles = () => setOpen(Object.fromEntries(fases.map((f) => [f.id, !allesOpen])));

  if (loading || !user || !isAdmin) {
    return <AdminLoading />;
  }

  return (
    <div className="min-h-screen bg-muted print:bg-white">
      <header className="bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/admin" aria-label="Terug naar admin">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground truncate">Werkingsproces</h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Afdrukken / PDF</span>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <h2 className="font-heading font-bold text-foreground">Alles wat Riory doet, van eerste klik tot boekhouding</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {fases.length} fases · {telStappen(fases.flatMap((f) => f.stappen))} stappen · versie {PROCES_VERSIE}. Vertakkingen
            (<GitBranch className="inline w-3.5 h-3.5 text-primary" />) tonen de keuzes; elk blok is een mogelijk pad.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(Object.keys(SYS) as Systeem[]).map((s) => (
              <Badge key={s} sys={s} />
            ))}
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS.deels.cls}`}>Deels</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS.open.cls}`}>Nog te doen</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 print:hidden">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={zoek}
                onChange={(e) => setZoek(e.target.value)}
                placeholder="Zoek een stap (bv. offerte, Peppol, syndicus)…"
                className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant={details ? "default" : "outline"} size="sm" onClick={() => setDetails((d) => !d)}>
              {details ? "Details verbergen" : "Details tonen"}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleAlles}>
              {allesOpen ? "Alles inklappen" : "Alles uitklappen"}
            </Button>
          </div>
        </div>

        {/* Flow */}
        <div className="space-y-3">
          {zichtbaar.map((f, i) => (
            <div key={f.id}>
              <FaseKaart fase={f} q={q} details={details} open={!!q || !!open[f.id]} onToggle={() => setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))} />
              {i < zichtbaar.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden>
                  <span className="text-primary text-lg leading-none">↓</span>
                </div>
              )}
            </div>
          ))}
          {zichtbaar.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Geen stap gevonden voor "{zoek}".</p>}
        </div>

        {/* Openstaande punten */}
        {openPunten.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-4">
            <h2 className="font-heading font-bold text-foreground mb-2">Nog niet volledig / te doen</h2>
            <ul className="space-y-1.5">
              {openPunten.map((p) => (
                <li key={`${p.fase}-${p.titel}`} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS[p.status as "deels" | "open"].cls}`}>
                    {STATUS[p.status as "deels" | "open"].label}
                  </span>
                  <span className="text-foreground">{p.titel}</span>
                  <span className="text-muted-foreground text-xs">— {p.fase}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Werkingsproces;
