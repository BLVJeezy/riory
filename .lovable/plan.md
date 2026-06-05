## Plan: vervang Maps embed door officiële GBP-embed

In `src/components/ContactSection.tsx` de iframe `src` vervangen door de door de gebruiker aangeleverde Google Business Profile embed-URL. Dit toont de geverifieerde Riory-pin (place_id) i.p.v. een generieke adres-zoekopdracht.

### Wijziging

**`src/components/ContactSection.tsx`** (iframe in de kaart-container):
- `src` → `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.34528078288!2d5.504949476935356!3d50.86180725765979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x44722976652a2973%3A0xae233c65280e27fd!2sRiory!5e0!3m2!1snl!2sbe!4v1780665229780!5m2!1snl!2sbe`
- `title` blijft `"Riory BV – Natveld 47, 3740 Bilzen-Hoeselt op Google Maps"`
- Overige attributen (`loading="lazy"`, `referrerPolicy`, `allowFullScreen`, dimensies) ongewijzigd.

### Validatie
`/` → ContactSection: kaart toont de Riory-vestiging met officiële GBP-pin en bedrijfsnaam.
