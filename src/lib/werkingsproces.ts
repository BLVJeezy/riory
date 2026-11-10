// Werkingsproces Riory — volledig overzicht van website tot boekhouding.
// Aanpassen: voeg een stap toe, verwijder er een of wijzig de tekst hieronder.
//
// - `stappen`  = opeenvolgende stappen (onder elkaar)
// - `takken`   = keuze / vertakking: elke tak is een alternatief pad (naast elkaar)
// - `sys`      = waar het gebeurt: "site" (riory.be), "app" (werkbonnen-app), "extern", "mens"
// - `status`   = "actief" (standaard), "deels" (werkt maar nog niet volledig), "open" (nog te doen / idee)

export type Systeem = "site" | "app" | "extern" | "mens";
export type Status = "actief" | "deels" | "open";

export type Stap = {
  titel: string;
  uitleg?: string;
  sys?: Systeem;
  status?: Status;
  stappen?: Stap[];
  takken?: { label: string; stappen: Stap[] }[];
};

export type Fase = {
  id: string;
  nr: number;
  titel: string;
  doel: string;
  stappen: Stap[];
};

export const PROCES_VERSIE = "10 november 2026";

export const fases: Fase[] = [
  {
    id: "vinden",
    nr: 1,
    titel: "Klant vindt Riory",
    doel: "Elke manier waarop een klant bij ons binnenkomt.",
    stappen: [
      {
        titel: "Via welk kanaal?",
        takken: [
          {
            label: "Google (SEO)",
            stappen: [
              { titel: "Dienstpagina's", uitleg: "/diensten/… (ontstopping, camera-inspectie, septische put …)", sys: "site" },
              { titel: "Regiopagina's", uitleg: "/regio/… per gemeente (Tongeren, Bilzen, Genk, Hasselt, Maastricht …)", sys: "site" },
              { titel: "Artikels & veelvoorkomende problemen", sys: "site" },
            ],
          },
          {
            label: "Google Business Profiel",
            stappen: [
              { titel: "Bilzen / Tongeren", uitleg: "Reviews, foto's, bellen of website", sys: "extern" },
              { titel: "Genk en Hasselt", uitleg: "Profielen nog aan te maken", sys: "extern", status: "open" },
            ],
          },
          {
            label: "AI-chat",
            stappen: [
              { titel: "ChatGPT / Claude / Copilot", uitleg: "Riory-app toont het afspraakformulier in de chat", sys: "site", status: "deels" },
            ],
          },
          {
            label: "Andere",
            stappen: [
              { titel: "Social media, mond-aan-mond, installateur, reclame op voertuigen", sys: "extern" },
            ],
          },
        ],
      },
      {
        titel: "Op de website",
        sys: "site",
        takken: [
          { label: "Bellen", stappen: [{ titel: "Sticky belbalk / spoedbanner", uitleg: "Telefoon → direct contact", sys: "site" }] },
          { label: "Prijscalculator", stappen: [{ titel: "Richtprijs berekenen", uitleg: "Dienst + adres → afstand en prijs, daarna door naar formulier", sys: "site" }] },
          { label: "Formulier", stappen: [{ titel: "Afspraak- of offerteformulier", uitleg: "Zie fase 2", sys: "site" }] },
        ],
      },
    ],
  },
  {
    id: "aanvraag",
    nr: 2,
    titel: "Aanvraag indienen",
    doel: "De klant vertelt wat er moet gebeuren.",
    stappen: [
      {
        titel: "Welk formulier?",
        takken: [
          {
            label: "Afspraakformulier (7 stappen)",
            stappen: [
              {
                titel: "1. Dienst kiezen",
                sys: "site",
                uitleg: "Ontstopping · Septische put ledigen · Camera-inspectie · Plaatsbepaling afvoeren · Geurhinder/rioolvliegjes · Periodieke reiniging · Wateroverlast/pompwerken · Regenput reinigen · Dakgootreiniging · Herstellingswerken",
              },
              { titel: "2. Voorwaarden aanvaarden", sys: "site" },
              {
                titel: "3. Urgentie",
                sys: "site",
                takken: [
                  { label: "Meeste diensten", stappen: [{ titel: "Dringend: ja / nee" }] },
                  { label: "Dakgoot / regenput", stappen: [{ titel: "Offerte of afspraak?", uitleg: "+ meters dakgoot of inhoud regenput" }] },
                ],
              },
              {
                titel: "4. Klanttype",
                sys: "site",
                takken: [
                  { label: "Particulier", stappen: [{ titel: "Woning ouder dan 10 jaar?", uitleg: "Bepaalt 6% of 21% btw" }] },
                  { label: "Bedrijf", stappen: [{ titel: "Btw-nummer", uitleg: "Btw verlegd" }] },
                  { label: "Vrij beroep", stappen: [{ titel: "Altijd 21%" }] },
                  { label: "Syndicus", stappen: [{ titel: "VME-gegevens + KBO", uitleg: "VME = klant, werfadres = facturatieadres" }] },
                ],
              },
              { titel: "5. Gegevens", uitleg: "Contact, werfadres, facturatieadres", sys: "site" },
              { titel: "6. Omschrijving probleem", sys: "site" },
              { titel: "7. Hoe gevonden?", uitleg: "Google, ChatGPT, installateur … → bronnen-grafiek in admin", sys: "site" },
            ],
          },
          {
            label: "Offerteformulier",
            stappen: [{ titel: "Korte offerteaanvraag", uitleg: "Naam, contact, omschrijving", sys: "site" }],
          },
          {
            label: "AI-chat boeking",
            stappen: [{ titel: "Zelfde formulier in de chat", uitleg: "Na bevestiging + akkoord voorwaarden", sys: "site", status: "deels" }],
          },
          {
            label: "Telefoon / mail",
            stappen: [{ titel: "Admin maakt zelf een taak", uitleg: "Knop 'Nieuwe taak' in Kalender", sys: "app" }],
          },
        ],
      },
    ],
  },
  {
    id: "verwerking",
    nr: 3,
    titel: "Automatische verwerking",
    doel: "Wat er gebeurt meteen na het versturen.",
    stappen: [
      { titel: "Lead bewaard", uitleg: "Lead-pijplijn + database (appointments / quote_requests)", sys: "site" },
      {
        titel: "Tegelijk",
        takken: [
          { label: "Riory", stappen: [{ titel: "Mail naar afspraak@riory.be", sys: "site" }] },
          { label: "Klant", stappen: [{ titel: "Bevestigingsmail", uitleg: "Samenvatting van de aanvraag", sys: "site" }] },
          { label: "Simpla CRM", stappen: [{ titel: "Doorsturen naar Simpla", uitleg: "Wachtrij + automatische check als het mislukt", sys: "extern" }] },
          { label: "Admin-dashboard", stappen: [{ titel: "Telt mee in bronnen & afspraken", uitleg: "riory.be/admin", sys: "site" }] },
        ],
      },
    ],
  },
  {
    id: "instroom",
    nr: 4,
    titel: "Instroom in de werkbonnen-app",
    doel: "Elke aanvraag wordt automatisch een taak.",
    stappen: [
      { titel: "Mailbox afspraak@riory.be gelezen", uitleg: "Elke dag 06:00 + elke 5 min zolang de Kalender openstaat", sys: "app" },
      { titel: "AI leest de mail", uitleg: "Klant, adres, telefoon, e-mail, btw, omschrijving, dringend", sys: "app" },
      {
        titel: "Soort aanvraag?",
        sys: "app",
        takken: [
          { label: "Syndicus", stappen: [{ titel: "VME wordt klant", uitleg: "Syndicus als extra info op de fiche" }] },
          { label: "Particulier / bedrijf", stappen: [{ titel: "Gewone klant", uitleg: "Btw-nummer → naam en adres via VIES" }] },
        ],
      },
      { titel: "Klant gekoppeld", uitleg: "Bestaande klant (naam + adres) of nieuwe fiche", sys: "app" },
      { titel: "Nog in te plannen", uitleg: "Mail verhuist in Outlook naar 'Uitgevoerd'", sys: "app" },
    ],
  },
  {
    id: "beslissen",
    nr: 5,
    titel: "Offerte of direct uitvoeren?",
    doel: "Bepalen of er eerst een prijs nodig is.",
    stappen: [
      {
        titel: "Welk pad?",
        sys: "mens",
        takken: [
          {
            label: "Direct uitvoeren",
            stappen: [{ titel: "Naar inplannen", uitleg: "Fase 6" }],
          },
          {
            label: "Eerst offerte",
            stappen: [
              { titel: "Taak → offerte (OFF-…)", uitleg: "Taak verdwijnt uit de kalender tot akkoord", sys: "app" },
              { titel: "Lijnen, opties, foto's, km", sys: "app" },
              { titel: "Verzonden via info@riory.be met tekenlink", sys: "app" },
              {
                titel: "Klant tekent?",
                takken: [
                  { label: "Ja", stappen: [{ titel: "Taak komt terug", uitleg: "Label 'Offerte goedgekeurd', enkel gekozen opties uitvoeren", sys: "app" }] },
                  { label: "Nee", stappen: [{ titel: "Herinnering dag 7 en 10", sys: "app" }, { titel: "Daarna bellen", sys: "mens" }] },
                ],
              },
            ],
          },
          {
            label: "Contract (periodiek)",
            stappen: [
              { titel: "Contract aanmaken + activeren", uitleg: "Klant, frequentie, lijnen", sys: "app" },
              { titel: "Bezoeken komen automatisch terug", sys: "app" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plannen",
    nr: 6,
    titel: "Inplannen",
    doel: "Elke taak krijgt een dag, ploeg en activiteit.",
    stappen: [
      {
        titel: "Wie voert uit?",
        takken: [
          {
            label: "Eigen ploeg",
            stappen: [
              { titel: "Dag + ploeg + activiteit kiezen", uitleg: "Activiteit bepaalt het uurtarief", sys: "app" },
              {
                titel: "Extra label?",
                takken: [
                  { label: "Dringend", stappen: [{ titel: "Rood label" }] },
                  { label: "Eerste klant", stappen: [{ titel: "08:00–09:00" }] },
                  { label: "Garantie", stappen: [{ titel: "Eerste uur + km gratis" }] },
                ],
              },
            ],
          },
          {
            label: "Externe ploeg / onderaannemer",
            stappen: [
              { titel: "Ploeg stelt tijdsloten voor", uitleg: "Zonder prijzen", sys: "app" },
              { titel: "Klant kiest en bevestigt via link", sys: "app" },
            ],
          },
        ],
      },
      { titel: "Ploeg ziet taak", uitleg: "Vandaag / morgen in de app op de gsm", sys: "app" },
    ],
  },
  {
    id: "uitvoeren",
    nr: 7,
    titel: "Uitvoering ter plaatse",
    doel: "De ploeg doet het werk en registreert alles.",
    stappen: [
      { titel: "Aankomst → Start", uitleg: "Tijd loopt, werkbonnummer wordt toegekend", sys: "app" },
      { titel: "Werk uitvoeren", sys: "mens" },
      { titel: "Materialen kiezen + foto's nemen", sys: "app" },
      { titel: "Vertrek → Stop", sys: "app" },
      {
        titel: "Hoe afsluiten?",
        sys: "app",
        takken: [
          { label: "Aftekenen", stappen: [{ titel: "Klant tekent + naam" }] },
          { label: "Afrekenen", stappen: [{ titel: "Cash, Bancontact of overschrijving", uitleg: "Enkel als admin dit toelaat" }] },
        ],
      },
      { titel: "Werkbon gemaild naar klant", uitleg: "PDF met foto's en handtekening (zonder prijzen)", sys: "app" },
    ],
  },
  {
    id: "na-werkbon",
    nr: 8,
    titel: "Na de werkbon",
    doel: "Wat er met een afgewerkte werkbon gebeurt.",
    stappen: [
      {
        titel: "Wat nu?",
        sys: "app",
        takken: [
          { label: "Factureren", stappen: [{ titel: "Eén factuur per klant en btw-tarief", uitleg: "Fase 9" }] },
          { label: "Niet factureren", stappen: [{ titel: "Apart lijstje", uitleg: "Terugzetbaar (bv. garantie, informatief)" }] },
          { label: "Verzekering", stappen: [{ titel: "Bestek + prijsloos verslag", uitleg: "Met foto's, AI-tekstvoorstel" }] },
          { label: "Correctie", stappen: [{ titel: "Gegevens aanpassen, betaling verwijderen of opnieuw mailen" }] },
        ],
      },
    ],
  },
  {
    id: "factuur",
    nr: 9,
    titel: "Facturatie & betaling",
    doel: "Van factuur tot geld op de rekening.",
    stappen: [
      { titel: "Factuur controleren", uitleg: "Aanpasbaar tot verzonden; nummers zonder gaten, QR + gestructureerde mededeling", sys: "app" },
      {
        titel: "Verzenden",
        sys: "app",
        takken: [
          { label: "Belgisch btw-nummer", stappen: [{ titel: "Peppol + mail", uitleg: "Via Peppyrus" }] },
          { label: "Particulier", stappen: [{ titel: "Mail vanuit boekhouding@riory.be", uitleg: "PDF + UBL" }] },
          { label: "Per post", stappen: [{ titel: "Knop bpost" }] },
        ],
      },
      {
        titel: "Betaald?",
        takken: [
          { label: "Ja", stappen: [{ titel: "Bank afletteren", uitleg: "Ponto / CODA → koppelen, deelbetalingen blijven open", sys: "app" }] },
          {
            label: "Nee (vervallen)",
            stappen: [
              { titel: "Herinnering 1 → 2 → ingebrekestelling", uitleg: "Kosten volgens voorwaarden", sys: "app" },
              { titel: "Onzeker? Handmatig nakijken", sys: "mens" },
            ],
          },
          { label: "Fout", stappen: [{ titel: "Creditnota", uitleg: "Zelfde nummering, negatief bedrag", sys: "app" }] },
        ],
      },
    ],
  },
  {
    id: "aankoop",
    nr: 10,
    titel: "Aankopen & boekhouding",
    doel: "Kosten binnenhalen, betalen en doorgeven aan de boekhouder.",
    stappen: [
      {
        titel: "Aankoopfactuur komt binnen",
        sys: "app",
        takken: [
          { label: "Peppol", stappen: [{ titel: "Elke 5 minuten" }] },
          { label: "Mail", stappen: [{ titel: "boekhouding@riory.be" }] },
          { label: "Bonnetje", stappen: [{ titel: "Scannen met gsm" }] },
          { label: "Upload", stappen: [{ titel: "PDF opladen" }] },
        ],
      },
      { titel: "AI leest uit + dubbelcheck", uitleg: "Lijnen, btw, korting, IBAN/BIC, vervaldag", sys: "app" },
      { titel: "Controleren", uitleg: "Origineel naast formulier, leverancier, btw per lijn", sys: "mens" },
      { titel: "Leveranciers betalen", uitleg: "SEPA-bestand → zelf bevestigen in de bankapp", sys: "mens" },
      { titel: "Alles naar de boekhouder", uitleg: "UBL's + balans, tabellen, dagboeken per periode", sys: "app" },
      { titel: "OkiOki-koppeling", uitleg: "Wacht op een exportmethode", sys: "extern", status: "open" },
    ],
  },
  {
    id: "nazorg",
    nr: 11,
    titel: "Nazorg & marketing",
    doel: "Klanten terug laten komen en nieuwe klanten aantrekken.",
    stappen: [
      {
        titel: "Na de opdracht",
        takken: [
          { label: "Reviews", stappen: [{ titel: "Reviewvraag na factuur / werkbon", uitleg: "Google-reviews tonen op de site", sys: "app" }] },
          { label: "Nieuwsbrief", stappen: [{ titel: "Alle ingeschreven klanten", uitleg: "AI-voorstel, altijd uitschrijflink", sys: "app" }] },
          { label: "Foto's & filmpjes", stappen: [{ titel: "Per interventie, kijklink voor klant", uitleg: "Ook voor social media", sys: "app" }] },
          { label: "SEO-rapport", stappen: [{ titel: "Maandelijks rapport door Solyn", uitleg: "Afspraken = belangrijkste KPI", sys: "extern" }] },
        ],
      },
    ],
  },
  {
    id: "intern",
    nr: 12,
    titel: "Intern & ondersteunend",
    doel: "Alles wat het bedrijf laat draaien achter de schermen.",
    stappen: [
      {
        titel: "Beheer",
        takken: [
          { label: "Ploegen", stappen: [{ titel: "Aanmaken, rechten, uitnodigen via WhatsApp", sys: "app" }] },
          { label: "Tikklok", stappen: [{ titel: "Uren medewerkers + loonberekening", uitleg: "Verhuis naar nieuwe tikklok loopt nog", sys: "app", status: "deels" }] },
          { label: "Producten & prijzen", stappen: [{ titel: "Eén lijst voor werkbon, offerte en factuur", sys: "app" }] },
          { label: "Klanten & syndici", stappen: [{ titel: "Fiches, VME's, contactpersonen", sys: "app" }] },
          { label: "Personeel", stappen: [{ titel: "Sollicitaties via riory.be/sollicitatie", uitleg: "CV + melding per mail", sys: "site" }] },
        ],
      },
    ],
  },
];
