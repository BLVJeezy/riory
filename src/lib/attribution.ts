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
const AD_IDS_KEY = "riory_attr_ad_ids";
const TOUCHES_KEY = "riory_attr_touches";
const VISITOR_ID_KEY = "riory_visitor_id";
const TTL_DAYS = 90;
const TOUCHES_MAX = 50;
const TOUCH_DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 min
export const GA_MEASUREMENT_ID = "G-E54E9FCFZQ";

export type AttrData = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
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
  let base: AttrData = {};
  try {
    if (hasAnalyticsConsent()) {
      const raw = getCookie(COOKIE);
      if (raw) base = JSON.parse(raw);
    }
    if (!base.first_touch_at) {
      const sess = sessionStorage.getItem(SESSION_KEY);
      if (sess) base = JSON.parse(sess);
    }
  } catch {
    /* corrupt storage → fall through */
  }
  try {
    const ls = localStorage.getItem(AD_IDS_KEY);
    if (ls) {
      const ids = JSON.parse(ls) as Partial<AttrData>;
      if (!base.gclid && ids.gclid) base.gclid = ids.gclid;
      if (!base.gbraid && ids.gbraid) base.gbraid = ids.gbraid;
      if (!base.wbraid && ids.wbraid) base.wbraid = ids.wbraid;
      if (!base.first_touch_at && ids.first_touch_at) {
        base.first_touch_at = ids.first_touch_at;
      }
    }
  } catch {
    /* ignore */
  }
  return base;
}

function writeAttribution(data: AttrData): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(data);
  try {
    sessionStorage.setItem(SESSION_KEY, serialized);
  } catch {
    /* ignore */
  }
  if (data.gclid || data.gbraid || data.wbraid) {
    try {
      localStorage.setItem(
        AD_IDS_KEY,
        JSON.stringify({
          gclid: data.gclid,
          gbraid: data.gbraid,
          wbraid: data.wbraid,
          first_touch_at: data.first_touch_at,
        }),
      );
    } catch {
      /* quota or disabled */
    }
  }
  if (hasAnalyticsConsent()) {
    setCookie(COOKIE, serialized, TTL_DAYS);
  }
}

// ---------------------------------------------------------------------------
// Multi-touch storage — bewaar ALLE marketing-signalen die we zien.
// Consent: localStorage (cross-session); no-consent: sessionStorage (per tab).
// ---------------------------------------------------------------------------

function readTouches(): TouchData[] {
  if (typeof window === "undefined") return [];
  try {
    if (hasAnalyticsConsent()) {
      const ls = localStorage.getItem(TOUCHES_KEY);
      if (ls) return JSON.parse(ls) as TouchData[];
    }
    const ss = sessionStorage.getItem(TOUCHES_KEY);
    if (ss) return JSON.parse(ss) as TouchData[];
  } catch {
    /* corrupt storage → reset */
  }
  return [];
}

function writeTouches(touches: TouchData[]): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(touches);
  try {
    sessionStorage.setItem(TOUCHES_KEY, serialized);
  } catch {
    /* ignore */
  }
  if (hasAnalyticsConsent()) {
    try {
      localStorage.setItem(TOUCHES_KEY, serialized);
    } catch {
      /* quota or disabled */
    }
  }
}

function touchHasSignal(t: Partial<TouchData>): boolean {
  return Boolean(
    t.gclid ||
      t.utm_source ||
      t.utm_medium ||
      t.utm_campaign ||
      t.utm_content ||
      t.utm_term
  );
}

function sameCampaign(a: Partial<TouchData>, b: Partial<TouchData>): boolean {
  return (
    a.gclid === b.gclid &&
    a.utm_source === b.utm_source &&
    a.utm_medium === b.utm_medium &&
    a.utm_campaign === b.utm_campaign &&
    a.utm_content === b.utm_content &&
    a.utm_term === b.utm_term
  );
}

