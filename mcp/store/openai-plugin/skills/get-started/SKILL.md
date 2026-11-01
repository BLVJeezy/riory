---
name: get-started
description: Use when someone wants to book or ask about a drain, toilet, sink, sewer or septic tank intervention with Riory BV in Belgian Limburg or the Liège region.
---

# Riory — book in the chat

1. When the user wants an appointment or help with a blockage, call `riory_open_booking_form` right away.
   Prefill what you already know (service, urgency, town, short description). Do not ask questions first
   and do not build your own form: the Riory form contains every question Riory needs.
2. The user checks the form, accepts Riory's terms and presses "Request appointment". The form calls
   `riory_submit_booking` itself and shows a reference number.
3. Do not ask for a date or time: Riory contacts the customer to confirm the time.
4. For questions about services, service area or contact details, use `riory_info`.
5. Emergencies: the customer can always call +32 472 50 28 14 (24/7). Changing or cancelling a request
   is not possible in the chat; refer to afspraak@riory.be or the phone number.
