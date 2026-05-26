// Attribution tracking voor riory.be.
//
// Strategie (consent-conform):
//  - Cookie `riory_attr` (persistent, 90 dgn) wordt alleen geschreven NA
//    consent voor categorie "analytics" via CookieYes.
//  - Voor wie consent weigert: alles draait via sessionStorage (per tab) +
//    URL-attribution op het moment van submit. First-touch werkt dan binnen
//    een sessie, niet cross-session.
//  - Bij elke /api/lead of /api/phone_click sturen we ALTIJD ook de
//    URL-parameters van dat moment mee — onafhankelijk van cookie-status.
//  - First-touch attributie is "immutable": eenmaal geregistreerd worden
//    gclid/utm_* niet meer overschreven door latere bezoeken.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const COOKIE = "riory_attr";
const SESSION_KEY = "riory_attr_session";
const VISITOR_ID_KEY = "riory_visitor_id";
const TTL_DAYS = 90;
export const GA_MEASUREMENT_ID = "G-E54E9FCFZQ";

export type AttrData = {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
  ga_client_id?: string;
  first_touch_at?: string;
};

// ---------------------------------------------------------------------------
// Consent — CookieYes integratie
// ---------------------------------------------------------------------------

function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false;
  // CookieYes schrijft `cookieyes-consent` cookie met o.a. "consent={...}"
  // of een individuele "analytics:yes"/"analytics:no" segment. Robuuste
  // detectie: zoek naar "analytics:yes" in de cookie-string.
  const raw = document.cookie || "";
  return /analytics:yes/i.test(raw);
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

// ---------------------------------------------------------------------------
// Visitor ID — sessionStorage (per-tab, geen consent nodig)
// ---------------------------------------------------------------------------

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Attribution storage — kiest cookie vs sessionStorage op basis van consent
// ---------------------------------------------------------------------------

function readAttribution(): AttrData {
  if (typeof window === "undefined") return {};
  try {
    if (hasAnalyticsConsent()) {
      const raw = getCookie(COOKIE);
      if (raw) return JSON.parse(raw);
    }
    const sess = sessionStorage.getItem(SESSION_KEY);
    if (sess) return JSON.parse(sess);
  } catch {
    /* corrupt storage → fall through */
  }
  return {};
}

function writeAttribution(data: AttrData): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(data);
  try {
    sessionStorage.setItem(SESSION_KEY, serialized);
  } catch {
    /* ignore */
  }
  if (hasAnalyticsConsent()) {
    setCookie(COOKIE, serialized, TTL_DAYS);
  }
}

// ---------------------------------------------------------------------------
// GA client_id — primary: gtag('get'), fallback: parse _ga cookie
// ---------------------------------------------------------------------------

export function getGaClientIdFromCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  // _ga cookie format: GA1.1.<client_id>.<timestamp> → wij willen
  // "<client_id>.<timestamp>" als single string.
  const m = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
  return m ? m[1] : undefined;
}

export function getGa4ClientId(): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(undefined);
    }
    if (typeof window.gtag !== "function") {
      // GA niet (nog) geladen → fall back op cookie
      return resolve(getGaClientIdFromCookie());
    }
    const timer = setTimeout(() => resolve(getGaClientIdFromCookie()), 500);
    try {
      window.gtag("get", GA_MEASUREMENT_ID, "client_id", (id: string) => {
        clearTimeout(timer);
        resolve(id || getGaClientIdFromCookie());
      });
    } catch {
      clearTimeout(timer);
      resolve(getGaClientIdFromCookie());
    }
  });
}

// ---------------------------------------------------------------------------
// Capture — runs once on mount. First-touch is immutable.
// ---------------------------------------------------------------------------

function readUrlAttribution(): Partial<AttrData> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const pick = (k: string) => params.get(k) || undefined;
  return {
    gclid: pick("gclid"),
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
}

