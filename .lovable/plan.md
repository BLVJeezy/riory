## Plan: Manuele Simpla health check + mail naar Jason

### Stappen
1. Roep de bestaande `simpla-health-check` edge function aan (POST). Deze:
   - Probeert de Simpla callback URL (`http://app-02.simpla.be/callback.aspx?key=rioryV2`)
   - Logt resultaat in `simpla_health_checks`
   - Retourneert JSON met status, httpStatus, latency, attempts, foutboodschap
2. Op basis van het resultaat een one-off mail sturen naar `jasonbalongo@gmail.com` via `send-transactional-email` met template `simpla-health-alert`:
   - Bij OK: `alertType: "incident"` met succes-info in `errorMessage` veld ("Handmatige check — alles OK")
   - Bij FAIL: gebruik echte foutdata
   - Unieke `idempotencyKey` met timestamp zodat de mail niet wordt geblokkeerd
3. Resultaat terugkoppelen in chat (HTTP status, latency, of mail verzonden).

### Opmerking
De automatische alert-flow stuurt enkel een mail bij 3 opeenvolgende fouten. Voor deze handmatige check forceren we een mail ongeacht de uitkomst, zodat Jason het resultaat ziet.

### Geen code-wijzigingen
Dit is een runtime-actie — geen wijzigingen aan files. Edge functions worden enkel aangeroepen.
