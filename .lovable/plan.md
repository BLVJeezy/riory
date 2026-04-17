
## Plan: Audit & optimaliseren van Meta Titel + Meta Beschrijving (best practices)

### Huidige situatie
- **Homepage** (`index.html`): Title 56 tekens ✓, Description 169 tekens ⚠️ (te lang, knipt af rond 155-160).
- **Diensten-detailpagina's** (`src/data/services.ts`): titles en descriptions zien er goed uit, maar `metaDescription` voor "Ontstoppingen" (~157) en "Kelder leegpompen" (~152) zitten op de grens.
- **Locatiepagina's** (`src/data/locations.ts`): meeste meta-descriptions tussen 145-165 tekens — een paar zitten boven de aanbevolen 160.
- **Diensten-overzicht** (`/diensten`) en **Afspraak** (`/afspraak`): meta-tags via `useDocumentMeta()` zijn **kort en generiek** — missen power-words, USP's en CTA.
- **OG image**: verwijst naar een tijdelijke Lovable preview-URL (niet brand-eigen).

### Best practices die we toepassen
1. **Title**: 50-60 tekens, primair zoekwoord vooraan, locatie + brand achteraan, pipe-separator.
2. **Description**: 140-158 tekens, USP's met ✓ vinkjes, urgentie ("24/7", "Binnen 2u"), social proof ("4.9★"), duidelijke CTA ("Bel nu", "Plan in").
3. **Uniek per pagina** — geen duplicates.
4. **Bevat primair zoekwoord** + minstens 1 locatie waar relevant.

### Wijzigingen

**1. `index.html`** — homepage description inkorten naar ~155 tekens, OG image vervangen door brand-asset of stabiele URL behouden met notitie.

**2. `src/data/services.ts`** — herzien van alle 4 `metaTitle` + `metaDescription` waar nodig (lengte + krachtigere CTA/USP).

**3. `src/data/locations.ts`** — alle 6 locatie meta-tags optimaliseren (lengte trimmen tot ≤158 tekens, consistent format: "Dienst Locatie 24/7 | USP's | Brand").

**4. `src/pages/Diensten.tsx`** + **`src/pages/Afspraak.tsx`** — vervang generieke titels met SEO-rijke versies:
- Diensten: `"Rioleringsdiensten Limburg | Ontstopping, Camera & Septische Put | Riory"` + krachtige description.
- Afspraak: `"Afspraak Maken Riory | 24/7 Ontstoppingsdienst Limburg"` + CTA-gerichte description.

**5. `src/hooks/useDocumentMeta.tsx`** — uitbreiden om ook `og:url` (canonical) per pagina te updaten zodat social shares correct linken.

### Resultaat
- Alle meta-tags binnen Google's aanbevolen lengte (geen afkappingen in SERP).
- Consistent format met USP-vinkjes, urgentie, social proof en CTA → hogere CTR.
- Unieke meta-tags per pagina (geen duplicate content signals).
- OG-tags blijven in sync per route.

### Niet in scope (apart vragen indien gewenst)
- CRO-aanpassingen (formulier-achtergrond, prijsrange, hero CTA boven fold).
- SEA-keyword campagnestructuur (separate Google Ads strategie-document).
