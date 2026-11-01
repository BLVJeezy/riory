# Claude Connectors Directory — antwoorden om te plakken

Aanvragen via het reviewformulier van Anthropic (Connectors Directory, "remote MCP server").
Tip van Anthropic: voeg de server eerst zelf toe als custom connector en test hem; dien daarna in.
Antwoorden hieronder in het Engels (het formulier is Engelstalig).

## Basis

| Veld | Waarde |
|---|---|
| Connector name | Riory |
| Server URL | `https://www.riory.be/api/mcp` |
| Transport | Streamable HTTP |
| Authentication | None (authless) — no account needed |
| Developer / company | Riory BV (Belgium, KBO BE 0840.931.404) |
| Website | https://www.riory.be |
| Support | afspraak@riory.be · https://www.riory.be/boeken-in-chat |
| Privacy policy | https://www.riory.be/privacy-policy (section 8 covers bookings via AI assistants) |
| Terms | https://www.riory.be/algemene-voorwaarden |
| DPA URL | Not applicable: Riory BV is the controller of booking data; see the privacy policy |
| Icon | https://www.riory.be/favicon.ico (256 px) — or `openai-plugin/assets/logo.png` |
| Test account | Not required. Test bookings with an `@example.com` e-mail never reach Riory's real systems and show a TEST label. |
| Interactive UI (MCP App) | Yes: booking form `ui://riory/booking-form-v1.html` (`text/html;profile=mcp-app`) |
| Allowed link URIs | `https://www.riory.be`, `https://riory.be` (terms links in the form) |
| Screenshots | `openai-plugin/assets/screenshot-1.png` … `screenshot-5.png` |

## Short description

Book a drain or sewer intervention with Riory BV (Belgium) right in the chat.

## Description (markdown)

```markdown
Riory BV is a 24/7 drain-unblocking and sewer company in Bilzen, Belgium, serving Belgian Limburg and the Liège region. With this connector, customers request an intervention without leaving Claude.

## Features
- **Booking form in the chat**: Riory's official form opens in the conversation, prefilled with what the user already said (service, town, urgency, description). The user checks the details, accepts Riory's terms and sends the request.
- **Instant confirmation**: a reference number and confirmation e-mail; Riory contacts the customer to confirm the time.
- **Service info**: Riory's services, service area and 24/7 phone number.
- Dutch, French and English; light and dark theme.

## Setup
1. Find Riory in the Connectors Directory and connect. No account or login is needed.
2. Ask, for example: "My toilet is blocked in Hasselt, can Riory come today?"

## Authentication
None. The connector only sends appointment requests that the user submits.

## Examples
1. "Mijn wc is verstopt in Hasselt, ik wil een afspraak bij Riory." → opens the booking form with unblocking and Hasselt prefilled.
2. "Book Riory to empty my septic tank in Bilzen next week." → opens the form with septic tank emptying selected.
3. "Which services does Riory offer and where do they work?" → returns services, service area and contact details.
4. "Mon WC est bouché à Tongres, je voudrais un rendez-vous." → opens the form; the FR button shows it in French.

## Privacy
Riory only receives the fields the user enters or confirms in the form and the name of the chat app. The conversation itself is not collected. Policy: https://www.riory.be/privacy-policy

## Support
afspraak@riory.be · +32 472 50 28 14 · https://www.riory.be/boeken-in-chat
```

## Tools en veiligheidslabels

| Tool | readOnlyHint | destructiveHint | openWorldHint | Wat het doet |
|---|---|---|---|---|
| `riory_info` | true | false | false | Services, service area, contact (static data) |
| `riory_open_booking_form` | true | false | false | Shows the booking form with prefill; sends nothing |
| `riory_submit_booking` | false | false | true | Creates an appointment request; e-mails Riory and the customer |

## Nog te doen voor indienen

- [ ] Riory zelf als custom connector toevoegen in Claude en een testboeking doen met een `@example.com`-adres.
- [ ] Optioneel maar aangeraden: een globale rate limit op `/api/mcp` (Vercel Firewall), want zonder login is er geen limiet per gebruiker.
