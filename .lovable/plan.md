## Doel
Wanneer jij als eigenaar een **afspraak-notificatie** ontvangt op `afspraak@riory.be`, moet "Beantwoorden" rechtstreeks naar het e-mailadres van de klant gaan — niet terug naar `afspraak@riory.be`.

## Hoe
De edge function `send-transactional-email` zet nu altijd `Reply-To: afspraak@riory.be`. We voegen een optionele `replyToEmail` parameter toe en gebruiken die in `AppointmentForm` voor de eigenaar-notificatie.

### 1. `supabase/functions/send-transactional-email/index.ts`
- Lees `replyToEmail` (of `reply_to_email`) uit de request body.
- Valideer dat het een geldig e-mailadres is (anders negeren en fallback gebruiken).
- In de enqueue payload: `reply_to: replyToEmail || \`afspraak@${FROM_DOMAIN}\``.
- Standaardgedrag voor alle bestaande calls (zoals klantbevestigingen) blijft ongewijzigd.

### 2. `src/components/AppointmentForm.tsx` (regel ~308)
Bij de aanroep voor `appointment-notification` (mail naar eigenaar):
- Bepaal het juiste klant-e-mailadres:
  - syndicus → `syndicus.email`
  - particulier/bedrijf/vrij beroep → `fact.email`
- Voeg `replyToEmail: <klantEmail>` toe aan de body.
- De klantbevestiging (`afspraak-confirmation`) blijft ongewijzigd — die gaat nog steeds met standaard reply-to weg.

### 3. Deployen
`send-transactional-email` opnieuw deployen.

### 4. Verificatie
Eén testafspraak indienen of een directe testcall doen, controleren dat de mail naar `afspraak@riory.be` als header heeft:
```text
From:     Riory <afspraak@riory.be>
Reply-To: <klant-email>
```
Klikken op "Beantwoorden" in de inbox moet automatisch het klant-adres invullen.

## Niet in scope
- QuoteForm / offertes (zelfde patroon mogelijk later — laat me weten als je dit ook daar wil).
- Wijzigingen aan templates of From-adres.
