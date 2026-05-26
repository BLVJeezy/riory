## Context

`index.html` bevat al een uitgebreid `Plumber` schema (een subtype van `LocalBusiness` → `Organization`) met naam, adres, telefoon, e-mail, openingstijden en reviews. Schema.org-validators accepteren dit als business-schema, maar sommige SEO-tools (waaronder de Lovable scanner-melding die je toonde) zoeken letterlijk naar een `@type: "Organization"` blok en flaggen het anders als ontbrekend.

## Plan

Een apart `Organization` JSON-LD blok toevoegen in `index.html`, naast de bestaande `Plumber` en `FAQPage` schemas. Zo bedien je beide: brand identity voor zoekmachines/AI assistants én de specifieke LocalBusiness-data voor lokale SEO.

### Wijziging in `index.html`

Nieuw `<script type="application/ld+json">` blok toevoegen vóór het bestaande `Plumber` blok:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Riory BV",
  "legalName": "Riory BV",
  "url": "https://riory.be",
  "logo": "https://riory.be/src/assets/riory-logo-black.svg",
  "image": "https://riory.be/src/assets/riory-logo-black.svg",
  "description": "24/7 ontstopping-, riool- & ruimdienst in Bilzen-Hoeselt en heel Limburg.",
  "telephone": "+32472502814",
  "email": "info@riory.be",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tongersestraat 12",
    "addressLocality": "Bilzen",
    "postalCode": "3740",
    "addressRegion": "Limburg",
    "addressCountry": "BE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+32472502814",
    "contactType": "customer service",
    "areaServed": "BE",
    "availableLanguage": ["Dutch", "French", "English"]
  },
  "sameAs": [
    "https://www.google.com/maps/place/Riory"
  ]
}
```

### Notes

- Bestaande `Plumber` en `FAQPage` schemas blijven onaangewijzigd — die leveren extra lokale SEO-signalen.
- Als je officiële social-profielen hebt (Facebook, Instagram, LinkedIn), kunnen we die in `sameAs` toevoegen — geef de URLs door.
- Geen code-wijzigingen buiten `index.html`.
