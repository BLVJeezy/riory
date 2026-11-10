// Customer journey: telt per vertakking van het werkingsproces hoeveel klanten erdoor gingen.
// Website-data komt uit de eigen database; alles vanaf de werkbonnen-app via /api/journey
// (enkel gehashte e-mail/telefoon, geen namen of adressen). Een website-aanvraag en een
// taak in de app worden aan elkaar gekoppeld op dezelfde gehashte e-mail of telefoon.

import { supabase } from "@/integrations/supabase/client";

export type Tellers = Record<string, number>;

export type AppRij = {
  id: string;
  at: string;
  h: { e: string[]; p: string[] };
  bron: "mail" | "manueel" | "contract";
  status: string | null;
  dringend: boolean;
  eerste_klant: boolean;
  garantie: boolean;
  syndicus: boolean;
  ingepland: boolean;
  afgesloten: "afgetekend" | "afgerekend" | null;
  niet_factureren: boolean;
  offerte: null | { status: string | null; verzonden: boolean; getekend: boolean; herinnering: number; verzekering: boolean };
  factuur: null | { verzonden: boolean; via: "peppol" | "post" | "mail" | null; betaald: boolean; vervallen: boolean; herinnering: number; creditnota: boolean };
};

export type Traject = {
  dienst: string;
  klantType: string;
  kanaal: string;
  dringend: boolean;
  aanvraag: true;
  taak: boolean;
  offerte: boolean;
  uitgevoerd: boolean;
  gefactureerd: boolean;
  volledig: boolean;
};

export type JourneyResultaat = {
  tellers: Tellers;
  trajecten: Traject[];
  app: "ok" | "niet_ingesteld" | "fout";
  appFout?: string;
  appAantal: number;
  gekoppeld: number;
  afgekapt: boolean;
};

