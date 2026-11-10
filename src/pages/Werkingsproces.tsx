import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  GitBranch,
  Loader2,
  Printer,
  Search,
  Target,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  eenvoudig,
  EENVOUDIG_EINDE,
  fases,
  PROCES_VERSIE,
  type Fase,
  type Stap,
  type Status,
  type Systeem,
} from "@/lib/werkingsproces";
import {
  groepeer,
  laadJourney,
  type JourneyResultaat,
  type Tellers,
} from "@/lib/journey";

const SYS: Record<Systeem, { label: string; cls: string }> = {
  site: {
    label: "Website",
    cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  app: {
    label: "Werkbonnen-app",
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  extern: {
    label: "Extern",
    cls: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  },
  mens: {
    label: "Manueel",
    cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
};

const STATUS: Record<
  Exclude<Status, "actief">,
  { label: string; cls: string }
> = {
  deels: {
    label: "Deels",
    cls: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  open: {
    label: "Nog te doen",
    cls: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

const matches = (s: Stap, q: string): boolean => {
  if (!q) return true;
  const hay =
    `${s.titel} ${s.uitleg ?? ""} ${s.wie ?? ""} ${(s.details ?? []).join(" ")}`.toLowerCase();
  if (hay.includes(q)) return true;
  if (s.stappen?.some((c) => matches(c, q))) return true;
  return !!s.takken?.some(
    (t) =>
      t.label.toLowerCase().includes(q) || t.stappen.some((c) => matches(c, q)),
  );
};

const telStappen = (lijst: Stap[]): number =>
  lijst.reduce(
    (n, s) =>
      n +
      1 +
      telStappen(s.stappen ?? []) +
      (s.takken ?? []).reduce((m, t) => m + telStappen(t.stappen), 0),
    0,
  );

const Badge = ({ sys }: { sys?: Systeem }) =>
  sys ? (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${SYS[sys].cls}`}
    >
      {SYS[sys].label}
    </span>
  ) : null;

const Teller = ({ k, tellers }: { k?: string; tellers: Tellers | null }) => {
  if (!k || !tellers) return null;
  const n = tellers[k] ?? 0;
  return (
    <span
      title="Aantal klanten in de gekozen periode"
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
        n > 0
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Users className="w-3 h-3" />
      {n.toLocaleString("nl-BE")}
    </span>
  );
};

const StapKaart = ({
  stap,
  q,
  details,
  tellers,
}: {
  stap: Stap;
  q: string;
  details: boolean;
  tellers: Tellers | null;
}) => {
  const hit =
    !!q &&
    `${stap.titel} ${stap.uitleg ?? ""} ${(stap.details ?? []).join(" ")}`
      .toLowerCase()
      .includes(q);
  return (
    <div className="relative pl-5">
      {/* verbindingslijn + bolletje */}
      <span
        className="absolute left-[5px] top-0 bottom-0 w-px bg-border"
        aria-hidden
      />
      <span
        className={`absolute left-0 top-3 w-[11px] h-[11px] rounded-full border-2 ${
          stap.takken
            ? "bg-primary border-primary"
            : "bg-background border-primary"
        }`}
        aria-hidden
      />
      <div
        className={`rounded-lg border bg-card px-3 py-2 mb-2 ${hit ? "ring-2 ring-primary" : ""} ${
          stap.status === "open"
            ? "border-dashed border-red-400/60"
            : "border-border"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {stap.takken && (
            <GitBranch className="w-3.5 h-3.5 text-primary shrink-0" />
          )}
          <p className="font-heading font-semibold text-sm text-foreground">
            {stap.titel}
          </p>
          <Badge sys={stap.sys} />
          <Teller k={stap.teller} tellers={tellers} />
          {stap.status && stap.status !== "actief" && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS[stap.status].cls}`}
            >
              {STATUS[stap.status].label}
            </span>
          )}
        </div>
        {stap.uitleg && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {stap.uitleg}
          </p>
        )}
        {(stap.wie || stap.wanneer) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px] text-foreground/80">
            {stap.wie && (
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" /> {stap.wie}
              </span>
            )}
            {stap.wanneer && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />{" "}
                {stap.wanneer}
              </span>
            )}
          </div>
        )}
        {details && stap.details && stap.details.length > 0 && (
          <ul className="mt-2 space-y-0.5 border-t border-border/60 pt-1.5">
            {stap.details.map((d) => (
              <li
                key={d}
                className="text-xs text-muted-foreground leading-relaxed flex gap-1.5"
              >
                <span className="text-primary shrink-0" aria-hidden>
                  •
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {stap.stappen && (
        <StappenLijst
          stappen={stap.stappen}
          q={q}
          details={details}
          tellers={tellers}
        />
      )}

      {stap.takken && (
        <div className="grid gap-2 mb-3 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {stap.takken.map((tak) => (
            <div
              key={tak.label}
              className="rounded-lg border border-primary/25 bg-primary/[0.03] p-2"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                <span aria-hidden>↳</span> {tak.label}
                <span className="ml-auto normal-case tracking-normal">
                  <Teller k={tak.teller} tellers={tellers} />
                </span>
              </p>
              <StappenLijst
                stappen={tak.stappen}
                q={q}
                details={details}
                tellers={tellers}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StappenLijst = ({
  stappen,
  q,
  details,
  tellers,
}: {
  stappen: Stap[];
  q: string;
  details: boolean;
  tellers: Tellers | null;
}) => (
  <div>
    {stappen
      .filter((s) => matches(s, q))
      .map((s, i) => (
        <StapKaart
          key={`${s.titel}-${i}`}
          stap={s}
          q={q}
          details={details}
          tellers={tellers}
        />
      ))}
  </div>
);

const FaseKaart = ({
  fase,
  open,
  onToggle,
  q,
  details,
  tellers,
}: {
  fase: Fase;
  open: boolean;
  onToggle: () => void;
  q: string;
  details: boolean;
  tellers: Tellers | null;
}) => (
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
          <span className="block font-heading font-bold text-foreground">
            {fase.titel}
          </span>
          <span className="block text-xs text-muted-foreground">
            {fase.doel}
          </span>
        </span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {telStappen(fase.stappen)} stappen
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-border">
          <div className="pt-3">
            <StappenLijst
              stappen={fase.stappen}
              q={q}
              details={details}
              tellers={tellers}
            />
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

type Versie = "detail" | "eenvoudig" | "overzicht";
const VERSIES: { k: Versie; label: string; uitleg: string }[] = [
  {
    k: "detail",
    label: "Gedetailleerd",
    uitleg: "Alle stappen, regels en uitzonderingen",
  },
  { k: "eenvoudig", label: "Eenvoudig", uitleg: "8 stappen in gewone taal" },
  {
    k: "overzicht",
    label: "Overzicht",
    uitleg: "Alle fases en keuzes op één scherm",
  },
];

const VersieKiezer = ({
  versie,
  zet,
}: {
  versie: Versie;
  zet: (v: Versie) => void;
}) => (
  <div
    className="grid grid-cols-3 gap-1 rounded-xl bg-background border border-border p-1 print:hidden"
    role="tablist"
  >
    {VERSIES.map((v) => (
      <button
        key={v.k}
        type="button"
        role="tab"
        aria-selected={versie === v.k}
        onClick={() => zet(v.k)}
        className={`rounded-lg px-2 py-2 text-left transition-colors ${versie === v.k ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
      >
        <span className="block font-heading font-bold text-sm">{v.label}</span>
        <span
          className={`hidden sm:block text-[11px] ${versie === v.k ? "text-primary-foreground/85" : "text-muted-foreground"}`}
        >
          {v.uitleg}
        </span>
      </button>
    ))}
  </div>
);

const Eenvoudig = ({ tellers }: { tellers: Tellers | null }) => (
  <div>
    <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-1">Zo werkt Riory</h2>
    <p className="text-center text-muted-foreground mb-6">6 stappen</p>
    <ol className="space-y-2">
      {eenvoudig.map((st, i) => (
        <li key={st.nr}>
          <div className="flex items-center gap-4 rounded-2xl bg-background border border-border px-4 py-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xl shrink-0">
              {st.nr}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-lg text-foreground leading-tight">{st.titel}</p>
              <p className="text-base text-muted-foreground mt-0.5">{st.zin}</p>
            </div>
            {tellers && st.teller && (
              <span className="text-xl font-heading font-bold text-primary tabular-nums shrink-0" title="Aantal klanten">
                {(tellers[st.teller] ?? 0).toLocaleString("nl-BE")}
              </span>
            )}
          </div>
          {i < eenvoudig.length - 1 && (
            <div className="flex justify-center py-1" aria-hidden>
              <ArrowDown className="w-5 h-5 text-primary" />
            </div>
          )}
        </li>
      ))}
    </ol>
    <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 px-4 py-4">
      <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
      <p className="font-heading font-bold text-lg text-foreground">{EENVOUDIG_EINDE}</p>
    </div>
  </div>
);

type Keuze = { vraag: string; opties: { label: string; teller?: string }[] };
const keuzesVan = (fase: Fase): Keuze[] => {
  const out: Keuze[] = [];
  const walk = (lijst: Stap[], diepte: number) =>
    lijst.forEach((s) => {
      if (s.takken && diepte <= 1) out.push({ vraag: s.titel, opties: s.takken.map((t) => ({ label: t.label, teller: t.teller })) });
      if (diepte < 1) {
        walk(s.stappen ?? [], diepte + 1);
        s.takken?.forEach((t) => walk(t.stappen, diepte + 1));
      }
    });
  walk(fase.stappen, 0);
  return out;
};

const KLEUREN = ["#f97316", "#2563eb", "#7c3aed", "#059669", "#db2777", "#0891b2", "#ca8a04", "#dc2626", "#4f46e5", "#16a34a", "#9333ea", "#0d9488"];
/** Breekt een titel in max. 3 regels van ±n tekens. */
const regels = (t: string, n: number) => {
  const out: string[] = [];
  for (const w of t.replace(/\?$/, "").split(" ")) {
    const last = out[out.length - 1];
    if (last && (last + " " + w).length <= n) out[out.length - 1] = last + " " + w;
    else out.push(w);
  }
  return out.length > 3 ? [...out.slice(0, 2), out.slice(2).join(" ").slice(0, n - 1) + "…"] : out;
};
const kortVraag = (v: string) => v.replace(/^\d+\.\s*/, "").replace(/\?$/, "");

/** Spinnenweb: Riory in het midden → fases → vragen → keuzes. */
const Spinnenweb = ({ tellers }: { tellers: Tellers | null }) => {
  const W = 1900;
  const C = W / 2;
  const R1 = 270; // fases
  const R2 = 480; // vragen
  const R3 = 650; // keuzes (start tekst)
  type Blad = { fase: number; vraag: number; label: string; teller?: string };
  const data = fases.map((f) => {
    const k = keuzesVan(f);
    return { f, keuzes: k.length ? k : [{ vraag: f.doel, opties: [] as Keuze["opties"] }] };
  });
  const bladeren: Blad[] = [];
  data.forEach((d, fi) =>
    d.keuzes.forEach((k, ki) => {
      if (k.opties.length === 0) bladeren.push({ fase: fi, vraag: ki, label: "" });
      k.opties.forEach((o) => bladeren.push({ fase: fi, vraag: ki, label: o.label, teller: o.teller }));
    }),
  );
  // Elke fase krijgt minstens MIN plaatsen, zodat kleine fases niet op elkaar vallen.
  const MIN = 6;
  const perFase = data.map((_, fi) => bladeren.filter((b) => b.fase === fi));
  const ruimte = perFase.map((l) => Math.max(MIN, l.length) + 1);
  const N = ruimte.reduce((a, b) => a + b, 0);
  const stap = (2 * Math.PI) / N;
  const hoekVan = new Map<Blad, number>();
  let start = 0;
  perFase.forEach((lijst, fi) => {
    const vrij = ruimte[fi] - 1 - lijst.length;
    lijst.forEach((bl, i) => hoekVan.set(bl, -Math.PI / 2 + (start + vrij / 2 + i + 0.5) * stap));
    start += ruimte[fi];
  });
  const gem = (lijst: number[]) => lijst.reduce((a, b) => a + b, 0) / lijst.length;
  const pt = (r: number, a: number) => [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
  const curve = (r0: number, a0: number, r1: number, a1: number) => {
    const [x0, y0] = pt(r0, a0);
    const [x1, y1] = pt(r1, a1);
    const [cx, cy] = pt((r0 + r1) / 2, a1);
    return `M${x0},${y0} Q${cx},${cy} ${x1},${y1}`;
  };
  const deg = (a: number) => (a * 180) / Math.PI;

  return (
    <svg viewBox={`0 0 ${W} ${W}`} className="w-full h-auto" role="img" aria-label="Spinnenweb van het werkingsproces" style={{ fontFamily: "inherit" }}>
      {/* ringen */}
      {[R1, R2].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeDasharray="4 6" />
      ))}
      {data.map((d, fi) => {
        const kleur = KLEUREN[fi % KLEUREN.length];
        const eigen = bladeren.filter((b) => b.fase === fi);
        const aFase = gem(eigen.map((b) => hoekVan.get(b)!));
        const [fx, fy] = pt(R1, aFase);
        return (
          <g key={d.f.id}>
            <path d={curve(70, aFase, R1, aFase)} stroke={kleur} strokeWidth={4} fill="none" strokeOpacity={0.7} />
            {d.keuzes.map((k, ki) => {
              const bl = eigen.filter((b) => b.vraag === ki);
              const aV = gem(bl.map((b) => hoekVan.get(b)!));
              const [vx, vy] = pt(R2, aV);
              return (
                <g key={ki}>
                  <path d={curve(R1, aFase, R2, aV)} stroke={kleur} strokeWidth={2.5} fill="none" strokeOpacity={0.55} />
                  {bl.map((b, bi) => {
                    if (!b.label) return null;
                    const a = hoekVan.get(b)!;
                    const [lx, ly] = pt(R3, a);
                    const r = Math.cos(a) >= 0;
                    const n = tellers && b.teller ? tellers[b.teller] ?? 0 : null;
                    return (
                      <g key={bi}>
                        <path d={curve(R2, aV, R3 - 12, a)} stroke={kleur} strokeWidth={1.5} fill="none" strokeOpacity={0.45} />
                        <circle cx={pt(R3 - 8, a)[0]} cy={pt(R3 - 8, a)[1]} r={4} fill={kleur} />
                        <text
                          x={lx}
                          y={ly}
                          fontSize={17}
                          dominantBaseline="middle"
                          textAnchor={r ? "start" : "end"}
                          transform={`rotate(${r ? deg(a) : deg(a) + 180} ${lx} ${ly})`}
                          fill="currentColor"
                        >
                          {b.label.length > 30 ? b.label.slice(0, 29) + "…" : b.label}
                          {n !== null && (
                            <tspan fontWeight={700} fill={kleur}>
                              {"  "}
                              {n}
                            </tspan>
                          )}
                        </text>
                      </g>
                    );
                  })}
                  <g transform={`translate(${vx} ${vy})`}>
                    <text
                      y={0}
                      fontSize={15}
                      fontWeight={600}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={kleur}
                      stroke="hsl(var(--background))"
                      strokeWidth={5}
                      paintOrder="stroke"
                    >
                      {kortVraag(k.vraag).slice(0, 26)}
                    </text>
                  </g>
                </g>
              );
            })}
            <g transform={`translate(${fx} ${fy})`}>
              <circle r={62} fill={kleur} />
              <text y={-24} textAnchor="middle" fontSize={26} fontWeight={800} fill="#fff">
                {d.f.nr}
              </text>
              {regels(d.f.titel, 13).map((r, i, arr) => (
                <text key={i} y={2 + i * 16 - (arr.length > 2 ? 4 : 0)} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="#fff">
                  {r}
                </text>
              ))}
            </g>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={74} fill="hsl(var(--primary))" />
      <text x={C} y={C - 6} textAnchor="middle" fontSize={34} fontWeight={800} fill="#fff">
        Riory
      </text>
      <text x={C} y={C + 24} textAnchor="middle" fontSize={15} fill="#fff" fillOpacity={0.9}>
        werkingsproces
      </text>
    </svg>
  );
};

const Overzicht = ({ tellers }: { tellers: Tellers | null }) => (
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-background p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <div>
        <h2 className="font-heading font-bold text-foreground">Overzicht als spinnenweb</h2>
        <p className="text-sm text-muted-foreground">Midden = Riory · ring 1 = fases (volg de nummers) · ring 2 = vragen · buitenaan = keuzes.</p>
      </div>
      <Button size="sm" className="gap-2" onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Download als PDF
      </Button>
    </div>
    <div className="rounded-xl border border-border bg-background p-2 overflow-auto print:border-0 print:p-0 print:overflow-visible">
      <div className="min-w-[900px] print:min-w-0 text-foreground">
        <Spinnenweb tellers={tellers} />
      </div>
    </div>
    <p className="text-xs text-muted-foreground print:hidden">Op gsm: schuif en zoom in met twee vingers.</p>
  </div>
);

const PERIODES: { d: number; label: string }[] = [
  { d: 7, label: "7 dagen" },
  { d: 30, label: "30 dagen" },
  { d: 90, label: "90 dagen" },
  { d: 365, label: "Jaar" },
  { d: 0, label: "Alles" },
];

const GROEPEN = [
  { k: "dienst", label: "Per dienst" },
  { k: "klantType", label: "Per klanttype" },
  { k: "kanaal", label: "Per kanaal" },
  { k: "dringend", label: "Dringend" },
] as const;

const pct = (a: number, b: number) =>
  b ? `${Math.round((a / b) * 100)}%` : "–";

const JourneyPaneel = ({
  journey,
  laden,
  fout,
  periode,
  setPeriode,
  groep,
  setGroep,
}: {
  journey: JourneyResultaat | null;
  laden: boolean;
  fout: string | null;
  periode: number;
  setPeriode: (d: number) => void;
  groep: (typeof GROEPEN)[number]["k"];
  setGroep: (g: (typeof GROEPEN)[number]["k"]) => void;
}) => {
  const t = journey?.tellers ?? {};
  const appOk = journey?.app === "ok";
  const trechter = [
    { label: "Bezoekers", n: t["bezoekers"] ?? 0 },
    { label: "Aanvragen", n: t["site:formulier"] ?? 0 },
    ...(appOk
      ? [
          { label: "Taken in app", n: t["app:taken"] ?? 0 },
          { label: "Uitgevoerd", n: t["uitvoer:afgesloten"] ?? 0 },
          { label: "Gefactureerd", n: t["factuur:gemaakt"] ?? 0 },
          { label: "Volledig (betaald)", n: t["volledig"] ?? 0 },
        ]
      : []),
  ];
  const max = Math.max(1, ...trechter.map((x) => x.n));
  const rijen = journey ? groepeer(journey.trajecten, groep) : [];

  return (
    <div className="rounded-xl border border-border bg-background p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            Customer journey{" "}
            {laden && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            Hoeveel klanten elke stap en vertakking doorliepen.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 print:hidden">
          {PERIODES.map((p) => (
            <button
              key={p.d}
              type="button"
              onClick={() => setPeriode(p.d)}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                periode === p.d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {fout && <p className="text-sm text-red-600">Laden mislukt: {fout}</p>}
      {journey?.app === "niet_ingesteld" && (
        <p className="text-xs rounded-md bg-amber-500/10 border border-amber-500/30 text-foreground px-3 py-2">
          Website-cijfers zijn live. De koppeling met de werkbonnen-app (taken,
          offertes, werkbonnen, facturen) is nog niet ingesteld.
        </p>
      )}
      {journey?.app === "fout" && (
        <p className="text-xs rounded-md bg-red-500/10 border border-red-500/30 text-foreground px-3 py-2">
          Werkbonnen-app: {journey.appFout ?? "fout bij ophalen"}.
          Website-cijfers zijn wel live.
        </p>
      )}

      {/* Trechter */}
      <div className="space-y-1.5">
        {trechter.map((x, i) => (
          <div key={x.label} className="flex items-center gap-2">
            <span className="w-32 sm:w-40 shrink-0 text-xs text-foreground">
              {x.label}
            </span>
            <div className="flex-1 h-6 rounded bg-muted overflow-hidden">
              <div
                className="h-full bg-primary/80 rounded"
                style={{ width: `${Math.max(2, (x.n / max) * 100)}%` }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-xs tabular-nums">
              <span className="font-bold text-foreground">
                {x.n.toLocaleString("nl-BE")}
              </span>
              {i > 0 && (
                <span className="text-muted-foreground">
                  {" "}
                  · {pct(x.n, trechter[i - 1].n)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Resultaat per vertakking */}
      {journey && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Resultaat per vertakking (website-aanvragen)
            </h3>
            <div className="flex flex-wrap gap-1 print:hidden">
              {GROEPEN.map((g) => (
                <button
                  key={g.k}
                  type="button"
                  onClick={() => setGroep(g.k)}
                  className={`text-xs px-2 py-0.5 rounded border ${groep === g.k ? "bg-foreground text-background border-foreground" : "border-border"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          {rijen.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nog geen aanvragen in deze periode.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs min-w-[520px]">
                <thead>
                  <tr className="text-muted-foreground text-left">
                    <th className="font-semibold py-1 px-1">Vertakking</th>
                    <th className="font-semibold py-1 px-1 text-right">
                      Aanvraag
                    </th>
                    {appOk && (
                      <>
                        <th className="font-semibold py-1 px-1 text-right">
                          Taak
                        </th>
                        <th className="font-semibold py-1 px-1 text-right">
                          Offerte
                        </th>
                        <th className="font-semibold py-1 px-1 text-right">
                          Uitgevoerd
                        </th>
                        <th className="font-semibold py-1 px-1 text-right">
                          Gefactureerd
                        </th>
                        <th className="font-semibold py-1 px-1 text-right">
                          Volledig
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rijen.map((r) => (
                    <tr key={r.label} className="border-t border-border">
                      <td className="py-1.5 px-1 text-foreground">{r.label}</td>
                      <td className="py-1.5 px-1 text-right font-bold tabular-nums">
                        {r.aanvraag}
                      </td>
                      {appOk && (
                        <>
                          <td className="py-1.5 px-1 text-right tabular-nums">
                            {r.taak}
                          </td>
                          <td className="py-1.5 px-1 text-right tabular-nums">
                            {r.offerte}
                          </td>
                          <td className="py-1.5 px-1 text-right tabular-nums">
                            {r.uitgevoerd}
                          </td>
                          <td className="py-1.5 px-1 text-right tabular-nums">
                            {r.gefactureerd}
                          </td>
                          <td className="py-1.5 px-1 text-right tabular-nums">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              {r.volledig}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              · {pct(r.volledig, r.aanvraag)}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {appOk && (
            <p className="text-[11px] text-muted-foreground mt-2">
              {journey.gekoppeld} van {journey.trajecten.length}{" "}
              website-aanvragen gekoppeld aan een taak (zelfde e-mail of
              telefoon). Volledig = factuur betaald of ter plaatse afgerekend.
              {journey.afgekapt ? " Periode afgekapt op 5.000 taken." : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Werkingsproces = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fases.map((f) => [f.id, true])),
  );
  const [zoek, setZoek] = useState("");
  const [params, setParams] = useSearchParams();
  const versie: Versie = (
    ["detail", "eenvoudig", "overzicht"] as const
  ).includes(params.get("versie") as Versie)
    ? (params.get("versie") as Versie)
    : "detail";
  const zetVersie = (v: Versie) =>
    setParams(v === "detail" ? {} : { versie: v }, { replace: true });
  const [details, setDetails] = useState(true);
  const [periode, setPeriode] = useState<number>(30);
  const [journey, setJourney] = useState<JourneyResultaat | null>(null);
  const [journeyLaden, setJourneyLaden] = useState(false);
  const [journeyFout, setJourneyFout] = useState<string | null>(null);
  const [groep, setGroep] = useState<
    "dienst" | "klantType" | "kanaal" | "dringend"
  >("dienst");
  const q = zoek.trim().toLowerCase();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let stop = false;
    setJourneyLaden(true);
    setJourneyFout(null);
    const from =
      periode === 0
        ? new Date("2026-01-01T00:00:00Z")
        : new Date(Date.now() - periode * 864e5);
    laadJourney(from)
      .then((r) => !stop && setJourney(r))
      .catch(
        (e) =>
          !stop &&
          setJourneyFout(e instanceof Error ? e.message : "Laden mislukt"),
      )
      .finally(() => !stop && setJourneyLaden(false));
    return () => {
      stop = true;
    };
  }, [user, isAdmin, periode]);

  useEffect(() => {
    document.title = "Werkingsproces — Riory Admin";
  }, []);

  const zichtbaar = useMemo(
    () =>
      fases.filter(
        (f) =>
          !q ||
          f.titel.toLowerCase().includes(q) ||
          f.stappen.some((s) => matches(s, q)),
      ),
    [q],
  );
  const openPunten = useMemo(() => {
    const out: { fase: string; titel: string; status: Status }[] = [];
    const walk = (lijst: Stap[], fase: string) =>
      lijst.forEach((s) => {
        if (s.status && s.status !== "actief")
          out.push({ fase, titel: s.titel, status: s.status });
        walk(s.stappen ?? [], fase);
        s.takken?.forEach((t) => walk(t.stappen, fase));
      });
    fases.forEach((f) => walk(f.stappen, f.titel));
    return out;
  }, []);

  const allesOpen = fases.every((f) => open[f.id]);
  const toggleAlles = () =>
    setOpen(Object.fromEntries(fases.map((f) => [f.id, !allesOpen])));

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground font-body">Laden...</p>
      </div>
    );
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
          <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground truncate">
            Werkingsproces
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Afdrukken / PDF</span>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-4">
        <VersieKiezer versie={versie} zet={zetVersie} />
        {versie === "detail" ? (
          <>
            <div className="rounded-xl border border-border bg-background p-4">
              <h2 className="font-heading font-bold text-foreground">
                Alles wat Riory doet, van eerste klik tot boekhouding
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {fases.length} fases ·{" "}
                {telStappen(fases.flatMap((f) => f.stappen))} stappen · versie{" "}
                {PROCES_VERSIE}. Vertakkingen (
                <GitBranch className="inline w-3.5 h-3.5 text-primary" />) tonen
                de keuzes; elk blok is een mogelijk pad.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(Object.keys(SYS) as Systeem[]).map((s) => (
                  <Badge key={s} sys={s} />
                ))}
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS.deels.cls}`}
                >
                  Deels
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS.open.cls}`}
                >
                  Nog te doen
                </span>
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
                <Button
                  variant={details ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDetails((d) => !d)}
                >
                  {details ? "Details verbergen" : "Details tonen"}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleAlles}>
                  {allesOpen ? "Alles inklappen" : "Alles uitklappen"}
                </Button>
              </div>
            </div>

            {/* Customer journey */}
            <JourneyPaneel
              journey={journey}
              laden={journeyLaden}
              fout={journeyFout}
              periode={periode}
              setPeriode={setPeriode}
              groep={groep}
              setGroep={setGroep}
            />

            {/* Flow */}
            <div className="space-y-3">
              {zichtbaar.map((f, i) => (
                <div key={f.id}>
                  <FaseKaart
                    fase={f}
                    q={q}
                    details={details}
                    tellers={journey?.tellers ?? null}
                    open={!!q || !!open[f.id]}
                    onToggle={() =>
                      setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))
                    }
                  />
                  {i < zichtbaar.length - 1 && (
                    <div className="flex justify-center py-1" aria-hidden>
                      <span className="text-primary text-lg leading-none">
                        ↓
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {zichtbaar.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Geen stap gevonden voor "{zoek}".
                </p>
              )}
            </div>

            {/* Openstaande punten */}
            {openPunten.length > 0 && (
              <div className="rounded-xl border border-border bg-background p-4">
                <h2 className="font-heading font-bold text-foreground mb-2">
                  Nog niet volledig / te doen
                </h2>
                <ul className="space-y-1.5">
                  {openPunten.map((p) => (
                    <li
                      key={`${p.fase}-${p.titel}`}
                      className="flex flex-wrap items-center gap-2 text-sm"
                    >
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS[p.status as "deels" | "open"].cls}`}
                      >
                        {STATUS[p.status as "deels" | "open"].label}
                      </span>
                      <span className="text-foreground">{p.titel}</span>
                      <span className="text-muted-foreground text-xs">
                        — {p.fase}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : versie === "eenvoudig" ? (
          <div className="max-w-xl mx-auto">
            <Eenvoudig tellers={journey?.tellers ?? null} />
          </div>
        ) : (
          <Overzicht tellers={journey?.tellers ?? null} />
        )}
      </main>
    </div>
  );
};

export default Werkingsproces;
