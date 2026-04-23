---
name: Locatie Landing Pages
description: City-specific SEO landing pages under /regio/:slug for Limburg + Luik region
type: feature
---
Location-specific landing pages at `/regio/:slug`.
Limburg (NL): hasselt, genk, hoeselt, tongeren, maasmechelen, sint-truiden.
Luik regio (FR): luik, rocourt, juprelle, ans, milmort, vottem.
Data in `src/data/locations.ts`, page component in `src/pages/LocatieDetail.tsx`.
Each page has: unique H1, meta title/description, intro text, 4 service cards linking to /diensten/:slug, local FAQ with JSON-LD, nearby areas with cross-links, appointment form CTA.
JSON-LD includes LocalBusiness (Plumber) + FAQPage schema per city.
Liège-region pages have French content (city/region is francophone); NL i18n fallback uses the same FR strings unless overridden in `locationsData.{slug}` translation keys.
