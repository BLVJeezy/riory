import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  KeyRound,
  EyeOff,
  FileText,
  Info,
  Clock,
  Sunset,
  Sunrise,
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  LayoutGrid,
  LifeBuoy,
  Search,
  Download,
  Eye,
  ExternalLink,
  FileSignature,
  LoaderCircle,
  LogOut,
  Menu,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  Receipt,
  Star,
} from "lucide-react";
import logo from "@/assets/riory-logo-black.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { nl } from "date-fns/locale";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { AlgemeneVoorwaardenInhoud } from "./AlgemeneVoorwaarden";
import {
  PortalAccessError,
  PortalAuthError,
  STAGE_LABEL,
  clearPortalSession,
  fetchDocument,
  saveDocument,
  type PortalDocument,
  loadOverview,
  loginTokenFromHash,
  hasPortalSession,
  requestAppointment,
  requestInvoiceCopy,
  reportProblem,
  requestPasswordReset,
  passwordLogin,
  setNewPassword,
  resetTokenFromHash,
  decideQuote,
  cancelAppointment,
  brusselsTime,
  CANCEL_HOURS,
  applyDemoState,
  readDemoState,
  writeDemoState,
  updateProfile,
  requestLoginLink,
  verifyLoginToken,
  type PortalCustomer,
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

/** Solid status colours plus a matching bar on the left of each row, readable at a glance. */
const STAGE_STYLE: Record<PortalStage, string> = {
  aangevraagd: "bg-slate-500 text-white",
  offerte: "bg-violet-600 text-white",
  gepland: "bg-blue-600 text-white",
  afgewerkt: "bg-emerald-600 text-white",
};
const STAGE_BAR: Record<PortalStage, string> = {
  aangevraagd: "border-l-slate-400",
  offerte: "border-l-violet-500",
  gepland: "border-l-blue-500",
  afgewerkt: "border-l-emerald-500",
};

const INVOICE_STYLE: Record<PortalInvoiceState, { label: string; cls: string; bar: string }> = {
  betaald: { label: "Betaald", cls: "bg-emerald-600 text-white", bar: "border-l-emerald-500" },
  open: { label: "Open", cls: "bg-amber-500 text-white", bar: "border-l-amber-400" },
  vervallen: { label: "Vervallen", cls: "bg-red-600 text-white", bar: "border-l-red-500 bg-red-50/60" },
  creditnota: { label: "Creditnota", cls: "bg-slate-500 text-white", bar: "border-l-slate-400" },
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>{children}</span>;
}

function Panel({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return <section id={id} className={cn("rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]", className)}>{children}</section>;
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

function SetPasswordView({ token, onDone }: { token: string; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const strong = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!strong) return setError("Kies een wachtwoord van minstens 8 tekens met een letter en een cijfer.");
    if (pw !== pw2) return setError("De twee wachtwoorden zijn niet gelijk.");
    setBusy(true);
    try {
      await setNewPassword(token, pw);
      toast.success("Uw wachtwoord is ingesteld.");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wachtwoord instellen mislukt.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-[420px] space-y-5 rounded-2xl border border-black/5 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]"
      >
        <img src={logo} alt="Riory" className="h-7 w-auto" />
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Wachtwoord instellen</h1>
          <p className="text-sm text-gray-500">Kies een wachtwoord van minstens 8 tekens, met een letter en een cijfer.</p>
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="new-pw">Nieuw wachtwoord</Label>
          <div className="relative">
            <Input id="new-pw" type={show ? "text" : "password"} autoComplete="new-password" className="h-11 pr-11" value={pw} onChange={(e) => setPw(e.target.value)} />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-500"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className={cn("text-xs", strong ? "text-emerald-700" : "text-gray-500")}>
            {strong ? "✓ Sterk genoeg" : "Minstens 8 tekens, een letter en een cijfer"}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-pw2">Herhaal wachtwoord</Label>
          <Input id="new-pw2" type={show ? "text" : "password"} autoComplete="new-password" className="h-11" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
        <Button className="h-11 w-full font-semibold" disabled={busy}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Wachtwoord opslaan en inloggen"}
        </Button>
      </form>
    </div>
  );
}

function LoginView({ initialError, onLoggedIn }: { initialError: string; onLoggedIn: () => void }) {
  const [mode, setMode] = useState<"password" | "link" | "forgot">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [sent, setSent] = useState<"" | "link" | "reset">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "password") {
        await passwordLogin(email, password);
        onLoggedIn();
        return;
      }
      if (mode === "forgot") {
        await requestPasswordReset(email);
        setSent("reset");
      } else {
        await requestLoginLink(email);
        setSent("link");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  const emailField = (
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
  );

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
                  ontvangt u binnen een minuut {sent === "reset" ? "een link om uw wachtwoord in te stellen" : "een inloglink"}{" "}
                  van Riory.
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
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setSent("");
                  setMode("password");
                }}
              >
                Terug naar inloggen
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {mode === "forgot" ? "Wachtwoord vergeten" : "Klantenportaal"}
                </h1>
                <p className="text-sm leading-relaxed text-gray-500">
                  {mode === "forgot"
                    ? "Vul het e-mailadres in waarop u facturen van Riory ontvangt. U krijgt een link om een (nieuw) wachtwoord in te stellen."
                    : "Log in met het e-mailadres waarop u facturen van Riory ontvangt."}
                </p>
              </div>
              {mode !== "forgot" && (
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1" role="tablist">
                  {(
                    [
                      ["password", "Met wachtwoord"],
                      ["link", "Met inloglink"],
                    ] as const
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      role="tab"
                      aria-selected={mode === m}
                      onClick={() => {
                        setMode(m);
                        setError("");
                      }}
                      className={cn(
                        "h-9 rounded-md text-sm font-medium transition-colors",
                        mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {emailField}
              {mode === "password" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="portal-password">Wachtwoord</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Wachtwoord vergeten?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="portal-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="h-11 pr-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
                      className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-500"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              <Button className="h-11 w-full text-[15px] font-semibold" disabled={busy}>
                {busy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : mode === "password" ? (
                  "Inloggen"
                ) : mode === "forgot" ? (
                  "Stuur mij een link"
                ) : (
                  "Stuur mij een inloglink"
                )}
              </Button>
              {mode === "forgot" ? (
                <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("password")}>
                  Terug naar inloggen
                </Button>
              ) : (
                <>
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
                  <p className="text-center text-xs text-gray-500">
                    Nog geen wachtwoord? Kies <span className="font-medium">Wachtwoord vergeten</span> om er een in te stellen.
                  </p>
                </>
              )}
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
  id,
  title,
  count,
  children,
  action,
}: {
  id?: string;
  title: string;
  count?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Panel id={id} className="scroll-mt-20">
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

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="truncate text-sm text-gray-900">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

function ProfilePanel({
  customer,
  loginEmail,
  readOnly,
  onSaved,
  onAuthError,
}: {
  customer: PortalCustomer;
  loginEmail: string;
  readOnly: boolean;
  onSaved: () => Promise<void>;
  onAuthError: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    street: customer.street ?? "",
    house_number: customer.house_number ?? "",
    postal_code: customer.postal_code ?? "",
    city: customer.city ?? "",
    billing_email: customer.billing_email ?? "",
  }));
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ customerId: customer.id, ...form });
      toast.success("Uw gegevens zijn bijgewerkt.");
      setEditing(false);
      await onSaved();
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onAuthError();
      toast.error(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  }

  const address = [
    [customer.street, customer.house_number].filter(Boolean).join(" "),
    [customer.postal_code, customer.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Panel id="gegevens" className="scroll-mt-20 border-gray-200 bg-gray-100 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <UserRound className="h-4 w-4 text-primary" /> Mijn gegevens
        </h2>
        {!editing && !readOnly && (
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-primary" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" /> Aanpassen
          </Button>
        )}
      </div>
      {editing ? (
        <form onSubmit={save} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Naam</Label>
            <Input id="pf-name" className="h-11" required minLength={2} value={form.name} onChange={set("name")} />
          </div>
          <div className="grid grid-cols-[1fr_80px] gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-street">Straat</Label>
              <Input id="pf-street" className="h-11" value={form.street} onChange={set("street")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-nr">Nr.</Label>
              <Input id="pf-nr" className="h-11" value={form.house_number} onChange={set("house_number")} />
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-pc">Postcode</Label>
              <Input id="pf-pc" className="h-11" inputMode="numeric" value={form.postal_code} onChange={set("postal_code")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-city">Gemeente</Label>
              <Input id="pf-city" className="h-11" value={form.city} onChange={set("city")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-phone">Telefoon</Label>
            <Input id="pf-phone" className="h-11" type="tel" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-bill">Facturen sturen naar</Label>
            <Input id="pf-bill" className="h-11" type="email" placeholder={loginEmail} value={form.billing_email} onChange={set("billing_email")} />
          </div>
          <div className="flex gap-2 pt-1">
            <Button className="h-11 flex-1 font-semibold" disabled={saving}>
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Opslaan"}
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={() => setEditing(false)}>
              Annuleren
            </Button>
          </div>
        </form>
      ) : (
        <dl className="grid gap-3">
          <Field label="Naam" value={customer.name} />
          <Field label="Adres" value={address} />
          <Field label="Telefoon" value={customer.phone} />
          <Field label="Facturen naar" value={customer.billing_email || customer.email} />
          <Field label="Inloggen met" value={loginEmail} />
          {customer.vat_number && <Field label="Btw-nummer" value={customer.vat_number} />}
          {customer.customer_number && <Field label="Klantnummer" value={customer.customer_number} />}
          {customer.profile_updated_at && (
            <p className="text-xs text-gray-500">
              Laatst aangepast op{" "}
              {new Date(customer.profile_updated_at).toLocaleString("nl-BE", { dateStyle: "long", timeStyle: "short" })}
            </p>
          )}
          <ProfileHistory history={customer.profile_history ?? []} />
        </dl>
      )}
    </Panel>
  );
}

const HISTORY_LABELS: Record<string, string> = {
  name: "Naam",
  phone: "Telefoon",
  street: "Straat",
  house_number: "Huisnummer",
  postal_code: "Postcode",
  city: "Gemeente",
  billing_email: "Facturen naar",
};

function ProfileHistory({ history }: { history: NonNullable<PortalCustomer["profile_history"]> }) {
  if (!history.length) return null;
  return (
    <details className="group rounded-lg border border-gray-200 bg-white/70 text-sm">
      <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-gray-600 marker:hidden">
        <span className="group-open:hidden">Vorige gegevens bekijken ({history.length})</span>
        <span className="hidden group-open:inline">Vorige gegevens verbergen</span>
      </summary>
      <ol className="space-y-3 border-t px-3 py-3">
        {history.map((h) => (
          <li key={h.created_at}>
            <p className="text-xs font-medium text-gray-500">
              {new Date(h.created_at).toLocaleString("nl-BE", { dateStyle: "medium", timeStyle: "short" })}
            </p>
            <ul className="mt-1 space-y-0.5">
              {h.changes.map((c) => (
                <li key={c.field} className="text-[13px] text-gray-700">
                  <span className="text-gray-500">{HISTORY_LABELS[c.field] ?? c.field}:</span>{" "}
                  <span className="line-through decoration-gray-400">{c.before || "(leeg)"}</span>{" "}
                  → <span className="font-medium text-gray-900">{c.after || "(leeg)"}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="border-t px-3 py-2 text-[11px] text-gray-500">Oude gegevens worden altijd bewaard.</p>
    </details>
  );
}

function OlderInvoiceRequest({ readOnly, onAuthError }: { readOnly: boolean; onAuthError: () => void }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await requestInvoiceCopy(message);
      setSent(true);
      setMessage("");
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onAuthError();
      toast.error(err instanceof Error ? err.message : "Versturen mislukt.");
    } finally {
      setSending(false);
    }
  }

  if (sent)
    return (
      <p className="border-t px-4 py-3 text-sm text-emerald-700 sm:px-5">
        Aanvraag verstuurd. Riory mailt u de factuur zo snel mogelijk.
      </p>
    );
  if (!open)
    return (
      <button
        type="button"
        disabled={readOnly}
        onClick={() => setOpen(true)}
        className="w-full border-t px-4 py-3 text-left text-sm text-gray-600 hover:bg-black/[0.02] disabled:opacity-60 sm:px-5"
      >
        Oudere factuur nodig? <span className="font-medium text-primary">Vraag ze op</span>
      </button>
    );
  return (
    <form onSubmit={send} className="space-y-2 border-t px-4 py-3 sm:px-5">
      <Label htmlFor="old-inv">Welke factuur zoekt u?</Label>
      <Input
        id="old-inv"
        className="h-11"
        required
        minLength={3}
        placeholder="Bv. factuur van maart 2026, wc ontstopt"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex gap-2">
        <Button className="h-10 font-semibold" disabled={sending}>
          {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Opvragen"}
        </Button>
        <Button type="button" variant="ghost" className="h-10" onClick={() => setOpen(false)}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}

/**
 * Draws every PDF page on a canvas with pdf.js (served from /pdfjs on our own domain), because
 * mobile browsers do not show a PDF inside an iframe: iOS shows only page one, Android nothing.
 */
function PdfPages({ blob, url, title }: { blob: Blob; url: string; title: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    (async () => {
      try {
        const pdfjs = await import(/* @vite-ignore */ `${window.location.origin}/pdfjs/pdf.min.mjs`);
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
        const host = ref.current;
        if (!host || cancelled) return;
        host.replaceChildren();
        const width = Math.max(240, host.clientWidth - 16);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${width}px`;
          canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
          canvas.className = "mx-auto mb-3 block rounded-sm bg-white shadow-md";
          canvas.setAttribute("aria-label", `${title} — pagina ${n} van ${pdf.numPages}`);
          host.appendChild(canvas);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("no canvas");
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (n === 1 && !cancelled) setState("ok");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [blob, title]);

  if (state === "error") {
    // pdf.js could not load: fall back to the browser's own viewer.
    return <iframe title={title} src={`${url}#view=FitH`} className="h-full w-full border-0" />;
  }
  return (
    <div className="relative h-full overflow-y-auto overscroll-contain p-2">
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-gray-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" /> Document laden…
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}

function PdfViewer({ doc, title, onClose }: { doc: PortalDocument | null; title: string; onClose: () => void }) {
  return (
    <Dialog open={!!doc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[96dvh] w-[100vw] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:h-[92dvh] sm:w-[96vw] sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3 pr-12">
          <div className="min-w-0">
            <DialogTitle className="truncate text-base font-semibold text-gray-900">{title}</DialogTitle>
            <DialogDescription className="sr-only">PDF-voorbeeld van {title}</DialogDescription>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-gray-100">
          {doc && <PdfPages key={doc.url} blob={doc.blob} url={doc.url} title={title} />}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-white px-4 py-3">
          {doc && (
            <Button asChild variant="ghost" className="h-10 gap-2">
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Volledig scherm
              </a>
            </Button>
          )}
          <Button className="h-10 gap-2 font-semibold" onClick={() => doc && saveDocument(doc)}>
            <Download className="h-4 w-4" /> Downloaden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


const PROBLEM_TOPICS = [
  "Ik zie een werkbon niet",
  "Ik zie een factuur niet",
  "Een document opent niet",
  "Mijn gegevens kloppen niet",
  "Afspraak aanvragen lukt niet",
  "Inloggen of uitloggen loopt fout",
  "Iets anders",
];

function ProblemReport({
  open,
  setOpen,
  page,
  onAuthError,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  page: string;
  onAuthError: () => void;
}) {
  const [topics, setTopics] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const toggle = (t: string) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const canSend = topics.length > 0 || message.trim().length >= 5;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    try {
      await reportProblem({ topics, message, page, userAgent: navigator.userAgent.slice(0, 300) });
      toast.success("Bedankt, uw melding is verstuurd. We bekijken het zo snel mogelijk.");
      setTopics([]);
      setMessage("");
      setOpen(false);
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onAuthError();
      toast.error(err instanceof Error ? err.message : "Melding versturen mislukt.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <form onSubmit={send} className="space-y-4">
          <div>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <LifeBuoy className="h-5 w-5 text-primary" /> Probleem met het klantportaal?
            </DialogTitle>
            <DialogDescription className="mt-1">Duid aan wat er misloopt. Meerdere keuzes mogen.</DialogDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROBLEM_TOPICS.map((t) => {
              const on = topics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(t)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    on ? "border-primary bg-primary text-white" : "border-black/10 bg-white text-gray-700 hover:bg-black/5",
                  )}
                >
                  {on && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {t}
                </button>
              );
            })}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="problem-msg">Wat gebeurt er precies?</Label>
            <Textarea
              id="problem-msg"
              rows={4}
              maxLength={2000}
              placeholder="Bv. als ik op Bekijken klik bij factuur 2026-0412 gebeurt er niets."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={!canSend || sending} className="gap-2">
              {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Melding versturen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TermsButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
          className,
        )}
      >
        <FileText className="h-4 w-4" /> Algemene voorwaarden bekijken
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[85dvh] max-w-2xl flex-col gap-0 p-0">
          <DialogTitle className="sr-only">Algemene voorwaarden</DialogTitle>
          <DialogDescription className="sr-only">De algemene voorwaarden van Riory BV</DialogDescription>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-6 sm:px-7">
            <AlgemeneVoorwaardenInhoud />
          </div>
          <div className="border-t p-3">
            <Button className="h-11 w-full" onClick={() => setOpen(false)}>
              Sluiten
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PasswordPanel({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function send() {
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Versturen mislukt.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel className="mt-4 p-4 sm:p-5">
      <p className="flex items-center gap-2 font-semibold text-gray-900">
        <KeyRound className="h-4 w-4 text-primary" /> Wachtwoord
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Liever inloggen met een wachtwoord? Wij sturen een link naar {email} om er een in te stellen of te wijzigen.
      </p>
      {sent ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Verstuurd. Kijk in uw mailbox (ook bij ongewenste e-mail).
        </p>
      ) : (
        <Button variant="outline" className="mt-3 h-10 gap-2" disabled={busy} onClick={send}>
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Wachtwoord instellen of wijzigen
        </Button>
      )}
    </Panel>
  );
}

function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = e.currentTarget.getContext("2d");
    const p = pos(e);
    ctx?.beginPath();
    ctx?.moveTo(p.x, p.y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    const p = pos(e);
    ctx?.lineTo(p.x, p.y);
    ctx?.stroke();
    dirty.current = true;
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (dirty.current && ref.current) onChange(ref.current.toDataURL("image/png"));
  };
  const clear = () => {
    const c = ref.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    dirty.current = false;
    onChange(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>Handtekening</Label>
        <button type="button" onClick={clear} className="text-xs font-medium text-gray-500 underline underline-offset-2">
          Wissen
        </button>
      </div>
      <canvas
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="h-36 w-full touch-none rounded-lg border-2 border-dashed border-gray-300 bg-white"
        aria-label="Teken hier uw handtekening"
      />
    </div>
  );
}

const DECLINE_REASONS = ["Te duur", "Ander bedrijf gekozen", "Werken niet meer nodig", "Later opnieuw bekijken"];

function QuoteDialog({
  quote,
  defaultName,
  readOnly,
  onClose,
  onDone,
  onAuthError,
}: {
  quote: PortalOverview["quotes"][number] | null;
  defaultName: string;
  readOnly: boolean;
  onClose: () => void;
  onDone: (id: string, decision: "akkoord" | "geweigerd", name?: string) => Promise<void>;
  onAuthError: () => void;
}) {
  const [mode, setMode] = useState<"view" | "approve" | "decline">("view");
  const [name, setName] = useState(defaultName);
  const [signature, setSignature] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [reasonText, setReasonText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMode("view");
    setSignature(null);
    setAgree(false);
    setOptions([]);
    setReasons([]);
    setReasonText("");
    setName(defaultName);
  }, [quote?.id, defaultName]);

  if (!quote) return null;
  const lines = quote.lines ?? [];
  const base = lines.filter((l) => !l.optional).reduce((s, l) => s + l.amount, 0);
  const extra = lines.filter((l) => l.optional && options.includes(l.index)).reduce((s, l) => s + l.amount, 0);
  const vatFactor = quote.net ? (quote.total / quote.net) : 1.21;
  const shownTotal = lines.length ? Math.round((base + extra) * vatFactor * 100) / 100 : quote.total;
  const open = quote.status === "verzonden";
  const isDemo = quote.id.startsWith("demo-");

  async function submit(decision: "akkoord" | "geweigerd") {
    setBusy(true);
    try {
      const reason = [...reasons, reasonText.trim()].filter(Boolean).join(" — ");
      if (!isDemo) {
        await decideQuote({
          quoteId: quote!.id,
          decision,
          ...(decision === "akkoord" ? { name: name.trim(), signature: signature ?? "", options } : { reason }),
        });
      }
      await onDone(quote!.id, decision, name.trim());
      toast.success(decision === "akkoord" ? "Bedankt! De offerte is goedgekeurd. Riory plant de werken in." : "Uw antwoord is doorgegeven aan Riory.");
      onClose();
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onAuthError();
      toast.error(err instanceof Error ? err.message : "Versturen mislukt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92dvh] max-w-lg overflow-y-auto">
        <div>
          <DialogTitle className="flex flex-wrap items-center gap-2 text-lg">
            {quote.kind === "verzekering" ? "Bestek" : "Offerte"} {quote.number}
            {quote.status === "akkoord" && <Pill className="bg-emerald-600 text-white">Goedgekeurd</Pill>}
            {quote.status === "geweigerd" && <Pill className="bg-gray-500 text-white">Geweigerd</Pill>}
            {open && <Pill className="bg-violet-600 text-white">Wacht op uw antwoord</Pill>}
          </DialogTitle>
          <DialogDescription className="mt-1">
            {quote.intro || "Offerte van Riory"} · {formatDate(quote.date)}
          </DialogDescription>
        </div>

        {lines.length > 0 && (
          <div className="rounded-xl border">
            {lines.map((l) => (
              <div key={l.index} className={cn("flex items-start justify-between gap-3 border-b px-3 py-2.5 text-sm last:border-0", l.optional && "bg-gray-50")}>
                <label className={cn("flex min-w-0 items-start gap-2", !l.optional && "pl-0")}>
                  {l.optional && open && mode === "approve" ? (
                    <Checkbox
                      className="mt-0.5"
                      checked={options.includes(l.index)}
                      onCheckedChange={(v) => setOptions((cur) => (v === true ? [...cur, l.index] : cur.filter((x) => x !== l.index)))}
                    />
                  ) : null}
                  <span className="text-gray-800">
                    {l.description}
                    {l.optional && <span className="ml-1.5 text-xs font-medium text-violet-700">optie</span>}
                    <span className="block text-xs text-gray-500">
                      {l.quantity} {l.unit}
                    </span>
                  </span>
                </label>
                <span className="shrink-0 tabular-nums text-gray-900">{euro(l.amount)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between rounded-xl bg-[#1e2e34] px-4 py-3 text-white">
          <span className="text-sm">Totaal incl. btw</span>
          <span className="text-lg font-bold tabular-nums">{euro(open ? shownTotal : quote.total)}</span>
        </div>

        <TermsButton />
        {quote.status === "akkoord" && (
          <p className="text-sm text-gray-600">
            Goedgekeurd{quote.signedName ? ` door ${quote.signedName}` : ""}{quote.signedAt ? ` op ${formatDate(quote.signedAt)}` : ""}.
          </p>
        )}

        {open && mode === "view" && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-11" disabled={readOnly} onClick={() => setMode("decline")}>
              Weigeren
            </Button>
            <Button className="h-11 gap-2 bg-emerald-600 font-semibold hover:bg-emerald-700" disabled={readOnly} onClick={() => setMode("approve")}>
              <CheckCircle2 className="h-4 w-4" /> Goedkeuren
            </Button>
          </div>
        )}

        {open && mode === "approve" && (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
            {lines.some((l) => l.optional) && <p className="text-xs text-gray-600">Vink hierboven de opties aan die u erbij wilt.</p>}
            <div className="space-y-1.5">
              <Label htmlFor="q-name">Uw naam</Label>
              <Input id="q-name" className="h-11 bg-white" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <SignaturePad onChange={setSignature} />
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <Checkbox className="mt-0.5" checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
              <span>
                Ik ga akkoord met deze offerte en de algemene voorwaarden van Riory.
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="h-11" onClick={() => setMode("view")}>
                Terug
              </Button>
              <Button
                className="h-11 gap-2 bg-emerald-600 font-semibold hover:bg-emerald-700"
                disabled={busy || !agree || !signature || !name.trim()}
                onClick={() => submit("akkoord")}
              >
                {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Offerte goedkeuren
              </Button>
            </div>
          </div>
        )}

        {open && mode === "decline" && (
          <div className="space-y-3 rounded-xl border p-3">
            <p className="text-sm font-medium text-gray-800">Waarom past deze offerte niet? (optioneel)</p>
            <div className="flex flex-wrap gap-2">
              {DECLINE_REASONS.map((r) => {
                const on = reasons.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setReasons((cur) => (on ? cur.filter((x) => x !== r) : [...cur, r]))}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      on ? "border-[#1e2e34] bg-[#1e2e34] text-white" : "border-black/10 bg-white text-gray-700",
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <Textarea rows={3} maxLength={1000} placeholder="Wilt u nog iets kwijt?" value={reasonText} onChange={(e) => setReasonText(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="h-11" onClick={() => setMode("view")}>
                Terug
              </Button>
              <Button variant="destructive" className="h-11 gap-2" disabled={busy} onClick={() => submit("geweigerd")}>
                {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Offerte weigeren
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AppointmentDialog({
  wo,
  readOnly,
  onClose,
  onCancelled,
  onAuthError,
}: {
  wo: WorkOrder | null;
  readOnly: boolean;
  onClose: () => void;
  onCancelled: (id: string) => Promise<void>;
  onAuthError: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setConfirm(false);
    setReason("");
  }, [wo?.id]);
  if (!wo || !wo.scheduledDate) return null;
  const start = brusselsTime(wo.scheduledDate, wo.scheduledFrom);
  const hoursLeft = (start - Date.now()) / 3600000;
  const canCancel = hoursLeft >= CANCEL_HOURS && !wo.cancelRequested;

  async function cancel() {
    setBusy(true);
    try {
      if (!wo!.id.startsWith("demo-")) await cancelAppointment({ workOrderId: wo!.id, reason: reason.trim() || undefined });
      await onCancelled(wo!.id);
      toast.success("Uw afspraak is geannuleerd. Riory haalt ze uit de planning.");
      onClose();
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onAuthError();
      toast.error(err instanceof Error ? err.message : "Annuleren mislukt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <div>
          <DialogTitle className="text-lg">Uw afspraak</DialogTitle>
          <DialogDescription className="mt-1">{wo.number ? `Werkbon #${wo.number}` : "Nieuwe aanvraag"}</DialogDescription>
        </div>
        <div className="space-y-3 rounded-xl bg-sky-50 p-4">
          <p className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <CalendarClock className="h-5 w-5 text-sky-700" />
            {formatDate(wo.scheduledDate, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {wo.scheduledFrom && (
            <p className="pl-7 text-sm text-gray-700">
              Tussen {wo.scheduledFrom}
              {wo.scheduledUntil ? ` en ${wo.scheduledUntil}` : ""}
            </p>
          )}
          {wo.address && (
            <p className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" /> {wo.address}
            </p>
          )}
          {wo.description && <p className="pl-6 text-sm text-gray-600">{wo.description}</p>}
        </div>

        {wo.cancelRequested ? (
          <p className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-700">
            U heeft deze afspraak geannuleerd. Riory haalt ze uit de planning.
          </p>
        ) : canCancel ? (
          confirm ? (
            <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/60 p-3">
              <p className="text-sm font-medium text-gray-900">Afspraak zeker annuleren?</p>
              <Textarea rows={2} maxLength={500} placeholder="Reden (optioneel)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" className="h-11" onClick={() => setConfirm(false)}>
                  Terug
                </Button>
                <Button variant="destructive" className="h-11 gap-2" disabled={busy} onClick={cancel}>
                  {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Ja, annuleren
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" className="h-11 w-full border-red-200 text-red-700 hover:bg-red-50" disabled={readOnly} onClick={() => setConfirm(true)}>
                Afspraak annuleren
              </Button>
              <p className="text-center text-xs text-gray-500">Online annuleren kan tot {CANCEL_HOURS} uur voor de afspraak.</p>
            </div>
          )
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              De afspraak is binnen {CANCEL_HOURS} uur. Annuleren kan nu enkel telefonisch.
            </p>
            <a href="tel:+32472502814" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 font-semibold text-white">
              <Phone className="h-4 w-4" /> Bel +32 472 50 28 14
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type PortalPage = "home" | "werkbonnen" | "facturen" | "offertes" | "afspraak" | "gegevens";
const PORTAL_BASE = "/klantportaal";
const PAGE_PATH: Record<PortalPage, string> = {
  home: PORTAL_BASE,
  werkbonnen: `${PORTAL_BASE}/werkbonnen`,
  facturen: `${PORTAL_BASE}/facturen`,
  offertes: `${PORTAL_BASE}/offertes`,
  afspraak: `${PORTAL_BASE}/afspraak`,
  gegevens: `${PORTAL_BASE}/gegevens`,
};

function pageFromPath(pathname: string): PortalPage {
  const seg = pathname.replace(/\/+$/, "").split("/")[2] ?? "";
  return (["werkbonnen", "facturen", "offertes", "afspraak", "gegevens"] as const).find((p) => p === seg) ?? "home";
}

function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; count: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === o.key
              ? "border-[#1e2e34] bg-[#1e2e34] text-white"
              : "border-black/10 bg-white text-gray-700 hover:bg-black/5",
          )}
        >
          {o.label}
          <span className={cn("text-xs tabular-nums", value === o.key ? "text-white/70" : "text-gray-400")}>{o.count}</span>
        </button>
      ))}
    </div>
  );
}

function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 bg-white pl-9"
      />
    </div>
  );
}

function UrgentCard() {
  return (
    <section className="overflow-hidden rounded-2xl bg-[#1e2e34] p-5 text-white shadow-[0_8px_24px_-12px_rgba(30,46,52,0.6)]">
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-600/40 motion-reduce:hidden" />
          <Phone className="relative h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-bold leading-tight">Dringend? Bel ons</p>
          <p className="text-sm text-white/70">24/7 bereikbaar, ook in het weekend</p>
        </div>
      </div>
      <a
        href="tel:+32472502814"
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-base font-bold tracking-wide transition-colors hover:bg-red-700"
      >
        <Phone className="h-5 w-5" /> +32 472 50 28 14
      </a>
      <p className="mt-3 text-center text-sm text-white/70">
        of mail naar{" "}
        <a href="mailto:info@riory.be" className="font-medium text-white underline underline-offset-2">
          info@riory.be
        </a>
      </p>
    </section>
  );
}

function ContactStrip({ showReview }: { showReview: boolean }) {
  return (
    <div className={cn("grid gap-3", showReview && "sm:grid-cols-2")}>
      <div className="flex items-center gap-3 rounded-xl bg-[#1e2e34] px-3.5 py-2.5 text-white">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600">
          <Phone className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="whitespace-nowrap text-sm font-semibold">Dringend? Bel ons</p>
          <p className="text-xs text-white/60">24/7 bereikbaar</p>
        </div>
        <a
          href="tel:+32472502814"
          className="shrink-0 whitespace-nowrap rounded-lg bg-red-600 px-2.5 py-1.5 text-[13px] font-semibold tabular-nums transition-colors hover:bg-red-700"
        >
          +32 472 50 28 14
        </a>
      </div>
      {showReview && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((n) => (
                <Star key={n} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-1 whitespace-nowrap text-sm font-semibold text-gray-900">Tevreden over ons?</p>
          </div>
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          >
            <GoogleIcon />
            Review schrijven
          </a>
        </div>
      )}
    </div>
  );
}

function StatTile({
  to,
  onClick,
  icon,
  label,
  value,
  sub,
  tone,
}: {
  to: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: string;
}) {
  const Comp = (onClick ? "button" : Link) as React.ElementType;
  return (
    <Comp
      {...(onClick ? { type: "button", onClick } : { to })}
      className={cn(
        "text-left",
        "group flex flex-col justify-between rounded-2xl border p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        tone,
      )}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-3">
        <p className="text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
          {sub}
          <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </p>
      </div>
    </Comp>
  );
}

function PortalView({ data: rawData, onReload, onLogout }: { data: PortalOverview; onReload: () => Promise<void>; onLogout: () => void }) {
  const [demoTick, setDemoTick] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => applyDemoState(rawData), [rawData, demoTick]);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [apptId, setApptId] = useState<string | null>(null);
  const [prefDate, setPrefDate] = useState<Date | undefined>(undefined);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [regenput, setRegenput] = useState("");
  const [regenputOther, setRegenputOther] = useState("");
  const [dakgoot, setDakgoot] = useState({ v1: "", v2: "", v3: "" });
  const [prefPart, setPrefPart] = useState<"" | "voormiddag" | "namiddag" | "maakt niet uit">("");
  async function quoteDone(id: string, decision: "akkoord" | "geweigerd", name?: string) {
    if (id.startsWith("demo-")) {
      const st = readDemoState();
      writeDemoState({ ...st, quotes: { ...st.quotes, [id]: decision }, signedName: { ...st.signedName, ...(name ? { [id]: name } : {}) } });
      setDemoTick((t) => t + 1);
    } else await onReload();
  }
  async function appointmentCancelled(id: string) {
    if (id.startsWith("demo-")) {
      const st = readDemoState();
      writeDemoState({ ...st, cancels: { ...st.cancels, [id]: true } });
      setDemoTick((t) => t + 1);
    } else await onReload();
  }
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageFromPath(location.pathname);

  const [downloading, setDownloading] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ doc: PortalDocument; title: string } | null>(null);
  const closeViewer = () =>
    setViewer((prev) => {
      if (prev) setTimeout(() => URL.revokeObjectURL(prev.doc.url), 1000);
      return null;
    });
  const [menuOpen, setMenuOpen] = useState(false);
  const [problemOpen, setProblemOpen] = useState(false);
  const [woFilter, setWoFilter] = useState<"alle" | PortalStage>("alle");
  const [invFilter, setInvFilter] = useState<"alle" | PortalInvoiceState>("alle");
  const [woQuery, setWoQuery] = useState("");
  const [invQuery, setInvQuery] = useState("");

  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState(data.customer?.phone ?? "");
  const [customerId, setCustomerId] = useState(data.customer?.id ?? "");
  const [urgent, setUrgent] = useState(false);
  const [worksiteDifferent, setWorksiteDifferent] = useState(false);
  const [worksiteStreet, setWorksiteStreet] = useState("");
  const [worksiteHouseNumber, setWorksiteHouseNumber] = useState("");
  const [worksitePostalCode, setWorksitePostalCode] = useState("");
  const [worksiteCity, setWorksiteCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState("");
  const readOnly = !!data.preview;

  // Old links (?tab=afspraak) open the appointment page.
  useEffect(() => {
    if (new URLSearchParams(location.search).get("tab") === "afspraak") navigate(PAGE_PATH.afspraak, { replace: true });
  }, [location.search, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [page]);

  async function handleDownload(type: "factuur" | "werkbon", id: string, title: string) {
    setDownloading(id);
    try {
      const doc = await fetchDocument(type, id);
      setViewer((prev) => {
        if (prev) URL.revokeObjectURL(prev.doc.url);
        return { doc, title };
      });
    } catch (e) {
      if (e instanceof PortalAuthError || e instanceof PortalAccessError) return onLogout();
      toast.error(e instanceof Error ? e.message : "Downloaden mislukt.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Same follow-up questions as the appointment form on riory.be.
    let extra = "";
    if (service === "regenput") {
      const size = regenput === "Andere maat" ? regenputOther.trim() : regenput;
      if (!size) return toast.error("Kies de grootte van uw regenput.");
      extra = `Grootte regenput: ${size}`;
    } else if (service === "dakgoot") {
      const total = ["v1", "v2", "v3"].reduce((sum, k) => sum + (parseFloat(dakgoot[k as "v1"]) || 0), 0);
      if (total === 0) return toast.error("Vul de meters dakgoot per verdieping in.");
      extra = `Dakgoot meters — 1 verdiep: ${dakgoot.v1 || "0"}m, 2 verdiepen: ${dakgoot.v2 || "0"}m, 3 verdiepen: ${dakgoot.v3 || "0"}m`;
    }
    setSubmitting(true);
    try {
      await requestAppointment({
        description: extra ? `${extra}\n\n${description}` : description,
        preferredWindow:
          [
            prefDate ? format(prefDate, "EEEE d MMMM", { locale: nl }) : "",
            prefPart && prefPart !== "maakt niet uit" ? prefPart : "",
          ]
            .filter(Boolean)
            .join(" · ") || undefined,
        contactPhone: contactPhone || undefined,
        customerId: customerId || undefined,
        service: service || undefined,
        urgent,
        worksiteDifferent,
        worksiteStreet: worksiteDifferent ? worksiteStreet : undefined,
        worksiteHouseNumber: worksiteDifferent ? worksiteHouseNumber : undefined,
        worksitePostalCode: worksiteDifferent ? worksitePostalCode : undefined,
        worksiteCity: worksiteDifferent ? worksiteCity : undefined,
      });
      toast.success("Uw aanvraag is ontvangen. Riory neemt snel contact op.");
      setDescription("");
      setService("");
      setPrefDate(undefined);
      setPrefPart("");
      setTermsAccepted(false);
      setRegenput("");
      setRegenputOther("");
      setDakgoot({ v1: "", v2: "", v3: "" });
      setUrgent(false);
      setWorksiteDifferent(false);
      setWorksiteStreet("");
      setWorksiteHouseNumber("");
      setWorksitePostalCode("");
      setWorksiteCity("");
      await onReload();
      navigate(PAGE_PATH.werkbonnen);
    } catch (err) {
      if (err instanceof PortalAuthError || err instanceof PortalAccessError) return onLogout();
      toast.error(err instanceof Error ? err.message : "Aanvraag verzenden mislukt.");
    } finally {
      setSubmitting(false);
    }
  }

  // Same address on several customer records: show it once.
  const addressOptions = (() => {
    const seen = new Map<string, { id: string; label: string }>();
    for (const c of data.customers) {
      const label = `${[c.street, c.house_number].filter(Boolean).join(" ") || c.name}${c.city ? `, ${c.city}` : ""}`;
      const key = label.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, { id: c.id, label });
    }
    return [...seen.values()];
  })();
  const today = localToday();
  const currentAddress = (addressOptions.find((o) => o.id === customerId) ?? addressOptions[0])?.label ?? "";
  const openInvoices = data.invoices.filter((i) => i.state === "open" || i.state === "vervallen");
  const overdue = data.invoices.filter((i) => i.state === "vervallen");
  const openAmount = openInvoices.reduce((s, i) => s + i.openAmount, 0);
  const toSign = data.quotes.filter((q) => q.status === "verzonden");
  const running = data.workOrders.filter((w) => w.stage !== "afgewerkt");
  const next = [...data.workOrders]
    .filter((w) => w.stage === "gepland" && !w.cancelRequested && w.scheduledDate && w.scheduledDate >= today)
    .sort((a, b) => (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? ""))[0];
  const hasDone = data.workOrders.some((w) => w.stage === "afgewerkt");
  const firstName = (data.customer?.name ?? "").trim();

  const navItems: { page: PortalPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { page: "home", label: "Overzicht", icon: <LayoutGrid className="h-4 w-4" /> },
    { page: "werkbonnen", label: "Werkbonnen", icon: <ClipboardList className="h-4 w-4" />, badge: running.length || undefined },
    { page: "facturen", label: "Facturen", icon: <Receipt className="h-4 w-4" />, badge: openInvoices.length || undefined },
    { page: "offertes", label: "Offertes", icon: <FileSignature className="h-4 w-4" />, badge: toSign.length || undefined },
    { page: "afspraak", label: "Nieuwe afspraak", icon: <CalendarPlus className="h-4 w-4" /> },
    ...(data.customer ? [{ page: "gegevens" as const, label: "Mijn gegevens", icon: <UserRound className="h-4 w-4" /> }] : []),
  ];

  const WorkOrderRow = ({ w }: { w: WorkOrder }) => (
    <div className={cn("flex items-start justify-between gap-3 border-l-4 px-4 py-3.5 sm:px-5", STAGE_BAR[w.stage])}>
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">{w.number ? `Werkbon #${w.number}` : "Nieuwe aanvraag"}</span>
          <Pill className={STAGE_STYLE[w.stage]}>{STAGE_LABEL[w.stage]}</Pill>
          {w.urgent && w.stage !== "afgewerkt" && <Pill className="bg-red-600 text-white">Dringend</Pill>}
          {w.cancelRequested && <Pill className="bg-gray-200 text-gray-700">Geannuleerd</Pill>}
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
      {w.stage === "gepland" && w.scheduledDate && (
        <Button variant="outline" size="sm" className="h-9 shrink-0 gap-1.5 px-3" onClick={() => setApptId(w.id)}>
          <CalendarClock className="h-4 w-4" />
          {w.cancelRequested ? "Details" : "Afspraak"}
        </Button>
      )}
      {w.hasPdf && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 px-3"
          disabled={downloading === w.id}
          onClick={() => handleDownload("werkbon", w.id, `Werkbon ${werkbonNr(w.number)}`)}
          aria-label={`Werkbon ${werkbonNr(w.number)} bekijken`}
        >
          {downloading === w.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Bekijken
        </Button>
      )}
    </div>
  );

  const InvoiceRow = ({ i }: { i: Invoice }) => {
    const st = INVOICE_STYLE[i.state];
    return (
      <div className={cn("flex items-center justify-between gap-3 border-l-4 px-4 py-3.5 sm:px-5", st.bar)}>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">
              {i.kind === "creditnota" ? "Creditnota" : "Factuur"} {i.number}
            </span>
            <Pill className={st.cls}>{st.label}</Pill>
            {(i.state === "open" || i.state === "vervallen") && i.openAmount > 0 && i.openAmount < i.total - 0.005 && (
              <Pill className="bg-sky-100 text-sky-800">Deels betaald · nog {euro(i.openAmount)}</Pill>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(i.issueDate)}
            {(i.state === "open" || i.state === "vervallen") && i.dueDate ? ` · te betalen voor ${formatDate(i.dueDate)}` : ""}
            {i.workOrderNumber ? ` · werkbon #${i.workOrderNumber}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-semibold tabular-nums text-gray-900">{euro(i.total)}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 px-3"
            disabled={downloading === i.id}
            onClick={() => handleDownload("factuur", i.id, `${i.kind === "creditnota" ? "Creditnota" : "Factuur"} ${i.number}`)}
            aria-label={`Factuur ${i.number} bekijken`}
          >
            {downloading === i.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            <span className="hidden sm:inline">Bekijken</span>
          </Button>
        </div>
      </div>
    );
  };

  const QuoteList = ({ quotes }: { quotes: PortalOverview["quotes"] }) => (
    <div className="divide-y">
      {quotes.map((q) => (
        <div
          key={q.id}
          className={cn(
            "flex items-center justify-between gap-3 border-l-4 px-4 py-3.5 sm:px-5",
            q.status === "verzonden" ? "border-l-violet-500" : q.status === "akkoord" ? "border-l-emerald-500" : "border-l-gray-300",
          )}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-900">
                {q.kind === "verzekering" ? "Bestek" : "Offerte"} {q.number}
              </span>
              {q.status === "verzonden" ? (
                <Pill className="bg-violet-600 text-white">Wacht op uw antwoord</Pill>
              ) : q.status === "akkoord" ? (
                <Pill className="bg-emerald-600 text-white">Goedgekeurd</Pill>
              ) : (
                <Pill className="bg-gray-500 text-white">Geweigerd</Pill>
              )}
            </div>
            <p className="line-clamp-1 text-xs text-gray-500">
              {formatDate(q.date)}
              {q.intro ? ` · ${q.intro}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-semibold tabular-nums text-gray-900 sm:inline">{euro(q.total)}</span>
            <Button
              size="sm"
              variant={q.status === "verzonden" ? "default" : "outline"}
              className="h-9 gap-1.5"
              onClick={() => setQuoteId(q.id)}
            >
              <Eye className="h-4 w-4" />
              {q.status === "verzonden" ? "Bekijken & beslissen" : "Bekijken"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const SeeAll = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
      {label} <ChevronRight className="h-4 w-4" />
    </Link>
  );

  const matches = (q: string, ...parts: (string | number | null | undefined)[]) => {
    const needle = q.trim().toLowerCase();
    return !needle || parts.some((p) => p != null && String(p).toLowerCase().includes(needle));
  };

  // ---------------------------------------------------------------- pages
  const homePage = (
    <>
      <PageTitle
        title={firstName ? `Welkom, ${firstName}` : "Welkom"}
        sub="Alles over uw werken bij Riory op één plek."
        action={
          <Button asChild className="h-11 gap-2 font-semibold">
            <Link to={PAGE_PATH.afspraak}>
              <CalendarPlus className="h-4 w-4" /> Nieuwe afspraak
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          to={PAGE_PATH.werkbonnen}
          icon={<CalendarClock className="h-4 w-4" />}
          label="Volgende afspraak"
          value={next ? formatDate(next.scheduledDate, { weekday: "short", day: "numeric", month: "short" }) : "Geen"}
          sub={next ? (next.scheduledFrom ? `om ${next.scheduledFrom} · details` : "Ingepland · details") : "Niets ingepland"}
          onClick={next ? () => setApptId(next.id) : undefined}
          tone="border-sky-100 bg-sky-50/70 text-sky-800"
        />
        <StatTile
          to={PAGE_PATH.werkbonnen}
          icon={<ClipboardList className="h-4 w-4" />}
          label="Lopend"
          value={String(running.length)}
          sub={running.length === 1 ? "werkbon of aanvraag" : "werkbonnen en aanvragen"}
          tone="border-slate-200 bg-white text-slate-600"
        />
        <StatTile
          to={PAGE_PATH.facturen}
          icon={<Receipt className="h-4 w-4" />}
          label="Te betalen"
          value={euro(openAmount)}
          sub={overdue.length ? `${overdue.length} vervallen` : openInvoices.length ? `${openInvoices.length} open` : "Alles betaald"}
          tone={overdue.length ? "border-red-100 bg-red-50/70 text-red-700" : "border-amber-100 bg-amber-50/70 text-amber-800"}
        />
        <StatTile
          to={PAGE_PATH.offertes}
          icon={<FileSignature className="h-4 w-4" />}
          label="Offertes"
          value={String(toSign.length)}
          sub={toSign.length ? "te tekenen" : `${data.quotes.length} in totaal`}
          tone="border-violet-100 bg-violet-50/70 text-violet-800"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-start">
        <Section title="Recente werkbonnen" count={data.workOrders.length} action={<SeeAll to={PAGE_PATH.werkbonnen} label="Alle" />}>
          {data.workOrders.length ? (
            <div className="divide-y">{data.workOrders.slice(0, 4).map((w) => <WorkOrderRow key={w.id} w={w} />)}</div>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-500">Nog geen werkbonnen.</p>
          )}
        </Section>
        <Section title="Recente facturen" count={data.invoices.length} action={<SeeAll to={PAGE_PATH.facturen} label="Alle" />}>
          {data.invoices.length ? (
            <div className="divide-y">{data.invoices.slice(0, 4).map((i) => <InvoiceRow key={i.id} i={i} />)}</div>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-500">Nog geen facturen.</p>
          )}
        </Section>
      </div>

      {toSign.length > 0 && (
        <div className="mt-5">
          <Section title="Te tekenen offertes" count={toSign.length} action={<SeeAll to={PAGE_PATH.offertes} label="Alle offertes" />}>
            <QuoteList quotes={toSign} />
          </Section>
        </div>
      )}

      <div className="mt-5">
        <ContactStrip showReview={hasDone} />
      </div>
    </>
  );

  const stageCount = (s: PortalStage) => data.workOrders.filter((w) => w.stage === s).length;
  const filteredWorkOrders = data.workOrders.filter(
    (w) =>
      (woFilter === "alle" || w.stage === woFilter) &&
      matches(woQuery, w.number, w.description, w.address, w.projectName),
  );
  const werkbonnenPage = (
    <>
      <PageTitle
        title="Werkbonnen"
        sub="Al uw aanvragen, geplande interventies en afgewerkte werkbonnen."
        action={
          <Button asChild variant="outline" className="h-10 gap-2">
            <Link to={PAGE_PATH.afspraak}>
              <CalendarPlus className="h-4 w-4" /> Nieuwe afspraak
            </Link>
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_260px] sm:items-center">
        <FilterChips<"alle" | PortalStage>
          value={woFilter}
          onChange={setWoFilter}
          options={[
            { key: "alle", label: "Alle", count: data.workOrders.length },
            ...(["aangevraagd", "offerte", "gepland", "afgewerkt"] as const).map((s) => ({
              key: s,
              label: STAGE_LABEL[s],
              count: stageCount(s),
            })),
          ]}
        />
        <SearchBox value={woQuery} onChange={setWoQuery} placeholder="Zoek op nummer of adres" />
      </div>
      <Panel>
        {filteredWorkOrders.length ? (
          <div className="divide-y">{filteredWorkOrders.map((w) => <WorkOrderRow key={w.id} w={w} />)}</div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-gray-500">Geen werkbonnen gevonden.</p>
        )}
      </Panel>
    </>
  );

  const invCount = (s: PortalInvoiceState) => data.invoices.filter((i) => i.state === s).length;
  const filteredInvoices = data.invoices.filter(
    (i) => (invFilter === "alle" || i.state === invFilter) && matches(invQuery, i.number, i.workOrderNumber),
  );
  const facturenPage = (
    <>
      <PageTitle title="Facturen" sub="Bekijk en download uw facturen en creditnota's." />
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Panel className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Te betalen</p>
          <p className="mt-1 text-lg font-bold tabular-nums sm:text-xl">{euro(openAmount)}</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Vervallen</p>
          <p className="mt-1 text-lg font-bold sm:text-xl">{overdue.length}</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Betaald</p>
          <p className="mt-1 text-lg font-bold sm:text-xl">{invCount("betaald")}</p>
        </Panel>
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_260px] sm:items-center">
        <FilterChips<"alle" | PortalInvoiceState>
          value={invFilter}
          onChange={setInvFilter}
          options={[
            { key: "alle", label: "Alle", count: data.invoices.length },
            ...(["open", "vervallen", "betaald", "creditnota"] as const).map((s) => ({
              key: s,
              label: INVOICE_STYLE[s].label,
              count: invCount(s),
            })),
          ]}
        />
        <SearchBox value={invQuery} onChange={setInvQuery} placeholder="Zoek op factuurnummer" />
      </div>
      <Panel>
        {filteredInvoices.length ? (
          <div className="divide-y">{filteredInvoices.map((i) => <InvoiceRow key={i.id} i={i} />)}</div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-gray-500">Geen facturen gevonden.</p>
        )}
        <OlderInvoiceRequest readOnly={readOnly} onAuthError={onLogout} />
      </Panel>
    </>
  );

  const offertesPage = (
    <>
      <PageTitle title="Offertes" sub="Offertes en bestekken die Riory voor u opmaakte." />
      <Panel>
        {data.quotes.length ? (
          <QuoteList quotes={data.quotes} />
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-500">U heeft nog geen offertes.</p>
            <Button asChild variant="outline" className="mt-3 h-10">
              <Link to={PAGE_PATH.afspraak}>Vraag een offerte aan</Link>
            </Button>
          </div>
        )}
      </Panel>
    </>
  );

  const afspraakPage = (
    <>
      <PageTitle title="Nieuwe afspraak" sub="Vertel ons wat er aan de hand is. Riory neemt contact op om een moment te plannen." />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <Panel className="border-transparent bg-primary p-4 text-white sm:p-6 [&_label]:text-white [&_input]:bg-white [&_input]:text-gray-900 [&_select]:bg-white [&_select]:text-gray-900 [&_textarea]:bg-white [&_textarea]:text-gray-900">
          <form id="afspraak" onSubmit={handleSubmit} className="space-y-4">
            {!worksiteDifferent &&
              (addressOptions.length > 1 ? (
                <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <label htmlFor="pa-customer" className="sr-only">
                    Adres
                  </label>
                  <select
                    id="pa-customer"
                    className="h-8 min-w-0 flex-1 rounded-md border-0 px-2 text-sm"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    {addressOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : addressOptions[0] ? (
                <p className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{addressOptions[0].label}</span>
                </p>
              ) : null)}
            <div className="space-y-1.5">
              <Label htmlFor="pa-service">Dienst</Label>
              <select
                id="pa-service"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="" disabled>
                  Kies een dienst…
                </option>
                {data.services.map((sv) => (
                  <option key={sv.key} value={sv.key}>
                    {sv.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pa-desc">Omschrijving</Label>
              <Textarea
                id="pa-desc"
                required
                minLength={5}
                rows={4}
                placeholder="Wat is er aan de hand? Bv. water loopt niet weg in de keuken…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {service === "regenput" && (
              <div className="space-y-2 rounded-xl bg-white p-3.5 text-gray-900">
                <p className="text-sm font-semibold">Hoe groot is uw regenput?</p>
                <p className="text-xs text-gray-500">Dit helpt ons een correcte prijs te berekenen.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Tot 5.000 L", "7.500 L", "10.000 L", "15.000 L", "20.000 L", "Ik weet het niet", "Andere maat"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={regenput === opt}
                      onClick={() => setRegenput(opt)}
                      className={cn(
                        "min-h-11 rounded-lg border px-2 py-2 text-sm font-medium",
                        regenput === opt ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {regenput === "Andere maat" && (
                  <Input className="h-11" placeholder="Vul de maat in (bv. 25.000 L)" value={regenputOther} onChange={(e) => setRegenputOther(e.target.value)} />
                )}
              </div>
            )}
            {service === "dakgoot" && (
              <div className="space-y-2 rounded-xl bg-white p-3.5 text-gray-900">
                <p className="text-sm font-semibold">Geschatte meters dakgoot per verdieping</p>
                <p className="text-xs text-gray-500">Geldig tot 3 verdiepen of 10 meter hoogte. Minimum 10 m te reinigen.</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["v1", "1 verdiep"],
                      ["v2", "2 verdiepen"],
                      ["v3", "3 verdiepen"],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k} className="space-y-1">
                      <label htmlFor={`dg-${k}`} className="block text-xs font-medium !text-gray-700">
                        {label}
                      </label>
                      <Input
                        id={`dg-${k}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        placeholder="meter"
                        className="h-11"
                        value={dakgoot[k]}
                        onChange={(e) => setDakgoot((d) => ({ ...d, [k]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Wanneer past het u?</Label>
              <div className="grid gap-3 rounded-xl bg-white p-3 text-gray-900 sm:grid-cols-[auto_1fr] sm:items-start">
                <Calendar
                  mode="single"
                  locale={nl}
                  weekStartsOn={1}
                  selected={prefDate}
                  onSelect={setPrefDate}
                  disabled={[{ before: new Date() }, { dayOfWeek: [0] }]}
                  className="mx-auto rounded-lg p-0 [&_label]:text-gray-900"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {prefDate ? format(prefDate, "EEEE d MMMM", { locale: nl }) : "Kies een dag"}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
                    {(
                      [
                        ["voormiddag", "Voormiddag", <Sunrise key="a" className="h-4 w-4" />],
                        ["namiddag", "Namiddag", <Sunset key="b" className="h-4 w-4" />],
                        ["maakt niet uit", "Maakt niet uit", <Clock key="c" className="h-4 w-4" />],
                      ] as const
                    ).map(([key, label, icon]) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={prefPart === key}
                        onClick={() => setPrefPart(prefPart === key ? "" : key)}
                        className={cn(
                          "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold sm:flex-row sm:justify-start sm:text-sm",
                          prefPart === key ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Dit is een voorkeur. Riory bevestigt het exacte uur.</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pa-phone">Telefoon</Label>
              <Input id="pa-phone" className="h-11" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  [urgent, setUrgent, <AlertTriangle key="u" className="h-5 w-5" />, "Dringend", "Binnen 24u ter plaatse · toeslag van 50%"],
                  [worksiteDifferent, setWorksiteDifferent, <MapPin key="m" className="h-5 w-5" />, "Ander werkadres", currentAddress ? `Nu: ${currentAddress}` : "De werken zijn niet op uw gekende adres."],
                ] as const
              ).map(([on, set, icon, title, sub]) => (
                <button
                  key={title}
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => set(!on)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                    on
                      ? title === "Dringend"
                        ? "border-red-600 bg-white text-gray-900 shadow-md"
                        : "border-[#1e2e34] bg-white text-gray-900 shadow-md"
                      : "border-white bg-white text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", on ? (title === "Dringend" ? "bg-red-600 text-white" : "bg-[#1e2e34] text-white") : title === "Dringend" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700")}>
                    {icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 font-semibold">
                      {title}
                      <span
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
                          on ? (title === "Dringend" ? "bg-red-600" : "bg-[#1e2e34]") : "bg-gray-300",
                        )}
                        aria-hidden="true"
                      >
                        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", on ? "left-[18px]" : "left-0.5")} />
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-600">{sub}</span>
                  </span>
                </button>
              ))}
            </div>
            {worksiteDifferent && (
              <div className="grid grid-cols-[1fr_80px] gap-2 rounded-xl bg-white p-3 text-gray-900">
                <p className="col-span-2 text-sm font-semibold">Werkadres voor deze aanvraag</p>
                <Input className="h-11" placeholder="Straat" value={worksiteStreet} onChange={(e) => setWorksiteStreet(e.target.value)} required />
                <Input className="h-11" placeholder="Nr." value={worksiteHouseNumber} onChange={(e) => setWorksiteHouseNumber(e.target.value)} />
                <Input className="h-11" placeholder="Gemeente" value={worksiteCity} onChange={(e) => setWorksiteCity(e.target.value)} required />
                <Input className="h-11" placeholder="Postcode" value={worksitePostalCode} onChange={(e) => setWorksitePostalCode(e.target.value)} />
              </div>
            )}
            {urgent && (
              <div className="rounded-xl border-2 border-red-600 bg-white p-4 text-sm text-gray-700">
                <p className="flex items-center gap-2 font-bold text-gray-900">
                  <AlertTriangle className="h-4 w-4 text-red-600" /> Prioritaire behandeling
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />Uw aanvraag gaat vóór alle gewone aanvragen.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />Wij zijn binnen 24 uur bij u ter plaatse.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />Hiervoor rekenen wij een urgentietoeslag van 50%.</li>
                </ul>
              </div>
            )}
            <div className="rounded-xl bg-white p-3.5 text-xs leading-relaxed text-gray-700">
              <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                <Info className="h-4 w-4 text-primary" /> Goed om te weten
              </p>
              Prijzen gelden op weekdagen tussen 8u en 16u. Met voorrang (dringend) rekenen wij een urgentietoeslag van 50%.
              's avonds geldt +50%, 's nachts, in het weekend en op feestdagen +100%. Alle tarieven en toeslagen staan in de algemene voorwaarden hieronder.
            </div>
            <div className="space-y-2 rounded-xl bg-white p-3.5 text-gray-900">
              <TermsButton />
              <label className="flex items-start gap-2 text-sm !text-gray-900">
                <Checkbox className="mt-0.5" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(v === true)} />
                Ik ga akkoord met de algemene voorwaarden en de toeslagen van Riory.
              </label>
            </div>
            <Button className="h-11 w-full gap-2 bg-[#1e2e34] font-semibold text-white hover:bg-[#1e2e34]/90" disabled={submitting || readOnly || !termsAccepted}>
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Aanvraag versturen
            </Button>
          </form>
        </Panel>
        <aside className="space-y-4">
          <UrgentCard />
        </aside>
      </div>
    </>
  );

  const gegevensPage = data.customer ? (
    <>
      <PageTitle title="Mijn gegevens" sub="Klopt er iets niet meer? Pas het hier aan. Uw vorige gegevens blijven bewaard." />
      <div className="max-w-2xl">
        <ProfilePanel
          key={data.customer.id}
          customer={data.customer}
          loginEmail={data.accountEmail}
          readOnly={readOnly}
          onSaved={onReload}
          onAuthError={onLogout}
        />
        <PasswordPanel email={data.accountEmail} />
      </div>
    </>
  ) : (
    homePage
  );

  const content = {
    home: homePage,
    werkbonnen: werkbonnenPage,
    facturen: facturenPage,
    offertes: offertesPage,
    afspraak: afspraakPage,
    gegevens: gegevensPage,
  }[page];

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to={PAGE_PATH.home} aria-label="Klantportaal overzicht" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="Riory" className="h-6 w-auto sm:h-7" />
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 sm:inline lg:hidden xl:inline">Klantportaal</span>
          </Link>
          <nav aria-label="Klantportaal" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((n) => (
              <Link
                key={n.page}
                to={PAGE_PATH[n.page]}
                aria-current={page === n.page ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  page === n.page ? "bg-[#1e2e34] text-white" : "text-gray-700 hover:bg-black/5 hover:text-gray-900",
                )}
              >
                {n.label}
                {n.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                      page === n.page ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
                    )}
                  >
                    {n.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="tel:+32472502814"
              className="hidden items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 lg:inline-flex"
            >
              <Phone className="h-4 w-4" /> Dringend
            </a>
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={() => setProblemOpen(true)} aria-label="Probleem melden" title="Probleem melden">
              <LifeBuoy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onLogout} aria-label="Uitloggen" title="Uitloggen">
              <LogOut className="h-4 w-4" />
            </Button>
            <a href="tel:+32472502814" aria-label="Bel Riory" className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white lg:hidden">
              <Phone className="h-5 w-5" />
            </a>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden" aria-label="Menu openen">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[85vw] max-w-xs flex-col gap-0 p-0">
                <SheetTitle className="border-b px-5 py-4 text-base">Menu</SheetTitle>
                <p className="truncate px-5 pt-3 text-xs text-gray-500">{data.accountEmail}</p>
                <nav aria-label="Klantportaal" className="flex flex-col gap-0.5 p-3">
                  {navItems.map((n) => (
                    <Link
                      key={n.page}
                      to={PAGE_PATH[n.page]}
                      onClick={() => setMenuOpen(false)}
                      aria-current={page === n.page ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium",
                        page === n.page ? "bg-[#1e2e34] text-white" : "text-gray-800 hover:bg-black/5",
                      )}
                    >
                      {n.icon}
                      <span className="flex-1">{n.label}</span>
                      {n.badge ? (
                        <span className={cn("rounded-full px-2 text-xs font-semibold", page === n.page ? "bg-white/20" : "bg-primary/10 text-primary")}>
                          {n.badge}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto space-y-2 border-t p-4">
                  <a
                    href="tel:+32472502814"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white"
                  >
                    <Phone className="h-5 w-5" /> Dringend: bel ons
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 w-full gap-2 text-gray-600"
                    onClick={() => {
                      setMenuOpen(false);
                      setProblemOpen(true);
                    }}
                  >
                    <LifeBuoy className="h-4 w-4" /> Probleem melden
                  </Button>
                  <Button variant="outline" className="h-11 w-full gap-2" onClick={() => { setMenuOpen(false); onLogout(); }}>
                    <LogOut className="h-4 w-4" /> Uitloggen
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:pt-8">
        {data.preview && (
          <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <span className="font-semibold">Voorbeeldweergave</span> — u bekijkt het portaal zoals klant{" "}
            <span className="font-semibold">{data.preview.name}</span> het ziet. Aanpassen en aanvragen zijn uitgeschakeld.
          </div>
        )}
        {page !== "home" && (
          <Link to={PAGE_PATH.home} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Overzicht
          </Link>
        )}
        {content}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setProblemOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-black/5 hover:text-gray-900"
          >
            <LifeBuoy className="h-4 w-4" /> Probleem met het klantportaal? Meld het hier
          </button>
        </div>
      </main>
      <ProblemReport open={problemOpen} setOpen={setProblemOpen} page={location.pathname} onAuthError={onLogout} />
      <PdfViewer doc={viewer?.doc ?? null} title={viewer?.title ?? ""} onClose={closeViewer} />
      <QuoteDialog
        quote={data.quotes.find((q) => q.id === quoteId) ?? null}
        defaultName={data.customer?.name ?? ""}
        readOnly={readOnly}
        onClose={() => setQuoteId(null)}
        onDone={quoteDone}
        onAuthError={onLogout}
      />
      <AppointmentDialog
        wo={data.workOrders.find((w) => w.id === apptId) ?? null}
        readOnly={readOnly}
        onClose={() => setApptId(null)}
        onCancelled={appointmentCancelled}
        onAuthError={onLogout}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------

export default function Klantportaal() {
  useDocumentMeta("Klantenportaal | Riory", "Uw werkbonnen, facturen en offertes bij Riory op één plek.");
  useNoIndex();
  const [state, setState] = useState<"loading" | "login" | "portal" | "error" | "reset">("loading");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState<PortalOverview | null>(null);
  const [loginError, setLoginError] = useState("");

  async function load() {
    try {
      setData(await loadOverview());
      setState("portal");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Er ging iets mis.";
      // Only an expired session or refused access ends the session; a hiccup keeps the customer logged in.
      if (e instanceof PortalAuthError || e instanceof PortalAccessError) {
        if (!(e instanceof PortalAuthError)) setLoginError(message);
        clearPortalSession();
        setData(null);
        setState("login");
      } else if (data) {
        toast.error(`Vernieuwen mislukt: ${message}`);
      } else {
        setLoadError(message);
        setState("error");
      }
    }
  }

  useEffect(() => {
    (async () => {
      const fout = new URLSearchParams(window.location.search).get("fout");
      if (fout) {
        setLoginError(LOGIN_ERRORS[fout] ?? LOGIN_ERRORS.google);
        window.history.replaceState(null, "", window.location.pathname);
      }
      const reset = resetTokenFromHash(window.location.hash);
      if (reset) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setResetToken(reset);
        setState("reset");
        return;
      }
      const token = loginTokenFromHash(window.location.hash);
      if (token) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        try {
          await verifyLoginToken(token);
        } catch (e) {
          setLoginError(
            e instanceof PortalAccessError
              ? e.message
              : "Deze inloglink is verlopen of al gebruikt. Vraag hieronder een nieuwe aan.",
          );
          setState("login");
          return;
        }
      }
      if (!hasPortalSession()) {
        setState("login");
        return;
      }
      await load();
    })();
  }, []);

  async function logout() {
    clearPortalSession();
    setData(null);
    setLoginError("");
    setState("login");
  }

  return (
    <div data-clarity-mask="True" className="flex min-h-dvh flex-col bg-[#f6f5f2] font-body text-gray-900">
      <div className="h-1.5 w-full bg-primary" />
      {state === "loading" ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-gray-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" /> Even geduld…
        </div>
      ) : state === "error" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-sm text-gray-600">{loadError || "Uw gegevens konden niet geladen worden."}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setState("loading");
                void load();
              }}
            >
              Opnieuw proberen
            </Button>
            <Button variant="outline" onClick={logout}>
              Uitloggen
            </Button>
          </div>
        </div>
      ) : state === "reset" && resetToken ? (
        <SetPasswordView
          token={resetToken}
          onDone={() => {
            setResetToken(null);
            setState("loading");
            void load();
          }}
        />
      ) : state === "login" || !data ? (
        <LoginView
          initialError={loginError}
          onLoggedIn={() => {
            setState("loading");
            void load();
          }}
        />
      ) : (
        <PortalView data={data} onReload={load} onLogout={logout} />
      )}
    </div>
  );
}
