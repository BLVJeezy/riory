import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  image: string;
  longDescription: string;
  features: string[];
  metaTitle?: string;
  metaDescription?: string;
  h2Title: string;
  /** Dynamic FAQ rendered op DienstDetail + gebruikt voor FAQPage JSON-LD. */
  faq?: ServiceFAQ[];
  /** Optionele Schema.org serviceType label. Valt terug op title. */
  serviceType?: string;
}

const CTA_PARAGRAPH =
  "Bel ons nu op +32 472 50 28 14 of stuur een mail naar info@riory.be. Wij zijn 24/7 bereikbaar en staan binnen de 2 uur bij u ter plaatse in Bilzen, Hasselt, Genk, Tongeren en Hoeselt.";

export const allServices: Service[] = [
  {
    slug: "camera-inspectie",
    title: "Camera inspectie riool en afvoer in Limburg",
    shortTitle: "Camera inspectie riool",
    description:
      "Laat verborgen problemen exact lokaliseren met professioneel camera onderzoek van riool en afvoer in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg. Ideaal bij een verstopte afvoer, terugkerende rioollucht of aankoop van een woning.",
    image: serviceCamera,
    longDescription:
      "Met onze professionele camera-inspectie van riool en afvoer krijgt u een duidelijk beeld van de toestand van uw rioleringssysteem in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg. We brengen breuken, wortelingroei, verzakkingen en verstoppingen nauwkeurig in kaart. WC die steeds verstopt raakt? Douche die niet afloopt? Gootsteen die traag wegloopt? Een camera-inspectie legt de exacte oorzaak bloot, zonder breekwerk. Na de inspectie ontvangt u een gedetailleerd rapport met beelden en advies voor eventuele herstellingen.",
    features: [
      "Riool inspecteren met professionele camera",
      "Oorzaak van verstopte WC, douche of gootsteen opsporen",
      "Verstopte afvoer lokaliseren zonder breekwerk",
      "Rioollucht in huis? Camera legt de bron bloot",
      "Plaatsbepaling van ondergrondse afvoerleidingen",
      "Duidelijk rapport met beelden en advies",
      "Geschikt voor preventieve controles bij aankoop woning",
    ],
    metaTitle: "Camera Inspectie Riool Limburg | Zonder Breekwerk | Riory",
    metaDescription:
      "Camera-inspectie van uw riool — oorzaak bloot zonder breekwerk. ✓ Rapport met beelden ✓ 24/7 in Bilzen, Hasselt, Genk & Tongeren. Plan nu in!",
    h2Title: "Riool inspecteren en afvoerproblemen opsporen",
    serviceType: "Camera-inspectie riolering",
    faq: [
      {
        question: "Wat kost een camera-inspectie van het riool?",
        answer:
          "Riory werkt met vaste, transparante prijzen voor camera-inspecties in Limburg. U weet vooraf wat u betaalt — er zijn geen verborgen kosten. Vraag een afspraak aan voor een correcte prijsindicatie.",
      },
      {
        question: "Krijg ik een rapport na de inspectie?",
        answer:
          "Ja. Na elke camera-inspectie ontvangt u een gedetailleerd rapport met beelden, exacte locatie van het probleem en een helder advies voor eventuele herstellingen.",
      },
      {
        question: "Moet er gegraven worden voor een camera-inspectie?",
        answer:
          "Nee. We voeren de camera via een bestaand inspectieputje of de afvoer in. Breekwerk is in 99% van de gevallen niet nodig.",
      },
    ],
  },
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Ontstoppingsdienst Limburg — afvoer & gootsteen verstopt 24/7",
    shortTitle: "Ontstoppingen & Geurdetectie",
    description:
      "Afvoer verstopt in Limburg? Gootsteen verstopt of niet aan het ontstoppen? Riory is dé ontstoppingsdienst in Limburg — 24/7 in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel de provincie.",
    image: serviceOntstoppingen,
    longDescription:
      "Riory is dé ontstoppingsdienst in Limburg voor elke verstopping: gootsteen verstopt, afvoer verstopt, WC of douche die niet meer wegloopt, en hardnekkige rioolverstoppingen. Of u nu uw gootsteen wil ontstoppen in Hasselt, een verstopte afvoer wil laten verhelpen in Genk of een rioolontstopping nodig hebt in Bilzen, Hoeselt of Tongeren. Wij zijn 24/7 ter plaatse in heel Limburg. Met professionele hogedrukapparatuur ontstoppen wij gootstenen, badkamers, WC's en hoofdrioleringen snel en duurzaam. Ook bij stankoverlast sporen wij geurhinder en rioolvliegjes op aan de bron. Vaste prijzen, ervaren team en gegarandeerd resultaat: dat is Riory, uw ontstoppingsdienst in Limburg.",
    features: [
      "Ontstoppingsdienst Limburg — 24/7 bereikbaar in heel de provincie",
      "Gootsteen verstopt in Limburg? Snel en netjes vrijgemaakt",
      "Gootsteen ontstoppen in Limburg met professionele hogedrukreiniging",
      "Afvoer verstopt in Limburg — directe oplossing aan huis",
      "WC ontstoppen bij verstopping of overloop",
      "Douche of bad loopt niet af — wij ontstoppen ter plaatse",
      "Rioolverstopping verhelpen zonder breekwerk",
      "Rioollucht en geurhinder opsporen aan de bron",
      "Bestrijding van rioolvliegjes en stankoverlast",
      "Vaste prijzen, ervaren ontstoppers, gegarandeerd resultaat",
    ],
    metaTitle: "Ontstoppingsdienst Limburg 24/7 | Afvoer & Gootsteen Verstopt | Riory",
    metaDescription:
      "Afvoer verstopt of gootsteen verstopt in Limburg? Riory is dé ontstoppingsdienst in Limburg — 24/7 gootsteen ontstoppen in Bilzen, Hasselt, Genk & Tongeren. Bel nu!",
    h2Title: "Gootsteen ontstoppen in Limburg en verstopte afvoer verhelpen",
    serviceType: "Ontstoppingsdienst",
    faq: [
      {
        question: "Wat kost een ontstoppingsdienst in Limburg?",
        answer:
          "Riory werkt met vaste, transparante prijzen voor ontstoppingen in Limburg. U weet vooraf wat u betaalt, zonder verrassingen achteraf. Vraag een afspraak aan voor een correcte prijsindicatie.",
      },
      {
        question: "Mijn gootsteen is verstopt — hoe snel zijn jullie ter plaatse?",
        answer:
          "Bij een verstopte gootsteen of afvoer is Riory doorgaans binnen 2 uur ter plaatse in Bilzen, Hasselt, Genk, Tongeren, Hoeselt en omstreken. We zijn 24/7 bereikbaar voor noodgevallen.",
      },
      {
        question: "Hoe wordt een afvoer ontstopt?",
        answer:
          "Een verstopte afvoer wordt door Riory ontstopt met professionele hogedrukreiniging en, indien nodig, met camera-inspectie om de exacte oorzaak op te sporen — zonder breekwerk.",
      },
    ],
  },
  {
    slug: "septische-put-ledigen",
    title: "Septische put ledigen in Limburg",
    shortTitle: "Septische put ledigen",
    description:
      "Septische put vol? Riory ledigt, ruimt en reinigt uw septische put in Bilzen, Hoeselt, Hasselt, Genk en Tongeren — 24/7 met vaste prijzen en gespecialiseerde zuigwagens.",
    image: serviceLeidingen,
    longDescription:
      "Een volle septische put zorgt voor stankoverlast, een trage afvoer en in het ergste geval terugstromend rioolwater. Riory is uw specialist voor het ledigen van septische putten in Bilzen, Hasselt, Genk, Tongeren en Hoeselt. " +
      "Met gespecialiseerde zuigwagens leegt en reinigt ons team uw septische put snel, netjes en zonder beschadiging van uw tuin of oprit. We laten de omgeving altijd schoon achter en voeren het afval correct af conform de milieuwetgeving. " +
      CTA_PARAGRAPH,
    features: [
      "Septische put ledigen met professionele zuigwagens",
      "Beerput en regenput ruimen en onderhouden",
      "Grondige reiniging na het leegmaken",
      "Geen schade aan tuin, gazon of oprit",
      "Correcte afvoer conform de milieuwetgeving",
      "Vaste, transparante prijzen — geen verrassingen",
      "24/7 bereikbaar bij een volle septische put",
    ],
    metaTitle: "Septische Put Ledigen Limburg 24/7 | Vaste Prijs | Riory",
    metaDescription:
      "Septische put vol in Limburg? Riory ledigt, ruimt & reinigt 24/7 in Bilzen, Hasselt, Genk & Tongeren. ✓ Vaste prijs ✓ Geen schade aan tuin. Bel nu!",
    h2Title: "Septische put leegmaken en reinigen in Limburg",
    serviceType: "Septische put ledigen",
    faq: [
      {
        question: "Hoe vaak moet een septische put geledigd worden?",
        answer:
          "Gemiddeld om de 2 tot 5 jaar, afhankelijk van de grootte van de put en het aantal bewoners. Riory adviseert u tijdens de interventie en plant indien gewenst periodiek onderhoud.",
      },
      {
        question: "Hoe weet ik dat mijn septische put vol is?",
        answer:
          "Stankoverlast, een traag wegvloeiende afvoer, gorgelende geluiden in de leidingen of terugstromend water zijn typische signalen. Wacht niet en bel ons direct.",
      },
      {
        question: "Beschadigen jullie mijn tuin of oprit?",
        answer:
          "Nee. Onze zuigwagens werken met lange slangen waardoor we tot 40 meter ver kunnen komen zonder over uw gazon of oprit te rijden.",
      },
    ],
  },
  {
    slug: "rioolrenovatie",
    title: "Rioolrenovatie zonder breekwerken in Limburg",
    shortTitle: "Rioolrenovatie",
    description:
      "Rioolrenovatie en leidingherstel zonder breekwerken in Limburg. Wij herstellen breuken, wortelingroei en verzakkingen van binnenuit — vloer en tuin blijven intact.",
    image: serviceLeidingen,
    longDescription:
      "Breuken, wortelingroei, scheuren of verzakte rioolbuizen zorgen voor terugkerende verstoppingen, rioollucht en in het ergste geval ondergrondse waterschade. Riory renoveert uw rioleringen in Bilzen, Hasselt, Genk, Tongeren en Hoeselt zonder dat we vloeren of opritten moeten openbreken. " +
      "Met no-dig technieken zoals relining brengen wij van binnenuit een nieuwe, naadloze buis aan in uw bestaande riolering. Het resultaat: een volledig vernieuwd rioolsysteem zonder breekwerk, zonder dagenlange werf en met decennia gemoedsrust. " +
      CTA_PARAGRAPH,
    features: [
      "Rioolrenovatie zonder open te breken (relining)",
      "Herstellen van breuken, scheuren en wortelingroei",
      "Inspectie vooraf met camera voor exacte diagnose",
      "Geen schade aan vloer, terras of tuin",
      "Levensduur van 50+ jaar na renovatie",
      "Vaste prijsofferte na inspectie",
      "Actief in heel Limburg",
    ],
    metaTitle: "Rioolrenovatie Limburg | Zonder Breekwerken | Riory",
    metaDescription:
      "Rioolrenovatie zonder breekwerk in Limburg. ✓ Relining ✓ Geen schade aan vloer/tuin ✓ 50+ jaar levensduur. Bilzen, Hasselt, Genk & Tongeren. Bel nu!",
    h2Title: "Rioleringen herstellen zonder breekwerk",
    serviceType: "Rioolrenovatie",
    faq: [
      {
        question: "Wat is relining van een riolering?",
        answer:
          "Relining is een no-dig techniek waarbij een nieuwe kunststof binnenbuis in de oude rioolbuis wordt aangebracht. Het bestaande riool wordt zo van binnenuit vernieuwd, zonder breken of graven.",
      },
      {
        question: "Hoe lang duurt een rioolrenovatie?",
        answer:
          "De meeste renovaties zijn dezelfde dag klaar. Na uitharding is de leiding direct opnieuw bruikbaar. Geen dagenlange werf, geen overlast.",
      },
      {
        question: "Werkt rioolrenovatie ook bij ernstige verzakkingen?",
        answer:
          "Bij lichte tot matige beschadigingen is relining ideaal. Bij volledige instortingen voeren we eerst een camera-inspectie uit en adviseren we de beste aanpak met vaste prijsofferte.",
      },
    ],
  },
  {
    slug: "geurdetectie-riolering",
    title: "Geurdetectie riolering in Limburg",
    shortTitle: "Geurdetectie riolering",
    description:
      "Rioollucht in huis of op het terras? Riory spoort de exacte bron op met professionele rookdetectie — zonder breekwerk en met direct resultaat.",
    image: serviceOntstoppingen,
    longDescription:
      "Een hardnekkige rioolgeur in huis, badkamer of op het terras wijst meestal op een lek of breuk in de afvoerleidingen, een uitgedroogde sifon of een defecte ontluchting. Riory spoort de exacte oorzaak op in Bilzen, Hasselt, Genk, Tongeren en Hoeselt. " +
      "Met professionele rookdetectie en camera-inspectie lokaliseren wij het lek tot op de centimeter nauwkeurig — zonder breekwerk. Zodra de bron bekend is, ontvangt u een helder advies en een vaste prijsofferte voor de herstelling. " +
      CTA_PARAGRAPH,
    features: [
      "Opsporen van rioollucht via rookdetectie",
      "Camera-inspectie voor exacte lokalisatie",
      "Geen breekwerk nodig",
      "Direct rapport met beelden en advies",
      "Ook voor rioolvliegjes en stankoverlast",
      "Vaste prijsofferte voor herstelling",
      "24/7 bereikbaar in heel Limburg",
    ],
    metaTitle: "Geurdetectie Riolering Limburg | Rookdetectie | Riory",
    metaDescription:
      "Rioolgeur in huis? Riory spoort de bron op met rookdetectie en camera — zonder breekwerk. ✓ Bilzen, Hasselt, Genk, Tongeren. Bel 24/7!",
    h2Title: "Rioollucht opsporen zonder breekwerk",
    serviceType: "Geurdetectie riolering",
    faq: [
      {
        question: "Hoe werkt rookdetectie van een riolering?",
        answer:
          "We blazen een onschadelijke witte rook in de leiding. Op de plek waar de rook uit de grond, muur of vloer komt, zit het lek. Zo identificeren we de bron tot op de centimeter — zonder breekwerk.",
      },
      {
        question: "Is de rook gevaarlijk?",
        answer:
          "Nee. De rook is volledig onschadelijk voor mens, dier en plant. Hij laat ook geen vlekken of geur achter.",
      },
      {
        question: "Wat als ik rioolvliegjes heb?",
        answer:
          "Rioolvliegjes zijn vrijwel altijd een symptoom van een lek of opgedroogde sifon. Onze geurdetectie spoort de bron op zodat we het probleem aan de wortel aanpakken.",
      },
    ],
  },
  {
    slug: "noodontstopping-24-7",
    title: "Noodontstopping 24/7 in Limburg",
    shortTitle: "Noodontstopping 24/7",
    description:
      "Overstromende WC, ondergelopen kelder of plots verstopt riool? Riory is 24/7 bereikbaar — ook in het weekend en op feestdagen — en staat binnen 2 uur bij u.",
    image: serviceOntstoppingen,
    longDescription:
      "Een overstromende WC, een ondergelopen kelder of een plots verstopt hoofdriool — dit zijn situaties die niet kunnen wachten tot maandagochtend. Riory is daarom 24 uur op 24, 7 dagen op 7 bereikbaar voor noodontstoppingen in Bilzen, Hasselt, Genk, Tongeren en Hoeselt. Ook 's nachts, in het weekend en op feestdagen. " +
      "We streven ernaar om binnen de 2 uur bij u ter plaatse te zijn met professionele hogedrukapparatuur. U krijgt vooraf een vaste prijsindicatie zodat u nooit voor verrassingen komt te staan. Houd er rekening mee dat een urgentietarief geldt bij volle dagplanning (+50%) en op weekenddagen en feestdagen (+100%). " +
      CTA_PARAGRAPH,
    features: [
      "24/7 bereikbaar — ook nacht, weekend en feestdagen",
      "Binnen 2 uur ter plaatse in heel Limburg",
      "Professionele hogedrukapparatuur ter beschikking",
      "Vaste prijsindicatie vooraf, geen verrassingen",
      "Ervaren team voor elke noodsituatie",
      "Transparante toeslagen (+50% volle planning, +100% weekend/feestdag)",
      "Verzekerd en gecertificeerd",
    ],
    metaTitle: "Noodontstopping 24/7 Limburg | Binnen 2u Ter Plaatse | Riory",
    metaDescription:
      "Spoedontstopping in Limburg? Riory 24/7 — ook nacht, weekend & feestdag. ✓ Binnen 2u ter plaatse ✓ Vaste prijs. Bilzen, Hasselt, Genk. Bel direct!",
    h2Title: "Spoedinterventie dag en nacht",
    serviceType: "Noodontstopping 24/7",
    faq: [
      {
        question: "Hoe snel zijn jullie ter plaatse bij een noodgeval?",
        answer:
          "We streven naar een aankomsttijd van 2 uur of minder in heel Limburg. Bij telefonisch contact krijgt u een realistische ETA op basis van onze actuele planning.",
      },
      {
        question: "Geldt er een toeslag in het weekend of 's nachts?",
        answer:
          "Ja. Bij volle dagplanning op dezelfde dag geldt een urgentietarief van +50%. In het weekend en op feestdagen geldt +100%. Het basistarief en de toeslagen worden vooraf duidelijk gecommuniceerd.",
      },
      {
        question: "Kunnen jullie ook 's nachts komen?",
        answer:
          "Ja. Ons noodnummer +32 472 50 28 14 is 24/7 bereikbaar, ook tussen 22u en 6u.",
      },
    ],
  },
  {
    slug: "rioolreiniging-hogedruk",
    title: "Rioolreiniging met hogedruk in Limburg",
    shortTitle: "Rioolreiniging hogedruk",
    description:
      "Preventieve en curatieve rioolreiniging met professionele hogedrukapparatuur. Riory verwijdert vet, kalk en wortelingroei zonder uw leidingen te beschadigen.",
    image: serviceLeegpompen,
    longDescription:
      "Na verloop van tijd hopen vet, kalkaanslag, zeepresten en wortels zich op aan de binnenkant van uw rioolleidingen. Het gevolg: trager wegvloeiend water, hardnekkige verstoppingen en uiteindelijk volledige blokkades. Riory voert preventieve en curatieve hogedrukreiniging uit in Bilzen, Hasselt, Genk, Tongeren en Hoeselt. " +
      "Met professionele jetting-apparatuur spuiten wij de leidingen schoon onder hoge druk. Het resultaat: rioleringen die werken alsof ze nieuw zijn, zonder dat we de buizen openbreken of beschadigen. Periodieke reiniging voorkomt dure noodinterventies. " +
      CTA_PARAGRAPH,
    features: [
      "Hogedrukreiniging met professionele jetting-apparatuur",
      "Verwijdert vet, kalk, zeepresten en wortels",
      "Preventief én curatief inzetbaar",
      "Geen schade aan PVC, gres of beton",
      "Camera-inspectie achteraf op aanvraag",
      "Voorkomt dure noodinterventies",
      "Vaste prijzen voor heel Limburg",
    ],
    metaTitle: "Rioolreiniging Hogedruk Limburg | Jetting | Riory",
    metaDescription:
      "Hogedrukreiniging van uw riolering in Limburg. ✓ Verwijdert vet, kalk & wortels ✓ Geen schade ✓ Vaste prijs. Bilzen, Hasselt, Genk. Plan in!",
    h2Title: "Riolering reinigen met professionele jetting",
    serviceType: "Rioolreiniging hogedruk",
    faq: [
      {
        question: "Hoe vaak moet ik mijn riool laten reinigen?",
        answer:
          "Voor particulieren raden we elke 3 tot 5 jaar een preventieve hogedrukreiniging aan. Bij horeca, kapsalons of bedrijven met veel vet- of haarafvoer is jaarlijks aangewezen.",
      },
      {
        question: "Beschadigt hogedrukreiniging mijn leidingen?",
        answer:
          "Nee. Onze apparatuur en mondstukken worden afgesteld op het materiaal (PVC, gres, beton). Bij correcte uitvoering blijven uw leidingen volledig intact.",
      },
      {
        question: "Wordt het resultaat gecontroleerd?",
        answer:
          "Op aanvraag voeren we na de reiniging een camera-inspectie uit zodat u zelf het resultaat kunt zien.",
      },
    ],
  },
  {
    slug: "toilet-ontstoppen",
    title: "Verstopt toilet ontstoppen in Limburg",
    shortTitle: "Toilet ontstoppen",
    description:
      "Toilet verstopt of overstromend? Riory ontstopt uw WC snel en vakkundig in Bilzen, Hasselt, Genk, Tongeren en Hoeselt — zonder rommel en met vaste prijs.",
    image: serviceOntstoppingen,
    longDescription:
      "Een verstopt toilet dat gorgelt, traag wegspoelt of zelfs overstroomt is een acuut probleem. De oorzaak ligt meestal aan vochtige doekjes, te veel papier, kalkaanslag in de afvoer of een dieperliggend probleem in de hoofdriolering. Riory ontstopt uw WC snel en vakkundig in heel Limburg. " +
      "Wij werken met professionele ontstoppingsapparatuur die het toilet zelf én de aansluiting op de hoofdriolering volledig vrijmaakt. Geen rommel, geen brokstukken, geen breekwerk. Zo is uw toilet binnen het uur weer volledig bruikbaar. " +
      CTA_PARAGRAPH,
    features: [
      "Verstopt toilet snel ontstoppen",
      "Geschikt voor hangtoilet, staand toilet en duobloc",
      "Professionele apparatuur — geen schade aan keramiek",
      "Camera-inspectie bij terugkerende verstopping",
      "Vaste prijsindicatie vooraf",
      "Geen breekwerk nodig",
      "24/7 bereikbaar bij overstromend toilet",
    ],
    metaTitle: "Verstopt Toilet Ontstoppen Limburg 24/7 | Riory",
    metaDescription:
      "Toilet verstopt of overstromend in Limburg? Riory ontstopt uw WC 24/7. ✓ Vaste prijs ✓ Geen breekwerk. Bilzen, Hasselt, Genk, Tongeren. Bel nu!",
    h2Title: "WC ontstoppen snel en netjes",
    serviceType: "Toilet ontstoppen",
    faq: [
      {
        question: "Wat doe ik bij een overstromend toilet?",
        answer:
          "Sluit de watertoevoer naar het toilet af (kraantje achter of onder het toilet) en bel direct ons noodnummer +32 472 50 28 14. We zijn 24/7 bereikbaar.",
      },
      {
        question: "Mag ik zelf chemische ontstoppers gebruiken?",
        answer:
          "Wij raden dit af. Chemische producten kunnen sifons en leidingen aantasten en lossen de werkelijke oorzaak vaak niet op. Mechanische ontstopping is veiliger en duurzamer.",
      },
      {
        question: "Komt het probleem snel terug?",
        answer:
          "Als de verstopping terugkeert, voeren we een camera-inspectie uit om de exacte oorzaak op te sporen — bijvoorbeeld wortelingroei of een breuk in de afvoer.",
      },
    ],
  },
  {
    slug: "keukenafvoer-ontstoppen",
    title: "Verstopte keukenafvoer ontstoppen in Limburg",
    shortTitle: "Keukenafvoer ontstoppen",
    description:
      "Gootsteen die traag wegloopt door vetophoping? Riory verwijdert vet en zeepresten professioneel uit uw keukenafvoer — duurzaam en zonder beschadiging.",
    image: serviceOntstoppingen,
    longDescription:
      "Vet, voedselresten en zeep hopen zich na verloop van tijd op in de keukenafvoer. Het water loopt steeds trager weg tot de afvoer volledig verstopt is. Riory ontstopt uw keukenafvoer professioneel in Bilzen, Hasselt, Genk, Tongeren en Hoeselt. " +
      "Met hogedrukreiniging spoelen wij de vetlaag volledig uit de leidingen, ook in de moeilijk bereikbare bochten. Zo loopt uw gootsteen weer vlot weg én voorkomt u dat de verstopping snel terugkeert. Voor preventief onderhoud bieden we ook periodieke reiniging aan. " +
      CTA_PARAGRAPH,
    features: [
      "Vetophoping verwijderen uit keukenafvoer",
      "Professionele hogedrukreiniging",
      "Geen schade aan sifons of leidingen",
      "Ook voor afvoeren van vaatwasser en spoelbak",
      "Preventief periodiek onderhoud mogelijk",
      "Vaste prijs vooraf",
      "Snel ter plaatse in heel Limburg",
    ],
    metaTitle: "Verstopte Keukenafvoer Ontstoppen Limburg | Riory",
    metaDescription:
      "Keukenafvoer verstopt door vet in Limburg? Riory verwijdert vet & zeep professioneel. ✓ Vaste prijs ✓ Geen schade. Bilzen, Hasselt, Genk. Bel nu!",
    h2Title: "Vetverstopping in keukenafvoer verhelpen",
    serviceType: "Keukenafvoer ontstoppen",
    faq: [
      {
        question: "Waarom verstopt mijn keukenafvoer regelmatig?",
        answer:
          "Vet en olie stollen in de leiding en vormen samen met voedselresten een hardnekkige plak. Spoel daarom nooit vet door de gootsteen en laat de afvoer periodiek reinigen.",
      },
      {
        question: "Helpt heet water of soda?",
        answer:
          "Voor lichte verstoppingen tijdelijk wel, maar bij vetophoping is alleen professionele hogedrukreiniging echt duurzaam. Chemische producten lossen het kernprobleem niet op.",
      },
      {
        question: "Hoe vaak preventief reinigen?",
        answer:
          "Bij gemiddeld gezinsgebruik volstaat elke 2 tot 3 jaar. Voor horeca raden we jaarlijks aan om vetverstopping voor te zijn.",
      },
    ],
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Kelder leegpompen en regenput reinigen in Limburg",
    shortTitle: "Leegpompen & Reinigen",
    description:
      "Kelder of regenput ondergelopen? Riory pompt snel leeg, spoort de oorzaak op en maakt schoon. 24/7 beschikbaar in Limburg!",
    image: serviceLeegpompen,
    longDescription:
      "Bij wateroverlast staan wij snel ter plaatse in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg om kelders, putten en terreinen leeg te pompen. Kelder onder water na hevige regenval? Regenput die overloopt? Riool dat terugkomt via de afvoer? Wij pompen snel leeg en sporen de oorzaak op. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud voor uw volledige rioleringssysteem. Regelmatig onderhoud voorkomt dure herstellingen, verstopte afvoeren en rioollucht in huis.",
    features: [
      "Kelder leegpompen bij wateroverlast of overstroming",
      "Regenput reinigen en onderhouden",
      "Riool dat terugkomt? Oorzaak opsporen en verhelpen",
      "Periodieke reiniging van rioleringssystemen",
      "Dakgootreiniging en afvoerbuizen schoonmaken",
      "Verstopte afvoer voorkomen door preventief onderhoud",
      "Snel ter plaatse — 24/7 bereikbaar in Limburg",
    ],
    metaTitle: "Kelder Leegpompen Limburg 24/7 | Snel Ter Plaatse | Riory",
    metaDescription:
      "Kelder onder water of regenput overloopt? Riory pompt leeg & spoort oorzaak op. ✓ 24/7 ✓ Bilzen, Hasselt, Genk & Tongeren. Bel direct!",
    h2Title: "Kelder droogpompen en rioleringssysteem reinigen",
    serviceType: "Kelder leegpompen en reinigen",
    faq: [
      {
        question: "Hoe snel kan een kelder leeggepompt worden?",
        answer:
          "Bij wateroverlast zijn we vaak binnen het uur ter plaatse. De pomptijd zelf hangt af van de hoeveelheid water — meestal binnen 1 à 3 uur volledig droog.",
      },
      {
        question: "Sporen jullie ook de oorzaak van wateroverlast op?",
        answer:
          "Ja. Na het leegpompen voeren we indien gewenst een camera-inspectie of geurdetectie uit om de bron op te sporen, zodat het probleem niet terugkeert.",
      },
      {
        question: "Hoe vaak moet een regenput gereinigd worden?",
        answer:
          "Elke 5 tot 7 jaar volstaat voor een doorsnee regenput. Bij overloop, vuil water of bladval kan vroeger nodig zijn.",
      },
    ],
  },
];
