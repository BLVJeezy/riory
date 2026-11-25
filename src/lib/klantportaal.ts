import { createClient } from "@supabase/supabase-js";

/**
 * Klantenportaal op www.riory.be/klantportaal.
 * De gegevens (werkbonnen, facturen, offertes) komen uit het Riory-werkbonnensysteem;
 * de klant logt in bij dat systeem met een eenmalige inloglink per mail.
 * De URL en publishable key zijn publieke waarden; toegang wordt server-side afgedwongen.
 */
const PORTAL_SUPABASE_URL = "https://kruypcaqelxqqdjcbvsf.supabase.co";
const PORTAL_SUPABASE_KEY = "sb_publishable_cG-RjkpV4cHvG_ppVQEgLQ_TtR-mpWC";
const PORTAL_API = "https://werkbonnen.riory.be/api/public/portal";

export const portalAuth = createClient(PORTAL_SUPABASE_URL, PORTAL_SUPABASE_KEY, {
  auth: {
    storageKey: "riory-klantportaal-auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

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
    const { data } = await portalAuth.auth.getSession();
    if (!data.session) throw new PortalAuthError("Niet ingelogd.");
    headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  const res = await fetch(`${PORTAL_API}/${action}`, { method: "POST", headers, body: JSON.stringify(body ?? {}) });
  if (res.status === 401) throw new PortalAuthError("Uw sessie is verlopen. Log opnieuw in.");
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

export async function verifyLoginToken(token: string): Promise<boolean> {
  let res = await portalAuth.auth.verifyOtp({ token_hash: token, type: "magiclink" });
  if (res.error) res = await portalAuth.auth.verifyOtp({ token_hash: token, type: "email" });
  return !res.error && !!res.data.session;
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