// ── normalisatie: identiek aan src/lib/journey-feed.ts in de werkbonnen-app ──
const normEmail = (v?: string | null) => {
  const e = (v ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
};
const normPhone = (v?: string | null) => {
  const d = (v ?? "").replace(/\D/g, "");
  return d.length >= 8 ? d.slice(-9) : null;
};
async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const KANAAL = (v?: string | null, bron?: string | null) => {
  const s = `${v ?? ""} ${bron ?? ""}`.toLowerCase();
  if (/chatgpt|claude|ai_chat|copilot|gemini|perplexity/.test(s)) return "ai";
  if (/google/.test(s)) return "google";
  return "andere";
};

const KANAAL_LABEL: Record<string, string> = { google: "Google", ai: "AI-chat", andere: "Andere" };
const KLANT_LABEL: Record<string, string> = { particulier: "Particulier", bedrijf: "Bedrijf", vrij_beroep: "Vrij beroep", syndicus: "Syndicus" };
export const labelKanaal = (k: string) => KANAAL_LABEL[k] ?? k;
export const labelKlant = (k: string) => KLANT_LABEL[k] ?? (k || "Onbekend");

const landing = (page: string) => {
  const p = page.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  if (p.startsWith("/diensten")) return "dienst";
  if (p.startsWith("/regio")) return "regio";
  if (p.startsWith("/artikels") || p.startsWith("/veelvoorkomende")) return "artikel";
  if (p.startsWith("/referenties")) return "referentie";
  if (p.startsWith("/prijscalculator")) return "calculator";
  if (p.startsWith("/afspraak")) return "afspraak";
  return "home";
};

/** Haalt alle rijen sinds `from` op in pagina's van 1000. */
async function alle<T>(tabel: string, kolommen: string, from: string, max = 20000): Promise<T[]> {
  const out: T[] = [];
  for (let lo = 0; lo < max; lo += 1000) {
    const { data, error } = await (supabase as any)
      .from(tabel)
      .select(kolommen)
      .gte("created_at", from)
      .order("created_at", { ascending: true })
      .range(lo, lo + 999);
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function appRijen(from: string): Promise<{ status: JourneyResultaat["app"]; rows: AppRij[]; fout?: string; afgekapt: boolean }> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { status: "fout", rows: [], fout: "Niet ingelogd.", afgekapt: false };
  try {
    const r = await fetch(`/api/journey?from=${encodeURIComponent(from)}`, { headers: { Authorization: `Bearer ${token}` } });
    const body = await r.json().catch(() => ({}));
    if (body?.code === "not_configured") return { status: "niet_ingesteld", rows: [], afgekapt: false };
    if (!r.ok) return { status: "fout", rows: [], fout: body?.error || `Fout ${r.status}`, afgekapt: false };
    return { status: "ok", rows: (body.rows ?? []) as AppRij[], afgekapt: !!body.truncated };
  } catch {
    return { status: "fout", rows: [], fout: "Werkbonnen-app niet bereikbaar.", afgekapt: false };
  }
}

export async function laadJourney(from: Date): Promise<JourneyResultaat> {
  const fromIso = from.toISOString();
  const t: Tellers = {};
  const plus = (k: string, n = 1) => (t[k] = (t[k] ?? 0) + n);

  const [views, clicks, calc, afspraken, offertes, app] = await Promise.all([
    alle<{ visitor_id: string | null; page: string; created_at: string }>("page_views", "visitor_id,page,created_at", fromIso, 50000),
    alle<{ visitor_id: string | null }>("phone_clicks", "visitor_id", fromIso),
    alle<{ session_id: string; step: number | null; service: string | null; price_eur: number | null }>("calculator_sessions", "session_id,step,service,price_eur", fromIso),
    alle<any>(
      "appointments",
      "id,created_at,dienst,klant_type,urgent,gevonden_via,lead_bron,woning_ouder_dan_10_jaar,calculator_session_id,fact_email,fact_facturatie_email,fact_telefoon,syndicus_email,syndicus_facturatie_email,syndicus_telefoon,werf_telefoon",
      fromIso,
    ),
    alle<{ email: string | null; telefoon: string | null; created_at: string }>("quote_requests", "email,telefoon,created_at", fromIso),
    appRijen(fromIso),
  ]);

  // ── Fase 1: bezoek ──
  const eersteBezoek = new Map<string, string>();
  for (const v of views) if (v.visitor_id && !eersteBezoek.has(v.visitor_id)) eersteBezoek.set(v.visitor_id, v.page);
  plus("bezoekers", eersteBezoek.size);
  for (const page of eersteBezoek.values()) plus(`landing:${landing(page)}`);
  plus("site:bellen", clicks.length);

  // Calculator: hoogste stap per sessie
  const sessies = new Map<string, { step: number; prijs: boolean }>();
  for (const c of calc) {
    const s = sessies.get(c.session_id) ?? { step: -1, prijs: false };
    s.step = Math.max(s.step, c.step ?? 0);
    s.prijs ||= c.price_eur != null;
    sessies.set(c.session_id, s);
  }
  const doorNaarFormulier = new Set(afspraken.map((a) => a.calculator_session_id).filter(Boolean));
  plus("site:calculator", sessies.size);
  for (const [id, s] of sessies) {
    if (s.step >= 1) plus("calc:akkoord");
    if (s.step >= 2) plus("calc:adres");
    if (s.step >= 3 || s.prijs) plus("calc:prijs");
    if (doorNaarFormulier.has(id)) plus("calc:door");
  }

  // ── Fase 2–3: aanvragen ──
  plus("site:formulier", afspraken.length + offertes.length);
  plus("form:offerte", offertes.length);
  for (const a of afspraken) {
    const kanaal = KANAAL(a.gevonden_via, a.lead_bron);
    plus(`kanaal:${kanaal}`);
    plus(kanaal === "ai" && /ai_chat/.test(String(a.lead_bron ?? "")) ? "form:ai" : "form:afspraak");
    plus("form:dienst");
    if (a.dienst === "Dakgootreiniging") plus("urgent:dakgoot");
    else if (a.dienst === "Reinigen van regenput") plus("urgent:regenput");
    else plus(a.urgent ? "urgent:ja" : "urgent:nee"), plus("urgent:overig");
    const kt = a.klant_type || "onbekend";
    plus(`klant:${kt}`);
    if (kt === "particulier") plus(a.woning_ouder_dan_10_jaar ? "woning:oud" : "woning:nieuw");
  }
  plus("verwerking:aanvragen", afspraken.length + offertes.length);
  plus("verwerking:afspraken", afspraken.length);

  // ── Fase 4–9: werkbonnen-app ──
  const rows = app.rows;
  plus("app:taken", rows.length);
  for (const r of rows) {
    plus(`app:bron:${r.bron}`);
    plus(r.syndicus ? "app:syndicus" : "app:gewoon");
    if (r.status === "nieuw" && !r.ingepland && !r.offerte) plus("app:nog");
    const pad = r.bron === "contract" ? "contract" : r.offerte && !r.offerte.verzekering ? "offerte" : "direct";
    plus(`pad:${pad}`);
    if (r.offerte && !r.offerte.verzekering) {
      if (r.offerte.verzonden) plus("offerte:verzonden");
      if (r.offerte.getekend) plus("offerte:getekend");
      else if (r.offerte.verzonden) plus("offerte:open");
      if (r.offerte.herinnering >= 1) plus("offerte:herinnering1");
      if (r.offerte.herinnering >= 2) plus("offerte:herinnering2");
    }
    if (r.ingepland) plus("plannen:ingepland");
    if (r.dringend) plus("label:dringend");
    if (r.eerste_klant) plus("label:eerste");
    if (r.garantie) plus("label:garantie");
    if (r.afgesloten) {
      plus("uitvoer:afgesloten");
      plus(`uitvoer:${r.afgesloten}`);
    }
    if (r.factuur) plus("na:factureren");
    else if (r.niet_factureren) plus("na:niet");
    if (r.offerte?.verzekering) plus("na:verzekering");
    const f = r.factuur;
    if (f) {
      plus("factuur:gemaakt");
      if (f.verzonden) plus("factuur:verzonden");
      if (f.via) plus(`factuur:via:${f.via}`);
      if (f.betaald) plus("factuur:betaald");
      if (f.vervallen) plus("factuur:vervallen");
      if (f.herinnering >= 1) plus("factuur:herinnering1");
      if (f.herinnering >= 2) plus("factuur:herinnering2");
      if (f.herinnering >= 3) plus("factuur:herinnering3");
      if (f.creditnota) plus("factuur:creditnota");
    }
    if (f?.betaald || (r.afgesloten === "afgerekend" && !f)) plus("volledig");
  }

  // ── Koppelen: website-aanvraag ↔ taak in de app ──
  const index = new Map<string, AppRij[]>();
  for (const r of rows) for (const h of [...r.h.e, ...r.h.p]) (index.get(h) ?? index.set(h, []).get(h)!).push(r);
  const gebruikt = new Set<string>();
  const trajecten: Traject[] = [];
  for (const a of afspraken) {
    const hashes = [
      ...(await Promise.all(
        [a.fact_email, a.fact_facturatie_email, a.syndicus_email, a.syndicus_facturatie_email].map(normEmail).filter(Boolean).map((e) => sha256(`email:${e}`)),
      )),
      ...(await Promise.all([a.fact_telefoon, a.syndicus_telefoon, a.werf_telefoon].map(normPhone).filter(Boolean).map((p) => sha256(`tel:${p}`)))),
    ];
    const t0 = Date.parse(a.created_at);
    let best: AppRij | null = null;
    for (const h of hashes)
      for (const r of index.get(h) ?? []) {
        if (gebruikt.has(r.id)) continue;
        const dt = Date.parse(r.at) - t0;
        if (dt < -2 * 864e5 || dt > 60 * 864e5) continue;
        if (!best || Math.abs(dt) < Math.abs(Date.parse(best.at) - t0)) best = r;
      }
    if (best) gebruikt.add(best.id);
    const f = best?.factuur;
    trajecten.push({
      dienst: a.dienst || "Onbekend",
      klantType: a.klant_type || "onbekend",
      kanaal: KANAAL(a.gevonden_via, a.lead_bron),
      dringend: !!a.urgent,
      aanvraag: true,
      taak: !!best,
      offerte: !!best?.offerte && !best.offerte.verzekering,
      uitgevoerd: !!best?.afgesloten,
      gefactureerd: !!f,
      volledig: !!(f?.betaald || (best?.afgesloten === "afgerekend" && !f)),
    });
  }
  plus("koppel:taak", trajecten.filter((x) => x.taak).length);

  return {
    tellers: t,
    trajecten,
    app: app.status,
    appFout: app.fout,
    appAantal: rows.length,
    gekoppeld: gebruikt.size,
    afgekapt: app.afgekapt,
  };
}

export type Rij = { label: string; aanvraag: number; taak: number; offerte: number; uitgevoerd: number; gefactureerd: number; volledig: number };

export function groepeer(trajecten: Traject[], op: "dienst" | "klantType" | "kanaal" | "dringend"): Rij[] {
  const m = new Map<string, Rij>();
  for (const t of trajecten) {
    const key =
      op === "dienst" ? t.dienst : op === "klantType" ? labelKlant(t.klantType) : op === "kanaal" ? labelKanaal(t.kanaal) : t.dringend ? "Dringend" : "Niet dringend";
    const r = m.get(key) ?? { label: key, aanvraag: 0, taak: 0, offerte: 0, uitgevoerd: 0, gefactureerd: 0, volledig: 0 };
    r.aanvraag++;
    if (t.taak) r.taak++;
    if (t.offerte) r.offerte++;
    if (t.uitgevoerd) r.uitgevoerd++;
    if (t.gefactureerd) r.gefactureerd++;
    if (t.volledig) r.volledig++;
    m.set(key, r);
  }
  return [...m.values()].sort((a, b) => b.aanvraag - a.aanvraag);
}
