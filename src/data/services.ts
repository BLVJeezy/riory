import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";

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
}

export const allServices: Service[] = [
  {
    slug: "camera-inspectie",
    title: "Camera inspectie riool en afvoer in Limburg",
    shortTitle: "Camera inspectie riool",
    description: "Laat verborgen problemen exact lokaliseren met professioneel camera onderzoek van riool en afvoer in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg. Ideaal bij een verstopte afvoer, terugkerende rioollucht of aankoop van een woning.",
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
    metaDescription: "Camera-inspectie van uw riool — oorzaak bloot zonder breekwerk. ✓ Rapport met beelden ✓ 24/7 in Bilzen, Hasselt, Genk & Tongeren. Plan nu in!",
    h2Title: "Riool inspecteren en afvoerproblemen opsporen",
  },
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Ontstoppingsdienst Limburg — afvoer & gootsteen verstopt 24/7",
    shortTitle: "Ontstoppingen & Geurdetectie",
    description: "Afvoer verstopt in Limburg? Gootsteen verstopt of niet aan het ontstoppen? Riory is dé ontstoppingsdienst in Limburg — 24/7 in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel de provincie.",
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
    metaDescription: "Afvoer verstopt of gootsteen verstopt in Limburg? Riory is dé ontstoppingsdienst in Limburg — 24/7 gootsteen ontstoppen in Bilzen, Hasselt, Genk & Tongeren. Bel nu!",
    h2Title: "Gootsteen ontstoppen in Limburg en verstopte afvoer verhelpen",
  },
  {
    slug: "leidingen-en-septische-putten",
    title: "Septische put ledigen in Limburg — septische put vol of leegmaken",
    shortTitle: "Septische put ledigen",
    description: "Septische put vol? Septische put leegmaken in Limburg? Riory is dé specialist voor het ledigen, ruimen en reinigen van uw septische put in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg — 24/7 met vaste prijzen.",
    image: serviceLeidingen,
    longDescription:
      "Een septische put vol laten lopen leidt tot stankoverlast, een trage afvoer en in het ergste geval terugstromend rioolwater. Riory is dé specialist voor het ledigen van uw septische put in Limburg. Of u nu een septische put wil laten leegmaken in Hasselt, een volle septische put hebt in Genk, of dringend uw septische put wil laten ruimen in Bilzen, Hoeselt of Tongeren — wij staan 24/7 voor u klaar. Met gespecialiseerde zuigwagens ledigen wij uw septische put snel, netjes en met minimale overlast. Ook reinigen wij uw septische put grondig na het leegmaken, zodat hij weer optimaal werkt. Daarnaast leggen en herstellen wij rioolleidingen, beerputten en regenputten in heel Limburg. Vaste prijzen, ervaren team en gegarandeerd resultaat.",
    features: [
      "Septische put ledigen in Limburg — 24/7 bereikbaar",
      "Septische put vol? Snel ter plaatse in Bilzen, Hasselt, Genk & Tongeren",
      "Septische put leegmaken met professionele zuigwagens",
      "Septische put reinigen na het ledigen voor optimale werking",
      "Beerput ruimen, leegmaken en onderhouden",
      "Regenput grondig reinigen en onderhouden",
      "Aanleg van nieuwe rioolleidingen en septische putten",
      "Herstelling van beschadigde rioolleidingen",
      "Vaste, transparante prijzen zonder verrassingen",
      "Ervaren team, minimale overlast, gegarandeerd resultaat",
    ],
    metaTitle: "Septische Put Ledigen Limburg 24/7 | Leegmaken & Reinigen | Riory",
    metaDescription: "Septische put vol of laten leegmaken in Limburg? Riory ledigt, ruimt & reinigt uw septische put 24/7 in Bilzen, Hasselt, Genk & Tongeren. ✓ Vaste prijs. Bel nu!",
    h2Title: "Septische put ledigen, leegmaken en reinigen in Limburg",
  },

  {
    slug: "leegpompen-en-reinigen",
    title: "Kelder leegpompen en regenput reinigen in Limburg",
    shortTitle: "Leegpompen & Reinigen",
    description: "Kelder of regenput ondergelopen? Riory pompt snel leeg, spoort de oorzaak op en maakt schoon. 24/7 beschikbaar in Limburg!",
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
    metaDescription: "Kelder onder water of regenput overloopt? Riory pompt leeg & spoort oorzaak op. ✓ 24/7 ✓ Bilzen, Hasselt, Genk & Tongeren. Bel direct!",
    h2Title: "Kelder droogpompen en rioleringssysteem reinigen",
  },
];