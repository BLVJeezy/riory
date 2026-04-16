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
}

export const allServices: Service[] = [
  {
    slug: "camera-inspectie",
    title: "Camera inspectie riool en afvoer in Limburg",
    shortTitle: "Camera inspectie riool",
    description: "Laat verborgen problemen exact lokaliseren met professioneel camera onderzoek van riool en afvoer in Bilzen, Hasselt en heel Limburg.",
    image: serviceCamera,
    longDescription:
      "Met onze professionele camera-inspectie van riool en afvoer krijgt u een duidelijk beeld van de toestand van uw rioleringssysteem in Bilzen, Hasselt, Genk, Tongeren en heel Limburg. We brengen breuken, wortelingroei, verzakkingen en verstoppingen nauwkeurig in kaart. Na de inspectie ontvangt u een gedetailleerd rapport met beelden en advies voor eventuele herstellingen.",
    features: [
      "Riool inspecteren met professionele camera",
      "Verstopte afvoer lokaliseren zonder breekwerk",
      "Plaatsbepaling van ondergrondse afvoerleidingen",
      "Duidelijk rapport met beelden en advies",
      "Geschikt voor preventieve controles bij aankoop woning",
    ],
    metaTitle: "Camera inspectie riool & afvoer Bilzen, Hasselt, Limburg | Riory",
    metaDescription: "Professionele camera inspectie riool in Bilzen, Hasselt, Genk en heel Limburg. Geen breekwerk, wel snelle detectie. 24/7 beschikbaar!",
  },
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Professionele ontstoppingen en geurdetectie in Limburg",
    shortTitle: "Ontstoppingen & Geurdetectie",
    description: "Afvoer verstopt? Geurhinder? Riory spoort het probleem 24/7 op met efficiënte ontstopping en geurdetectie in Bilzen, Hasselt en heel Limburg.",
    image: serviceOntstoppingen,
    longDescription:
      "Heeft u last van een verstopte afvoer, rioolverstopping of stankoverlast? WC verstopt, gootsteen verstopt of douche loopt niet weg? Wij zorgen voor een snelle en grondige oplossing in Bilzen, Hasselt, Genk, Tongeren en heel Limburg. Met professionele hogedrukapparatuur maken wij elke verstopping vrij — van keukens en badkamers tot hoofdrioleringen. Riool stinkt? Wij sporen geurhinder en rioolvliegjes op aan de bron en verhelpen het probleem duurzaam.",
    features: [
      "Riool ontstoppen — snel en professioneel",
      "Verstopte afvoer verhelpen met hogedrukreiniging",
      "WC, douche & gootsteen ontstoppen",
      "Rioollucht opsporen en geurhinder verhelpen",
      "Bestrijding van rioolvliegjes aan de bron",
      "24/7 beschikbaar voor noodgevallen in Limburg",
    ],
    metaTitle: "Ontstopping Bilzen, Hasselt & Limburg 24/7 + geurdetectie | Riory",
    metaDescription: "Afvoer verstopt in Bilzen, Hasselt of Genk? Riory spoort het probleem 24/7 op met efficiënte ontstopping en geurdetectie in heel Limburg.",
  },
  {
    slug: "leidingen-en-septische-putten",
    title: "Septische put ledigen en leidingen herstellen in Limburg",
    shortTitle: "Leidingen & Septische Putten",
    description: "Riory ruimt en reinigt septische putten in Bilzen, Hasselt en heel Limburg voor eerlijke prijzen en met 24/7 service.",
    image: serviceLeidingen,
    longDescription:
      "Van het ledigen van septische putten tot het aanleggen of herstellen van rioolleidingen — wij bieden een totaalpakket voor uw ondergrondse infrastructuur in Bilzen, Hasselt, Genk en omstreken. Met gespecialiseerde zuigwagens en graafmachines werken wij efficiënt en met minimale overlast. Regenputten reinigen we grondig zodat uw afwatering optimaal blijft functioneren.",
    features: [
      "Septische put ledigen en reinigen",
      "Beerput ruimen en onderhouden",
      "Regenput grondig reinigen",
      "Aanleg van nieuwe rioolleidingen",
      "Herstelling van beschadigde leidingen",
      "Professionele zuigwagens en graafmachines",
    ],
    metaTitle: "Septische put ledigen Bilzen, Hasselt, Limburg | Riory 24/7",
    metaDescription: "Septische put of beerput ledigen in Bilzen, Hasselt, Genk of Tongeren? Riory ruimt en reinigt 24/7 voor eerlijke prijzen in heel Limburg.",
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Kelder leegpompen en regenput reinigen in Limburg",
    shortTitle: "Leegpompen & Reinigen",
    description: "Kelder of regenput ondergelopen? Riory pompt snel leeg, spoort de oorzaak op en maakt schoon. 24/7 beschikbaar in Limburg!",
    image: serviceLeegpompen,
    longDescription:
      "Bij wateroverlast staan wij snel ter plaatse in Bilzen, Hasselt, Genk en heel Limburg om kelders, putten en terreinen leeg te pompen. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud voor uw volledige rioleringssysteem. Regelmatig onderhoud voorkomt dure herstellingen en zorgt ervoor dat uw afvoersysteem optimaal blijft werken.",
    features: [
      "Kelder leegpompen bij wateroverlast",
      "Regenput reinigen en onderhouden",
      "Periodieke reiniging van rioleringssystemen",
      "Dakgootreiniging en afvoerbuizen schoonmaken",
      "Snel ter plaatse — 24/7 bereikbaar in Limburg",
    ],
    metaTitle: "Kelder leegpompen Bilzen, Hasselt, Limburg 24/7 | Riory",
    metaDescription: "Kelder of regenput ondergelopen in Bilzen, Hasselt of Genk? Riory pompt snel leeg en maakt schoon. 24/7 beschikbaar in heel Limburg!",
  },
];