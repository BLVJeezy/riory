## Plan: correct adres "Natveld 47, 3740 Bilzen-Hoeselt"

Het juiste vestigingsadres staat momenteel verspreid fout in de codebase (deels "Tongersesteenweg 19", deels "Tongersestraat 12", deels "Toekomststraat 19"). Alleen `AlgemeneVoorwaarden.tsx` had al "Natveld 47". We harmoniseren alles.

### Wijzigingen

**1. Maps embed — `src/components/ContactSection.tsx`**
- iframe `src` → `https://www.google.com/maps?q=Natveld+47,+3740+Bilzen-Hoeselt,+Belgi%C3%AB&output=embed`
- `title` → `"Riory BV – Natveld 47, 3740 Bilzen-Hoeselt op Google Maps"`

**2. Zichtbaar adres — i18n (`nl.json`, `fr.json`, `en.json`, regel 136-137)**
- `addressLine1`: `"Natveld 47"`
- `addressLine2`: `"3740 Bilzen-Hoeselt, België"` (NL) / `"Belgique"` (FR) / `"Belgium"` (EN)

**3. JSON-LD schema's — `index.html`**
- Organization-schema (regel 49): `streetAddress` → `"Natveld 47"`, `addressLocality` → `"Bilzen-Hoeselt"`
- Plumber-schema (regel 80): idem
- LocalBusiness-schema (regel 130-136): voeg `"streetAddress": "Natveld 47"` toe + `addressLocality` → `"Bilzen-Hoeselt"`

**4. Andere paginaschema's**
- `src/pages/DienstDetail.tsx` (regel 108) en `src/pages/LocatieDetail.tsx` (regel 69): `streetAddress` toevoegen + `addressLocality` harmoniseren naar `"Bilzen-Hoeselt"` als die velden bestaan; postcode 3740 blijft.

### Niet gewijzigd (juridische teksten)
`PrivacyPolicy.tsx`, `DataProtection.tsx`, `Gebruiksvoorwaarden.tsx`, `AlgemeneVoorwaarden.tsx` (regel 33) vermelden "Toekomststraat 19" als **maatschappelijke zetel** (KBO-adres). Dit is een juridisch ander adres dan het operationele vestigingsadres en raken we niet aan zonder bevestiging.

→ Vraag: moet de **maatschappelijke zetel** in de juridische pagina's óók worden bijgewerkt naar Natveld 47, of blijft Toekomststraat 19 het KBO-adres?

### Validatie
1. `/` → ContactSection: kaart toont pin op Natveld 47, adresblok toont nieuwe straat.
2. View-source `index.html`: 3× JSON-LD bevat `"streetAddress": "Natveld 47"` en `"addressLocality": "Bilzen-Hoeselt"`.
3. Taalwissel NL/FR/EN → adres correct in alle 3 talen.
