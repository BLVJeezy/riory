import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Download,
  FileSignature,
  LoaderCircle,
  LogOut,
  Mail,
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

const GOOGLE_LOGIN_URL = "https://werkbonnen.riory.be/klantportaal-google?start=1";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const LOGIN_ERRORS: Record<string, string> = {
  "geen-klant": "Dit Google-account is niet gekend als klant van Riory. Log in met het e-mailadres van uw facturen of mail naar info@riory.be.",
  google: "Inloggen met Google is niet gelukt. Probeer opnieuw of vraag een inloglink per mail.",
};

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
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                of
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <a
                href={GOOGLE_LOGIN_URL}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50"
              >
                <GoogleIcon />
                Inloggen met Google
              </a>
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

function Section({
  title,
  count,
  children,
  action,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          {title}
          {count ? <span className="rounded-full bg-black/5 px-2 text-xs font-medium text-gray-600">{count}</span> : null}
        </h2>
        {action}
      </div>
      {children}
    </Panel>
  );
}

function ShowMore({ total, shown, onClick }: { total: number; shown: number; onClick: () => void }) {
  if (total <= shown) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-t px-5 py-3 text-sm font-medium text-primary hover:bg-black/[0.02]"
    >
      Toon alle {total}
    </button>
  );
}

function PortalView({ data, onReload, onLogout }: { data: PortalOverview; onReload: () => Promise<void>; onLogout: () => void }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [allWorkOrders, setAllWorkOrders] = useState(false);
  const [allInvoices, setAllInvoices] = useState(false);

  const [description, setDescription] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [contactPhone, setContactPhone] = useState(data.customer?.phone ?? "");
  const [customerId, setCustomerId] = useState(data.customer?.id ?? "");
  const [urgent, setUrgent] = useState(false);
  const [worksiteDifferent, setWorksiteDifferent] = useState(false);
  const [worksiteStreet, setWorksiteStreet] = useState("");
  const [worksiteHouseNumber, setWorksiteHouseNumber] = useState("");
  const [worksitePostalCode, setWorksitePostalCode] = useState("");
  const [worksiteCity, setWorksiteCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "afspraak") {
      setTimeout(() => document.getElementById("afspraak")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);

  const scrollToForm = () => {
    document.getElementById("afspraak")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("pa-desc")?.focus({ preventScroll: true }), 450);
  };

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
        customerId: customerId || undefined,
        urgent,
        worksiteDifferent,
        worksiteStreet: worksiteDifferent ? worksiteStreet : undefined,
        worksiteHouseNumber: worksiteDifferent ? worksiteHouseNumber : undefined,
        worksitePostalCode: worksiteDifferent ? worksitePostalCode : undefined,
        worksiteCity: worksiteDifferent ? worksiteCity : undefined,
      });
      toast.success("Uw aanvraag is ontvangen. Riory neemt snel contact op.");
      setDescription("");
      setPreferredWindow("");
      setUrgent(false);
      setWorksiteDifferent(false);
      setWorksiteStreet("");
      setWorksiteHouseNumber("");
      setWorksitePostalCode("");
      setWorksiteCity("");
      await onReload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof PortalAuthError) return onLogout();
      toast.error(err instanceof Error ? err.message : "Aanvraag verzenden mislukt.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = localToday();
  const openInvoices = data.invoices.filter((i) => i.state === "open" || i.state === "vervallen");
  const openAmount = openInvoices.reduce((s, i) => s + i.openAmount, 0);
  const toSign = data.quotes.filter((q) => q.signUrl);
  const next = [...data.workOrders]
    .filter((w) => w.stage === "gepland" && w.scheduledDate && w.scheduledDate >= today)
    .sort((a, b) => (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? ""))[0];
  const hasDone = data.workOrders.some((w) => w.stage === "afgewerkt");
  const firstName = (data.customer?.name ?? "").trim();
  const workOrders = allWorkOrders ? data.workOrders : data.workOrders.slice(0, 5);
  const invoices = allInvoices ? data.invoices : data.invoices.slice(0, 5);

  const WorkOrderRow = ({ w }: { w: WorkOrder }) => (
    <div className="flex items-start justify-between gap-3 px-4 py-3.5 sm:px-5">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">Werkbon {werkbonNr(w.number)}</span>
          <Pill className={STAGE_STYLE[w.stage]}>{STAGE_LABEL[w.stage]}</Pill>
        </div>
        {w.description && <p className="line-clamp-2 text-sm text-gray-600">{w.description}</p>}
        <p className="text-xs text-gray-500">
          {w.stage === "afgewerkt"
            ? formatDate(w.signedAt ?? w.scheduledDate)
            : w.scheduledDate
              ? `${formatDate(w.scheduledDate, { weekday: "short", day: "numeric", month: "short" })}${w.scheduledFrom ? ` · ${w.scheduledFrom}` : ""}`
              : `Aangevraagd ${formatDate(w.createdAt)}`}
          {w.address ? ` · ${w.address}` : ""}
        </p>
      </div>
      {w.hasPdf && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 px-3"
          disabled={downloading === w.id}
          onClick={() => handleDownload("werkbon", w.id)}
          aria-label={`Werkbon ${werkbonNr(w.number)} downloaden`}
        >
          {downloading === w.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden sm:inline">PDF</span>
        </Button>
      )}
    </div>
  );

  const InvoiceRow = ({ i }: { i: Invoice }) => {
    const st = INVOICE_STYLE[i.state];
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">
              {i.kind === "creditnota" ? "Creditnota" : "Factuur"} {i.number}
            </span>
            <Pill className={st.cls}>{st.label}</Pill>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(i.issueDate)}
            {(i.state === "open" || i.state === "vervallen") && i.dueDate ? ` · te betalen voor ${formatDate(i.dueDate)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-semibold tabular-nums text-gray-900">{euro(i.total)}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 px-3"
            disabled={downloading === i.id}
            onClick={() => handleDownload("factuur", i.id)}
            aria-label={`Factuur ${i.number} downloaden`}
          >
            {downloading === i.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" aria-label="riory.be">
            <img src={logo} alt="Riory" className="h-6 w-auto sm:h-7" />
          </a>
          <div className="flex items-center gap-1 sm:gap-3">
            <span className="hidden max-w-[240px] truncate text-sm text-gray-500 md:inline">{data.accountEmail}</span>
            <Button variant="ghost" size="sm" className="gap-2" onClick={onLogout} aria-label="Uitloggen">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Uitloggen</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:pt-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {firstName ? `Welkom, ${firstName}` : "Welkom"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Uw werkbonnen, facturen en afspraken bij Riory.</p>
          </div>
          <Button className="h-11 gap-2 font-semibold lg:hidden" onClick={scrollToForm}>
            <CalendarPlus className="h-4 w-4" /> Nieuwe afspraak
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-5">
            {(next || openInvoices.length > 0 || toSign.length > 0) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {next && (
                  <Panel className="flex items-start gap-3 border-sky-100 bg-sky-50/70 p-4">
                    <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Volgende afspraak</p>
                      <p className="mt-0.5 font-semibold text-gray-900">
                        {formatDate(next.scheduledDate, { weekday: "long", day: "numeric", month: "long" })}
                        {next.scheduledFrom ? ` · ${next.scheduledFrom}${next.scheduledUntil ? `–${next.scheduledUntil}` : ""}` : ""}
                      </p>
                      {next.address && <p className="truncate text-sm text-gray-600">{next.address}</p>}
                    </div>
                  </Panel>
                )}
                {openInvoices.length > 0 && (
                  <Panel className="flex items-start gap-3 border-amber-100 bg-amber-50/70 p-4">
                    <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Te betalen</p>
                      <p className="mt-0.5 font-semibold text-gray-900">{euro(openAmount)}</p>
                      <p className="text-sm text-gray-600">
                        {openInvoices.length === 1 ? "1 open factuur" : `${openInvoices.length} open facturen`} — zie hieronder
                      </p>
                    </div>
                  </Panel>
                )}
                {toSign.length > 0 && (
                  <Panel className="flex items-start gap-3 border-violet-100 bg-violet-50/70 p-4">
                    <FileSignature className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">Te tekenen</p>
                      <p className="mt-0.5 font-semibold text-gray-900">
                        {toSign.length === 1 ? "1 offerte" : `${toSign.length} offertes`}
                      </p>
                      <a href={toSign[0]!.signUrl!} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary">
                        Bekijken &amp; tekenen →
                      </a>
                    </div>
                  </Panel>
                )}
              </div>
            )}

            <Section title="Werkbonnen" count={data.workOrders.length}>
              {data.workOrders.length ? (
                <>
                  <div className="divide-y">{workOrders.map((w) => <WorkOrderRow key={w.id} w={w} />)}</div>
                  {!allWorkOrders && <ShowMore total={data.workOrders.length} shown={5} onClick={() => setAllWorkOrders(true)} />}
                </>
              ) : (
                <p className="px-5 py-6 text-sm text-gray-500">Nog geen werkbonnen. Vraag hiernaast een afspraak aan.</p>
              )}
            </Section>

            <Section title="Facturen" count={data.invoices.length}>
              {data.invoices.length ? (
                <>
                  <div className="divide-y">{invoices.map((i) => <InvoiceRow key={i.id} i={i} />)}</div>
                  {!allInvoices && <ShowMore total={data.invoices.length} shown={5} onClick={() => setAllInvoices(true)} />}
                </>
              ) : (
                <p className="px-5 py-6 text-sm text-gray-500">Nog geen facturen.</p>
              )}
            </Section>

            {data.quotes.length > 0 && (
              <Section title="Offertes" count={data.quotes.length}>
                <div className="divide-y">
                  {data.quotes.map((q) => (
                    <div key={q.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {q.kind === "verzekering" ? "Bestek" : "Offerte"} {q.number}
                          </span>
                          {q.signUrl ? (
                            <Pill className="bg-violet-50 text-violet-700">Te tekenen</Pill>
                          ) : (
                            <Pill className="bg-emerald-50 text-emerald-700">Goedgekeurd</Pill>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(q.date)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-semibold tabular-nums text-gray-900">{euro(q.total)}</span>
                        {q.signUrl && (
                          <Button asChild size="sm" className="h-9">
                            <a href={q.signUrl} target="_blank" rel="noopener noreferrer">
                              Tekenen
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-20">
            <Panel className="scroll-mt-20 p-4 sm:p-5" >
              <form id="afspraak" onSubmit={handleSubmit} className="scroll-mt-24 space-y-4">
                <div>
                  <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                    <CalendarPlus className="h-4 w-4 text-primary" /> Nieuwe afspraak
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">Riory neemt contact op om een moment te plannen.</p>
                </div>
                {data.customers.length > 1 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-customer">Adres</Label>
                    <select
                      id="pa-customer"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    >
                      {data.customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {[c.street, c.house_number].filter(Boolean).join(" ") || c.name}
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
                    rows={3}
                    placeholder="Bv. wc verstopt, afvoer keuken loopt traag…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-window">Voorkeur</Label>
                    <Input id="pa-window" className="h-11" placeholder="Bv. di voormiddag" value={preferredWindow} onChange={(e) => setPreferredWindow(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-phone">Telefoon</Label>
                    <Input id="pa-phone" className="h-11" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox checked={urgent} onCheckedChange={(v) => setUrgent(v === true)} /> Dringend
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox checked={worksiteDifferent} onCheckedChange={(v) => setWorksiteDifferent(v === true)} /> Ander werkadres
                  </label>
                </div>
                {worksiteDifferent && (
                  <div className="grid grid-cols-[1fr_80px] gap-2">
                    <Input className="h-11" placeholder="Straat" value={worksiteStreet} onChange={(e) => setWorksiteStreet(e.target.value)} required />
                    <Input className="h-11" placeholder="Nr." value={worksiteHouseNumber} onChange={(e) => setWorksiteHouseNumber(e.target.value)} />
                    <Input className="h-11" placeholder="Gemeente" value={worksiteCity} onChange={(e) => setWorksiteCity(e.target.value)} required />
                    <Input className="h-11" placeholder="Postcode" value={worksitePostalCode} onChange={(e) => setWorksitePostalCode(e.target.value)} />
                  </div>
                )}
                <Button className="h-11 w-full gap-2 font-semibold" disabled={submitting}>
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Aanvraag versturen
                </Button>
              </form>
            </Panel>

            <Panel className="space-y-1 p-4 text-sm sm:p-5">
              <p className="font-semibold text-gray-900">Dringend? Bel ons</p>
              <a href="tel:+32472502814" className="block text-lg font-semibold text-primary">
                +32 472 50 28 14
              </a>
              <p className="text-gray-500">
                of mail naar{" "}
                <a href="mailto:info@riory.be" className="underline underline-offset-2">
                  info@riory.be
                </a>
              </p>
              {hasDone && (
                <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-medium text-primary">
                  <Star className="h-4 w-4" /> Laat een Google-review achter
                </a>
              )}
            </Panel>
          </aside>
        </div>
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
      await portalAuth.auth.signOut({ scope: "local" }).catch(() => undefined);
      setState("login");
    }
  }

  useEffect(() => {
    (async () => {
      const fout = new URLSearchParams(window.location.search).get("fout");
      if (fout) {
        setLoginError(LOGIN_ERRORS[fout] ?? LOGIN_ERRORS.google);
        window.history.replaceState(null, "", window.location.pathname);
      }
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
    await portalAuth.auth.signOut({ scope: "local" }).catch(() => undefined);
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
