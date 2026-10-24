---
name: Reviews Section
description: Google Reviews automatisering via Places API + database, dagelijks cron-job, hybride aanpak
type: feature
---
De reviewssectie leest uit de statische lijst src/data/reviewsList.ts (Google-export, enkel reviews met tekst, zonder vertaling/antwoord). JotForm-widget verwijderd — niet terugzetten.

**Hybride aanpak:**
- Bestaande reviews zijn handmatig in de DB opgeslagen (source: 'manual')
- Een Edge Function `fetch-google-reviews` haalt dagelijks de 5 meest relevante reviews op via Google Places API (New)
- Google Place ID: `ChIJq6qqqlTmwEcRHdPYblaJxK0`
- Cron-job: elke dag om 06:00 via pg_cron
- API reviews worden ge-upsert op basis van `google_review_id` (geen duplicaten)

**Scrollgedrag:**
- Twee rijen met CSS-animaties in tegenovergestelde richtingen
- Animatie pauzeert bij hover
- Reviews worden opgesplitst in twee helften voor de twee rijen

**Google Business link:**
- "Plaats een review" knop linkt naar het Google Reviews-profiel van Riory
