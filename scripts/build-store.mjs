// Bouwt het indienmateriaal voor de app-winkels uit één bron:
//   - mcp/store/openai-plugin/plugin.json + mcp.json + skills/get-started/SKILL.md  (ChatGPT, plugin-ZIP)
//   - mcp/store/chatgpt-app-submission.json                                        (ChatGPT, importbestand formulier)
//   - mcp/store/dist/riory-chatgpt-plugin.zip                                      (upload in OpenAI-dashboard)
// Controleert de lengtelimieten van OpenAI. Gebruik: node scripts/build-store.mjs

import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const store = resolve(root, "mcp/store");
const plugin = resolve(store, "openai-plugin");

// ── Gegevens (enige bron) ────────────────────────────────────────────────
const MCP_URL = "https://www.riory.be/api/mcp";
const DEVELOPER = "Riory BV"; // ⚠ moet overeenkomen met de geverifieerde OpenAI-organisatie

const listing = {
  displayName: "Riory",
  shortDescription: "Book drain & sewer services",
  longDescription: [
    "Riory BV is a 24/7 drain-unblocking and sewer company based in Bilzen, Belgium, serving Belgian Limburg and the Liège region. With the Riory app you request an intervention without leaving the chat.",
    "",
    "What you can do:",
    "• Ask about Riory's services, service area and contact details.",
    "• Open Riory's official booking form right in the conversation, already filled in with what you told the assistant (service, town, urgency, a short description).",
    "• Check and complete your details (contact, address, company details for businesses), accept Riory's terms and send the request yourself.",
    "• Get a reference number and a confirmation e-mail straight away. Riory then contacts you to confirm the time.",
    "",
    "Services: blocked toilet, sink, shower or sewer; septic tank emptying; CCTV sewer inspection; locating drains; sewer odours and drain flies; periodic drain cleaning; flooding and pumping; rainwater tank cleaning; gutter cleaning; drain repairs.",
    "",
    "Good to know:",
    "• Nothing is sent until you press \"Request appointment\".",
    "• Riory confirms the exact time after your request; the app does not show a calendar.",
    "• Help within 24 hours is possible; extra charges may apply. In an emergency, call +32 472 50 28 14 (24/7).",
    "• Requests cannot be changed or cancelled in the chat; contact Riory by phone or e-mail.",
    "• The form is available in Dutch, French and English.",
  ].join("\n"),
  category: "Lifestyle",
  submissionCategory: "LIFESTYLE",
  capabilities: ["Interactive", "Write"],
  websiteURL: "https://www.riory.be",
  supportURL: "https://www.riory.be/boeken-in-chat",
  privacyPolicyURL: "https://www.riory.be/privacy-policy",
  termsOfServiceURL: "https://www.riory.be/algemene-voorwaarden",
  defaultPrompt: [
    "Mijn wc is verstopt in Hasselt, kan Riory vandaag komen?",
    "Book Riory to empty my septic tank in Bilzen",
    "Mon évier est bouché à Tongres, je veux un rendez-vous",
  ],
  brandColor: "#FF6A00",
  brandColorDark: "#FF6A00",
};

const translations = {
  "nl-BE": {
    subtitle: "Ontstopping boeken in de chat",
    description:
      "Riory BV is een ontstoppings- en rioleringsbedrijf uit Bilzen, 24/7 bereikbaar in Belgisch Limburg en de regio Luik. Met de Riory-app vraagt u een interventie aan zonder de chat te verlaten: het officiële Riory-formulier verschijnt in het gesprek, al ingevuld met wat u vertelde. U controleert uw gegevens, aanvaardt de algemene voorwaarden en verstuurt zelf. U krijgt meteen een referentie en een bevestigingsmail; Riory neemt contact op om het tijdstip te bevestigen. Dringend? Bel +32 472 50 28 14.",
  },
  "fr-BE": {
    subtitle: "Débouchage, réservé en chat",
    description:
      "Riory BV est une entreprise de débouchage et d'égouttage basée à Bilzen, joignable 24h/24 dans le Limbourg belge et la région liégeoise. Avec l'app Riory, vous demandez une intervention sans quitter le chat : le formulaire officiel de Riory s'affiche dans la conversation, déjà prérempli. Vous vérifiez vos données, acceptez les conditions générales et envoyez vous-même la demande. Vous recevez aussitôt une référence et un e-mail de confirmation ; Riory vous contacte pour confirmer l'heure. Urgent ? Appelez le +32 472 50 28 14.",
  },
};

