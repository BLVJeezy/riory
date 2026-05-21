// Attribution tracking: captures GCLID + UTM params on first touch,
// stores them in a first-party cookie, and exposes helpers to enrich
// form submissions and click events.

const COOKIE = "riory_attr";
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

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export async function captureAttribution() {
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

  const hasNewSignal = Boolean(
    incoming.gclid ||
      incoming.utm_source ||
      incoming.utm_medium ||
      incoming.utm_campaign ||
      incoming.utm_content ||
      incoming.utm_term
  );

  const ga_client_id = existing.ga_client_id || (await getGa4ClientId());

  if (
    hasNewSignal ||
    !existing.first_touch_at ||
    (ga_client_id && !existing.ga_client_id)
  ) {
    const merged: AttrData = {
      ...(hasNewSignal ? incoming : existing),
      landing_page:
        existing.landing_page ||
        window.location.pathname + window.location.search,
      referrer: existing.referrer || document.referrer || undefined,
      ga_client_id: ga_client_id || existing.ga_client_id,
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
const PHONE_CLICK_ENDPOINT = "https://riory.invenix.nl/api/phone_click";

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

export async function trackPhoneClick(opts: { phone: string; label?: string }) {
  const attribution = getAttribution();
  const ga_client_id = await getGa4ClientId();

  // Fire-and-forget naar onze webhook
  try {
    fetch(PHONE_CLICK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        clicked_phone: opts.phone,
        cta_label: opts.label ?? "phone_click",
        page_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        attribution: { ...attribution, ga_client_id },
      }),
    }).catch(() => {
      /* zwijgend */
    });
  } catch {
    /* zwijgend */
  }

  if (typeof window !== "undefined") {
    window.gtag?.("event", "phone_click", {
      cta_label: opts.label ?? "phone_click",
      phone: opts.phone,
      attribution,
    });
  }
}

export async function trackCtaClick(opts: { label: string; phone?: string }) {
  const attribution = getAttribution();
  const ga_client_id = await getGa4ClientId();

  try {
    fetch(PHONE_CLICK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        clicked_phone: opts.phone,
        cta_label: opts.label,
        page_url:
          typeof window !== "undefined" ? window.location.href : undefined,
        attribution: { ...attribution, ga_client_id },
      }),
    }).catch(() => {
      /* zwijgend */
    });
  } catch {
    /* zwijgend */
  }

  if (typeof window !== "undefined") {
    window.gtag?.("event", "cta_click", {
      cta_label: opts.label,
      attribution,
    });
  }
}
