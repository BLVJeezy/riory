

# Google Reviews Automatiseren — Opties

## Optie 1: Google Places API (Aanbevolen)
- Gebruik de **Google Places API** (die je al hebt via je Google Maps API key met billing ingeschakeld)
- Maak een Edge Function die periodiek reviews ophaalt via `places/{placeId}/reviews`
- Sla de reviews op in een database-tabel
- De website leest uit de database in plaats van hardcoded data

**Voordelen**: Betrouwbaar, officieel, real-time updates
**Nadelen**: Google Places API toont maximaal **5 meest relevante reviews** per API-call (dit is een Google-beperking). Je kunt dus niet alle 79+ reviews automatisch ophalen.

## Optie 2: Scheduled scraping via Firecrawl
- Gebruik de Firecrawl connector om periodiek de Google Reviews pagina te scrapen
- Parse de reviews en sla ze op in de database
- Draait via een scheduled Edge Function (bijv. dagelijks)

**Voordelen**: Kan meer dan 5 reviews ophalen
**Nadelen**: Fragiel (HTML-structuur kan veranderen), vereist Firecrawl connector setup

## Optie 3: Hybride aanpak
- Gebruik de Google Places API voor de 5 nieuwste/meest relevante reviews
- Houd de overige reviews handmatig bij in de database
- Toon alles samen op de website

**Voordelen**: Betrouwbaar voor de nieuwste reviews, volledige controle over de rest
**Nadelen**: Niet volledig geautomatiseerd

## Wat elke optie inhoudt (technisch)

1. **Database-tabel** `google_reviews` met kolommen: naam, rating, tekst, datum, bron
2. **Edge Function** die reviews ophaalt (API of scraping)
3. **Scheduled job** (pg_cron) om periodiek te updaten
4. **ReviewsSection** aanpassen om uit de database te lezen in plaats van hardcoded data

## Aanbeveling

**Optie 1 (Google Places API)** is het meest betrouwbaar, maar beperkt tot 5 reviews per call. Als je alle reviews wilt tonen, is **Optie 3 (hybride)** het beste: automatisch de nieuwste ophalen + de rest in de database beheren.

