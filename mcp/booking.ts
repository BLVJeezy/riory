// Afspraak boeken vanuit een AI-chat (ChatGPT, Claude, ...).
//
// Volgt exact dezelfde pijplijn als het webformulier (src/components/AppointmentForm.tsx):
//   1. lead naar de eigen lead-pijplijn (invenix)  — eerst, zodat niets verloren gaat
//   2. rij in Supabase `appointments`
//   3. notificatiemail naar afspraak@riory.be (+ bevestiging naar de klant)
//   4. doorsturen naar Simpla CRM
// De aanvraag is geslaagd zodra ze via minstens één kanaal binnen is.

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import {
  DIENSTEN,
  KLANT_TYPES,
  LEAD_ENDPOINT,
  OFFICE_EMAIL,
  REGENPUT_OPTIES,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";

const opt = (max = 200) => z.string().trim().max(max).optional();

export const bookingInputShape = {
  dienst: z.enum(DIENSTEN).describe("Gevraagde dienst (exacte waarde uit de lijst)."),
  urgent: z
    .boolean()
    .describe("true = interventie binnen 24 uur nodig (extra kosten mogelijk)."),
  klant_type: z
    .enum(KLANT_TYPES)
    .describe("particulier, bedrijf of vrij_beroep. Syndici boeken via riory.be/afspraak."),
  voornaam: z.string().trim().min(1).max(100),
  naam: z.string().trim().min(1).max(100).describe("Familienaam."),
  email: z.string().trim().email().max(200),
  telefoon: z.string().trim().min(8).max(20).describe("Telefoonnummer van de klant."),
  straat: z.string().trim().min(1).max(200),
  huisnummer: z.string().trim().min(1).max(20),
  postcode: z.string().trim().min(4).max(10),
  plaats: z.string().trim().min(1).max(100),
  beschrijving: z
    .string()
    .trim()
    .min(1)
    .max(4000)
    .describe("Omschrijving van het probleem in de woorden van de klant."),
  akkoord_voorwaarden: z
    .boolean()
    .describe(
      "Moet true zijn: de klant heeft de algemene voorwaarden (riory.be/algemene-voorwaarden) uitdrukkelijk aanvaard.",
    ),

  woning_ouder_dan_10_jaar: z
    .boolean()
    .optional()
    .describe("Enkel particulier: woning ouder dan 10 jaar (6% btw)."),
  bedrijfsnaam: opt().describe("Verplicht voor bedrijf en vrij beroep."),
  btw_nummer: opt(30).describe("Verplicht voor bedrijf."),
  kbo_nummer: opt(30).describe("Verplicht voor bedrijf en vrij beroep."),
  facturatie_email: opt().describe("Verplicht voor bedrijf en vrij beroep."),

  werfadres_anders: z
    .boolean()
    .optional()
    .describe("true als het werkadres verschilt van het facturatieadres."),
  werf_straat: opt(),
  werf_huisnummer: opt(20),
  werf_postcode: opt(10),
  werf_plaats: opt(100),
  werf_contactpersoon: opt(),
  werf_telefoon: opt(20),
  werf_projectnaam: opt(),

  regenput_grootte: z.enum(REGENPUT_OPTIES).optional().describe("Enkel bij regenput."),
  regenput_andere_maat: opt(50),
  dakgoot_meters_1_verdiep: z.number().min(0).max(1000).optional(),
  dakgoot_meters_2_verdiepen: z.number().min(0).max(1000).optional(),
  dakgoot_meters_3_verdiepen: z.number().min(0).max(1000).optional(),
  wil_offerte: z
    .boolean()
    .optional()
    .describe("Regenput/dakgoot: true = eerst offerte, false = meteen afspraak."),
};

const bookingSchema = z.object(bookingInputShape);
export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingSource = {
  /** Waarde voor appointments.gevonden_via (chatgpt / claude / ai_chat). */
  gevondenVia: string;
  /** Leesbare naam van de chat-app, bv. "ChatGPT". */
  hostLabel: string;
};

export function sourceFromClient(clientName?: string): BookingSource {
  const n = (clientName || "").toLowerCase();
  if (n.includes("openai") || n.includes("chatgpt")) {
    return { gevondenVia: "chatgpt", hostLabel: "ChatGPT" };
  }
  if (n.includes("claude") || n.includes("anthropic")) {
    return { gevondenVia: "claude", hostLabel: "Claude" };
  }
  if (n.includes("copilot") || n.includes("microsoft")) {
    return { gevondenVia: "ai_chat", hostLabel: "Copilot" };
  }
  if (n.includes("gemini") || n.includes("google")) {
    return { gevondenVia: "ai_chat", hostLabel: "Gemini" };
  }
  return { gevondenVia: "ai_chat", hostLabel: "AI-chat" };
}

const digits = (v?: string) => (v || "").replace(/\D/g, "");
const isPhone = (v?: string) => {
  const d = digits(v);
  return d.length >= 8 && d.length <= 15;
};
const isEmail = (v?: string) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const blank = (v?: string) => !v || v.trim().length === 0;

/** Gereserveerde testdomeinen (RFC 2606): boekingen met zo'n adres worden nooit echt verstuurd. */
export const isTestEmail = (email?: string) => /@example\.(com|org|net)$/i.test((email || "").trim());

/** Zelfde verplichte velden als het webformulier, per klanttype. */
export function validateBooking(b: BookingInput): string[] {
  const missing: string[] = [];
  const req = (cond: boolean, label: string) => cond && missing.push(label);

  req(b.akkoord_voorwaarden !== true, "akkoord_voorwaarden (algemene voorwaarden aanvaarden)");
  req(!isPhone(b.telefoon), "telefoon (geldig nummer, 8–15 cijfers)");

  if (b.klant_type === "particulier") {
    req(b.woning_ouder_dan_10_jaar === undefined, "woning_ouder_dan_10_jaar");
  }
  if (b.klant_type === "bedrijf" || b.klant_type === "vrij_beroep") {
    req(blank(b.bedrijfsnaam), "bedrijfsnaam");
    req(blank(b.kbo_nummer), "kbo_nummer");
    req(!isEmail(b.facturatie_email), "facturatie_email");
  }
  if (b.klant_type === "bedrijf") req(blank(b.btw_nummer), "btw_nummer");

  if (b.werfadres_anders) {
    req(blank(b.werf_straat), "werf_straat");
    req(blank(b.werf_huisnummer), "werf_huisnummer");
    req(blank(b.werf_postcode), "werf_postcode");
    req(blank(b.werf_plaats), "werf_plaats");
    req(blank(b.werf_contactpersoon), "werf_contactpersoon");
    req(!isPhone(b.werf_telefoon), "werf_telefoon");
  }

  if (b.dienst === "Reinigen van regenput") {
    req(!b.regenput_grootte, "regenput_grootte");
    req(b.wil_offerte === undefined, "wil_offerte");
  }
  if (b.dienst === "Dakgootreiniging") {
    const tot =
      (b.dakgoot_meters_1_verdiep || 0) +
      (b.dakgoot_meters_2_verdiepen || 0) +
      (b.dakgoot_meters_3_verdiepen || 0);
    req(tot <= 0, "dakgoot_meters (minstens één verdieping)");
    req(b.wil_offerte === undefined, "wil_offerte");
  }
  return missing;
}

export type BookingResult = {
  ok: boolean;
  appointmentId: string;
  channels: { database: boolean; leadPipeline: boolean; officeEmail: boolean };
  dryRun: boolean;
};

const withTimeout = <T>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race([p, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);

export async function submitBooking(
  b: BookingInput,
  source: BookingSource,
  opts: { dryRun?: boolean } = {},
): Promise<BookingResult> {
  const appointmentId = crypto.randomUUID();
  const dryRun = !!opts.dryRun;
  if (dryRun) {
    return {
      ok: true,
      appointmentId,
      channels: { database: true, leadPipeline: true, officeEmail: true },
      dryRun,
    };
  }

  const regenput =
    b.dienst === "Reinigen van regenput" && b.regenput_grootte
      ? b.regenput_grootte === "Andere maat" && b.regenput_andere_maat
        ? b.regenput_andere_maat
        : b.regenput_grootte
      : undefined;
  const dakgoot =
    b.dienst === "Dakgootreiniging"
      ? {
          v1: String(b.dakgoot_meters_1_verdiep ?? 0),
          v2: String(b.dakgoot_meters_2_verdiepen ?? 0),
          v3: String(b.dakgoot_meters_3_verdiepen ?? 0),
        }
      : undefined;
  const extraInfo = regenput
    ? `Grootte regenput: ${regenput}\n\n`
    : dakgoot
      ? `Dakgoot meters — 1 verdiep: ${dakgoot.v1}m, 2 verdiepen: ${dakgoot.v2}m, 3 verdiepen: ${dakgoot.v3}m\n\n`
      : "";
  const fullBeschrijving = extraInfo + b.beschrijving;
  const wiltOfferte =
    b.dienst === "Dakgootreiniging" || b.dienst === "Reinigen van regenput"
      ? b.wil_offerte === true
        ? "offerte"
        : b.wil_offerte === false
          ? "afspraak"
          : undefined
      : undefined;

  const isZakelijk = b.klant_type === "bedrijf" || b.klant_type === "vrij_beroep";
  const werf = b.werfadres_anders
    ? {
        straat: b.werf_straat,
        huisnummer: b.werf_huisnummer,
        postcode: b.werf_postcode,
        plaats: b.werf_plaats,
        telefoon: b.werf_telefoon,
        contactpersoon: b.werf_contactpersoon,
        projectnaam: b.werf_projectnaam,
      }
    : {
        straat: b.straat,
        huisnummer: b.huisnummer,
        postcode: b.postcode,
        plaats: b.plaats,
        telefoon: b.telefoon,
        contactpersoon: isZakelijk ? b.bedrijfsnaam : `${b.voornaam} ${b.naam}`.trim(),
        projectnaam: undefined as string | undefined,
      };

  const leadBron = "ai_chat";
  const gevondenDetail = `Geboekt in ${source.hostLabel}`;

  const common = {
    dienst: b.dienst,
    urgent: b.urgent,
    klantType: b.klant_type,
    woningOuder: b.woning_ouder_dan_10_jaar ?? false,
    naam: b.naam,
    voornaam: b.voornaam,
    bedrijfsnaam: b.bedrijfsnaam || undefined,
    btwNummer: b.btw_nummer || undefined,
    kboNummer: b.kbo_nummer || undefined,
    email: b.email,
    facturatieEmail: b.facturatie_email || undefined,
    telefoon: b.telefoon,
    straat: b.straat,
    huisnummer: b.huisnummer,
    postcode: b.postcode,
    plaats: b.plaats,
    werfStraat: werf.straat,
    werfHuisnummer: werf.huisnummer,
    werfPostcode: werf.postcode,
    werfPlaats: werf.plaats,
    werfTelefoon: werf.telefoon,
    werfContactpersoon: werf.contactpersoon,
    werfProjectnaam: werf.projectnaam,
    leadBron,
    beschrijving: b.beschrijving,
    gevondenVia: source.gevondenVia,
    gevondenDetail,
  };

  // 1. Lead-pijplijn eerst (zoals het webformulier).
  const leadPromise = fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "appointment",
      appointmentId,
      ...common,
      submitted_at: new Date().toISOString(),
      page_url: `mcp://${source.gevondenVia}`,
      attribution: { utm_source: source.gevondenVia, utm_medium: "ai_chat_app" },
    }),
  })
    .then((r) => r.ok)
    .catch(() => false);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 2. Database.
  let dbOk = false;
  for (let attempt = 0; attempt < 3 && !dbOk; attempt++) {
    const { error } = await supabase.from("appointments").insert({
      id: appointmentId,
      dienst: b.dienst,
      urgent: b.urgent,
      klant_type: b.klant_type,
      woning_ouder_dan_10_jaar:
        b.klant_type === "particulier" ? (b.woning_ouder_dan_10_jaar ?? null) : null,
      werfadres_is_facturatieadres: !b.werfadres_anders,
      fact_naam: b.naam,
      fact_voornaam: b.voornaam,
      fact_bedrijfsnaam: b.bedrijfsnaam || null,
      fact_btw_nummer: b.btw_nummer || null,
      fact_kbo_nummer: b.kbo_nummer || null,
      fact_straat: b.straat,
      fact_huisnummer: b.huisnummer,
      fact_postcode: b.postcode,
      fact_plaats: b.plaats,
      fact_email: b.email,
      fact_facturatie_email: b.facturatie_email || null,
      fact_telefoon: b.telefoon,
      werf_projectnaam: b.werfadres_anders ? b.werf_projectnaam || null : null,
      werf_contactpersoon: b.werfadres_anders ? b.werf_contactpersoon || null : null,
      werf_straat: b.werfadres_anders ? b.werf_straat || null : null,
      werf_huisnummer: b.werfadres_anders ? b.werf_huisnummer || null : null,
      werf_postcode: b.werfadres_anders ? b.werf_postcode || null : null,
      werf_plaats: b.werfadres_anders ? b.werf_plaats || null : null,
      werf_telefoon: b.werfadres_anders ? b.werf_telefoon || null : null,
      beschrijving: fullBeschrijving,
      gevonden_via: source.gevondenVia,
      gevonden_detail: gevondenDetail,
      lead_bron: leadBron,
    });
    if (!error) dbOk = true;
    else {
      console.error(`[mcp] appointments insert attempt ${attempt + 1} failed:`, error.message);
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  const emailData = {
    ...common,
    regenputGrootte: regenput,
    dakgootMeters: dakgoot,
    wiltOfferte,
  };

  // 3. Notificatie naar kantoor — altijd, ook als de DB faalde.
  const notifyPromise = supabase.functions
    .invoke("send-transactional-email", {
      body: {
        templateName: "appointment-notification",
        recipientEmail: OFFICE_EMAIL,
        replyToEmail: b.email,
        idempotencyKey: `appointment-${appointmentId}`,
        templateData: emailData,
      },
    })
    .then(({ error }) => {
      if (error) console.error("[mcp] office notification failed:", error);
      return !error;
    })
    .catch(() => false);

  const confirmPromise = supabase.functions
    .invoke("send-transactional-email", {
      body: {
        templateName: "afspraak-confirmation",
        recipientEmail: b.email,
        idempotencyKey: `afspraak-confirm-${appointmentId}`,
        templateData: emailData,
      },
    })
    .catch((err) => console.error("[mcp] customer confirmation failed:", err));

  // 4. Simpla CRM (faalt → wachtrij in de edge function).
  const simplaPromise = supabase.functions
    .invoke("send-to-simpla", {
      body: {
        appointmentId,
        payload: {
          land: "België",
          ...common,
          ondernemingsnummer: b.kbo_nummer || undefined,
        },
      },
    })
    .catch((err) => console.error("[mcp] simpla failed:", err));

  const [leadOk, officeOk] = await Promise.all([
    withTimeout(leadPromise, 8000, false),
    withTimeout(notifyPromise, 10000, false),
    withTimeout(confirmPromise, 10000, undefined),
    withTimeout(simplaPromise, 10000, undefined),
  ]);

  return {
    ok: dbOk || leadOk || officeOk,
    appointmentId,
    channels: { database: dbOk, leadPipeline: leadOk, officeEmail: officeOk },
    dryRun,
  };
}
