## Doel

Wanneer een klant een **afspraak** of **offerte** indient, ontvangt hij/zij automatisch een bevestigingsmail ("Je aanvraag is succesvol aangekomen") **verzonden vanaf `afspraak@riory.be`**.

## Huidige situatie

- Transactionele e-mail infrastructuur is al aanwezig (`send-transactional-email`, queue, suppression, unsubscribe).
- Het verzenddomein is op dit moment `notify.test-solyn.pw` — een testdomein. Mails worden nu verstuurd vanaf `noreply@notify.test-solyn.pw`.
- Er bestaan al notificatie-templates richting Riory zelf (`afspraak@riory.be`), maar **geen bevestigingsmail richting de klant**.

## Belangrijk: domein moet eerst geconfigureerd worden

Om mails te versturen vanaf `afspraak@riory.be` moet `riory.be` (of een subdomein zoals `notify.riory.be`) als e-maildomein gekoppeld worden via **Cloud → Emails → Manage Domains**. Dit vereist:

1. Domein `riory.be` toevoegen in de Lovable Cloud email-setup dialog
2. NS-records plaatsen bij de DNS-provider van riory.be (richting `ns3.lovable.cloud` / `ns4.lovable.cloud`)
3. Wachten tot DNS verificatie geslaagd is

Zonder die stap blijven mails vanaf `notify.test-solyn.pw` vertrekken — een mail "from afspraak@riory.be" zou geweigerd worden door de email API.

> Lovable kan `display_from_root` gebruiken zodat de From-header `afspraak@riory.be` toont, terwijl het technische verzenddomein `notify.riory.be` blijft. Dit is de standaard, professionele opzet.

## Plan

### Stap 1 — Domein `riory.be` koppelen (vereist actie van jou)
Via de email setup dialog. Ik open die voor je zodra je akkoord gaat. Je krijgt 2 NS-records die je bij je DNS-provider moet plaatsen.

### Stap 2 — Verzendconfiguratie aanpassen
In `supabase/functions/send-transactional-email/index.ts`:
- `SENDER_DOMAIN = "notify.riory.be"`
- `FROM_DOMAIN = "riory.be"`
- From-header → `Riory <afspraak@riory.be>`

### Stap 3 — Twee nieuwe klant-bevestigingstemplates
In `supabase/functions/_shared/transactional-email-templates/`:

1. **`afspraak-confirmation.tsx`** — bevestigt afspraak-aanvraag aan klant
   - Subject: "Je afspraak-aanvraag bij Riory is goed ontvangen"
   - Bevat: dienst, datum-indicatie, contactgegevens Riory, verwachte reactietijd
2. **`offerte-confirmation.tsx`** — bevestigt offerte-aanvraag aan klant
   - Subject: "Je offerte-aanvraag bij Riory is goed ontvangen"
   - Bevat: dienst, beschrijving, verwachte reactietijd

Beide gestyled in Riory-huisstijl (zwart/oranje, conform bestaande templates), met kort, professioneel copy en zonder marketingtaal. Reply-to: `afspraak@riory.be`.

Beide registreren in `_shared/transactional-email-templates/registry.ts`.

### Stap 4 — Triggers in de UI
- **`src/components/AppointmentForm.tsx`** (na succesvolle insert in `appointments`): `supabase.functions.invoke('send-transactional-email', { body: { templateName: 'afspraak-confirmation', recipientEmail: <klant-email>, idempotencyKey: 'afspraak-confirm-<id>', templateData: { voornaam, dienst } } })`
- **`src/components/QuoteForm.tsx`** (na succesvolle insert): zelfde patroon met `offerte-confirmation`.

Verzending gebeurt non-blocking — als de mail faalt, blijft de form-submit succesvol.

### Stap 5 — Deploy
`send-transactional-email` redeployen na de codewijzigingen.

## Wat ik nodig heb van jou

1. **Bevestiging** dat je `riory.be` als verzenddomein wil koppelen (NS-records plaatsen).
2. Voorkeur voor het **subdomein** dat gebruikt wordt voor verzending: `notify.riory.be` (default) of iets anders zoals `mail.riory.be`. De zichtbare From blijft `afspraak@riory.be`.

Als je akkoord bent, switch ik naar build-mode, open de email-setup dialog en voer ik stappen 2-5 uit.
