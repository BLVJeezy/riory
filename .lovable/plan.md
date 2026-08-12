# Historiek belklikken op de website

## Bevinding

Terugkijken in de tijd is niet mogelijk in het eigen dashboard. De tabel waarin belklikken worden bewaard, bestaat pas sinds vandaag: de eerste geregistreerde klik is van 12/08/2026 15:13 en er staan in totaal 3 klikken in. Klikken van vóór die datum zijn nooit in de database opgeslagen en kunnen dus niet achteraf gegenereerd worden.

De projectanalytics van het platform bevat voor de laatste 30 dagen 0 bezoekers en 0 pageviews (het verkeer loopt via het eigen domein), dus ook daar zit geen bruikbare historiek.

De enige plek waar oudere belklikken kunnen staan is Google Analytics 4 (event `click_telefoon`), maar enkel voor bezoekers die analytics-consent gaven. Dat is niet automatisch in te lezen zonder GA4-API-toegang.

## Wat ik voorstel te doen

1. In de admin-kaart "Telefoon-leads (Bel nu)" een korte meetnotitie tonen: "Meting gestart op 12/08/2026 — klikken van vóór deze datum zijn niet beschikbaar." Zo blijven de cijfers correct interpreteerbaar en lijkt het niet alsof er vroeger geen klikken waren.
2. Verder niets aanpassen aan de meting zelf: elke klik wordt vanaf nu volledig gelogd (knoplabel, pagina, toestel, tijdstip), dus de historiek bouwt zich vanaf nu op.

## Optioneel (alleen als je dit wil)

Als je de GA4-cijfers van de afgelopen maanden toch in het dashboard wil zien, kan ik een klein invoerveld toevoegen waarmee je per maand een aantal belklikken uit GA4 registreert. Die maandtotalen worden dan naast de live gemeten cijfers gezet, duidelijk gelabeld als "historisch (GA4)". Zeg gerust of je dit erbij wil.

## Technisch

- `src/pages/Admin.tsx`: statische meetnotitie onder de titel van de telefoon-leads-kaart, in dezelfde subtiele stijl als de bestaande beschrijving. Geen wijziging aan queries of berekeningen.
- Geen database- of trackingwijzigingen nodig.
