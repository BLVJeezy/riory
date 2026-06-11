# Plan: alle toekomstige mails via Resend

## Wat verandert
Vandaag gaan productie-mails (afspraak-bevestiging klant, owner-notificatie, offerte-bevestiging, quote-notificatie, sollicitatie-notificatie) via de interne Lovable Emails queue (Mailgun op `notify.riory.be`). Vanaf nu sturen we ze rechtstreeks via **Resend** vanaf `@riory.be`, exact zoals de testmails naar jasonbalongo.

Géén veranderingen aan templates, formulieren of triggers — enkel de `send-transactional-email` edge function wordt omgeschakeld.

## Afzender-logica (consistent met memory + testmails)
- **Owner-notificaties** (`appointment-notification`, `quote-notification`, `sollicitatie-notification`)
  → `From: RIORY <noreply@riory.be>`
  → `Reply-To: <e-mail van de klant>` (zodat "Beantwoorden" rechtstreeks naar de klant gaat)
- **Klantbevestigingen** (`afspraak-confirmation`, `offerte-confirmation`, en alle overige)
  → `From: RIORY <afspraak@riory.be>`
  → `Reply-To: info@riory.be`

## Technische uitvoering
1. `supabase/functions/send-transactional-email/index.ts` aanpassen:
   - Suppression-check, unsubscribe-token en template-rendering blijven ongewijzigd.
   - De `enqueue_email` stap vervangen door een directe `POST https://api.resend.com/emails` met `RESEND_API_KEY` (al aanwezig als secret).
   - `email_send_log` blijft de waarheidsbron:
     - `pending` rij vóór de Resend-call
     - `sent` rij na een 2xx van Resend (met `metadata.provider = 'resend'` en de Resend `id`)
     - `failed` rij met foutdetails bij een non-2xx of netwerk-error
2. Edge function deployen.
3. Verificatie:
   - Eén live afspraak doorlopen via `/afspraak` (of `curl_edge_functions`) en in `email_send_log` controleren dat beide mails (klant + owner) status `sent` krijgen met `provider: resend`.

## Wat NIET verandert
- Templates en hun React-componenten.
- Triggers in `AppointmentForm`, `QuoteForm`, `Sollicitatie`, etc.
- De Lovable Emails infrastructuur (queue, cron, suppression, unsubscribe) blijft staan — handig voor toekomstige fallback en voor bounce/complaint webhooks.
- DNS / nameservers op `notify.riory.be` worden niet aangeraakt.

## Aandachtspunten
- Resend retries niet automatisch bij 5xx — bij een mislukte send verschijnt er een `failed` rij in `email_send_log` en kan ik 'm desgewenst handmatig opnieuw triggeren.
- Resend heeft een eigen suppression/bounce-systeem. De bestaande `suppressed_emails` tabel blijft als extra fail-closed check vooraf.
- Wil je dat ik ook de Lovable Emails infra later helemaal uitzet (en de NS-records op `notify.riory.be` mag laten verwijderen)? Dat doe ik liever pas als Resend een paar dagen vlekkeloos draait — dan kunnen we altijd snel terugschakelen.
