## Wachten op DNS-verificatie

Domein `notify.riory.be` staat nu nog op **⏳ Verifying DNS**. Zodra de status **Active** is (te volgen via Cloud → Emails → Manage Domains), voer ik onderstaande implementatie uit.

## Implementatie

### 1. Verzendconfig aanpassen
In `supabase/functions/send-transactional-email/index.ts`:

```text
SENDER_DOMAIN = "notify.riory.be"   (was: notify.test-solyn.pw)
FROM_DOMAIN   = "riory.be"          (was: test-solyn.pw)
```

Resultaat in elke uitgaande mail:
```text
From:     Riory <afspraak@riory.be>
Reply-To: afspraak@riory.be
```

### 2. Edge function redeployen
`send-transactional-email` opnieuw deployen zodat de wijziging live is.

### 3. Verificatie-testmail
Eén testmail (afspraak-bevestiging) naar `jasonbalongo@gmail.com` zodat je in de inbox kan controleren dat het zichtbare From-adres `Riory <afspraak@riory.be>` is en dat "Beantwoorden" naar `afspraak@riory.be` gaat.

## Wat NIET wijzigt
- Templates (logo, opmaak, copy) blijven identiek.
- `AppointmentForm`, `QuoteForm` en alle triggerlogica blijven ongewijzigd.
- Je SPF-record op `riory.be` (Microsoft 365) blijft ongewijzigd.

## Trigger om te starten
Stuur een berichtje "DNS is geverifieerd, ga maar" zodra de status **Active** staat — dan voer ik bovenstaande 3 stappen uit.