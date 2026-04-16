

## Plan: H1 & H2 Heading-optimalisatie met LSI-keywords

### Probleem
De H1-titels bevatten al lokale zoektermen, maar de H2-tussenkopjes zijn generiek ("Wat wij doen") en missen LSI-keywords. Elke dienstpagina gebruikt dezelfde H2, wat een gemiste SEO-kans is.

### Aanpak

**1. Service data-model uitbreiden** (`src/data/services.ts`)

Nieuw veld `h2Title` toevoegen aan de `Service` interface, zodat elke dienst een unieke, zoekwoordrijke H2 krijgt:

| Dienst | Huidige H2 | Nieuwe H2 (`h2Title`) |
|---|---|---|
| Camera inspectie | Wat wij doen | Riool inspecteren en afvoerproblemen opsporen |
| Ontstoppingen & Geurdetectie | Wat wij doen | Riool ontstoppen en oorzaak van rioolstank opsporen |
| Leidingen & Septische Putten | Wat wij doen | Septische put ruimen en rioolleidingen herstellen |
| Leegpompen & Reinigen | Wat wij doen | Kelder droogpompen en rioleringssysteem reinigen |

**2. DienstDetail pagina updaten** (`src/pages/DienstDetail.tsx`)

- De H2 "Wat wij doen" vervangen door `service.h2Title`
- De H3 "Bekijk onze referenties" wordt ook zoekwoordrijker per dienst (optioneel, via een `refH3` veld)

### Technische details

- `Service` interface: `h2Title: string` toevoegen
- Alle 4 services in `allServices` array krijgen een `h2Title` waarde
- In `DienstDetail.tsx` regel 108-109: `"Wat wij doen"` → `{service.h2Title}`

### Geen wijzigingen aan
- H1-titels (zijn al geoptimaliseerd met lokale termen)
- Meta titles/descriptions (zijn al geoptimaliseerd)

