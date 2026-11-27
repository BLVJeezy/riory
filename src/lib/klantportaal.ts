/**
 * Klantenportaal op www.riory.be/klantportaal.
 * De gegevens (werkbonnen, facturen, offertes) komen uit het Riory-werkbonnensysteem.
 * De klant logt in met een eenmalige inloglink (mail of Google); die wordt omgeruild voor
 * een kortlevend portaaltoken dat enkel de portaal-API aanvaardt. Er staat dus nooit een
 * volledige inlogsessie van het werkbonnensysteem in deze browser.
 */
const PORTAL_API = "https://werkbonnen.riory.be/api/public/portal";
const TOKEN_KEY = "riory-klantportaal-token";
const LEGACY_SESSION_KEY = "riory-klantportaal-auth";

type StoredToken = { token: string; expiresAt: number };

function readToken(): string | null {
  try {
    localStorage.removeItem(LEGACY_SESSION_KEY); // oude Supabase-sessie van vóór de portaaltokens
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as StoredToken;
    if (!t?.token || !t.expiresAt || t.expiresAt <= Date.now() + 30_000) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return t.token;
  } catch {
    return null;
  }
}

function storeToken(t: StoredToken) {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
  } catch {
    /* privémodus: token blijft enkel voor deze pagina geldig */
    memoryToken = t;
  }
}

let memoryToken: StoredToken | null = null;

export function hasPortalSession(): boolean {
  return !!(readToken() ?? (memoryToken && memoryToken.expiresAt > Date.now() ? memoryToken.token : null));
}

