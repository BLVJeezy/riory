import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  FolderOpen,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Receipt,
  Star,
} from "lucide-react";
import logo from "@/assets/riory-logo-black.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  PortalAuthError,
  STAGE_LABEL,
  downloadDocument,
  groupProjects,
  loadOverview,
  loginTokenFromHash,
  portalAuth,
  requestAppointment,
  requestLoginLink,
  verifyLoginToken,
  type PortalInvoiceState,
  type PortalOverview,
  type PortalStage,
} from "@/lib/klantportaal";

type Tab = "overzicht" | "projecten" | "facturen" | "offertes" | "afspraak";
type WorkOrder = PortalOverview["workOrders"][number];
type Invoice = PortalOverview["invoices"][number];

const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJcykqZXYpckQR_ScOKGU8I64";
const euro = (n: number) => new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

function formatDate(d: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!d) return "—";
  const parsed = new Date(d.length === 10 ? `${d}T12:00:00` : d);
  return Number.isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString("nl-BE", opts);
}

function localToday() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

const werkbonNr = (n: number | null) => (n ? `#${n}` : "Nieuw");

const STAGE_STYLE: Record<PortalStage, string> = {
  aangevraagd: "bg-slate-100 text-slate-700",
  offerte: "bg-violet-50 text-violet-700",
  gepland: "bg-sky-50 text-sky-700",
  afgewerkt: "bg-emerald-50 text-emerald-700",
};

const INVOICE_STYLE: Record<PortalInvoiceState, { label: string; cls: string }> = {
  betaald: { label: "Betaald", cls: "bg-emerald-50 text-emerald-700" },
  open: { label: "Open", cls: "bg-amber-50 text-amber-700" },
  vervallen: { label: "Vervallen", cls: "bg-red-50 text-red-700" },
  creditnota: { label: "Creditnota", cls: "bg-slate-100 text-slate-700" },
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>{children}</span>;
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]", className)}>{children}</section>;
}

