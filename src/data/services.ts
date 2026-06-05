import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";
import wcVerstoptAsset from "@/assets/wc-verstopt.jpg.asset.json";
import doucheputjeVerstoptAsset from "@/assets/doucheputje-verstopt.webp.asset.json";
import rioolVerstoptAsset from "@/assets/riool-verstopt-hero.jpg.asset.json";
import doucheputjeHarenAsset from "@/assets/doucheputje-haren.jpg.asset.json";
import gootsteenVerstoptAsset from "@/assets/gootsteen-verstopt.jpg.asset.json";
import keukenafvoerVerstoptAsset from "@/assets/keukenafvoer-etensresten.jpg.asset.json";

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
  // ===================== SPOED / SYMPTOOM-PAGINA'S =====================
  {
    slug: "wc-verstopt",
    title: "WC Verstopt in Limburg — Riory BV Lost Het Op",
    shortTitle: "WC Verstopt",
    description:
      "WC verstopt in Limburg? Riory BV is 24/7 bereikbaar en binnen 2 uur ter plaatse in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. Vaste prijzen, geen breekwerk.",
    image: wcVerstoptAsset.url,
    longDescription:
      "Een verstopt toilet herkent u meestal direct: de WC spoelt traag door, het water blijft hoog staan, u hoort gorgelende geluiden of er stijgt een vieze rioolgeur op. In het ergste geval loopt het toilet over en richt het waterschade aan. Een verstopte WC is bijna nooit een probleem dat vanzelf overgaat — wachten maakt de blokkage doorgaans erger. " +
      "Bij Riory BV pakken wij elk verstopt toilet professioneel aan met de juiste apparatuur: ontstopveer, hogedrukreiniging en — indien nodig — camera-inspectie om de exacte oorzaak te lokaliseren. Wij werken zonder onnodig breekwerk, met netjes afgedekte werkzone en vaste, transparante prijzen. Onze ontstoppers zijn 24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden en doorgaans binnen 2 uur bij u thuis. " +
      CTA_PARAGRAPH,
    features: [
      "WC verstopt — snel en netjes ontstopt zonder breekwerk",
      "Toilet loopt over of spoelt traag door? Wij lossen het op",
      "24/7 spoedontstopping in heel Limburg",
      "Camera-inspectie indien herhaaldelijke verstopping",
      "Vaste prijzen — geen verrassingen achteraf",
      "Binnen 2 uur ter plaatse in Hasselt, Genk, Tongeren, Bilzen",
    ],
    metaTitle: "WC Verstopt Limburg | 24/7 Loodgieter | Riory",
    metaDescription:
      "WC verstopt in Limburg? Riory BV lost het snel en vakkundig op. 24/7 bereikbaar, binnen 2u ter plaatse. ☎ +32 472 50 28 14",
    h2Title: "WC ontstoppen in Limburg — Riory's aanpak",
    serviceType: "WC ontstoppen",
    faq: [
      {
        question: "Wat kost een verstopt toilet laten ontstoppen?",
        answer:
          "Riory werkt met vaste, transparante tarieven voor het ontstoppen van een toilet in Limburg. U weet vooraf wat u betaalt — geen verborgen kosten. Vraag een afspraak aan voor een correcte prijsindicatie of bel +32 472 50 28 14.",
      },
      {
        question: "Hoe snel komt Riory ter plaatse in Limburg?",
        answer:
          "Bij een verstopt toilet zijn wij doorgaans binnen 1 à 2 uur ter plaatse in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. Wij zijn 24/7 bereikbaar, ook in het weekend en op feestdagen.",
      },
      {
        question: "Wat mag ik niet doorspoelen om verstopping te vermijden?",
        answer:
          "Spoel nooit vochtige doekjes, maandverband, tampons, condooms, wattenstaafjes, kattenbakvulling of vet door het toilet. Ook 'doorspoelbare' doekjes lossen niet op en zijn een hoofdoorzaak van verstoppingen.",
      },
    ],
  },
  {
    slug: "keukenafvoer-verstopt",
    title: "Keukenafvoer Verstopt in Limburg — Riory BV",
    shortTitle: "Keukenafvoer Verstopt",
    description:
      "Keukenafvoer verstopt in Limburg? Riory BV verwijdert vetophoping snel en grondig met hogedrukreiniging. 24/7 bereikbaar in heel Limburg.",
    image: keukenafvoerVerstoptAsset.url,
    longDescription:
      "Een verstopte keukenafvoer ontstaat bijna altijd door dezelfde oorzaak: vet, etensresten en zeep die zich na verloop van tijd ophopen tot een harde laag in de leiding. Typische signalen zijn een gootsteen die traag wegloopt, borrelende geluiden of een vieze geur uit de afvoer. Doe-het-zelf-middelen helpen meestal maar tijdelijk en kunnen leidingen aantasten. " +
      "Riory BV verwijdert vetverstoppingen vakkundig met professionele hogedrukreiniging — geen ontstopper-chemie, geen breekwerk. Wij behandelen elke keukenafvoer in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden, 24/7. Onze techniekers werken netjes, dekken uw keuken correct af en geven tips om herhaling te vermijden. " +
      CTA_PARAGRAPH,
    features: [
      "Vetophoping in keukenafvoer professioneel verwijderd",
      "Hogedrukreiniging — geen agressieve chemicaliën",
      "Gootsteen loopt weer vlot weg",
      "Vaste prijzen — vooraf duidelijk",
      "24/7 bereikbaar in heel Limburg",
      "Advies om nieuwe verstopping te vermijden",
    ],
    metaTitle: "Keukenafvoer Verstopt Limburg | 24/7 Loodgieter | Riory",
    metaDescription:
      "Keukenafvoer verstopt in Limburg? Riory BV verwijdert vetophoping snel en grondig. 24/7 bereikbaar. ☎ +32 472 50 28 14",
    h2Title: "Keukenafvoer ontstoppen in Limburg",
    serviceType: "Keukenafvoer ontstoppen",
    faq: [
      {
        question: "Waarom raakt mijn keukenafvoer steeds opnieuw verstopt?",
        answer:
          "De hoofdoorzaak is vet dat na het afkoelen stolt aan de wand van de leiding en daar etensresten vasthoudt. Een grondige hogedrukreiniging verwijdert de hele laag — een chemische ontstopper doet dat niet.",
      },
      {
        question: "Hoe snel is Riory ter plaatse voor een verstopte gootsteen?",
        answer:
          "Bij een verstopte keukenafvoer zijn wij doorgaans binnen 1 à 2 uur ter plaatse in Hasselt, Genk, Tongeren, Bilzen en Sint-Truiden. Wij zijn 24/7 bereikbaar.",
      },
      {
        question: "Kan vet- en etensresten echt mijn riool blokkeren?",
        answer:
          "Ja. Vet stolt in de leiding en vangt etensresten en zeep af. Na verloop van tijd ontstaat een harde 'vetprop' die alleen met professionele hogedruk los te krijgen is.",
      },
    ],
  },
  {
    slug: "doucheputje-verstopt",
    title: "Doucheputje Verstopt in Limburg — Riory BV",
    shortTitle: "Doucheputje Verstopt",
    description:
      "Doucheputje verstopt in Limburg? Riory verwijdert haar- en zeepresten snel. 24/7 bereikbaar in Hasselt, Genk, Tongeren en omstreken.",
    image: doucheputjeHarenAsset.url,
    longDescription:
      "Een verstopt doucheputje is vooral hinderlijk: het water blijft staan, er ontstaat een vieze laag en op den duur stinkt de badkamer naar riool. De oorzaak is bijna altijd dezelfde combinatie: haren, zeepresten, douchegel en huidvet die samen een prop vormen in de sifon of net daaronder. " +
      "Riory BV ontstopt elk doucheputje in Limburg vakkundig: wij demonteren de sifon waar nodig, verwijderen de prop volledig en spoelen de leiding professioneel door zodat het water weer snel wegloopt. Wij werken 24/7 in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden, met vaste prijzen en zonder onnodig breekwerk. " +
      CTA_PARAGRAPH,
    features: [
      "Haren en zeepresten volledig uit de sifon verwijderd",
      "Geen stankoverlast meer in de badkamer",
      "Zonder breekwerk — uw badkamer blijft intact",
      "Vaste prijzen — vooraf transparant",
      "24/7 bereikbaar in heel Limburg",
      "Advies om herhaling te vermijden",
    ],
    metaTitle: "Doucheputje Verstopt Limburg | Loodgieter 24/7 | Riory",
    metaDescription:
      "Doucheputje verstopt in Limburg? Riory verwijdert haren en zeeprest snel. 24/7 bereikbaar. ☎ +32 472 50 28 14",
    h2Title: "Doucheputje ontstoppen in Limburg",
    serviceType: "Doucheputje ontstoppen",
    faq: [
      {
        question: "Wat is de oorzaak van een verstopt doucheputje?",
        answer:
          "Bijna altijd een combinatie van haren, zeepresten en huidvet die samen een prop vormen in de sifon. Een haarzeefje kan veel verstoppingen voorkomen, maar bestaande props moet u professioneel laten verwijderen.",
      },
      {
        question: "Kan ik het zelf oplossen met chemische ontstopper?",
        answer:
          "Chemische middelen helpen maar tijdelijk en tasten op termijn uw leidingen en sifon aan. Een mechanische verwijdering door Riory is duurzamer en veiliger voor uw installatie.",
      },
      {
        question: "Hoe snel is Riory ter plaatse?",
        answer:
          "Doorgaans binnen 1 à 2 uur in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. 24/7 bereikbaar op +32 472 50 28 14.",
      },
    ],
  },
  {
    slug: "riool-verstopt",
    title: "Riool Verstopt in Limburg — Riory BV",
    shortTitle: "Riool Verstopt",
    description:
      "Riool verstopt in Limburg? Meerdere afvoeren tegelijk geblokkeerd? Riory BV pakt het aan met hogedrukspuit + camera-inspectie. 24/7 in heel Limburg.",
    image: rioolVerstoptAsset.url,
    longDescription:
      "Wanneer meerdere afvoeren tegelijk traag wegvloeien — uw WC, douche én gootsteen — dan zit het probleem dieper: er is een verstopping in de hoofdriolering, niet in een individuele sifon. Typische signalen zijn gorgelende geluiden in andere afvoeren, water dat terugkomt via de doucheput, of een sterke rioolgeur rond de inspectieputjes buiten. Een diepe rioolverstopping vereist professionele uitrusting. " +
      "Riory BV diagnosticeert elke rioolverstopping in Limburg eerst correct met camera-inspectie, en lost de blokkage vervolgens op met een krachtige hogedrukspuit ('jetting'). Zo verwijderen wij wortelingroei, vetlagen, kalkaanslag en hardnekkige verstoppingen tot diep in de hoofdriolering — zonder graafwerk. Wij werken 24/7 in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden, met vaste prijzen en een rapport van de toestand van uw riolering. " +
      CTA_PARAGRAPH,
    features: [
      "Diagnose met camera-inspectie — exacte oorzaak gelokaliseerd",
      "Krachtige hogedrukspuit verwijdert wortels, vet en kalk",
      "Geschikt voor hoofdriolering, regenwater- en vuilwaterleidingen",
      "Geen graafwerk in 99% van de gevallen",
      "Rapport met beelden en advies",
      "24/7 spoedontstopping in heel Limburg",
    ],
    metaTitle: "Riool Verstopt Limburg | Spoedonttopping 24/7 | Riory",
    metaDescription:
      "Riool verstopt in Limburg? Riory BV lost het op met hogedrukspuit en camera-inspectie. 24/7 bereikbaar. ☎ +32 472 50 28 14",
    h2Title: "Verstopt riool ontstoppen in Limburg — Riory's aanpak",
    serviceType: "Rioolontstopping",
    faq: [
      {
        question: "Hoe weet ik of mijn hoofdriool verstopt is?",
        answer:
          "Als meerdere afvoeren tegelijk traag wegvloeien (WC, douche, gootsteen), of als water uit de doucheput omhoogkomt wanneer u doorspoelt, zit de verstopping in de hoofdriolering — niet in één sifon.",
      },
      {
        question: "Moet er gegraven worden om mijn riool te ontstoppen?",
        answer:
          "In 99% van de gevallen niet. Wij voeren de hogedrukspuit in via een bestaand inspectieputje en lokaliseren het probleem met onze camera. Graafwerk is enkel nodig bij ernstige breuken of verzakkingen.",
      },
      {
        question: "Wat kost een rioolontstopping in Limburg?",
        answer:
          "Riory hanteert vaste, transparante prijzen voor rioolontstoppingen. Vraag een afspraak voor een correcte indicatie of bel rechtstreeks +32 472 50 28 14.",
      },
    ],
  },
  {
    slug: "gootsteen-verstopt",
    title: "Gootsteen Verstopt in Limburg — Riory BV",
    shortTitle: "Gootsteen Verstopt",
    description:
      "Gootsteen verstopt in Limburg? Riory BV lost het snel op met vaste prijzen. 24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en omstreken.",
    image: gootsteenVerstoptAsset.url,
    longDescription:
      "Een gootsteen die niet wegloopt, traag leegt of borrelende geluiden maakt heeft bijna altijd een verstopte sifon of leiding. Bij keukens is de oorzaak meestal vet en etensresten, bij badkamergootstenen vooral haren, tandpasta en zeep. Een verstopte gootsteen verergert snel: hoe langer u wacht, hoe harder de prop wordt. " +
      "Riory BV ontstopt elke gootsteen in Limburg snel en netjes. Wij demonteren de sifon waar nodig, verwijderen de blokkage en spoelen de leiding professioneel door. Zo loopt uw gootsteen meteen weer normaal weg. Wij werken 24/7 in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden, met vaste prijzen en zonder breekwerk. " +
      CTA_PARAGRAPH,
    features: [
      "Gootsteen weer vlot wegvloeiend in 1 interventie",
      "Sifon gereinigd of vervangen indien nodig",
      "Geen breekwerk in uw keuken of badkamer",
      "Vaste prijzen — vooraf transparant",
      "24/7 bereikbaar in heel Limburg",
      "Binnen 1 à 2 uur ter plaatse",
    ],
    metaTitle: "Gootsteen Verstopt Limburg | Loodgieter 24/7 | Riory",
    metaDescription:
      "Gootsteen verstopt in Limburg? Riory BV lost het snel op. 24/7 bereikbaar in Hasselt, Genk, Tongeren. ☎ +32 472 50 28 14",
    h2Title: "Gootsteen ontstoppen in Limburg — Riory's werkwijze",
    serviceType: "Gootsteen ontstoppen",
    faq: [
      {
        question: "Mijn gootsteen loopt traag weg — moet ik wachten?",
        answer:
          "Nee. Een traag wegvloeiende gootsteen is het eerste signaal van een groeiende verstopping. Vroeg ingrijpen is goedkoper en eenvoudiger dan een volledig verstopte afvoer.",
      },
      {
        question: "Hoe snel komt Riory ter plaatse?",
        answer:
          "Doorgaans binnen 1 à 2 uur in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. 24/7 bereikbaar, ook in het weekend.",
      },
      {
        question: "Wat kost het ontstoppen van een gootsteen?",
        answer:
          "Riory hanteert vaste prijzen voor gootsteenontstoppingen. U weet vooraf wat u betaalt. Vraag een afspraak voor een prijsindicatie.",
      },
    ],
  },
  {
    slug: "lekkende-kraan",
    title: "Lekkende Kraan in Limburg — Riory BV Herstelt Het",
    shortTitle: "Lekkende Kraan",
    description:
      "Lekkende kraan in Limburg? Riory BV herstelt snel en vakkundig. 24/7 bereikbaar in heel Limburg — Hasselt, Genk, Tongeren, Bilzen, Sint-Truiden.",
    image: serviceLeidingen,
    longDescription:
      "Een lekkende kraan lijkt onschuldig, maar een druppelende kraan verspilt al snel honderden liters water per maand — en een lekkende mengkraan onder een gootsteen kan ongemerkt waterschade veroorzaken aan uw kast, vloer of plafond. Een lek bij een kraan komt meestal door versleten dichtingen, kalkaanslag of een defecte cartridge. " +
      "Riory BV herstelt elke lekkende kraan in Limburg snel en netjes: wij identificeren de juiste onderdelen, vervangen dichtingen of cartridges, of plaatsen indien gewenst een nieuwe kraan. Onze loodgieters werken 24/7 in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden, met vaste prijzen en garantie op de uitgevoerde werken. " +
      CTA_PARAGRAPH,
    features: [
      "Lekkende kraan vakkundig hersteld — geen waterverspilling meer",
      "Dichting, cartridge of volledige kraan vervangen",
      "Geschikt voor keuken, badkamer en wastafel",
      "24/7 bereikbaar in heel Limburg",
      "Vaste prijzen — garantie op uitgevoerde werken",
      "Voorkomt waterschade aan kast, vloer en plafond",
    ],
    metaTitle: "Lekkende Kraan Limburg | Loodgieter 24/7 | Riory",
    metaDescription:
      "Lekkende kraan in Limburg? Riory BV herstelt snel en vakkundig. 24/7 bereikbaar in heel Limburg. ☎ +32 472 50 28 14",
    h2Title: "Lekkende kraan herstellen in Limburg",
    serviceType: "Lekkende kraan herstellen",
    faq: [
      {
        question: "Hoeveel water verspilt een lekkende kraan?",
        answer:
          "Een kraan die elke seconde druppelt verspilt al snel 15 à 20 liter per dag — meer dan 5000 liter per jaar. Een gerichte herstelling betaalt zichzelf snel terug.",
      },
      {
        question: "Kan elke kraan hersteld worden of moet ze vervangen?",
        answer:
          "In veel gevallen volstaat het vervangen van een dichting of cartridge. Bij oudere kranen, kalkaanslag of beschadigde onderdelen is vervangen vaak duurzamer. Riory adviseert u eerlijk ter plaatse.",
      },
      {
        question: "Hoe snel komt Riory ter plaatse voor een lekkende kraan?",
        answer:
          "Doorgaans binnen 1 à 2 uur in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. Voor niet-urgente herstellingen kunnen we ook een afspraak inplannen op een door u gekozen moment.",
      },
    ],
  },
];

/** Echte kerndiensten (Diensten-sectie homepage + /diensten overzicht). */
export const coreServiceSlugs = [
  "camera-inspectie",
  "ontstoppingen-en-geurdetectie",
  "septische-put-ledigen",
  "leegpompen-en-reinigen",
] as const;

/** Veelvoorkomende problemen die Riory zorgeloos oplost. */
export const commonProblemSlugs = [
  "wc-verstopt",
  "keukenafvoer-verstopt",
  "doucheputje-verstopt",
  "riool-verstopt",
  "gootsteen-verstopt",
  "lekkende-kraan",
] as const;

export const coreServices = allServices.filter((s) =>
  (coreServiceSlugs as readonly string[]).includes(s.slug)
);

export const commonProblems = allServices.filter((s) =>
  (commonProblemSlugs as readonly string[]).includes(s.slug)
);


