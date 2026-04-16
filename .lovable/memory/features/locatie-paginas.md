---
name: Locatie Landing Pages
description: City-specific SEO landing pages under /regio/:slug for 6 Limburg cities
type: feature
---
Location-specific landing pages at `/regio/:slug` for Hasselt, Genk, Hoeselt, Tongeren, Maasmechelen, Sint-Truiden.
Data in `src/data/locations.ts`, page component in `src/pages/LocatieDetail.tsx`.
Each page has: unique H1, meta title/description, intro text, 4 service cards linking to /diensten/:slug, local FAQ with JSON-LD, nearby areas with cross-links, appointment form CTA.
JSON-LD includes LocalBusiness (Plumber) + FAQPage schema per city.
