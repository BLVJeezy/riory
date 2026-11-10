// Werkingsproces Riory — volledig overzicht van website tot boekhouding.
// Aanpassen: voeg een stap toe, verwijder er een of wijzig de tekst hieronder.
//
// - `stappen`  = opeenvolgende stappen (onder elkaar)
// - `takken`   = keuze / vertakking: elke tak is een alternatief pad (naast elkaar)
// - `sys`      = waar het gebeurt: "site" (riory.be), "app" (werkbonnen-app), "extern", "mens"
// - `wie`      = wie de stap uitvoert (klant, admin, ploeg, systeem …)
// - `wanneer`  = timing / frequentie
// - `details`  = extra regels, prijzen, uitzonderingen (opsomming)
// - `teller`   = sleutel van de journey-teller (aantal klanten dat hier passeerde)
// - `status`   = "actief" (standaard), "deels" (werkt maar nog niet volledig), "open" (nog te doen / idee)

export type Systeem = "site" | "app" | "extern" | "mens";
export type Status = "actief" | "deels" | "open";

export type Stap = {
  titel: string;
  uitleg?: string;
  sys?: Systeem;
  wie?: string;
  wanneer?: string;
  details?: string[];
  status?: Status;
  /** Sleutel voor de customer-journey-teller (zie src/lib/journey.ts). */
  teller?: string;
  stappen?: Stap[];
  takken?: { label: string; teller?: string; stappen: Stap[] }[];
};

export type Fase = {
  id: string;
  nr: number;
  titel: string;
  doel: string;
  resultaat?: string;
  stappen: Stap[];
};

export const PROCES_VERSIE = "10 november 2026";

