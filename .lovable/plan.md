## Doel
Witscherm fixen (syntax error in `attribution.ts`) en GA4 Measurement ID consistent zetten op `G-2XP4PSTDFS` overal.

## Wijzigingen

### 1. `src/lib/attribution.ts`
- Regel 15: `GA_MEASUREMENT_ID` constante updaten van `"G-E54E9FCFZQ"` → `"G-2XP4PSTDFS"`.
- Regel 104: kapotte regel
  ```ts
  window.gtag("get", 'G-2XP4PSTDFS, "client_id", (id: string) => {
  ```
  vervangen door:
  ```ts
  window.gtag("get", GA_MEASUREMENT_ID, "client_id", (id: string) => {
  ```
  (gebruikt de constante i.p.v. hardcoded string → één plek om te wijzigen in de toekomst).

### 2. `index.html`
- Regel 175: script-src `?id=G-E54E9FCFZQ` → `?id=G-2XP4PSTDFS`.
- Regel 180: `gtag('config', 'G-E54E9FCFZQ', …)` → `gtag('config', 'G-2XP4PSTDFS', …)`.

## Verificatie
- Witscherm weg, preview laadt homepage.
- In console: `gtag('get','G-2XP4PSTDFS','client_id',console.log)` geeft een client id terug.
- Bij form submit / phone click bevat de payload `attribution.ga_client_id`.

Geen andere bestanden of business logic raken.