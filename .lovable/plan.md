# Veel Voorkomende Problemen — aparte sectie & pagina

## Doel
De 6 items WC Verstopt, Keukenafvoer Verstopt, Doucheputje Verstopt, Riool Verstopt, Gootsteen Verstopt en Lekkende Kraan zijn geen kerndiensten maar **problemen** die Riory zorgeloos oplost. Ze krijgen een eigen identiteit op de site.

## Wat verandert

### 1. Diensten-sectie (homepage) opschonen
`ServicesSection.tsx` toont nog enkel de 4 echte kerndiensten:
- Camera Inspectie Riool
- Ontstoppingen & Geurdetectie
- Septische Put Ledigen
- Leegpompen & Reinigen

Resultaat: nettere 4-koloms grid, minder ruis, duidelijkere positionering.

### 2. Nieuwe homepage-sectie: "Veel Voorkomende Problemen"
Nieuwe component `CommonProblemsSection.tsx`, geplaatst direct onder de Diensten-sectie.

- Titel: "Veel Voorkomende Problemen"
- Subtitel: "Riory lost het zorgeloos voor u op — 24/7 in heel Limburg"
- 6 kaarten in 2x3 (mobiel) / 3x2 (desktop) grid met foto + probleemnaam + korte zin
- Elke kaart linkt naar de bijhorende detailpagina (`/diensten/<slug>` blijft ongewijzigd zodat SEO/links intact blijven)
- Onderaan CTA-knop: "Bekijk alle veelvoorkomende problemen" → `/veelvoorkomende-problemen`

### 3. Nieuwe overzichtspagina `/veelvoorkomende-problemen`
Nieuwe page `VeelvoorkomendeProblemen.tsx`:
- Hero met titel "Veel Voorkomende Problemen in Limburg" + intro-tekst over Riory's zorgeloze aanpak
- Grid met alle 6 problemen (grotere kaarten dan op homepage, met beschrijving)
- USP-strip (24/7, vaste prijzen, geen breekwerk, garantie)
- Eind-CTA: Afspraak maken + Bel-knop

### 4. Navigatie & SEO
- Route toegevoegd in `App.tsx`: `/veelvoorkomende-problemen` → nieuwe pagina (incl. taalvarianten via `localizedPath`)
- Sitemap & Footer: link "Veel voorkomende problemen" naast "Diensten"
- Meta title/description voor de nieuwe pagina volgens bestaande SEO-conventie

## Wat NIET verandert
- Bestaande detailpagina's `/diensten/<slug>` blijven werken (geen redirects nodig, geen SEO-impact)
- Data in `src/data/services.ts` blijft intact; we splitsen alleen welke slugs in welke sectie tonen via een nieuwe `commonProblemSlugs` constante
- Foto's die je net hebt geüpload blijven gekoppeld

## Technische details
- Nieuwe constante in `src/data/services.ts`:
  ```ts
  export const coreServiceSlugs = ["camera-inspectie", "ontstoppingen-en-geurdetectie", "septische-put-ledigen", "leegpompen-en-reinigen"];
  export const commonProblemSlugs = ["wc-verstopt", "keukenafvoer-verstopt", "doucheputje-verstopt", "riool-verstopt", "gootsteen-verstopt", "lekkende-kraan"];
  ```
- `ServicesSection` filtert op `coreServiceSlugs`, `CommonProblemsSection` op `commonProblemSlugs`
- Nieuwe pagina hergebruikt bestaande kaartstijl (rounded, gradient overlay) zodat alles consistent oogt
- i18n-keys: bestaande `servicesData.<slug>` keys worden hergebruikt; nieuwe sectiekoppen krijgen `commonProblems.sectionTitle` etc.

Akkoord om te bouwen?