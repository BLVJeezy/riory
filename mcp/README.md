# Riory MCP-server — afspraak boeken in ChatGPT, Claude, Copilot, …

Klanten kunnen een afspraak bij Riory boeken **zonder de chat te verlaten**.
Vraagt iemand in ChatGPT of Claude "mijn riool is verstopt in Tongeren, wat nu?" en is de Riory-app
gekoppeld, dan toont de assistent het Riory-afspraakformulier rechtstreeks in het gesprek, al
ingevuld met wat de klant al vertelde.

Endpoint (productie): **`https://www.riory.be/api/mcp`** (MCP Streamable HTTP, stateless, geen login).
Gebruik altijd de www-versie: `riory.be` stuurt door naar `www.riory.be` (308) en niet elke chat-app volgt die doorverwijzing.

> **Let op:** zolang de app niet gekoppeld is (developer mode) of niet goedgekeurd in de app-directory van
> ChatGPT/Claude, gebruikt de assistent deze server niet. Hij zoekt Riory dan op het web en verzint soms een
> eigen formulier (bv. met datum en tijdstip). Zo'n aanvraag komt nergens bij Riory binnen.

## Hoe het werkt

| Tool | Wat het doet |
|---|---|
| `riory_info` | Diensten, werkgebied, contact (alleen lezen) |
| `riory_open_booking_form` | Toont het interactieve formulier (MCP App) in de chat, vooraf ingevuld vanuit het gesprek |
| `riory_submit_booking` | Verstuurt de aanvraag. Wordt aangeroepen door het formulier, of door het model in chat-apps zonder formulieren (na expliciete bevestiging + akkoord voorwaarden) |

Een boeking uit de chat volgt **exact dezelfde pijplijn als het webformulier**:
lead-pijplijn (invenix) → Supabase `appointments` → mail naar afspraak@riory.be + bevestigingsmail klant → Simpla CRM.
Herkenbaar aan `lead_bron = ai_chat` en `gevonden_via = chatgpt | claude | ai_chat`.

Het formulier is een MCP App (`text/html;profile=mcp-app`), de open standaard die ChatGPT, Claude,
Microsoft Copilot, VS Code en Goose ondersteunen. Eén build werkt overal. Het formulier is in het Nederlands, Frans en Engels
(automatisch volgens de taal van de chat-app) en ondersteunt een licht en donker thema.

## Bestanden

- `mcp/server.ts`: tools en formulier-resource
- `mcp/booking.ts`: validatie en boekingspijplijn
- `mcp/handler.ts`: Vercel HTTP-handler
- `mcp/widget/`: het formulier (HTML + TypeScript)
- `api/mcp.js`: **gegenereerd**, de Vercel function. Niet manueel aanpassen.

## Aanpassen

```bash
npm run build:mcp      # bouwt api/mcp.js opnieuw — commit dit bestand mee
npm run mcp:dev        # lokale server op http://localhost:8787/api/mcp (testmodus: niets wordt echt geboekt)
```

Testen met de officiële inspector: `npx @modelcontextprotocol/inspector` → Streamable HTTP → `http://localhost:8787/api/mcp`.

Omgevingsvariabelen (optioneel): `RIORY_MCP_DRY_RUN=1` zet testmodus aan (bevestigingsscherm toont dan "TEST").
`SUPABASE_URL` / `SUPABASE_ANON_KEY` overschrijven de publieke sleutels.

## Live zetten in de chat-apps

**Claude** (meteen bruikbaar): Instellingen → Connectors → *Add custom connector* → URL `https://www.riory.be/api/mcp`.
Voor een vermelding in de Claude-connectordirectory: aanmelden via het formulier van Anthropic.

**ChatGPT**:
1. Testen: Settings → Apps → *Advanced settings* → Developer mode aan → *Create app* → URL `https://www.riory.be/api/mcp`, authenticatie "None".
2. Publiek maken: platform.openai.com → Apps → *Submit app*. Nodig: naam, logo, korte beschrijving, privacybeleid
   (https://riory.be/privacy-policy), testvoorbeelden ("Mijn wc is verstopt in Hasselt, kan iemand vandaag komen?") en een geverifieerde organisatie.
   Na goedkeuring staat Riory in de ChatGPT app-directory en kan ChatGPT de app zelf voorstellen.

**Microsoft Copilot / andere**: dezelfde URL toevoegen als MCP-server.