export async function captureAttribution() {
  if (typeof window === "undefined") return;

  const existing = readAttribution();
  const incoming = readUrlAttribution();
  const ga_client_id = await getGa4ClientId();

  const isFirstTouch = !existing.first_touch_at;

  // First-touch wins: schrijf alleen een veld bij eerste contact.
  // Bij latere bezoeken met nieuwe UTM/gclid wordt de oude waarde
  // BEWUST behouden (deze cookie modelleert first-touch attributie).
  const merged: AttrData = {
    gclid:
      existing.gclid || (isFirstTouch ? incoming.gclid : undefined),
    utm_source:
      existing.utm_source || (isFirstTouch ? incoming.utm_source : undefined),
    utm_medium:
      existing.utm_medium || (isFirstTouch ? incoming.utm_medium : undefined),
    utm_campaign:
      existing.utm_campaign ||
      (isFirstTouch ? incoming.utm_campaign : undefined),
    utm_content:
      existing.utm_content || (isFirstTouch ? incoming.utm_content : undefined),
    utm_term:
      existing.utm_term || (isFirstTouch ? incoming.utm_term : undefined),
    landing_page:
      existing.landing_page ||
      (isFirstTouch
        ? window.location.pathname + window.location.search
        : undefined),
    referrer:
      existing.referrer ||
      (isFirstTouch ? document.referrer || undefined : undefined),
    first_touch_at: existing.first_touch_at || new Date().toISOString(),
    ga_client_id: ga_client_id || existing.ga_client_id,
  };

  writeAttribution(merged);
}

// Re-run schrijfactie bij consent-update zodat cookie alsnog gevuld wordt
// als de gebruiker later "accept" klikt.
if (typeof window !== "undefined") {
  document.addEventListener("cookieyes_consent_update", () => {
    if (hasAnalyticsConsent()) {
      const data = readAttribution();
      setCookie(COOKIE, JSON.stringify(data), TTL_DAYS);
    }
  });
}

export function getAttribution(): AttrData {
  return readAttribution();
}

// ---------------------------------------------------------------------------
// Submit-time attribution: combineert opgeslagen first-touch met
// URL-parameters van NU (last-touch) — werkt ook zonder cookie.
// ---------------------------------------------------------------------------

async function buildSubmitAttribution(): Promise<AttrData> {
  const stored = readAttribution();
  const url = readUrlAttribution();
  const ga_client_id = await getGa4ClientId();

  // Submit-time attributie: behoud first-touch waar aanwezig, anders pak
  // wat NU in URL staat. Voor leads waarvan de cookie ontbreekt (consent
  // geweigerd, eerste sessie) is dit dé manier om last-touch te capturen.
  return {
    gclid: stored.gclid || url.gclid,
    utm_source: stored.utm_source || url.utm_source,
    utm_medium: stored.utm_medium || url.utm_medium,
    utm_campaign: stored.utm_campaign || url.utm_campaign,
    utm_content: stored.utm_content || url.utm_content,
    utm_term: stored.utm_term || url.utm_term,
    landing_page:
      stored.landing_page ||
      (typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : undefined),
    referrer:
      stored.referrer ||
      (typeof document !== "undefined" ? document.referrer || undefined : undefined),
    first_touch_at: stored.first_touch_at,
    ga_client_id: ga_client_id || stored.ga_client_id,
  };
}

// ---------------------------------------------------------------------------
// Network: sendLead / trackPhoneClick / trackCtaClick
// ---------------------------------------------------------------------------

const LEAD_ENDPOINT = "https://riory.invenix.nl/api/lead";
const PHONE_CLICK_ENDPOINT = "https://riory.invenix.nl/api/phone_click";

export async function sendLead(formFields: Record<string, unknown>) {
  try {
    const attribution = await buildSubmitAttribution();
    const payload = {
      ...formFields,
      visitor_id: getVisitorId(),
      submitted_at: new Date().toISOString(),
      page_url:
        typeof window !== "undefined" ? window.location.href : undefined,
      attribution,
    };
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("sendLead failed:", err);
  }
}

export async function trackPhoneClick(opts: { phone: string; label?: string }) {
  const attribution = await buildSubmitAttribution();
  try {
    fetch(PHONE_CLICK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        clicked_phone: opts.phone,
        cta_label: opts.label ?? "phone_click",
        visitor_id: getVisitorId(),
        page_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        attribution,
      }),
    }).catch((err) => {
      if (import.meta.env.DEV) console.warn("trackPhoneClick failed:", err);
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("trackPhoneClick failed:", err);
  }

  if (typeof window !== "undefined") {
    window.gtag?.("event", "click_telefoon", {
      cta_label: opts.label ?? "click_telefoon",
      phone: opts.phone,
    });
  }
}

export async function trackCtaClick(opts: { label: string; phone?: string }) {
  const attribution = await buildSubmitAttribution();
  try {
    fetch(PHONE_CLICK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        clicked_phone: opts.phone,
        cta_label: opts.label,
        visitor_id: getVisitorId(),
        page_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        attribution,
      }),
    }).catch((err) => {
      if (import.meta.env.DEV) console.warn("trackCtaClick failed:", err);
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("trackCtaClick failed:", err);
  }

  if (typeof window !== "undefined") {
    window.gtag?.("event", "cta_click", {
      cta_label: opts.label,
    });
  }
}
