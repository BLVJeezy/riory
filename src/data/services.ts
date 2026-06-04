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
