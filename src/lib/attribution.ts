// Attribution tracking: captures GCLID + UTM params on first touch,
// stores them in a first-party cookie, and exposes helpers to enrich
// form submissions and click events.

const COOKIE = "riory_attr";
const TTL_DAYS = 90;
export const GA_MEASUREMENT_ID = "G-2XP4PSTDFS";

export type AttrData = {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
  first_touch_at?: string;
};

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  let existing: AttrData = {};
  try {
    existing = JSON.parse(getCookie(COOKIE) || "{}");
  } catch {
    existing = {};
  }

  const incoming: AttrData = {
    gclid: params.get("gclid") ?? undefined,
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
  };

  const hasNewSignal = Boolean(incoming.gclid || incoming.utm_source);
  if (hasNewSignal || !existing.first_touch_at) {
    const merged: AttrData = {
      ...(hasNewSignal ? incoming : existing),
      landing_page:
        existing.landing_page ||
        window.location.pathname + window.location.search,
      referrer: existing.referrer || document.referrer || undefined,
      first_touch_at: existing.first_touch_at || new Date().toISOString(),
    };
    setCookie(COOKIE, JSON.stringify(merged), TTL_DAYS);
  }
}

export function getAttribution(): AttrData {
  if (typeof document === "undefined") return {};
  try {
    return JSON.parse(getCookie(COOKIE) || "{}");
  } catch {
    return {};
  }
}

export function getGa4ClientId(): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return resolve(undefined);
    }
    const timer = setTimeout(() => resolve(undefined), 500);
    try {
      window.gtag("get", GA_MEASUREMENT_ID, "client_id", (id: string) => {
        clearTimeout(timer);
        resolve(id);
      });
    } catch {
      clearTimeout(timer);
      resolve(undefined);
    }
  });
}

const LEAD_ENDPOINT = "https://riory.invenix.nl/api/lead";

export async function sendLead(formFields: Record<string, unknown>) {
  try {
    const attribution = getAttribution();
    const ga_client_id = await getGa4ClientId();
    const payload = {
      ...formFields,
      attribution: {
        ...attribution,
        ga_client_id,
        submitted_at: new Date().toISOString(),
        page_url:
          typeof window !== "undefined" ? window.location.href : undefined,
      },
    };
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    console.error("Lead submit failed:", err);
  }
}