const tools = {
  riory_info: {
    annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
    justifications: {
      read_only_justification: "Only returns Riory's services, service area and contact details from static data.",
      open_world_justification: "Does not send, publish or change anything in external systems.",
      destructive_justification: "Does not delete, overwrite or perform any irreversible action.",
    },
  },
  riory_open_booking_form: {
    annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
    justifications: {
      read_only_justification: "Only returns the booking form and prefill values for display; nothing is stored or sent.",
      open_world_justification: "Does not contact external systems; the user must submit the form separately.",
      destructive_justification: "Does not delete, overwrite or perform any irreversible action.",
    },
  },
  riory_submit_booking: {
    annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: false },
    justifications: {
      read_only_justification: "Creates a new appointment request in Riory's booking system and sends notification and confirmation e-mails.",
      open_world_justification: "Sends the request to Riory's external systems (database, CRM) and e-mails Riory's office and the customer.",
      destructive_justification: "Only creates a new request; it cannot delete, overwrite or cancel existing data, and Riory confirms the time afterwards.",
    },
  },
};

const positive = [
  {
    description: "A booking request in Dutch opens the Riory form right away, prefilled from the conversation (prompt: 'My toilet is blocked in Hasselt, I want an appointment with Riory').",
    prompt: "Mijn wc is verstopt in Hasselt, ik wil een afspraak bij Riory.",
    tools_triggered: "riory_open_booking_form",
    expected_behavior: "The Riory booking form appears in the chat without the assistant asking questions first. Service 'Ontstopping' and town 'Hasselt' are prefilled. Nothing is booked until the user submits.",
  },
  {
    description: "End-to-end test booking. Use an @example.com e-mail address: such test bookings never reach Riory's real systems and the confirmation shows a TEST label.",
    prompt: "I need Riory to unblock my kitchen sink in Tongeren tomorrow.",
    tools_triggered: "riory_open_booking_form, riory_submit_booking",
    expected_behavior: "The form opens prefilled (unblocking, Tongeren). After filling in contact and address details with an @example.com e-mail, accepting the terms and pressing 'Request appointment', the form shows 'Request received' with a reference number and a TEST label.",
  },
  {
    description: "Questions about services and service area use the info tool (prompt: 'Which services does Riory offer and in which towns do they work?').",
    prompt: "Welke diensten biedt Riory aan en in welke gemeenten werken ze?",
    tools_triggered: "riory_info",
    expected_behavior: "Lists Riory's services (e.g. unblocking, septic tank emptying, CCTV inspection, gutter cleaning), the towns in the service area and the 24/7 phone number. No booking is created.",
  },
  {
    description: "A non-urgent septic tank request in English opens the form with the matching service selected.",
    prompt: "Book Riory to empty my septic tank in Bilzen next week.",
    tools_triggered: "riory_open_booking_form",
    expected_behavior: "The form opens with 'Septische put ledigen' (septic tank emptying) selected and Bilzen prefilled. Riory confirms the time after the request; no date picker is shown.",
  },
  {
    description: "A request in French opens the same form; it follows the ChatGPT interface language and can be switched to French with the FR button (prompt: 'My toilet is blocked in Tongeren, I would like an appointment').",
    prompt: "Mon WC est bouché à Tongres, je voudrais un rendez-vous avec Riory.",
    tools_triggered: "riory_open_booking_form",
    expected_behavior: "The Riory form appears with unblocking selected and the town prefilled; pressing FR shows all labels in French.",
  },
];