function appendTouchIfNew(candidate: TouchData): void {
  if (!touchHasSignal(candidate)) return;
  const existing = readTouches();
  const last = existing[existing.length - 1];
  if (
    last &&
    sameCampaign(last, candidate) &&
    Date.now() - new Date(last.touch_at).getTime() < TOUCH_DEDUPE_WINDOW_MS
  ) {
    return; // dezelfde campagne binnen 30 min → skip duplicate
  }
  existing.push(candidate);
  if (existing.length > TOUCHES_MAX) existing.shift();
  writeTouches(existing);
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
    gbraid: pick("gbraid"),
    wbraid: pick("wbraid"),
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
    gbraid:
      existing.gbraid || (isFirstTouch ? incoming.gbraid : undefined),
    wbraid:
      existing.wbraid || (isFirstTouch ? incoming.wbraid : undefined),
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

  // Multi-touch: schrijf een touch-rij als er een marketing-signaal in de URL zit.
  // Dedup gebeurt in appendTouchIfNew (zelfde campagne binnen 30 min → skip).
  if (touchHasSignal(incoming)) {
    appendTouchIfNew({
      touch_at: new Date().toISOString(),
      gclid: incoming.gclid,
      gbraid: incoming.gbraid,
      wbraid: incoming.wbraid,
      utm_source: incoming.utm_source,
      utm_medium: incoming.utm_medium,
      utm_campaign: incoming.utm_campaign,
      utm_content: incoming.utm_content,
      utm_term: incoming.utm_term,
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    });
  }
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
// Submit-time attribution
//
// We sturen ALTIJD twee objecten naar de backend:
//
//   `attribution`  = first-touch (uit opgeslagen storage; fall-back op de
//                    huidige URL als er nog niets is opgeslagen)
//   `last_touch`   = de URL-parameters + referrer op het EXACTE moment van
//                    submit. Onbewerkt — niet samengevoegd met first-touch.
//
// De backend kan zelf kiezen welk model relevant is per query. Belangrijk:
// bij ontbrekende cookie (consent denied) zal `attribution` en `last_touch`
// nagenoeg gelijk zijn (beide vallen terug op de URL van het moment).
// ---------------------------------------------------------------------------

export type LastTouchData = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  last_touch_at?: string;
};

export type TouchData = {
  touch_at: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
};

async function buildSubmitAttribution(): Promise<AttrData> {
  const stored = readAttribution();
  const url = readUrlAttribution();
  const ga_client_id = await getGa4ClientId();

  return {
    gclid: stored.gclid || url.gclid,
    gbraid: stored.gbraid || url.gbraid,
    wbraid: stored.wbraid || url.wbraid,
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

function buildLastTouchAttribution(): LastTouchData {
  if (typeof window === "undefined") return {};
  const url = readUrlAttribution();
  return {
    gclid: url.gclid,
    gbraid: url.gbraid,
    wbraid: url.wbraid,
    utm_source: url.utm_source,
    utm_medium: url.utm_medium,
    utm_campaign: url.utm_campaign,
    utm_content: url.utm_content,
    utm_term: url.utm_term,
    referrer:
      typeof document !== "undefined" ? document.referrer || undefined : undefined,
    last_touch_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Network: sendLead / trackPhoneClick / trackCtaClick
// ---------------------------------------------------------------------------

const LEAD_ENDPOINT = "https://riory.invenix.nl/api/lead";
const PHONE_CLICK_ENDPOINT = "https://riory.invenix.nl/api/phone_click";
const CALCULATOR_ENDPOINT = "https://riory.invenix.nl/api/calculator";

export async function sendLead(formFields: Record<string, unknown>) {
  try {
    const attribution = await buildSubmitAttribution();
    const last_touch = buildLastTouchAttribution();
    const touches = readTouches();
    const payload = {
      ...formFields,
      visitor_id: getVisitorId(),
      submitted_at: new Date().toISOString(),
      page_url:
        typeof window !== "undefined" ? window.location.href : undefined,
      attribution,
      last_touch,
      touches,
    };
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        lead_type: String(formFields.type ?? "lead"),
      });
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn("sendLead failed:", err);
  }
}

export async function sendCalculatorSnapshot(state: Record<string, unknown>) {
  try {
    const attribution = await buildSubmitAttribution();
    const last_touch = buildLastTouchAttribution();
    const payload = {
      ...state,
      visitor_id: getVisitorId(),
      submitted_at: new Date().toISOString(),
      page_url:
        typeof window !== "undefined" ? window.location.href : undefined,
      attribution,
      last_touch,
    };
    await fetch(CALCULATOR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("sendCalculatorSnapshot failed:", err);
  }
}

export async function trackPhoneClick(opts: { phone: string; label?: string }) {
  const attribution = await buildSubmitAttribution();
  const last_touch = buildLastTouchAttribution();
  const touches = readTouches();
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
        last_touch,
        touches,
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
  const last_touch = buildLastTouchAttribution();
  const touches = readTouches();
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
        last_touch,
        touches,
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
