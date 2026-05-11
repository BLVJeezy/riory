## Wat ik ga doen

**1. Bron-veld verplicht maken in het afspraakformulier**

In `src/components/AppointmentForm.tsx`, stap 6:
- Validatie aanscherpen: gebruiker moet een bron aanduiden om te kunnen verzenden.
- Als de keuze "Mond-aan-mond", "Installateur" of "Andere" is, moet ook het detail-veld ingevuld zijn.
- Sterretje (*) bij de titel van stap 6 zodat zichtbaar is dat het verplicht is.

**2. Bestaande "onbekend" records opkuisen**

De 3 oude afspraken zonder bron worden bijgewerkt naar `gevonden_via = 'andere'`:
- 11/05/2026 — Ontstopping
- 11/05/2026 — Ontstopping
- 08/05/2026 — Septische put ledigen

**3. Resultaat**

- Geen nieuwe "onbekend" inzendingen meer mogelijk.
- De filter "Bronnen" in admin toont enkel echte bronnen — "onbekend" verdwijnt volledig.
