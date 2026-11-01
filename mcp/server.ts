// Riory MCP-server: laat klanten een afspraak boeken rechtstreeks in
// ChatGPT, Claude, Copilot, ... via het MCP Apps-formulier (of conversationeel
// in chat-apps zonder UI-ondersteuning).

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from "@modelcontextprotocol/ext-apps/server";
import {
  DIENSTEN,
  DIENST_OMSCHRIJVING,
  KLANT_TYPES,
  REGENPUT_OPTIES,
  RIORY,
  WERKGEBIED,
} from "./config";
import {
  bookingInputShape,
  isTestEmail,
  sourceFromClient,
  submitBooking,
  validateBooking,
  type BookingInput,
} from "./booking";

declare const __BOOKING_WIDGET_HTML__: string;

export const WIDGET_URI = "ui://riory/booking-form-v1.html";

export type ServerContext = {
  /** User-Agent van de inkomende request, om de chat-app te herkennen. */
  userAgent?: string;
  dryRun?: boolean;
};

const prefillShape = {
  dienst: z.enum(DIENSTEN).optional().describe("Dienst die past bij het probleem van de klant."),
  urgent: z.boolean().optional().describe("true als de klant binnen 24 uur geholpen moet worden."),
  klant_type: z.enum(KLANT_TYPES).optional(),
  voornaam: z.string().max(100).optional(),
  naam: z.string().max(100).optional(),
  email: z.string().max(200).optional(),
  telefoon: z.string().max(20).optional(),
  straat: z.string().max(200).optional(),
  huisnummer: z.string().max(20).optional(),
  postcode: z.string().max(10).optional(),
  plaats: z.string().max(100).optional(),
  beschrijving: z
    .string()
    .max(4000)
    .optional()
    .describe("Korte samenvatting van het probleem zoals de klant het beschreef."),
};

function formConfig() {
  return {
    diensten: DIENSTEN.map((d) => ({ value: d, omschrijving: DIENST_OMSCHRIJVING[d] })),
    regenputOpties: REGENPUT_OPTIES,
    links: {
      voorwaarden: RIORY.termsUrl,
      privacy: RIORY.privacyUrl,
      website: RIORY.website,
      afspraakPagina: RIORY.bookingPage,
    },
    telefoon: RIORY.phone,
  };
}

