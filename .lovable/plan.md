

## Plan: Zoektermen toevoegen aan FAQ-sectie

### Wat
Nieuwe FAQ-vragen toevoegen die specifieke zoektermen bevatten waar mensen actief op zoeken, plus bestaande antwoorden verrijken met die termen. De zoektermen: **wc ontstoppen**, **gootsteen verstopt**, **douche loopt niet af**, **rioollucht in huis**, **borrelende afvoer**, **rioolvliegjes**, **water dat terugkomt**.

### Wijzigingen

**1. `src/components/FAQSection.tsx`** — Nieuwe FAQ-items toevoegen + bestaande antwoorden verrijken:

- **Bestaand antwoord "Wat kost een ontstopping"** verrijken met concrete voorbeelden: "Of het nu gaat om een verstopte WC, gootsteen of een douche die niet afloopt..."
- **Nieuwe FAQ**: "Mijn WC is verstopt, wat kan ik doen?" — antwoord met advies + verwijzing naar dienst
- **Nieuwe FAQ**: "Mijn gootsteen of douche loopt niet af, wat is de oorzaak?" — antwoord met veelvoorkomende oorzaken
- **Nieuwe FAQ**: "Ik ruik rioollucht in huis, is dat gevaarlijk?" — antwoord over oorzaken (droogstaande sifon, beschadigde leiding) + camera-inspectie
- **Nieuwe FAQ**: "Wat betekent een borrelende afvoer of rioolvliegjes?" — antwoord over symptomen van diepere verstopping

**2. `index.html`** — Dezelfde nieuwe FAQ-items toevoegen aan het FAQPage JSON-LD schema zodat Google ze als rich results kan tonen.

### Resultaat
- 10 FAQ-items in plaats van 6, met maximale dekking van long-tail zoektermen
- FAQ schema in `index.html` blijft in sync
- Geen dubbele schema's (enkel in `index.html`)

