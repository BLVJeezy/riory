## Conclusie: geen wijzigingen nodig

Na dubbelcheck van `src/lib/attribution.ts` tegen jouw bericht: alle drie de punten zijn al correct geïmplementeerd. De enige afwijking t.o.v. jouw snippet was de GA Measurement ID — je bevestigde dat we de bestaande `G-E54E9FCFZQ` (via `GA_MEASUREMENT_ID`) houden, wat ook de juiste keuze is omdat dat de tag is die in `index.html` geladen wordt.

### Verificatie per punt

**1. `getGa4ClientId()` — ✓ correct**
- Guard op `typeof window.gtag !== 'function'` → resolve(undefined)
- 500ms timeout → resolve(undefined)
- `window.gtag('get', GA_MEASUREMENT_ID, 'client_id', cb)` met clearTimeout in callback
- Extra: `try/catch` rond de gtag-call (defensiever dan jouw snippet, geen functioneel verschil)
- Extra: gebruikt `GA_MEASUREMENT_ID` constante i.p.v. hardcoded string (consistent met `index.html` + `App.tsx`)

**2. `captureAttribution()` URL-params — ✓ correct**
- `utm_content: params.get("utm_content")` ✓
- `utm_term: params.get("utm_term")` ✓
- `referrer: existing.referrer || document.referrer || undefined` ✓ (first-touch behoud)

**3. `sendLead()` (= submitForm) en `trackPhoneClick()` — ✓ correct**
- Beide doen `const ga_client_id = await getGa4ClientId();`
- Beide spreaden `attribution: { ...attribution, ga_client_id, ... }`
- Bonus: `trackCtaClick()` doet dit ook al consistent

### Geen actie

Niets te bouwen. Als je wil kan ik:
- de defensieve `try/catch` rond `gtag('get', …)` verwijderen om 1-op-1 met jouw snippet te matchen, of
- de GA ID alsnog wijzigen (maar dan moet `index.html` mee, anders krijg je nooit een `ga_client_id` terug).

Laat maar weten als één van deze nog moet — anders is dit klaar.