function Empty({ icon: Icon, text }: { icon: typeof FileText; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-gray-500">
      <Icon className="h-6 w-6 text-gray-400" />
      {text}
    </div>
  );
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

// ---------------------------------------------------------------------------
// Inloggen
// ---------------------------------------------------------------------------

function LoginView({ initialError }: { initialError: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await requestLoginLink(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex items-center justify-between">
          <a href="/" aria-label="Riory home">
            <img src={logo} alt="Riory" className="h-7 w-auto" />
          </a>
          <a href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> riory.be
          </a>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Check uw mailbox</h1>
                <p className="text-sm leading-relaxed text-gray-500">
                  Is <span className="font-medium text-gray-900">{email.trim().toLowerCase()}</span> bij ons gekend? Dan
                  ontvangt u binnen een minuut een inloglink van Riory.
                </p>
              </div>
              <ul className="space-y-1.5 rounded-xl bg-[#f6f5f2] p-4 text-left text-sm text-gray-500">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Gebruik het e-mailadres waarop u facturen van Riory ontvangt.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Kijk ook even in uw map ongewenste e-mail.
                </li>
              </ul>
              <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
                Ander e-mailadres gebruiken
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Klantenportaal</h1>
                <p className="text-sm leading-relaxed text-gray-500">
                  Log in met het e-mailadres waarop u facturen van Riory ontvangt. U krijgt een veilige inloglink, zonder
                  wachtwoord.
                </p>
              </div>
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="portal-email">E-mailadres</Label>
                <Input
                  id="portal-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="naam@voorbeeld.be"
                  required
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button className="h-11 w-full text-[15px] font-semibold" disabled={busy}>
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Stuur mij een inloglink"}
              </Button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-gray-500">
          Vragen? Mail naar{" "}
          <a className="underline underline-offset-2" href="mailto:info@riory.be">
            info@riory.be
          </a>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portaal
// ---------------------------------------------------------------------------

function PortalView({ data, onReload, onLogout }: { data: PortalOverview; onReload: () => Promise<void>; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    return t === "afspraak" || t === "facturen" || t === "projecten" || t === "offertes" ? t : "overzicht";
  });
  const [downloading, setDownloading] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [contactPhone, setContactPhone] = useState(data.customer?.phone ?? "");
  const [projectName, setProjectName] = useState("");
  const [customerId, setCustomerId] = useState(data.customer?.id ?? "");
  const [urgent, setUrgent] = useState(false);
  const [worksiteDifferent, setWorksiteDifferent] = useState(false);
  const [worksiteStreet, setWorksiteStreet] = useState("");
  const [worksiteHouseNumber, setWorksiteHouseNumber] = useState("");
  const [worksitePostalCode, setWorksitePostalCode] = useState("");
  const [worksiteCity, setWorksiteCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleDownload(type: "factuur" | "werkbon", id: string) {
    setDownloading(id);
    try {
      await downloadDocument(type, id);
    } catch (e) {
      if (e instanceof PortalAuthError) return onLogout();
      toast.error(e instanceof Error ? e.message : "Downloaden mislukt.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestAppointment({
        description,
        preferredWindow: preferredWindow || undefined,
        contactPhone: contactPhone || undefined,
        projectName: projectName || undefined,
        customerId: customerId || undefined,
        urgent,
        worksiteDifferent,
        worksiteStreet: worksiteDifferent ? worksiteStreet : undefined,
        worksiteHouseNumber: worksiteDifferent ? worksiteHouseNumber : undefined,
        worksitePostalCode: worksiteDifferent ? worksitePostalCode : undefined,
        worksiteCity: worksiteDifferent ? worksiteCity : undefined,
      });
      toast.success("Uw aanvraag is ontvangen. Riory plant deze zo snel mogelijk in.");
      setDescription("");
      setPreferredWindow("");
      setProjectName("");
      setUrgent(false);
      setWorksiteDifferent(false);
      setWorksiteStreet("");
      setWorksiteHouseNumber("");
      setWorksitePostalCode("");
      setWorksiteCity("");
      setTab("projecten");
      await onReload();
    } catch (err) {
      if (err instanceof PortalAuthError) return onLogout();
      toast.error(err instanceof Error ? err.message : "Aanvraag verzenden mislukt.");
    } finally {
      setSubmitting(false);
    }
  }

  const stats = useMemo(() => {
    const today = localToday();
    const openInvoices = data.invoices.filter((i) => i.state === "open" || i.state === "vervallen");
    return {
      running: data.workOrders.filter((w) => w.stage !== "afgewerkt").length,
      openAmount: openInvoices.reduce((s, i) => s + i.openAmount, 0),
      openCount: openInvoices.length,
      toSign: data.quotes.filter((q) => q.signUrl).length,
      next: [...data.workOrders]
        .filter((w) => w.stage === "gepland" && w.scheduledDate && w.scheduledDate >= today)
        .sort((a, b) => (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? ""))[0],
      lastDone: data.workOrders.find((w) => w.stage === "afgewerkt"),
    };
  }, [data]);

  const projects = useMemo(() => groupProjects(data.workOrders), [data]);
  const displayName = (data.customer?.name ?? "").trim();
  const tabs: { key: Tab; label: string; icon: typeof FileText; count?: number }[] = [
    { key: "overzicht", label: "Overzicht", icon: LayoutGrid },
    { key: "projecten", label: "Werkbonnen", icon: FolderOpen, count: data.workOrders.length },
    { key: "facturen", label: "Facturen", icon: Receipt, count: data.invoices.length },
    { key: "offertes", label: "Offertes", icon: FileSignature, count: data.quotes.length },
    { key: "afspraak", label: "Afspraak aanvragen", icon: CalendarPlus },
  ];

  const WorkOrderRow = ({ w }: { w: WorkOrder }) => (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">Werkbon {werkbonNr(w.number)}</span>
          <Pill className={STAGE_STYLE[w.stage]}>{STAGE_LABEL[w.stage]}</Pill>
          {w.urgent && w.stage !== "afgewerkt" && <Pill className="bg-red-50 text-red-700">Dringend</Pill>}
        </div>
        {w.description && <p className="line-clamp-2 text-sm text-gray-500">{w.description}</p>}
        <p className="text-xs text-gray-500">
          {w.stage === "afgewerkt"
            ? `Afgewerkt op ${formatDate(w.signedAt ?? w.scheduledDate)}`
            : w.scheduledDate
              ? `Gepland op ${formatDate(w.scheduledDate, { weekday: "long", day: "numeric", month: "long" })}${
                  w.scheduledFrom ? ` · ${w.scheduledFrom}${w.scheduledUntil ? `–${w.scheduledUntil}` : ""}` : ""
                }`
              : `Aangevraagd op ${formatDate(w.createdAt)}`}
        </p>
      </div>
      {w.hasPdf && (
        <Button variant="outline" size="sm" className="shrink-0 gap-2" disabled={downloading === w.id} onClick={() => handleDownload("werkbon", w.id)}>
          {downloading === w.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Werkbon (PDF)
        </Button>
      )}
    </div>
  );

  const InvoiceRow = ({ i }: { i: Invoice }) => {
    const st = INVOICE_STYLE[i.state];
    return (
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900">
              {i.kind === "creditnota" ? "Creditnota" : "Factuur"} {i.number}
            </span>
            <Pill className={st.cls}>{st.label}</Pill>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(i.issueDate)}
            {i.state !== "betaald" && i.state !== "creditnota" && i.dueDate ? ` · vervalt ${formatDate(i.dueDate)}` : ""}
            {i.workOrderNumber ? ` · werkbon #${i.workOrderNumber}` : ""}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <p className="font-semibold tabular-nums text-gray-900">{euro(i.total)}</p>
            {(i.state === "open" || i.state === "vervallen") && i.openAmount !== i.total && (
              <p className="text-xs tabular-nums text-gray-500">nog {euro(i.openAmount)} open</p>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-2" disabled={downloading === i.id} onClick={() => handleDownload("factuur", i.id)}>
            {downloading === i.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            PDF
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Riory" className="h-6 w-auto" />
            <span className="hidden border-l pl-3 text-sm font-medium text-gray-500 sm:inline">Klantenportaal</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-sm text-gray-500 md:inline">{data.accountEmail}</span>
            <Button variant="ghost" size="sm" className="gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Uitloggen</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{displayName ? `Welkom, ${displayName}` : "Welkom"}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {data.customers.length > 1
                ? `${data.customers.length} adressen gekoppeld aan ${data.accountEmail}`
                : "Al uw werkbonnen, facturen en offertes bij Riory op één plek."}
            </p>
          </div>
          <Button className="h-10 gap-2 font-semibold" onClick={() => setTab("afspraak")}>
            <CalendarPlus className="h-4 w-4" /> Nieuwe afspraak
          </Button>
        </div>

        <nav aria-label="Klantenportaal" className="-mx-4 overflow-x-auto px-4">
          <div className="inline-flex min-w-full gap-1 rounded-xl border border-black/5 bg-white p-1 sm:min-w-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-current={tab === t.key ? "page" : undefined}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  tab === t.key ? "bg-[#1e2e34] text-white" : "text-gray-500 hover:bg-black/[0.03] hover:text-gray-900",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.count ? (
                  <span className={cn("rounded-full px-1.5 text-xs", tab === t.key ? "bg-white/15" : "bg-black/5")}>{t.count}</span>
                ) : null}
              </button>
            ))}
          </div>
        </nav>

        {tab === "overzicht" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Panel className="p-3.5 sm:p-5">
                <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-gray-500 sm:text-xs">Lopende opdrachten</p>
                <p className="mt-1.5 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-3xl">{stats.running}</p>
              </Panel>
              <Panel className="p-3.5 sm:p-5">
                <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-gray-500 sm:text-xs">Openstaand</p>
                <p className={cn("mt-1.5 text-lg font-bold tabular-nums sm:mt-2 sm:text-3xl", stats.openAmount > 0 ? "text-amber-700" : "text-gray-900")}>
                  {euro(stats.openAmount)}
                </p>
                <p className="text-xs text-gray-500">{stats.openCount === 1 ? "1 factuur" : `${stats.openCount} facturen`}</p>
              </Panel>
              <Panel className="p-3.5 sm:p-5">
                <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-gray-500 sm:text-xs">Offertes te tekenen</p>
                <p className="mt-1.5 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-3xl">{stats.toSign}</p>
              </Panel>
            </div>

            {stats.next && (
              <Panel className="flex items-start gap-4 border-sky-100 bg-sky-50/60 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                  <CalendarClock className="h-5 w-5 text-sky-700" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-sky-900">Volgende afspraak</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(stats.next.scheduledDate, { weekday: "long", day: "numeric", month: "long" })}
                    {stats.next.scheduledFrom ? ` · ${stats.next.scheduledFrom}${stats.next.scheduledUntil ? `–${stats.next.scheduledUntil}` : ""}` : ""}
                  </p>
                  {stats.next.address && (
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {stats.next.address}
                    </p>
                  )}
                </div>
              </Panel>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel>
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="font-semibold text-gray-900">Recente werkbonnen</h2>
                  <button className="inline-flex items-center gap-1 text-sm text-primary" onClick={() => setTab("projecten")}>
                    Alles <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {data.workOrders.length ? (
                  <div className="divide-y">{data.workOrders.slice(0, 4).map((w) => <WorkOrderRow key={w.id} w={w} />)}</div>
                ) : (
                  <Empty icon={FolderOpen} text="Nog geen werkbonnen." />
                )}
              </Panel>
              <Panel>
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h2 className="font-semibold text-gray-900">Recente facturen</h2>
                  <button className="inline-flex items-center gap-1 text-sm text-primary" onClick={() => setTab("facturen")}>
                    Alles <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {data.invoices.length ? (
                  <div className="divide-y">{data.invoices.slice(0, 4).map((i) => <InvoiceRow key={i.id} i={i} />)}</div>
                ) : (
                  <Empty icon={Receipt} text="Nog geen facturen." />
                )}
              </Panel>
            </div>

            {stats.lastDone && (
              <Panel className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Tevreden over onze service?</span> Een Google-review helpt ons enorm.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
                    Review schrijven
                  </a>
                </Button>
              </Panel>
            )}
          </div>
        )}

        {tab === "projecten" && (
          <div className="space-y-4">
            {projects.length ? (
              projects.map((p) => (
                <Panel key={p.key}>
                  <div className="flex items-center gap-3 border-b px-5 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-gray-900">{p.title}</h2>
                      <p className="text-xs text-gray-500">
                        {p.subtitle ? `${p.subtitle} · ` : ""}
                        {p.items.length === 1 ? "1 werkbon" : `${p.items.length} werkbonnen`}
                      </p>
                    </div>
                  </div>
                  <div className="divide-y">{p.items.map((w) => <WorkOrderRow key={w.id} w={w} />)}</div>
                </Panel>
              ))
            ) : (
              <Panel>
                <Empty icon={FolderOpen} text="Nog geen werkbonnen. Vraag hierboven een afspraak aan." />
              </Panel>
            )}
          </div>
        )}

        {tab === "facturen" && (
          <Panel>
            {data.invoices.length ? (
              <div className="divide-y">{data.invoices.map((i) => <InvoiceRow key={i.id} i={i} />)}</div>
            ) : (
              <Empty icon={Receipt} text="Nog geen facturen." />
            )}
          </Panel>
        )}

        {tab === "offertes" && (
          <Panel>
            {data.quotes.length ? (
              <div className="divide-y">
                {data.quotes.map((q) => (
                  <div key={q.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {q.kind === "verzekering" ? "Bestek" : "Offerte"} {q.number}
                        </span>
                        {q.signUrl ? (
                          <Pill className="bg-amber-50 text-amber-700">Wacht op handtekening</Pill>
                        ) : (
                          <Pill className="bg-emerald-50 text-emerald-700">Goedgekeurd</Pill>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(q.date)}
                        {q.signedAt ? ` · getekend ${formatDate(q.signedAt)}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="font-semibold tabular-nums text-gray-900">{euro(q.total)}</p>
                      {q.signUrl && (
                        <Button asChild size="sm">
                          <a href={q.signUrl} target="_blank" rel="noopener noreferrer">
                            Bekijken &amp; tekenen
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={FileSignature} text="Geen offertes." />
            )}
          </Panel>
        )}

        {tab === "afspraak" && (
          <Panel className="p-5 sm:p-7">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">Nieuwe afspraak aanvragen</h2>
                <p className="text-sm text-gray-500">Beschrijf kort het probleem. Riory neemt contact op om een moment in te plannen.</p>
              </div>
              {data.customers.length > 1 && (
                <div className="space-y-1.5">
                  <Label htmlFor="pa-customer">Adres</Label>
                  <select
                    id="pa-customer"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    {data.customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {[c.street, c.house_number].filter(Boolean).join(" ")}
                        {c.city ? `, ${c.city}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="pa-desc">Wat is het probleem?</Label>
                <Textarea
                  id="pa-desc"
                  required
                  minLength={5}
                  rows={4}
                  placeholder="Bv. wc loopt niet meer door, afvoer keuken verstopt…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-window">Voorkeur moment (optioneel)</Label>
                  <Input id="pa-window" placeholder="Bv. dinsdag voormiddag" value={preferredWindow} onChange={(e) => setPreferredWindow(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-phone">Telefoon</Label>
                  <Input id="pa-phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pa-project">Project of referentie (optioneel)</Label>
                <Input id="pa-project" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>
              <div className="space-y-3 rounded-xl bg-[#f6f5f2] p-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={urgent} onCheckedChange={(v) => setUrgent(v === true)} /> Dringend
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={worksiteDifferent} onCheckedChange={(v) => setWorksiteDifferent(v === true)} /> Werken op een ander adres
                </label>
                {worksiteDifferent && (
                  <div className="grid gap-3 pt-1 sm:grid-cols-[1fr_100px]">
                    <Input placeholder="Straat" value={worksiteStreet} onChange={(e) => setWorksiteStreet(e.target.value)} required />
                    <Input placeholder="Nr." value={worksiteHouseNumber} onChange={(e) => setWorksiteHouseNumber(e.target.value)} />
                    <Input placeholder="Postcode" value={worksitePostalCode} onChange={(e) => setWorksitePostalCode(e.target.value)} />
                    <Input placeholder="Gemeente" value={worksiteCity} onChange={(e) => setWorksiteCity(e.target.value)} required />
                  </div>
                )}
              </div>
              <Button className="h-11 w-full gap-2 font-semibold sm:w-auto" disabled={submitting}>
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
                Aanvraag versturen
              </Button>
            </form>
          </Panel>
        )}
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------

export default function Klantportaal() {
  useDocumentMeta("Klantenportaal | Riory", "Uw werkbonnen, facturen en offertes bij Riory op één plek.");
  useNoIndex();
  const [state, setState] = useState<"loading" | "login" | "portal">("loading");
  const [data, setData] = useState<PortalOverview | null>(null);
  const [loginError, setLoginError] = useState("");

  async function load() {
    try {
      setData(await loadOverview());
      setState("portal");
    } catch (e) {
      if (!(e instanceof PortalAuthError)) setLoginError(e instanceof Error ? e.message : "Inloggen mislukt.");
      await portalAuth.auth.signOut().catch(() => undefined);
      setState("login");
    }
  }

  useEffect(() => {
    (async () => {
      const token = loginTokenFromHash(window.location.hash);
      if (token) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        if (!(await verifyLoginToken(token))) {
          setLoginError("Deze inloglink is verlopen of al gebruikt. Vraag hieronder een nieuwe aan.");
          setState("login");
          return;
        }
      }
      const { data: s } = await portalAuth.auth.getSession();
      if (!s.session) {
        setState("login");
        return;
      }
      await load();
    })();
  }, []);

  async function logout() {
    await portalAuth.auth.signOut().catch(() => undefined);
    setData(null);
    setLoginError("");
    setState("login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f5f2] font-body text-gray-900">
      <div className="h-1.5 w-full bg-primary" />
      {state === "loading" ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" /> Even geduld…
        </div>
      ) : state === "login" || !data ? (
        <LoginView initialError={loginError} />
      ) : (
        <PortalView data={data} onReload={load} onLogout={logout} />
      )}
    </div>
  );
}
