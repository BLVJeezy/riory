# Indienmateriaal app-winkels (ChatGPT + Claude)

Alles om de Riory-app te publiceren in de **ChatGPT Apps Directory** (OpenAI) en de **Claude Connectors Directory** (Anthropic).

| Bestand | Voor |
|---|---|
| `openai-plugin/` | ChatGPT-pakket: `plugin.json` (listing, 5+3 testcases, landen, vertalingen), `mcp.json`, `skills/get-started/SKILL.md`, `assets/` (logo's, iconen, 5 screenshots) |
| `dist/riory-chatgpt-plugin.zip` | Upload in het OpenAI Platform-dashboard (gegenereerd, niet in git) |
| `chatgpt-app-submission.json` | Alternatief: importbestand als het dashboard het app-formulier toont i.p.v. een ZIP-upload |
| `claude-directory.md` | Antwoorden om te plakken in het reviewformulier van Anthropic |

Opnieuw bouwen na een wijziging: `node scripts/build-store.mjs` (controleert ook de lengtelimieten).

## Wat de indiener zelf moet doen

**OpenAI (ChatGPT)**
1. Organisatie verifiëren in het OpenAI Platform (persoon of bedrijf). De `developerName` in `scripts/build-store.mjs` moet daarmee overeenkomen (nu: Riory BV).
2. Een project met *global* data residency gebruiken (EU-residency kan niet indienen).
3. ZIP uploaden → domeinverificatie: het token als enige inhoud in `public/.well-known/openai-apps-challenge` zetten, deployen, laten controleren.
4. Demovideo opnemen (± 1 min, in ChatGPT developer mode: vraag → formulier → testboeking met `@example.com` → bevestiging) en de link invullen als demo-opname.
5. Review details opslaan → *Submit for review* → na goedkeuring *Publish*.

**Anthropic (Claude)**
1. Riory toevoegen als custom connector en testen.
2. Reviewformulier invullen met `claude-directory.md`.

Testboekingen met een `@example.com`-adres komen nooit in de echte pijplijn (geen databank, mails of Simpla).