const negative = [
  {
    description: "Unrelated appointment outside Riory's services; the app should not be used (prompt: 'Book a dentist appointment for tomorrow').",
    prompt: "Boek een afspraak bij de tandarts voor morgen.",
    expected_behavior: "The Riory app is not invoked; Riory only handles drain and sewer services.",
  },
  {
    description: "Changing or cancelling an existing appointment is not supported in the chat (prompt: 'Cancel my Riory appointment of tomorrow').",
    prompt: "Annuleer mijn afspraak bij Riory van morgen.",
    expected_behavior: "No booking tool is called. The assistant explains that requests cannot be changed or cancelled in the chat and gives Riory's phone number and e-mail address.",
  },
  {
    description: "A request without accepting Riory's terms must not be sent (prompt: 'Book Riory for my blocked shower, but I do not accept the terms and conditions').",
    prompt: "Boek Riory voor mijn verstopte douche, maar ik ga niet akkoord met de algemene voorwaarden.",
    expected_behavior: "No request is sent. The form requires accepting the terms; if riory_submit_booking is called without acceptance it returns an error, and the assistant asks the user to accept the terms or to call Riory.",
  },
];

const releaseNotes =
  "First version: request a drain or sewer intervention with Riory BV directly in ChatGPT through an interactive booking form (Dutch, French, English).";

// ── Limieten controleren ─────────────────────────────────────────────────
const problems = [];
const max = (label, v, n) => v.length > n && problems.push(`${label}: ${v.length} > ${n} tekens`);
max("displayName", listing.displayName, 30);
max("shortDescription", listing.shortDescription, 30);
max("longDescription", listing.longDescription, 4000);
max("developerName", DEVELOPER, 80);
listing.defaultPrompt.forEach((p, i) => max(`defaultPrompt[${i}]`, p, 128));
for (const [loc, t] of Object.entries(translations)) {
  max(`${loc}.subtitle`, t.subtitle, 30);
  max(`${loc}.description`, t.description, 4000);
}
positive.forEach((c, i) => max(`positive[${i}].description`, c.description, 4000));
if (positive.length !== 5) problems.push("precies 5 positieve testcases nodig");
if (negative.length !== 3) problems.push("precies 3 negatieve testcases nodig");
if (problems.length) {
  console.error("✗ Limieten overschreden:\n- " + problems.join("\n- "));
  process.exit(1);
}