export function createRioryMcpServer(ctx: ServerContext = {}): McpServer {
  const server = new McpServer(
    { name: "riory", title: "Riory — ontstopping & riolering", version: "1.0.0" },
    {
      instructions:
        "Riory BV is een ontstoppings- en rioleringsbedrijf uit Bilzen (Limburg, België), 24/7 bereikbaar. " +
        "Wil de gebruiker een afspraak, een interventie of hulp bij een verstopping of rioleringsprobleem: roep METEEN, " +
        "als eerste stap, riory_open_booking_form aan en vul in wat je al weet uit het gesprek. " +
        "Stel vooraf geen vragen in de chat en maak geen eigen formulier of vragenlijst: het Riory-formulier bevat " +
        "alle vragen die Riory nodig heeft. Vraag geen datum of tijdstip; Riory neemt na de aanvraag zelf contact op " +
        "om het tijdstip te bevestigen. Gebruik riory_info voor vragen over diensten, werkgebied en contact. " +
        "Enkel als de chat-app geen formulieren kan tonen: verzamel de gegevens in het gesprek, vat ze samen, " +
        "laat de gebruiker de algemene voorwaarden expliciet aanvaarden en roep pas dan riory_submit_booking aan. " +
        `Bij een noodgeval kan de klant altijd bellen naar ${RIORY.phone}.`,
    },
  );

  const clientName = () =>
    server.server.getClientVersion()?.name || ctx.userAgent || undefined;

  // ── 1. Info ────────────────────────────────────────────────────────────
  server.registerTool(
    "riory_info",
    {
      title: "Riory: diensten, werkgebied en contact",
      description:
        "Geeft de diensten van Riory BV (ontstopping van wc, gootsteen, douche en riool, camera-inspectie, " +
        "septische put ledigen, leegpompen, regenput- en dakgootreiniging, ...), het werkgebied in Limburg en " +
        "de regio Luik, en contactgegevens. Gebruik dit voor vragen over diensten, werkgebied of contact. " +
        "Wil iemand een afspraak of hulp bij een verstopping, gebruik dan meteen riory_open_booking_form.",
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    },
    async () => {
      const info = {
        bedrijf: RIORY.name,
        adres: RIORY.address,
        telefoon: RIORY.phone,
        bereikbaarheid: RIORY.availability,
        website: RIORY.website,
        diensten: DIENSTEN.map((d) => ({ dienst: d, omschrijving: DIENST_OMSCHRIJVING[d] })),
        werkgebied: WERKGEBIED,
        afspraak:
          "Boek direct in deze chat met riory_open_booking_form, via " +
          `${RIORY.bookingPage}, of bel ${RIORY.phone}.`,
        urgent: "Interventie binnen 24 uur is mogelijk; daarvoor kunnen extra kosten aangerekend worden.",
      };
      return {
        content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
        structuredContent: info,
      };
    },
  );

  // ── 2. Boekingsformulier (MCP App) ─────────────────────────────────────
  registerAppTool(
    server,
    "riory_open_booking_form",
    {
      title: "Afspraak boeken bij Riory",
      description:
        "Toont het officiële afspraakformulier van Riory BV in de chat. Gebruik dit METEEN, als eerste stap, " +
        "zodra iemand een afspraak of interventie wil (bv. wc, gootsteen of riool verstopt, septische put ledigen), " +
        "zonder eerst vragen te stellen: het formulier bevat alle verplichte vragen van Riory. Vul de velden in " +
        "die je al kent uit het gesprek; de gebruiker controleert en verstuurt zelf. Er wordt niets geboekt tot " +
        "de gebruiker op Versturen klikt.",
      inputSchema: prefillShape,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true },
      // ui.resourceUri = MCP Apps-standaard; openai/outputTemplate = ChatGPT-alias (zelfde formulier).
      _meta: { ui: { resourceUri: WIDGET_URI }, "openai/outputTemplate": WIDGET_URI },
    },
    async (prefill) => {
      const data = { prefill, ...formConfig() };
      return {
        content: [
          {
            type: "text",
            text:
              "Het Riory-afspraakformulier staat in de chat. De gebruiker vult het aan en verstuurt het zelf. " +
              "Als het formulier niet zichtbaar is in deze app: vraag de ontbrekende gegevens in het gesprek " +
              `(dienst, urgent, klanttype, naam, e-mail, telefoon, adres, omschrijving), laat de algemene voorwaarden ` +
              `(${RIORY.termsUrl}) aanvaarden en roep riory_submit_booking aan.`,
          },
        ],
        structuredContent: data,
      };
    },
  );

  // ── 3. Afspraak versturen ──────────────────────────────────────────────
  server.registerTool(
    "riory_submit_booking",
    {
      title: "Afspraakaanvraag versturen naar Riory",
      description:
        "Verstuurt een afspraakaanvraag naar Riory BV. Riory neemt daarna contact op om het tijdstip te bevestigen. " +
        "Roep dit enkel aan nadat de gebruiker alle gegevens heeft bevestigd en de algemene voorwaarden " +
        "uitdrukkelijk heeft aanvaard. Het formulier in de chat roept dit zelf aan.",
      inputSchema: {
        ...bookingInputShape,
        bron_app: z
          .string()
          .max(60)
          .optional()
          .describe("Naam van de chat-app (ingevuld door het formulier)."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (args) => {
      const { bron_app, ...booking } = args as BookingInput & { bron_app?: string };
      const missing = validateBooking(booking);
      if (missing.length) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Afspraak niet verstuurd. Ontbrekend of ongeldig: ${missing.join(", ")}.`,
            },
          ],
          structuredContent: { ok: false, missing },
        };
      }

      const source = sourceFromClient(bron_app || clientName());
      // Testboekingen (bv. door reviewers van OpenAI/Anthropic) met een @example.com-adres gaan
      // nooit naar de echte pijplijn: geen DB-rij, geen mails, geen Simpla. Antwoord toont "TEST".
      const testBooking = isTestEmail(booking.email);
      const result = await submitBooking(booking, source, { dryRun: ctx.dryRun || testBooking });

      if (!result.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                "De aanvraag kon niet verstuurd worden door een technisch probleem. " +
                `Vraag de klant om te bellen naar ${RIORY.phone} of te boeken via ${RIORY.bookingPage}.`,
            },
          ],
          structuredContent: { ok: false, telefoon: RIORY.phone },
        };
      }

      const referentie = result.appointmentId.slice(0, 8).toUpperCase();
      return {
        content: [
          {
            type: "text",
            text:
              `Afspraakaanvraag ontvangen door Riory (referentie ${referentie}). ` +
              `Riory neemt contact op via ${booking.telefoon} of ${booking.email} om het tijdstip te bevestigen; ` +
              `de klant krijgt ook een bevestigingsmail. ${booking.urgent ? `Bij urgentie kan de klant ook bellen naar ${RIORY.phone}.` : ""}`.trim(),
          },
        ],
        structuredContent: {
          ok: true,
          referentie,
          dienst: booking.dienst,
          urgent: booking.urgent,
          telefoonRiory: RIORY.phone,
          testmodus: result.dryRun || undefined,
        },
      };
    },
  );

  // ── Widget-resource ────────────────────────────────────────────────────
  registerAppResource(
    server,
    "Riory afspraakformulier",
    WIDGET_URI,
    { description: "Interactief afspraakformulier van Riory BV" },
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: __BOOKING_WIDGET_HTML__,
          _meta: {
            ui: {
              prefersBorder: true,
              csp: {
                connectDomains: [],
                resourceDomains: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
              },
            },
          },
        },
      ],
    }),
  );

  return server;
}