export function clearPortalSession() {
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export type PortalStage = "aangevraagd" | "offerte" | "gepland" | "afgewerkt";
export type PortalInvoiceState = "betaald" | "open" | "vervallen" | "creditnota";

export type PortalCustomer = {
  id: string;
  name: string;
  phone: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  email: string | null;
  billing_email: string | null;
  vat_number: string | null;
  customer_number: string | null;
  profile_updated_at?: string | null;
  profile_history?: {
    created_at: string;
    changes: { field: string; before: string | null; after: string | null }[];
  }[];
};

export type PortalOverview = {
  accountEmail: string;
  preview: { name: string } | null;
  services: { key: string; label: string }[];
  customer: PortalCustomer | null;
  customers: PortalCustomer[];
  workOrders: {
    id: string;
    number: number | null;
    stage: PortalStage;
    scheduledDate: string | null;
    scheduledFrom: string | null;
    scheduledUntil: string | null;
    description: string | null;
    projectName: string | null;
    address: string;
    urgent: boolean;
    createdAt: string;
    signedAt: string | null;
    hasPdf: boolean;
    cancelRequested?: boolean;
  }[];
  invoices: {
    id: string;
    number: string;
    kind: string;
    issueDate: string | null;
    dueDate: string | null;
    total: number;
    openAmount: number;
    state: PortalInvoiceState;
    workOrderNumber: number | null;
  }[];
  quotes: {
    id: string;
    number: string;
    kind: string;
    status: string;
    total: number;
    date: string;
    signedAt: string | null;
    signUrl: string | null;
    signedName?: string | null;
    intro?: string | null;
    net?: number;
    vat?: number;
    lines?: {
      index: number;
      description: string;
      quantity: number;
      unit: string;
      amount: number;
      optional: boolean;
    }[];
  }[];
};

export type PortalAppointmentInput = {
  description: string;
  preferredWindow?: string;
  contactPhone?: string;
  urgent?: boolean;
  worksiteDifferent?: boolean;
  worksiteStreet?: string;
  worksiteHouseNumber?: string;
  worksitePostalCode?: string;
  worksiteCity?: string;
  projectName?: string;
  customerId?: string;
  service?: string;
};

export type PortalProfileInput = {
  customerId: string;
  name: string;
  phone?: string;
  street?: string;
  house_number?: string;
  postal_code?: string;
  city?: string;
  billing_email?: string;
};

export class PortalAuthError extends Error {}
/** The account is logged in but has no (or no longer) access to the portal. */
export class PortalAccessError extends Error {}

async function call(action: string, body: unknown, auth = true): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = readToken() ?? (memoryToken && memoryToken.expiresAt > Date.now() ? memoryToken.token : null);
    if (!token) throw new PortalAuthError("Niet ingelogd.");
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${PORTAL_API}/${action}`, { method: "POST", headers, body: JSON.stringify(body ?? {}) });
  if (res.status === 401) {
    if (auth) clearPortalSession();
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new PortalAuthError(err?.error ?? "Uw sessie is verlopen. Log opnieuw in.");
  }
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    const message = err?.error ?? "Er ging iets mis. Probeer opnieuw.";
    if (res.status === 403) throw new PortalAccessError(message);
    throw new Error(message);
  }
  return res;
}

export async function requestLoginLink(email: string): Promise<void> {
  await call("login", { email: email.trim().toLowerCase() }, false);
}

export async function loadOverview(): Promise<PortalOverview> {
  return (await call("overview", {})).json();
}

export async function requestAppointment(input: PortalAppointmentInput): Promise<void> {
  await call("appointment", input);
}

export async function updateProfile(input: PortalProfileInput): Promise<void> {
  await call("profile", input);
}

export async function decideQuote(input: {
  quoteId: string;
  decision: "akkoord" | "geweigerd";
  name?: string;
  signature?: string;
  options?: number[];
  reason?: string;
}): Promise<void> {
  await call("quote-decision", input);
}

export async function cancelAppointment(input: { workOrderId: string; reason?: string }): Promise<void> {
  await call("appointment-cancel", input);
}

/** Customers can cancel online up to this many hours before the appointment. */
export const CANCEL_HOURS = 24;

/** Brussels wall-clock date + time → epoch ms (works whatever time zone the browser is in). */
export function brusselsTime(date: string, time: string | null): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time ?? "08:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return guess - (Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute")) - guess);
}

// Demo items (ids "demo-…", test account only) never reach the server: decisions are kept in this browser.
const DEMO_KEY = "riory-klantportaal-demo";
type DemoState = { quotes: Record<string, "akkoord" | "geweigerd">; cancels: Record<string, true>; signedName?: Record<string, string> };
export function readDemoState(): DemoState {
  try {
    const v = JSON.parse(localStorage.getItem(DEMO_KEY) ?? "null");
    return { quotes: v?.quotes ?? {}, cancels: v?.cancels ?? {}, signedName: v?.signedName ?? {} };
  } catch {
    return { quotes: {}, cancels: {}, signedName: {} };
  }
}
export function writeDemoState(state: DemoState) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the change lasts until reload */
  }
}
export function applyDemoState(data: PortalOverview): PortalOverview {
  const st = readDemoState();
  return {
    ...data,
    workOrders: data.workOrders.map((w) => (st.cancels[w.id] ? { ...w, cancelRequested: true } : w)),
    quotes: data.quotes.map((q) =>
      st.quotes[q.id]
        ? {
            ...q,
            status: st.quotes[q.id],
            signUrl: null,
            signedAt: st.quotes[q.id] === "akkoord" ? (q.signedAt ?? new Date().toISOString()) : q.signedAt,
            signedName: st.signedName?.[q.id] ?? q.signedName,
          }
        : q,
    ),
  };
}

export async function reportProblem(input: {
  topics: string[];
  message: string;
  page?: string;
  userAgent?: string;
}): Promise<void> {
  await call("problem", input);
}

export async function requestInvoiceCopy(message: string): Promise<void> {
  await call("invoice-request", { message });
}

export type PortalDocument = { url: string; filename: string; blob: Blob };

/** Fetch a PDF and keep it as an object URL, so it can be shown in a pop-up and downloaded from there. */
export async function fetchDocument(type: "factuur" | "werkbon", id: string): Promise<PortalDocument> {
  const res = await call("document", { type, id });
  const blob = new Blob([await res.blob()], { type: "application/pdf" });
  const filename = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? `Riory-${type}.pdf`;
  return { url: URL.createObjectURL(blob), filename, blob };
}

export function saveDocument(doc: PortalDocument) {
  const a = document.createElement("a");
  a.href = doc.url;
  a.download = doc.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** One-time token from the login mail: https://www.riory.be/klantportaal#login=<hashed token>. */
export function loginTokenFromHash(hash: string): string | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get("login");
  return token && /^[a-zA-Z0-9_-]{32,512}$/.test(token) ? token : null;
}

export function resetTokenFromHash(hash: string): string | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get("reset");
  return token && /^[a-zA-Z0-9_-]{32,512}$/.test(token) ? token : null;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await call("login", { email: email.trim().toLowerCase(), kind: "reset" }, false);
}

export async function passwordLogin(email: string, password: string): Promise<void> {
  const res = await call("password-login", { email: email.trim().toLowerCase(), password }, false);
  storeToken((await res.json()) as StoredToken);
}

export async function setNewPassword(token: string, password: string): Promise<void> {
  const res = await call("set-password", { token, password }, false);
  storeToken((await res.json()) as StoredToken);
}

/** Trade the one-time login link for a portal token. Throws with a readable message on failure. */
export async function verifyLoginToken(token: string): Promise<void> {
  const res = await call("exchange", { token }, false);
  const t = (await res.json()) as StoredToken;
  storeToken(t);
}

export const STAGE_LABEL: Record<PortalStage, string> = {
  aangevraagd: "Aangevraagd",
  offerte: "Offerte in opmaak",
  gepland: "Ingepland",
  afgewerkt: "Afgewerkt",
};

/** Werkbonnen per project (projectnaam, anders werkadres), in volgorde. */
export function groupProjects<T extends { projectName: string | null; address: string }>(rows: readonly T[]) {
  const groups = new Map<string, { key: string; title: string; subtitle: string | null; items: T[] }>();
  for (const row of rows) {
    const name = row.projectName?.trim();
    const key = name ? `p:${name.toLowerCase()}` : `a:${row.address.toLowerCase() || "onbekend"}`;
    let g = groups.get(key);
    if (!g) {
      g = { key, title: name || row.address || "Overige opdrachten", subtitle: name ? row.address || null : null, items: [] };
      groups.set(key, g);
    }
    g.items.push(row);
  }
  return [...groups.values()];
}
