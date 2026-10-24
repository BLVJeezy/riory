# Reviews: widget weg, scrollende reviewrijen terug

## Wat je ziet
- De JotForm-reviewwidget verdwijnt van de homepage.
- In de plaats komen opnieuw twee oneindig scrollende rijen met reviewkaartjes: bovenste rij schuift naar links, onderste naar rechts. Pauzeert als je erover beweegt.
- Bovenaan: titel, sterrenscore 4.9 en het aantal reviews (144), plus de knop "Plaats een review" naar jullie Google-profiel.
- Elk kaartje: naam, 5 sterren, datum en de reviewtekst (lange teksten ingekort tot enkele regels).

## Welke reviews
- Alle reviews uit de twee geplakte bestanden worden ingelezen.
- Enkel reviews met een eigen tekst van de klant komen in de rijen. Reviews met alleen sterren (waar in het bestand enkel jullie antwoord staat) laten we weg, zodat er nooit een antwoord van Riory als klantreview verschijnt.
- We tonen de originele tekst (Nederlands), zonder de "(Translated by Google)"-vertaling en zonder jullie antwoord.
- De reviews worden verdeeld over de twee rijen.

## Technische details
- Parse beide txt-bestanden met een script naar `src/data/reviewsList.ts` (naam, rating, tekst, datum); tekst afknippen op "(Translated by Google)"; entries waarvan de tekst een eigenaar-antwoord is (beginnen met de klantnaam/"bedankt"-patroon of reviewlijn gelijk aan reply) worden gefilterd.
- `ReviewsSection.tsx` herschrijven: JotForm-script weg, twee rijen met CSS marquee-animatie (`animate-scroll-left` / `animate-scroll-right` keyframes in tailwind config), content verdubbeld voor naadloze loop, `hover:[animation-play-state:paused]`. Semantische tokens voor kleuren.
- `REVIEW_STATS.reviewCount` in `src/data/reviews.ts` naar "144" (schema blijft kloppen).
- Memory "Reviews Section" bijwerken naar de statische lijst.