// ── 1. Plugin-pakket (ChatGPT, upload als ZIP) ───────────────────────────
const screenshots = [1, 2, 3, 4, 5].map((i) => `./assets/screenshot-${i}.png`);
const pluginJson = {
  name: "riory",
  version: "1.0.0",
  description: "Book a Riory drain or sewer intervention directly in the chat.",
  author: { name: DEVELOPER, email: "info@riory.be", url: listing.websiteURL },
  homepage: listing.supportURL,
  license: "Proprietary",
  keywords: ["riory", "drain cleaning", "sewer", "plumber", "septic tank", "ontstopping", "Belgium", "Limburg"],
  skills: "./skills/",
  extensions: {
    "com.openai": {
      interface: {
        displayName: listing.displayName,
        shortDescription: listing.shortDescription,
        longDescription: listing.longDescription,
        developerName: DEVELOPER,
        category: listing.category,
        capabilities: listing.capabilities,
        websiteURL: listing.websiteURL,
        supportURL: listing.supportURL,
        privacyPolicyURL: listing.privacyPolicyURL,
        termsOfServiceURL: listing.termsOfServiceURL,
        defaultPrompt: listing.defaultPrompt,
        brandColor: listing.brandColor,
        brandColorDark: listing.brandColorDark,
        composerIcon: "./assets/icon.png",
        composerIconDark: "./assets/icon-dark.png",
        logo: "./assets/logo.png",
        logoDark: "./assets/logo-dark.png",
        screenshots,
      },
      onboardingSkill: "./skills/get-started/SKILL.md",
      review: {
        test_cases: { positive, negative },
        commerce: false,
        commerce_description: "No payments or purchases. The app only sends appointment requests to Riory BV; prices are agreed afterwards.",
      },
      publication: {
        countries: ["BE"],
        release_notes: releaseNotes,
        translations,
      },
    },
  },
};
const mcpJson = {
  mcpServers: {
    riory: { type: "streamable-http", url: MCP_URL },
  },
};
const skillMd = `---
name: get-started
description: Use when someone wants to book or ask about a drain, toilet, sink, sewer or septic tank intervention with Riory BV in Belgian Limburg or the Liège region.
---

# Riory — book in the chat

1. When the user wants an appointment or help with a blockage, call \`riory_open_booking_form\` right away.
   Prefill what you already know (service, urgency, town, short description). Do not ask questions first
   and do not build your own form: the Riory form contains every question Riory needs.
2. The user checks the form, accepts Riory's terms and presses "Request appointment". The form calls
   \`riory_submit_booking\` itself and shows a reference number.
3. Do not ask for a date or time: Riory contacts the customer to confirm the time.
4. For questions about services, service area or contact details, use \`riory_info\`.
5. Emergencies: the customer can always call +32 472 50 28 14 (24/7). Changing or cancelling a request
   is not possible in the chat; refer to afspraak@riory.be or the phone number.
`;

mkdirSync(resolve(plugin, "skills/get-started"), { recursive: true });
writeFileSync(resolve(plugin, "plugin.json"), JSON.stringify(pluginJson, null, 2) + "\n");
writeFileSync(resolve(plugin, "mcp.json"), JSON.stringify(mcpJson, null, 2) + "\n");
writeFileSync(resolve(plugin, "skills/get-started/SKILL.md"), skillMd);

for (const p of [...screenshots, "./assets/icon.png", "./assets/icon-dark.png", "./assets/logo.png", "./assets/logo-dark.png"]) {
  if (!existsSync(resolve(plugin, p))) problems.push(`ontbrekend bestand: ${p}`);
}
if (problems.length) {
  console.error("✗ " + problems.join("\n✗ "));
  process.exit(1);
}

// ── 2. Importbestand voor het app-formulier (alternatief) ────────────────
const submission = {
  $schema: "https://developers.openai.com/apps-sdk/schemas/chatgpt-app-submission.v1.json",
  schema_version: 1,
  app_info: {
    display_name: listing.displayName,
    subtitle: listing.shortDescription,
    description: listing.longDescription,
    category: listing.submissionCategory,
  },
  tools,
  test_cases: positive.map((c) => ({
    description: c.description,
    user_prompt: c.prompt,
    file_attachment_urls: null,
    tools_triggered: c.tools_triggered,
    expected_output: c.expected_behavior,
    expected_output_url: null,
  })),
  negative_test_cases: negative.map((c) => ({
    description: c.description,
    user_prompt: c.prompt,
    file_attachment_urls: null,
    tools_triggered: null,
    expected_output: c.expected_behavior,
    expected_output_url: null,
  })),
};
writeFileSync(resolve(store, "chatgpt-app-submission.json"), JSON.stringify(submission, null, 2) + "\n");

// ── 3. ZIP ───────────────────────────────────────────────────────────────
const dist = resolve(store, "dist");
mkdirSync(dist, { recursive: true });
const zip = resolve(dist, "riory-chatgpt-plugin.zip");
rmSync(zip, { force: true });
execFileSync("zip", ["-q", "-r", "-X", zip, "plugin.json", "mcp.json", "skills", "assets"], { cwd: plugin });

console.log("✓ plugin.json, mcp.json, SKILL.md, chatgpt-app-submission.json");
console.log(`✓ ${zip.replace(root + "/", "")}`);
