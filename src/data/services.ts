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
import refDakgoot from "@/assets/refs/dakgoot-hoogte-1.webp";
import refGeurdetectie from "@/assets/refs/geurdetectie-1.webp";
import refSifon from "@/assets/refs/sifon-1.webp";
import refOntstoppingAfvoer from "@/assets/refs/ontstopping-afvoerput-1.webp";

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
      "Met onze professionele camera-inspectie van riool en afvoer krijgt u een duidelijk beeld van de toestand van uw rioleringssysteem in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg. We brengen breuken, wortelingroei, verzakkingen en verstoppingen nauwkeurig in kaart. WC die steeds verstopt raakt? Douche die niet afloopt? Gootsteen die traag wegloopt? Een camera-inspectie legt de exacte oorzaak bloot, zonder breekwerk. In oudere wijken van Tongeren en Bilzen stuiten we regelmatig op verzakte leidingen of verouderde betonbuizen uit de jaren '60. In nieuwbouwwijken in Hasselt-Kuringen of Genk-Waterschei gaat het vaker om wortelingroei of verkeerd aangesloten aftakkingen. Na de inspectie ontvangt u een gedetailleerd rapport met beelden en advies voor eventuele herstellingen.",
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
      "Riory is dé ontstoppingsdienst in Limburg voor elke verstopping: gootsteen verstopt, afvoer verstopt, WC of douche die niet meer wegloopt, en hardnekkige rioolverstoppingen. Of u nu uw gootsteen wil ontstoppen in Hasselt, een verstopte afvoer wil laten verhelpen in Genk of een rioolontstopping nodig hebt in Bilzen, Hoeselt of Tongeren. Wij zijn 24/7 ter plaatse in heel Limburg. In de herfst verstoppen gevallen bladeren de straatkolken in oudere wijken van Hasselt-Kermt en Bilzen — en dat trekt het water terug naar de kelders. In Genk-Winterslag en Waterschei zien wij vaak vetophoping in keukenleidingen van oudere appartementen. Met professionele hogedrukapparatuur ontstoppen wij gootstenen, badkamers, WC's en hoofdrioleringen snel en duurzaam. Ook bij stankoverlast sporen wij geurhinder en rioolvliegjes op aan de bron. Vaste prijzen, ervaren team en gegarandeerd resultaat: dat is Riory, uw ontstoppingsdienst in Limburg.",
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
      "Bij wateroverlast staan wij snel ter plaatse in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg om kelders, putten en terreinen leeg te pompen. Kelder onder water na hevige regenval? Regenput die overloopt? Riool dat terugkomt via de afvoer? Wij pompen snel leeg en sporen de oorzaak op. In de Maasstreek rond Maasmechelen en Riemst zorgen zware regenbuien regelmatig voor wateroverlast in laaggelegen kelders. In Sint-Truiden en Borgloon lopen regenputten op hoeves sneller vol dan in stedelijke gebieden, omdat de hemelwaterafvoer minder goed uitgebouwd is. Wij kennen die lokale verschillen en weten waar we als eerste moeten kijken. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud voor uw volledige rioleringssysteem. Regelmatig onderhoud voorkomt dure herstellingen, verstopte afvoeren en rioollucht in huis.",
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

  // ===================== NIEUWE DIENST PAGINA'S =====================
  {
    slug: "lekkage-opsporen",
    title: "Lekkage Opsporen in Limburg — Riory BV",
    shortTitle: "Lekkage Opsporen",
    description:
      "Vochtplekken, schimmel of onverklaarbaar hoge waterrekening? Riory opspoort verborgen lekkages in Limburg zonder breekwerk. 24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en omstreken.",
    image: refGeurdetectie,
    longDescription:
      "Een verborgen lek is verraderlijk. U ziet een vochtplek op de muur, uw waterrekening is plots veel hoger dan normaal, of u hoort het geluid van stromend water terwijl alle kranen dicht zijn. Maar waar zit het lek? In Limburg zien we dit probleem veel in oudere woningen in Tongeren en Bilzen, waar leidingen uit de jaren '60-'70 stilaan verouderen, maar ook in nieuwere appartementen in Hasselt en Genk waar een verkeerde aansluiting pas na jaren problemen geeft.\n\nRiory BV opspoort elke verborgen lekkage in Limburg zonder onnodig breekwerk. We gebruiken professionele apparatuur — akoestische lekdetectie, thermografische camera en traceergas — om het lek exact te lokaliseren. Zo weet onze technicus al voor de eerste steen gebroken wordt waar het probleem zit. Na de detectie ontvangt u een duidelijk rapport en een eerlijk advies voor de herstelling.",
    features: [
      "Akoestische lekdetectie — lek horen zonder breekwerk",
      "Thermografische camera — vochtplekken zichtbaar maken",
      "Traceergas voor moeilijk bereikbare leidingen",
      "Geschikt voor water-, verwarmings- en rioollekkages",
      "Duidelijk rapport met exacte locatie van het lek",
      "24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en Hoeselt",
      "Vaste, transparante prijzen — geen verrassingen",
    ],
    metaTitle: "Lekkage Opsporen Limburg | Zonder Breekwerk | Riory",
    metaDescription:
      "Verborgen lek in Limburg? Riory opspoort lekkages zonder breekwerk — akoestisch, thermografisch of traceergas. ✓ 24/7 ✓ Rapport ✓ Vaste prijs. Bel nu!",
    h2Title: "Verborgen lekkage detecteren in Limburg — Riory's aanpak",
    serviceType: "Lekkage opsporen",
    faq: [
      {
        question: "Hoe weet ik of ik een verborgen lek heb?",
        answer:
          "Typische signalen: een vochtplek die groeit op muur of plafond, schimmelvorming zonder duidelijke oorzaak, een waterrekening die plots gestegen is zonder dat u meer water gebruikt, of het geluid van stromend water terwijl alles dicht staat. Bij één of meer van deze signalen is lekdetectie aangewezen.",
      },
      {
        question: "Moet er gegraven of gebroken worden om een lek op te sporen?",
        answer:
          "In 95% van de gevallen niet. Met akoestische detectie, thermografie of traceergas lokaliseren we het lek tot op centimeter nauwkeurig — zonder één steen te breken. Pas na de detectie weet de hersteller precies waar hij moet werken.",
      },
      {
        question: "Wat kost lekdetectie in Limburg?",
        answer:
          "Riory werkt met vaste, transparante tarieven voor lekdetectie. De prijs hangt af van de gebruikte methode en de complexiteit. U weet vooraf wat u betaalt — vraag een afspraak aan of bel +32 472 50 28 14.",
      },
    ],
  },
  {
    slug: "dakgootreiniging",
    title: "Dakgootreiniging in Limburg — Riory BV",
    shortTitle: "Dakgootreiniging",
    description:
      "Verstopte dakgoten in Limburg? Riory reinigt dakgoten en regenpijpen grondig — voor particulieren en syndici. 24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en omstreken.",
    image: refDakgoot,
    longDescription:
      "In de herfst vullen bladeren, mos en takjes de dakgoten van woningen in heel Limburg. In Hasselt-Kermt, Tongeren en de landelijke gemeenten rond Borgloon en Wellen zien we dit elk jaar opnieuw: verstopte dakgoten die het regenwater niet meer afvoeren, waarna het over de rand loopt en schade veroorzaakt aan de gevel, de fundering of de kelder.\n\nEen verstopte dakgoot lijkt onschuldig maar de gevolgen zijn dat niet. Water dat langs de gevel loopt, dringt op termijn door in de muurisolatie. In winter zorgen bevroren dakgoten voor ijsvorming die de goot fysiek beschadigt. Riory BV reinigt dakgoten en regenpijpen grondig in heel Limburg — voor particuliere woningen, appartementsgebouwen en syndici. We werken op hoogte met de juiste veiligheidsuitrusting, verwijderen alle bladeren en slib, en controleren of de regenpijpen vrij doorstromen naar de regenput of het riool.",
    features: [
      "Grondige reiniging van dakgoten en regenpijpen",
      "Verwijdering van bladeren, mos, takjes en slib",
      "Controle van doorstroming naar regenput of riool",
      "Geschikt voor alle woningtypes en appartementsgebouwen",
      "Veilig werken op hoogte met professionele uitrusting",
      "Preventief jaarlijks onderhoud mogelijk",
      "24/7 bereikbaar — ook voor spoedgevallen bij wateroverlast",
    ],
    metaTitle: "Dakgootreiniging Limburg | Verstopte Dakgoot | Riory",
    metaDescription:
      "Verstopte dakgoot in Limburg? Riory reinigt dakgoten en regenpijpen grondig op hoogte. ✓ Particulier & syndici ✓ Vaste prijs ✓ 24/7. Bel nu!",
    h2Title: "Dakgoten reinigen in Limburg — voor particulier en syndici",
    serviceType: "Dakgootreiniging",
    faq: [
      {
        question: "Hoe vaak moet een dakgoot gereinigd worden?",
        answer:
          "Minimaal één keer per jaar, bij voorkeur in november na het bladeren vallen. Woningen onder bomen of met een plat dak kunnen baat hebben bij twee reinigingen per jaar — voor en na het herfstseizoen.",
      },
      {
        question: "Wat zijn de gevolgen van een verstopte dakgoot?",
        answer:
          "Regenwater dat niet kan wegvloeien loopt over de gootrand en dringt in de gevel, de isolatie of de fundering. Op termijn leidt dit tot vochtschade, schimmel en dure herstellingen. Preventieve reiniging is altijd goedkoper dan schade achteraf.",
      },
      {
        question: "Werkt Riory ook voor appartementsgebouwen en syndici?",
        answer:
          "Ja. Riory BV heeft ervaring met meerverdiepin​gspanden en appartementsgebouwen in Hasselt, Genk en Tongeren. We maken afspraken op maat voor syndici en zorgen voor een gedetailleerd verslag na elke interventie.",
      },
    ],
  },
  {
    slug: "rioolreparatie",
    title: "Rioolreparatie in Limburg — Riory BV",
    shortTitle: "Rioolreparatie",
    description:
      "Gebroken, verzakte of door wortels beschadigde riolering in Limburg? Riory herstelt riolen vakkundig — met of zonder graafwerk. 24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en omstreken.",
    image: "/src/assets/service-riolering.jpg",
    longDescription:
      "Een rioolreparatie is anders dan een ontstopping. Bij een verstopping zit er iets in de buis; bij een reparatie is de buis zelf beschadigd — gebroken, verzakt, losgeraakt op een verbinding, of binnengedrongen door boomwortels. In Limburg zien we dit veel in oudere wijken van Tongeren en Bilzen, waar betonnen rioolbuizen uit de jaren '50-'60 simpelweg het einde van hun levensduur bereiken. Ook in tuinen met populieren of wilgen is wortelingroei een veelvoorkomende oorzaak.\n\nRiory BV voert rioolreparaties uit in heel Limburg — van een enkelvoudige breukherstelling tot het vervangen van een heel buissegment. We starten altijd met een camera-inspectie om de schade exact in kaart te brengen. Waar mogelijk werken we zonder graafwerk via no-dig technieken zoals relining. Wanneer graven noodzakelijk is, werken we snel, netjes en laten we de omgeving proper achter. U ontvangt altijd een rapport met voor- en nabeelden.",
    features: [
      "Camera-inspectie eerst — exacte schade in kaart vóór werken starten",
      "Breuk, scheur of loskoppeling vakkundig hersteld",
      "Wortelingroei mechanisch verwijderd en buis hersteld",
      "No-dig relining waar mogelijk — geen graafwerk",
      "Volledige buisvervanging indien nodig",
      "Rapport met voor- en nabeelden",
      "24/7 bereikbaar in heel Limburg",
    ],
    metaTitle: "Rioolreparatie Limburg | Breuk, Verzakking & Wortels | Riory",
    metaDescription:
      "Gebroken of verzakt riool in Limburg? Riory repareert vakkundig — camera-inspectie, no-dig relining of buisvervanging. ✓ 24/7 ✓ Vaste prijs. Bel nu!",
    h2Title: "Rioolreparatie in Limburg — breuk, verzakking en wortelingroei",
    serviceType: "Rioolreparatie",
    faq: [
      {
        question: "Hoe weet ik of mijn riool gebroken is en niet gewoon verstopt?",
        answer:
          "Terugkerende verstoppingen op dezelfde plek, inzakkende grond in de tuin boven de rioollijn, permanente rioolgeur of water dat aan de oppervlakte komt zijn typische signalen van een breuk of verzakking. Een camera-inspectie bevestigt de diagnose.",
      },
      {
        question: "Moet er altijd gegraven worden voor een rioolreparatie?",
        answer:
          "Niet altijd. Bij kleinere scheuren of loskoppelingen kunnen we via relining — een techniek waarbij een nieuwe binnenbuis aangebracht wordt zonder graven — de schade herstellen. Alleen bij ernstige verzakkingen of complete breuken is graven noodzakelijk.",
      },
      {
        question: "Wat kost een rioolreparatie in Limburg?",
        answer:
          "De prijs hangt af van de aard van de schade, de diepte van de buis en de gekozen herstelmethode. Riory geeft altijd een eerlijk voorstel na de camera-inspectie. Bel +32 472 50 28 14 of vraag een afspraak aan.",
      },
    ],
  },
  {
    slug: "rioolvliegjes",
    title: "Rioolvliegjes in Limburg — Oorzaak Opsporen & Oplossen | Riory",
    shortTitle: "Rioolvliegjes",
    description:
      "Last van kleine vliegjes in badkamer, keuken of kelder in Limburg? Rioolvliegjes wijzen op een open rioolverbinding. Riory opspoort de bron en lost het op. 24/7 bereikbaar.",
    image: "/src/assets/service-ontstoppingen-geurdetectie.webp",
    longDescription:
      "U ziet kleine, donkere vliegjes in de badkamer, rond de gootsteen of in de kelder. Ze zijn traag, komen steeds terug en chemische middelen helpen maar tijdelijk. Dit zijn bijna zeker rioolvliegjes — ook wel motmuggen of rioolmuggen genoemd. Ze leven en broeden in het organische slib dat zich ophoopt in verstopte of trage afvoeren, en ze komen naar buiten via open verbindingen of scheuren in uw riolering.\n\nIn Limburg zien we rioolvliegjes het vaakst in oudere woningen in Tongeren, Bilzen en Hasselt-centrum, waar afvoerleidingen al decennia oud zijn en kleine scheurtjes of open sifonverbindingen de plaag binnenlaten. Een chemische behandeling bestrijdt de volwassen vliegjes maar niet de broedplaats. Riory BV pakt het bij de bron aan: we opspoort de open verbinding of beschadigde leiding met camera-inspectie of rookdetectie, herstellen het defect, en reinigen de betrokken afvoeren grondig zodat de broedplaats verdwijnt.",
    features: [
      "Oorzaak opsporen met camera-inspectie of rookdetectie",
      "Open rioolverbinding of scheur vakkundig hersteld",
      "Grondige reiniging van betrokken afvoeren",
      "Broedplaats in slib volledig verwijderd",
      "Geen tijdelijke chemische behandeling maar permanente oplossing",
      "24/7 bereikbaar in Hasselt, Genk, Tongeren, Bilzen en Hoeselt",
    ],
    metaTitle: "Rioolvliegjes Limburg | Oorzaak Opsporen & Oplossen | Riory",
    metaDescription:
      "Rioolvliegjes in badkamer of keuken in Limburg? Riory opspoort de bron en lost het permanent op. ✓ Camera-inspectie ✓ 24/7 ✓ Vaste prijs. Bel nu!",
    h2Title: "Rioolvliegjes aanpakken in Limburg — permanent, niet tijdelijk",
    serviceType: "Rioolvliegjes bestrijden",
    faq: [
      {
        question: "Zijn rioolvliegjes gevaarlijk?",
        answer:
          "Rioolvliegjes bijten niet en brengen geen ziektes over, maar ze zijn een duidelijk signaal dat er iets mis is met uw riolering — een open verbinding, een scheur of een ernstig vervuilde afvoer. Het probleem pakt u best zo snel mogelijk aan.",
      },
      {
        question: "Waarom komen ze steeds terug na een chemische behandeling?",
        answer:
          "Chemische middelen doden de volwassen vliegjes maar niet de larven in het slib, en ze herstellen de open verbinding niet waardoor nieuwe vliegjes van buiten binnenkomen. Alleen een mechanische aanpak van de broedplaats en het dichten van de opening geeft een permanente oplossing.",
      },
      {
        question: "Hoe snel kan Riory ter plaatse zijn?",
        answer:
          "Doorgaans binnen 1 à 2 uur in Hasselt, Genk, Tongeren, Bilzen, Hoeselt en Sint-Truiden. Rioolvliegjes zijn geen noodgeval maar wel vervelend — wij plannen snel een afspraak in op een moment dat u past.",
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


