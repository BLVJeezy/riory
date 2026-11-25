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

export type PortalOverview = {
  accountEmail: string;
  customer: { id: string; name: string; phone: string | null } | null;
  customers: { id: string; name: string; phone: string | null; street: string | null; house_number: string | null; city: string | null }[];
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

export async function downloadDocument(type: "factuur" | "werkbon", id: string): Promise<void> {
  const res = await call("document", { type, id });
  const blob = await res.blob();
  const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? `Riory-${type}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** One-time token from the login mail: https://www.riory.be/klantportaal#login=<hashed token>. */
export function loginTokenFromHash(hash: string): string | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get("login");
  return token && /^[a-zA-Z0-9_-]{32,512}$/.test(token) ? token : null;
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