export const fases: Fase[] = [
  // ─────────────────────────────────────────── 1
  {
    id: "vinden",
    nr: 1,
    titel: "Klant vindt Riory",
    doel: "Elke manier waarop een klant bij ons binnenkomt.",
    resultaat: "Klant staat op de website, belt, of opent het formulier in een AI-chat.",
    stappen: [
      {
        titel: "Klant heeft een probleem",
        uitleg: "Verstopping, geurhinder, wateroverlast, septische put vol, dakgoot vol …",
        wie: "Klant",
        sys: "mens",
      },
      {
        titel: "Via welk kanaal?",
        takken: [
          {
            label: "Google zoeken (SEO)", teller: "kanaal:google",
            stappen: [
              {
                titel: "Dienstpagina's", teller: "landing:dienst",
                uitleg: "/diensten/… per dienst",
                sys: "site",
                details: [
                  "Symptoomgerichte pagina's (bv. /diensten/wc-verstopt) met FAQ en reviews.",
                  "AggregateRating-schema zodat sterren in Google kunnen verschijnen.",
                  "Interne links naar regio's en verwante diensten.",
                ],
              },
              {
                titel: "Regiopagina's", teller: "landing:regio",
                uitleg: "/regio/… per gemeente",
                sys: "site",
                details: [
                  "Tongeren, Bilzen, Riemst, Genk, Hasselt, Diepenbeek, Maastricht …",
                  "Lokale foto's (geotagged) en lokale referenties.",
                  "Bilzen en Tongeren scoren sterk (#1–2); Genk en Hasselt nog zwak.",
                ],
              },
              { titel: "Artikels & veelvoorkomende problemen", teller: "landing:artikel", uitleg: "Informatieve blogposts die naar een dienst leiden", sys: "site" },
              { titel: "Referentiepagina's", teller: "landing:referentie", uitleg: "/referenties/… uitgevoerde projecten", sys: "site" },
            ],
          },
          {
            label: "Google Business Profiel",
            stappen: [
              { titel: "Profiel Bilzen / Tongeren", uitleg: "Reviews, foto's, bellen, route of website", sys: "extern", wie: "Solyn beheert" },
              { titel: "Profielen Genk en Hasselt", uitleg: "Nog aan te maken (nov. 2026)", sys: "extern", status: "open" },
            ],
          },
          {
            label: "AI-chat", teller: "kanaal:ai",
            stappen: [
              {
                titel: "ChatGPT / Claude / Copilot",
                uitleg: "Riory-app toont het afspraakformulier in de chat",
                sys: "site",
                status: "deels",
                details: [
                  "Endpoint www.riory.be/api/mcp (altijd de www-versie).",
                  "Werkt enkel als de Riory-app gekoppeld of goedgekeurd is in de chat-app.",
                  "Niet gekoppeld? Dan verzint de AI soms een eigen formulier dat nergens binnenkomt.",
                ],
              },
            ],
          },
          {
            label: "Andere kanalen", teller: "kanaal:andere",
            stappen: [
              {
                titel: "Offline & social",
                sys: "extern",
                details: [
                  "Facebook, Instagram, TikTok",
                  "Mond-aan-mondreclame",
                  "Doorverwezen door een installateur",
                  "Reclameborden en bestickerde voertuigen",
                  "Syndici die voor meerdere VME's bestellen",
                ],
              },
            ],
          },
        ],
      },
      {
        titel: "Bezoek wordt getagd", teller: "bezoekers",
        uitleg: "Bron van het eerste bezoek wordt onthouden",
        sys: "site",
        wie: "Systeem",
        details: [
          "Bewaart gclid, utm_source/medium/campaign/content/term en de landingspagina.",
          "Eerste bron wordt niet overschreven door latere bezoeken.",
          "Klikken op 'Bel nu' en CTA's worden apart geteld (Vercel Analytics + GA).",
        ],
      },
      {
        titel: "Wat doet de bezoeker op de site?",
        sys: "site",
        takken: [
          {
            label: "Bellen", teller: "site:bellen",
            stappen: [
              {
                titel: "Sticky belbalk / spoedbanner",
                uitleg: "Direct telefonisch contact",
                details: ["Telefoontje wordt geteld als 'Telefoon-lead' in het admin-dashboard.", "Bij vakantie verschijnt een vakantiemelding bovenaan."],
              },
              { titel: "Admin maakt taak aan", uitleg: "Zie fase 2 → Telefoon", sys: "app", wie: "Admin" },
            ],
          },
          {
            label: "Prijscalculator", teller: "site:calculator",
            stappen: [
              { titel: "Akkoord: prijzen indicatief", teller: "calc:akkoord", uitleg: "Niet bindend, exacte prijs ter plaatse", wie: "Klant" },
              { titel: "Werkadres invullen", teller: "calc:adres", uitleg: "Afstand + reiskosten berekend (max. 30 min rijden)", details: ["Reiskosten: heen en terug × € 1,45/km."] },
              {
                titel: "Dienst kiezen → richtprijs (excl. btw)", teller: "calc:prijs",
                details: [
                  "Interventie standaard € 165 (1e uur) · met camera € 275",
                  "Camera-inspectie € 275",
                  "Pompwerken € 165 · liftput onder water € 615 (€ 450 toeslag)",
                  "Dakgoot per meter: € 8,50 (verd. 1) / € 9,50 (verd. 2) / € 11 (verd. 3), min. 10 m",
                  "Septische put ledigen € 225",
                  "Regenput: 5.000 L € 329,45 · 7.500 L € 349,77 · 10.000 L € 369,45 · 15.000 L € 406,29 · 20.000 L+ op aanvraag",
                ],
              },
              { titel: "Door naar formulier", teller: "calc:door", uitleg: "Gegevens worden meegenomen", details: ["Afhakers na de calculator zichtbaar in admin.", "Calculator kan aan/uit gezet worden (instelling)."] },
            ],
          },
          {
            label: "Formulier", teller: "site:formulier",
            stappen: [{ titel: "Afspraak- of offerteformulier", uitleg: "Zie fase 2" }],
          },
          {
            label: "Solliciteren",
            stappen: [{ titel: "riory.be/sollicitatie", uitleg: "Zie fase 12", sys: "site" }],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 2
  {
    id: "aanvraag",
    nr: 2,
    titel: "Aanvraag indienen",
    doel: "De klant vertelt wat er moet gebeuren, waar en voor wie.",
    resultaat: "Volledige aanvraag met dienst, urgentie, klanttype, adressen en omschrijving.",
    stappen: [
      {
        titel: "Welk formulier?",
        takken: [
          {
            label: "Afspraakformulier (7 stappen)", teller: "form:afspraak",
            stappen: [
              {
                titel: "1. Dienst kiezen", teller: "form:dienst",
                sys: "site",
                wie: "Klant",
                details: [
                  "Ontstopping",
                  "Septische put ledigen",
                  "Camera-inspectie riool",
                  "Plaatsbepaling afvoeren",
                  "Geurhinder / rioolvliegjes",
                  "Periodieke reiniging van afvoeren",
                  "Wateroverlast / pompwerken",
                  "Reinigen van regenput",
                  "Dakgootreiniging",
                  "Herstellingswerken aan afvoeren",
                ],
              },
              { titel: "2. Voorwaarden aanvaarden", uitleg: "Verplicht vinkje, nodig voor latere herinneringskosten", sys: "site", wie: "Klant" },
              {
                titel: "3. Urgentie / type aanvraag",
                sys: "site",
                takken: [
                  { label: "Meeste diensten", teller: "urgent:overig", stappen: [{ titel: "Dringend: ja / nee", teller: "urgent:ja", uitleg: "Ja → label Dringend in de app" }] },
                  {
                    label: "Dakgoot", teller: "urgent:dakgoot",
                    stappen: [{ titel: "Offerte of afspraak?", uitleg: "+ meters per verdieping (1, 2, 3)" }],
                  },
                  {
                    label: "Regenput", teller: "urgent:regenput",
                    stappen: [{ titel: "Offerte of afspraak?", uitleg: "+ inhoud (5.000 – 20.000 L of andere maat)" }],
                  },
                ],
              },
              {
                titel: "4. Klanttype",
                sys: "site",
                takken: [
                  {
                    label: "Particulier", teller: "klant:particulier",
                    stappen: [
                      {
                        titel: "Woning ouder dan 10 jaar?", teller: "woning:oud",
                        details: ["Ja → 6% btw (Belgische woning)", "Nee → 21% btw", "Nederlandse particulier → altijd 21%"],
                      },
                    ],
                  },
                  {
                    label: "Bedrijf", teller: "klant:bedrijf",
                    stappen: [{ titel: "Btw-nummer + bedrijfsnaam", details: ["BE/NL-btw-nummer → 0% btw verlegd", "Naam en adres later automatisch via VIES"] }],
                  },
                  { label: "Vrij beroep", teller: "klant:vrij_beroep", stappen: [{ titel: "Altijd 21% btw", uitleg: "Geen verlegging" }] },
                  {
                    label: "Syndicus", teller: "klant:syndicus",
                    stappen: [
                      {
                        titel: "VME-gegevens",
                        details: ["Naam VME + KBO-nummer", "Adres VME = facturatieadres", "Woning ouder dan 10 jaar?", "Syndicus is contact, VME is klant"],
                      },
                    ],
                  },
                ],
              },
              {
                titel: "5. Gegevens",
                sys: "site",
                wie: "Klant",
                details: [
                  "Naam, telefoon, e-mail",
                  "Werfadres (straat, nr., postcode, plaats)",
                  "Is het werfadres ook het facturatieadres? Zo nee: apart facturatieadres + facturatiemail",
                ],
              },
              { titel: "6. Omschrijving probleem", uitleg: "Vrije tekst: wat, waar, sinds wanneer", sys: "site", wie: "Klant" },
              {
                titel: "7. Hoe heeft u ons gevonden?",
                sys: "site",
                details: ["Google, Facebook, Instagram, TikTok, ChatGPT, mond-aan-mond, installateur, reclame, andere", "Voedt de grafiek 'Hoe vinden klanten je?' in admin"],
              },
              { titel: "Versturen", uitleg: "Resultaatscherm: gelukt of opnieuw proberen", sys: "site", details: ["Bij een fout kan de klant opnieuw proberen; er gaat niets verloren."] },
            ],
          },
          {
            label: "Offerteformulier", teller: "form:offerte",
            stappen: [
              { titel: "Korte offerteaanvraag", uitleg: "Naam, telefoon, e-mail, adres, omschrijving", sys: "site", wie: "Klant" },
              { titel: "Bewaard in quote_requests", sys: "site" },
            ],
          },
          {
            label: "AI-chat boeking", teller: "form:ai",
            stappen: [
              {
                titel: "Formulier in de chat",
                uitleg: "Vooraf ingevuld met wat de klant al vertelde",
                sys: "site",
                status: "deels",
                details: ["Nederlands, Frans en Engels", "Pas versturen na expliciete bevestiging + akkoord voorwaarden", "Herkenbaar aan bron 'ai_chat' / 'chatgpt' / 'claude'"],
              },
            ],
          },
          {
            label: "Telefoon / mail / WhatsApp", teller: "app:bron:manueel",
            stappen: [
              { titel: "Admin noteert", wie: "Admin", sys: "mens" },
              {
                titel: "Nieuwe taak in Kalender",
                uitleg: "Klant kiezen of aanmaken, omschrijving, adres, contactpersoon",
                sys: "app",
                wie: "Admin",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 3
  {
    id: "verwerking",
    nr: 3,
    titel: "Automatische verwerking",
    doel: "Wat er automatisch gebeurt meteen na het versturen.",
    resultaat: "Aanvraag staat veilig in de database, Riory en de klant zijn verwittigd, Simpla is bijgewerkt.",
    stappen: [
      { titel: "1. Lead-pijplijn", uitleg: "Eerst opgeslagen zodat niets verloren gaat", sys: "site", wie: "Systeem", wanneer: "Direct" },
      { titel: "2. Database", teller: "verwerking:aanvragen", uitleg: "Rij in appointments (of quote_requests)", sys: "site", wie: "Systeem", wanneer: "Direct" },
      {
        titel: "3. Tegelijk verzonden",
        wanneer: "Binnen enkele seconden",
        takken: [
          {
            label: "Riory", teller: "verwerking:afspraken",
            stappen: [{ titel: "Melding naar afspraak@riory.be", uitleg: "Alle formuliervelden in één mail", sys: "site", details: ["Deze mailbox is de bron voor de werkbonnen-app (fase 4)."] }],
          },
          {
            label: "Klant", teller: "verwerking:afspraken",
            stappen: [
              {
                titel: "Bevestigingsmail",
                uitleg: "Samenvatting van de aanvraag",
                sys: "site",
                details: ["Naar het facturatie-e-mailadres", "Uitgeschreven / gebounced adressen worden overgeslagen (suppressielijst)"],
              },
            ],
          },
          {
            label: "Simpla CRM", teller: "verwerking:afspraken",
            stappen: [
              {
                titel: "Doorsturen naar Simpla",
                sys: "extern",
                details: [
                  "Mislukt? → wachtrij met nieuwe pogingen na 1, 2, 5, 10, 20, 40, 60, 120, 240 min",
                  "Na 10 pogingen naar de foutenwachtrij",
                  "Health-check stuurt een waarschuwingsmail als Simpla niet bereikbaar is",
                ],
              },
            ],
          },
          {
            label: "Admin-dashboard",
            stappen: [
              {
                titel: "riory.be/admin",
                sys: "site",
                details: [
                  "Hoe vinden klanten je? (per bron, CSV/PDF-export)",
                  "Telefoon-leads ('Bel nu')",
                  "Prijscalculator-conversie en afhakers",
                  "Verdeling per kanaal en top regio's",
                  "Lijst afspraken per periode",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 4
  {
    id: "instroom",
    nr: 4,
    titel: "Instroom in de werkbonnen-app",
    doel: "Elke aanvraag wordt automatisch een taak met de juiste klant.",
    resultaat: "Taak met status 'Nog in te plannen', gekoppeld aan de juiste klantfiche.",
    stappen: [
      {
        titel: "Mailbox afspraak@riory.be lezen", teller: "app:bron:mail",
        sys: "app",
        wie: "Systeem",
        wanneer: "Dagelijks 06:00 + elke 5 min zolang Kalender openstaat",
        details: ["Max. 15 nieuwe mails per keer", "Dubbele mails worden herkend en niet opnieuw ingelezen", "Koppeling verlopen? Knop 'Mailbox opnieuw koppelen'"],
      },
      {
        titel: "AI leest de mail",
        sys: "app",
        wie: "Systeem",
        details: [
          "Klant, telefoon, e-mail, btw-nummer, omschrijving",
          "Adres opgesplitst in straat, nr., postcode, plaats",
          "Apart werfadres aangevinkt als het verschilt",
          "Woorden als 'dringend' → label Dringend",
        ],
      },
      {
        titel: "Soort aanvraag?",
        sys: "app",
        takken: [
          {
            label: "Syndicus", teller: "app:syndicus",
            stappen: [
              { titel: "VME wordt de klant", uitleg: "Werfadres = facturatieadres" },
              { titel: "Syndicus als extra info", uitleg: "Naam, e-mails, telefoon op de fiche; btw-nummer syndicus nooit bij de VME" },
            ],
          },
          {
            label: "Particulier / bedrijf", teller: "app:gewoon",
            stappen: [{ titel: "Gewone klant", uitleg: "Btw-nummer → naam en adres via VIES (alleen lege velden)" }],
          },
          { label: "Vrij beroep", stappen: [{ titel: "Altijd 21%", uitleg: "Ook met btw-nummer" }] },
        ],
      },
      {
        titel: "Btw-tarief voorgesteld",
        sys: "app",
        details: ["BE/NL-btw-nummer → 0% verlegd", "Nederlandse particulier → 21%", "Belgische woning > 10 jaar → 6%", "Anders → 21%"],
      },
      {
        titel: "Klant gekoppeld", teller: "app:taken",
        sys: "app",
        takken: [
          { label: "Bestaat al", stappen: [{ titel: "Herkend op naam + volledig adres", uitleg: "Klantcode blijft behouden" }] },
          { label: "Nieuw", stappen: [{ titel: "Nieuwe klantfiche", uitleg: "Standaard ingeschreven op nieuwsbrief" }] },
        ],
      },
      { titel: "Status: Nog in te plannen", teller: "app:nog", uitleg: "Kaart bovenaan de Kalender, nog zonder ploeg", sys: "app" },
      { titel: "Mail naar 'Uitgevoerd'", uitleg: "In Outlook verplaatst zodat de inbox leeg blijft", sys: "app", wie: "Systeem" },
    ],
  },

  // ─────────────────────────────────────────── 5
  {
    id: "beslissen",
    nr: 5,
    titel: "Offerte, direct of contract?",
    doel: "Bepalen of er eerst een prijs of akkoord nodig is.",
    resultaat: "Taak klaar om in te plannen, of offerte bij de klant ter ondertekening.",
    stappen: [
      {
        titel: "Welk pad?",
        sys: "mens",
        wie: "Admin",
        takken: [
          {
            label: "Direct uitvoeren", teller: "pad:direct",
            stappen: [{ titel: "Naar inplannen", uitleg: "Standaard voor dringende interventies en kleine werken (fase 6)" }],
          },
          {
            label: "Eerst offerte", teller: "pad:offerte",
            stappen: [
              { titel: "Taak → offerte", uitleg: "Knop in de Kalender; nummer OFF-…", sys: "app", wie: "Admin", details: ["Klant, adres, werfadres en ploeg gaan mee", "Taak verdwijnt uit de planning tot akkoord"] },
              {
                titel: "Offerte opmaken",
                sys: "app",
                wie: "Admin",
                details: [
                  "Producten uit de productlijst (foto's gaan automatisch mee)",
                  "Titels groeperen lijnen",
                  "Optionele regels die de klant zelf aan/uit vinkt",
                  "Kilometers automatisch (heen en terug)",
                  "Voorwaarden incl. 'onder voorbehoud van ondergrond'",
                ],
              },
              { titel: "Voorbeeld bekijken", sys: "app", wie: "Admin" },
              { titel: "Verzenden via info@riory.be", teller: "offerte:verzonden", uitleg: "Mail met publieke tekenlink", sys: "app", details: ["Je ziet wanneer mail en link geopend werden (geopend ≠ gelezen)"] },
              { titel: "Klant kiest opties en tekent online", sys: "app", wie: "Klant" },
              {
                titel: "Klant tekent?",
                takken: [
                  {
                    label: "Ja", teller: "offerte:getekend",
                    stappen: [
                      { titel: "Precies één taak terug", uitleg: "Label 'Offerte goedgekeurd'", sys: "app", wie: "Systeem" },
                      { titel: "Enkel gekozen opties uitvoeren", uitleg: "Taak toont UIT TE VOEREN / NIET GEKOZEN — NIET UITVOEREN", sys: "app" },
                    ],
                  },
                  {
                    label: "Nog niet", teller: "offerte:open",
                    stappen: [
                      { titel: "Herinnering dag 7", teller: "offerte:herinnering1", sys: "app", wie: "Systeem" },
                      { titel: "Herinnering dag 10", teller: "offerte:herinnering2", sys: "app", wie: "Systeem" },
                      { titel: "Daarna bellen", sys: "mens", wie: "Admin" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: "Contract (periodiek)", teller: "pad:contract",
            stappen: [
              { titel: "Contract aanmaken", uitleg: "Klant, frequentie, lijnen", sys: "app", wie: "Admin" },
              { titel: "Bewust activeren", sys: "app", wie: "Admin" },
              { titel: "Bezoeken komen automatisch terug", sys: "app", wie: "Systeem" },
              {
                titel: "Soort bezoek?",
                takken: [
                  { label: "Gewoon", stappen: [{ titel: "Factuurlijn per bezoek", uitleg: "Wachtrij elke 5 min" }] },
                  { label: "Informatief", stappen: [{ titel: "Niet gefactureerd", uitleg: "Ook niet naar Simpla" }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 6
  {
    id: "plannen",
    nr: 6,
    titel: "Inplannen",
    doel: "Elke taak een dag, ploeg en activiteit geven.",
    resultaat: "Ploeg ziet de taak in de app op de juiste dag.",
    stappen: [
      { titel: "Kalender openen", uitleg: "Gisteren, vandaag en min. 7 dagen vooruit; zoeken, sorteren, per ploeg", sys: "app", wie: "Admin" },
      {
        titel: "Wie voert uit?",
        takken: [
          {
            label: "Eigen ploeg",
            stappen: [
              { titel: "Dag + ploeg kiezen", uitleg: "Snelkeuze op de kaart", sys: "app", wie: "Admin" },
              {
                titel: "Activiteit kiezen",
                uitleg: "Bepaalt het uurtarief",
                sys: "app",
                details: ["Arbeid: eerste uur volledig, daarna per begonnen kwartier", "Km heen en terug vanaf dichtstbijzijnde vestiging (standaard Natveld 47, 3740 Bilzen)"],
              },
              {
                titel: "Extra label?",
                takken: [
                  { label: "Dringend", teller: "label:dringend", stappen: [{ titel: "Rood label, bovenaan" }] },
                  { label: "Eerste klant", teller: "label:eerste", stappen: [{ titel: "Eerste afspraak 08:00–09:00" }] },
                  { label: "Garantie", teller: "label:garantie", stappen: [{ titel: "1e uur + km gratis", uitleg: "Materialen wel aangerekend" }] },
                  { label: "Contactpersoon", stappen: [{ titel: "Juiste persoon om te bellen", uitleg: "Bv. bij een VME" }] },
                ],
              },
            ],
          },
          {
            label: "Externe ploeg / onderaannemer",
            stappen: [
              { titel: "Taak toegewezen", uitleg: "Zonder prijzen of offertes", sys: "app", wie: "Admin" },
              { titel: "Ploeg stelt dag + tijdsloten voor", uitleg: "Bv. 08:00–12:00 en 13:00–16:00", sys: "app", wie: "Onderaannemer" },
              { titel: "Klant kiest en bevestigt via link", sys: "app", wie: "Klant" },
              { titel: "Bevestigingsmail met exacte uren", sys: "app", wie: "Systeem", details: ["Voorstellen en bevestiging zichtbaar in Kalender en taakdetail"] },
            ],
          },
        ],
      },
      {
        titel: "Ploeg ziet de taak", teller: "plannen:ingepland",
        uitleg: "Vandaag, morgen en nog in te plannen — enkel eigen taken",
        sys: "app",
        wie: "Ploeg",
        details: ["Prijzen en klantgegevens zichtbaar volgens rechten van de ploeg", "Lijst ververst elke 10 seconden"],
      },
    ],
  },

  // ─────────────────────────────────────────── 7
  {
    id: "uitvoeren",
    nr: 7,
    titel: "Uitvoering ter plaatse",
    doel: "De ploeg doet het werk en registreert tijd, materiaal en foto's.",
    resultaat: "Afgetekende of afgerekende werkbon, gemaild naar de klant.",
    stappen: [
      { titel: "Taak openen", uitleg: "Volledige omschrijving, adres, labels", sys: "app", wie: "Ploeg" },
      { titel: "Aankomst → Start", uitleg: "Tijd loopt; werkbonnummer wordt nu toegekend", sys: "app", wie: "Ploeg", details: ["Lopende taak krijgt een gekleurde rand", "Vergeten te starten? Uren handmatig invullen (als admin dit toelaat)"] },
      { titel: "Werk uitvoeren", sys: "mens", wie: "Ploeg" },
      { titel: "Materialen kiezen", uitleg: "Uit de ploegproducten", sys: "app", wie: "Ploeg", details: ["Welke producten een ploeg ziet, bepaalt de admin"] },
      { titel: "Foto's / filmpjes nemen", uitleg: "Komen als bijlage op de werkbon", sys: "app", wie: "Ploeg" },
      { titel: "Vertrek → Stop", sys: "app", wie: "Ploeg" },
      {
        titel: "Hoe afsluiten?", teller: "uitvoer:afgesloten",
        sys: "app",
        wie: "Ploeg + klant",
        takken: [
          { label: "Aftekenen", teller: "uitvoer:afgetekend", stappen: [{ titel: "Klant tekent op de gsm + naam", uitleg: "Factuur volgt later" }] },
          {
            label: "Afrekenen", teller: "uitvoer:afgerekend",
            stappen: [
              {
                titel: "Ter plaatse betalen",
                details: ["Cash, Bancontact of overschrijving", "Sluit de taak ook af, geen handtekening nodig", "Enkel zichtbaar als de admin het toelaat"],
              },
            ],
          },
        ],
      },
      {
        titel: "Werkbon naar klant", teller: "uitvoer:afgesloten",
        uitleg: "Automatisch gemaild als PDF",
        sys: "app",
        wie: "Systeem",
        details: ["Zonder prijzen, tenzij afgerekend (dan enkel bedrag, wijze en datum)", "Foto's en handtekening op de PDF", "Optioneel ook sms", "Lukt de mail niet? Werk blijft bewaard"],
      },
    ],
  },

  // ─────────────────────────────────────────── 8
  {
    id: "na-werkbon",
    nr: 8,
    titel: "Na de werkbon",
    doel: "Wat er met een afgewerkte werkbon gebeurt.",
    resultaat: "Werkbon klaar om te factureren, bewust uitgesloten of omgezet naar bestek.",
    stappen: [
      { titel: "Afgewerkte werkbonnen", uitleg: "Aparte pagina naast de actieve taken", sys: "app", wie: "Admin" },
      {
        titel: "Wat nu?",
        sys: "app",
        wie: "Admin",
        takken: [
          { label: "Factureren", teller: "na:factureren", stappen: [{ titel: "Naar 'Te factureren'", uitleg: "Fase 9" }] },
          { label: "Niet factureren", teller: "na:niet", stappen: [{ titel: "Apart lijstje", uitleg: "Bv. garantie of informatief; terugzetbaar" }] },
          {
            label: "Verzekering", teller: "na:verzekering",
            stappen: [
              { titel: "Bestek maken", uitleg: "Werkbon blijft bestaan" },
              { titel: "Foto's kiezen", uitleg: "Als bijlage vóór de voorwaarden" },
              { titel: "AI-tekstvoorstel verslag", uitleg: "Zonder prijzen; eerst nakijken" },
              { titel: "Verzenden", uitleg: "Zelfde nummering en tekenflow als offerte" },
            ],
          },
          {
            label: "Correctie",
            stappen: [
              {
                titel: "Werkbon aanpassen",
                details: ["Gegevens aanpassen", "Foute betaling verwijderen (status + handtekening blijven)", "Opnieuw mailen naar klant"],
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 9
  {
    id: "factuur",
    nr: 9,
    titel: "Facturatie & betaling",
    doel: "Van factuur tot geld op de rekening.",
    resultaat: "Factuur betaald en afgeletterd, of in de herinneringsreeks.",
    stappen: [
      {
        titel: "Werkbonnen selecteren → factureren", teller: "factuur:gemaakt",
        sys: "app",
        wie: "Admin",
        details: [
          "Eén factuur per klant en btw-tarief; elke werkbon als aparte groep",
          "Reeds afgerekende bonnen tonen 'reeds betaald', saldo onderaan",
          "Ook manuele factuur mogelijk (km en activiteit per lijn)",
        ],
      },
      {
        titel: "Factuur controleren",
        uitleg: "Aanpasbaar tot verzonden",
        sys: "app",
        wie: "Admin",
        details: [
          "Nummer zonder gaten (in één stap toegekend)",
          "Gestructureerde mededeling + betaal-QR-code",
          "Verplichte vermeldingen bij 6% en verlegging automatisch",
          "Titels met subtotaal; productprijzen per titel te verbergen",
        ],
      },
      {
        titel: "Verzenden",
        sys: "app",
        takken: [
          { label: "Belgisch btw-nummer", teller: "factuur:via:peppol", stappen: [{ titel: "Peppol (Peppyrus) + mail" }] },
          { label: "Geen btw-nummer", teller: "factuur:via:mail", stappen: [{ titel: "Mail vanuit boekhouding@riory.be", uitleg: "PDF + UBL, leesbevestiging gevraagd" }] },
          { label: "Per post", teller: "factuur:via:post", stappen: [{ titel: "Knop bpost" }] },
          { label: "Al betaald", stappen: [{ titel: "Gaat automatisch weg", uitleg: "Open facturen verstuur je zelf" }] },
        ],
      },
      {
        titel: "Mailadres gekozen",
        uitleg: "Facturatiemail werkbon → facturatiemail klant → algemeen adres",
        sys: "app",
        wie: "Systeem",
      },
      {
        titel: "Betaald?",
        takken: [
          {
            label: "Ja", teller: "factuur:betaald",
            stappen: [
              { titel: "Bankverrichtingen binnen", uitleg: "Ponto, CODA of CSV/Excel", sys: "app", wie: "Systeem" },
              {
                titel: "Afletteren",
                sys: "app",
                wie: "Admin",
                details: [
                  "Automatisch enkel bij een eenduidige match",
                  "Eén betaling over meerdere facturen verdelen",
                  "Deelbetaling → rest blijft open",
                  "Te veel → enkel met terugstorting",
                  "Onduidelijk → wachtrekening 499000",
                  "Europabank-kaart: bruto bedrag, commissie op 653000",
                ],
              },
            ],
          },
          {
            label: "Nee (vervallen)", teller: "factuur:vervallen",
            stappen: [
              { titel: "Rood in de facturenlijst", sys: "app" },
              { titel: "Herinnering 1 — kosteloos", teller: "factuur:herinnering1", uitleg: "Min. 14 kalenderdagen betaaltermijn", sys: "app", wie: "Systeem" },
              { titel: "Herinnering 2 — met forfaitaire vergoeding", teller: "factuur:herinnering2", uitleg: "Enkel als voorwaarden vooraf aanvaard; verschilt voor particulier en bedrijf", sys: "app", wie: "Systeem" },
              { titel: "Herinnering 3 / ingebrekestelling", teller: "factuur:herinnering3", uitleg: "Kosten stapelen niet", sys: "app", wie: "Systeem" },
              { titel: "Uitkomst onzeker? Handmatig nakijken", sys: "mens", wie: "Admin" },
            ],
          },
          {
            label: "Fout in factuur", teller: "factuur:creditnota",
            stappen: [
              { titel: "Creditnota", uitleg: "Zelfde nummering, altijd negatief", sys: "app", wie: "Admin" },
              { titel: "Verzenden en verrekenen", uitleg: "Daarna vergrendeld", sys: "app" },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 10
  {
    id: "aankoop",
    nr: 10,
    titel: "Aankopen & boekhouding",
    doel: "Kosten binnenhalen, controleren, betalen en doorgeven.",
    resultaat: "Elke aankoop geboekt en betaald; boekhouder heeft alle stukken.",
    stappen: [
      {
        titel: "Aankoopfactuur komt binnen",
        sys: "app",
        takken: [
          { label: "Peppol", stappen: [{ titel: "Automatisch elke 5 min", uitleg: "Heeft voorrang op mail" }] },
          { label: "Mail", stappen: [{ titel: "boekhouding@riory.be", uitleg: "Elk kwartier; enkel ontbrekende documenten" }] },
          { label: "Bonnetje", stappen: [{ titel: "Scannen met gsm", uitleg: "Camera of foto kiezen" }] },
          { label: "Upload", stappen: [{ titel: "PDF opladen" }] },
        ],
      },
      { titel: "Origineel privé bewaard", sys: "app", wie: "Systeem" },
      {
        titel: "AI leest uit",
        sys: "app",
        wie: "Systeem",
        details: ["Lijnen, btw, korting (één keer afgetrokken)", "IBAN + BIC (BIC afgeleid uit IBAN als die ontbreekt)", "Vervaldag en betaalkenmerk"],
      },
      {
        titel: "Dubbel?",
        sys: "app",
        takken: [
          { label: "Ja", stappen: [{ titel: "Gemarkeerd, verwijderbaar", uitleg: "Zelfde leverancier + nummer, of + datum + bedrag" }] },
          { label: "Nee", stappen: [{ titel: "Naar 'Te controleren'" }] },
        ],
      },
      {
        titel: "Controleren",
        uitleg: "Origineel naast het formulier",
        sys: "mens",
        wie: "Admin",
        details: [
          "Leverancier uit de lijst",
          "Btw (0/6/21%) en rekening per lijn; aankoop-btw → 411000",
          "Creditnota leverancier expliciet aanduiden",
          "App leert boekingssuggesties per leverancier",
        ],
      },
      {
        titel: "Betaalwijze?",
        takken: [
          {
            label: "Overschrijving",
            stappen: [
              { titel: "Selecteren → SEPA-bestand", uitleg: "Op vervaldag of zo snel mogelijk", sys: "app", wie: "Admin" },
              { titel: "Uploaden en bevestigen in de bankapp", uitleg: "App betaalt zelf nooit", sys: "mens", wie: "Admin" },
            ],
          },
          { label: "Kaart / domiciliëring", stappen: [{ titel: "Geen IBAN nodig", uitleg: "Afletteren via bank" }] },
        ],
      },
      { titel: "Bank afletteren", uitleg: "Zelfde regels als bij verkoop (fase 9)", sys: "app", wie: "Admin" },
      {
        titel: "Alles naar de boekhouder",
        sys: "app",
        wie: "Admin",
        wanneer: "Per periode (bv. kwartaal)",
        details: ["Begin- en einddatum kiezen; standaard enkel nog niet verzonden", "Waarschuwing bij onvolledige boekhouding", "Mail 1: UBL's · Mail 2: balans, tabellen, dagboeken", "Volledige balans ook in Excel"],
      },
      { titel: "OkiOki-gegevens ophalen", uitleg: "Wacht op een ondersteunde exportmethode", sys: "extern", status: "open" },
    ],
  },

  // ─────────────────────────────────────────── 11
  {
    id: "nazorg",
    nr: 11,
    titel: "Nazorg & marketing",
    doel: "Klanten terug laten komen en nieuwe klanten aantrekken.",
    resultaat: "Meer reviews, terugkerende klanten en betere vindbaarheid.",
    stappen: [
      {
        titel: "Na de opdracht",
        takken: [
          {
            label: "Reviews",
            stappen: [
              { titel: "Reviewfeed", uitleg: "Verzonden facturen en afgewerkte werkbonnen → reviewvraag", sys: "app", wie: "Systeem", details: ["Enkel id, e-mail en tijdstip worden gedeeld"] },
              { titel: "Google-reviews op de site", uitleg: "Automatisch opgehaald en vertaald (NL/FR/EN)", sys: "site" },
            ],
          },
          {
            label: "Nieuwsbrief",
            stappen: [
              { titel: "Nieuwsbrief opstellen", uitleg: "Optioneel AI-voorstel, eerst als concept", sys: "app", wie: "Admin / marketing" },
              { titel: "Naar alle ingeschreven klanten", uitleg: "Uitgeschreven adressen altijd uitgesloten; uitschrijflink in elke mail", sys: "app" },
            ],
          },
          {
            label: "Foto's & filmpjes",
            stappen: [
              {
                titel: "Per interventie",
                sys: "app",
                details: ["Downloaden per stuk, per interventie (ZIP) of eigen selectie", "Kijklink voor de klant (niet downloadbaar)", "Marketing ziet foto's zonder prijzen", "Bron voor social media en referentiepagina's"],
              },
            ],
          },
          {
            label: "SEO & rapportage",
            stappen: [
              {
                titel: "Maandrapport door Solyn",
                uitleg: "Rond de 1e van de maand",
                sys: "extern",
                details: ["Rankings per zoekwoord en gemeente (LeadSnap)", "Belangrijkste KPI: aantal geboekte afspraken", "Nieuwe regio- en dienstpagina's"],
              },
            ],
          },
          {
            label: "Periodiek onderhoud",
            stappen: [{ titel: "Klant omzetten naar contract", uitleg: "Fase 5 → Contract", sys: "mens", wie: "Admin" }],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────── 12
  {
    id: "intern",
    nr: 12,
    titel: "Intern & ondersteunend",
    doel: "Alles wat het bedrijf laat draaien achter de schermen.",
    stappen: [
      {
        titel: "Beheer",
        takken: [
          {
            label: "Ploegen",
            stappen: [
              { titel: "Ploeg aanmaken", uitleg: "Naam + kleur", sys: "app", wie: "Admin" },
              {
                titel: "Rechten kiezen",
                sys: "app",
                details: ["Prijzen zien", "Klantgegevens zien", "Afrekenen ter plaatse", "Afgetekende bonnen zien", "Manuele tijd invullen"],
              },
              { titel: "Uitnodigen via WhatsApp", uitleg: "Link 72 u geldig, één keer bruikbaar, nooit een wachtwoord", sys: "app" },
              { titel: "Ploeg kiest wachtwoord + zet app op beginscherm", sys: "app", wie: "Ploeg" },
            ],
          },
          {
            label: "Rollen",
            stappen: [
              {
                titel: "Wie ziet wat?",
                sys: "app",
                details: ["Beheerder: alles", "Technieker (ploeg): enkel eigen taken", "Marketing: klanten, nieuwsbrieven, foto's", "Nieuwe beheerders enkel door een bestaande beheerder"],
              },
            ],
          },
          {
            label: "Tikklok",
            stappen: [
              { titel: "Medewerkers klokken in/uit", uitleg: "Via /tikklok met PIN, toestel goedgekeurd door admin", sys: "app", wie: "Medewerker" },
              { titel: "Uren + loonberekening", sys: "app", wie: "Admin" },
              { titel: "Verhuis naar nieuwe tikklok", uitleg: "Data overgezet; wacht op laatste controles en goedkeuring", sys: "app", status: "deels" },
            ],
          },
          {
            label: "Producten & prijzen",
            stappen: [
              { titel: "Eén lijst", uitleg: "Voor werkbon, offerte en factuur", sys: "app", wie: "Admin" },
              { titel: "Zichtbaarheid", uitleg: "Alleen admin of ook ploegen (ploegproducten)", sys: "app" },
            ],
          },
          {
            label: "Klanten & syndici",
            stappen: [
              { titel: "Klantfiches", uitleg: "Contactpersonen, projecten, vestigingslabel (Maastricht = NL-regels)", sys: "app" },
              { titel: "Syndici", uitleg: "Kaart per syndicus met zijn VME's; in bulk toewijzen", sys: "app" },
            ],
          },
          {
            label: "Leveranciers",
            stappen: [{ titel: "Leveranciersfiches", uitleg: "Btw, IBAN, BIC; correcties op factuur worden bewaard", sys: "app" }],
          },
          {
            label: "Personeel",
            stappen: [
              { titel: "Sollicitatie via riory.be/sollicitatie", uitleg: "CV opladen", sys: "site", wie: "Kandidaat" },
              { titel: "Melding per mail", sys: "site", wie: "Systeem" },
            ],
          },
          {
            label: "Handleiding",
            stappen: [{ titel: "Handleiding in de werkbonnen-app", uitleg: "Stroomschema's voor beheer en ploegen, als PDF", sys: "app" }],
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Eenvoudige versie — voor wie snel wil begrijpen hoe Riory werkt.
// Korte zinnen, geen vaktermen. `teller` toont (indien beschikbaar) hoeveel klanten.
// ─────────────────────────────────────────────────────────────────────────────

export type EenvoudigeStap = {
  nr: number;
  titel: string;
  zin: string;
  wie: string;
  keuzes?: string[];
  teller?: string;
};

export const eenvoudig: EenvoudigeStap[] = [
  {
    nr: 1,
    titel: "De klant vindt ons",
    zin: "Via Google, een AI-chat, sociale media of iemand die ons aanraadt.",
    wie: "Klant",
    keuzes: ["Google", "AI-chat", "Mond-aan-mond / andere"],
    teller: "bezoekers",
  },
  {
    nr: 2,
    titel: "De klant vraagt hulp",
    zin: "Hij belt ons, of vult op de website een formulier in: welke dienst, hoe dringend en waar.",
    wie: "Klant",
    keuzes: ["Bellen", "Formulier op de website", "Prijs berekenen"],
    teller: "site:formulier",
  },
  {
    nr: 3,
    titel: "Wij krijgen de aanvraag",
    zin: "De aanvraag komt automatisch binnen per mail en de klant krijgt een bevestiging.",
    wie: "Automatisch",
    teller: "verwerking:aanvragen",
  },
  {
    nr: 4,
    titel: "Er wordt een taak gemaakt",
    zin: "De werkbonnen-app maakt van elke aanvraag een taak en zoekt de juiste klant erbij.",
    wie: "Automatisch",
    teller: "app:taken",
  },
  {
    nr: 5,
    titel: "Eerst een prijs, of meteen langskomen?",
    zin: "Bij grotere werken sturen we eerst een offerte. Tekent de klant, dan gaan we verder.",
    wie: "Kantoor",
    keuzes: ["Meteen inplannen", "Eerst offerte", "Vast contract"],
    teller: "pad:offerte",
  },
  {
    nr: 6,
    titel: "We plannen het in",
    zin: "De taak krijgt een dag en een ploeg. De ploeg ziet ze op de gsm.",
    wie: "Kantoor",
    teller: "plannen:ingepland",
  },
  {
    nr: 7,
    titel: "De ploeg doet het werk",
    zin: "Ter plaatse: tijd starten, werk doen, foto's nemen. De klant tekent of betaalt meteen.",
    wie: "Ploeg",
    keuzes: ["Klant tekent", "Klant betaalt ter plaatse"],
    teller: "uitvoer:afgesloten",
  },
  {
    nr: 8,
    titel: "Factuur en betaling",
    zin: "De klant krijgt de factuur. Betaalt hij niet op tijd, dan volgt een herinnering.",
    wie: "Kantoor",
    keuzes: ["Betaald", "Herinnering sturen"],
    teller: "factuur:betaald",
  },
];

export const EENVOUDIG_EINDE = "Klaar! De klant is geholpen en betaald. Daarna vragen we een review en houden we contact via de nieuwsbrief.";
