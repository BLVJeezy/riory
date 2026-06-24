# Werfadres gegarandeerd in elke mail

## Huidige situatie
- **Syndicus**: werf-velden zijn nu verplicht → werfadres komt altijd mee. ✅
- **Particulier / Bedrijf met "werf = facturatieadres = Ja"**: `werf.*` blijft leeg → in de notificatie-mail valt het hele `Werfadres:`-blok weg. Alleen het facturatieadres staat erin, zonder duidelijk label dat dit óók de werf is. Dit zorgt voor verwarring (zoals bij Veerle/Brent).
- **Particulier / Bedrijf met "werf = facturatieadres = Nee"**: werf-velden zijn verplicht → werfadres komt mee. ✅

## Wat ik wil aanpassen

### 1. `src/components/AppointmentForm.tsx`
Wanneer `werfIsFacturatie === true` (particulier/bedrijf/vrij beroep), het werfadres-payload vullen met de facturatie-velden vóór het versturen naar:
- `send-transactional-email` (owner notificatie)
- `send-to-simpla`
- `sendLead` (attribution)

Mapping bij "werf = facturatie = Ja":
```
werfStraat        ← fact.straat
werfHuisnummer    ← fact.huisnummer
werfPostcode      ← fact.postcode
werfPlaats        ← fact.plaats
werfTelefoon      ← fact.telefoon
werfContactpersoon← `${fact.voornaam} ${fact.naam}` (of bedrijfsnaam bij bedrijf)
werfProjectnaam   ← leeg laten
```

De `appointments` insert blijft ongewijzigd (kolommen `werf_*` blijven `null` als de klant "Ja" koos — dat reflecteert de werkelijke invoer en `werfadres_is_facturatieadres = true` legt de relatie vast).

### 2. `supabase/functions/_shared/transactional-email-templates/appointment-notification.tsx`
Geen wijziging nodig — het bestaande `if (p.werfStraat)`-blok rendert het Werfadres-blok zodra de velden meegestuurd worden.

### 3. Deploy
Geen edge-function-deploy nodig (alleen client-side wijziging).

## Resultaat
Elke afspraak-notificatie naar `afspraak@riory.be` bevat voortaan een expliciet **Werfadres:**-blok — bij particulier, bedrijf, vrij beroep én syndicus. Geen verwarring meer over waar de ploeg naartoe moet.
