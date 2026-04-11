import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceGeurdetectie from "@/assets/service-geurdetectie.webp";
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
    slug: "ontstoppingen",
    title: "Ontstoppingen",
    description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen. 24/7 beschikbaar voor noodgevallen.",
    image: serviceOntstoppingen,
    longDescription:
      "Heeft u last van een verstopte afvoer of rioolverstopping? Wij zorgen voor een snelle en grondige oplossing. Met professionele hogedrukapparatuur maken wij elke verstopping vrij — van keukens en badkamers tot hoofdrioleringen. Of het nu gaat om een verstopte wc, gootsteen of badkamerafvoer, Riory staat 24/7 klaar.",
    features: [
      "Ontstopping van rioleringen, afvoeren en leidingen",
      "Hogedrukreiniging met gespecialiseerd materiaal",
      "WC ontstoppen — snel en vakkundig",
      "Gootsteen ontstoppen — keukenafvoer weer vrij",
      "Badkamer ontstoppen — douche en lavabo",
      "24/7 beschikbaar voor noodgevallen",
    ],
    metaTitle: "Ontstoppingen 24/7 Bilzen-Hoeselt Limburg | Riory",
    metaDescription: "Afvoer verstopt? WC, gootsteen of badkamer? Riory lost elke verstopping 24/7 op met professionele hogedrukreiniging.",
  },
  {
    slug: "geurdetectie",
    title: "Geurdetectie & rioolvliegjes",
    shortTitle: "Geurdetectie",
    description: "Opsporing en verhelping van stankoverlast en rioolvliegjes aan de bron. Duurzame oplossing gegarandeerd.",
    image: serviceGeurdetectie,
    longDescription:
      "Heeft u last van stankoverlast of rioolvliegjes in huis? Riory spoort de oorzaak op aan de bron en verhelpt het probleem duurzaam. Met professionele detectieapparatuur lokaliseren wij geurhinder snel en nauwkeurig, zodat u weer kunt genieten van een frisse leefomgeving.",
    features: [
      "Opsporing van stankoverlast aan de bron",
      "Bestrijding van rioolvliegjes",
      "Professionele geurdetectie-apparatuur",
      "Duurzame oplossing — geen lapmiddelen",
      "Advies ter preventie van geurhinder",
      "Snelle interventie — 24/7 bereikbaar",
    ],
    metaTitle: "Geurdetectie & rioolvliegjes bestrijden Bilzen-Hoeselt | Riory",
    metaDescription: "Last van stankoverlast of rioolvliegjes? Riory spoort de oorzaak op aan de bron en verhelpt het probleem duurzaam.",
  },
  {
    slug: "leidingen-en-septische-putten",
    title: "Leidingen en septische putten",
    description: "Professioneel ledigen en reinigen van septische putten, regenputten en aanleg of herstelling van leidingen.",
    image: serviceLeidingen,
    longDescription:
      "Van het ledigen van septische putten tot het aanleggen of herstellen van rioolleidingen — wij bieden een totaalpakket voor uw ondergrondse infrastructuur. Met gespecialiseerde zuigwagens en graafmachines werken wij efficiënt en met minimale overlast. Regenputten reinigen we grondig zodat uw afwatering optimaal blijft functioneren.",
    features: [
      "Ledigen en reinigen van septische putten",
      "Regenputten grondig reinigen",
      "Aanleg van nieuwe rioolleidingen",
      "Herstelling van beschadigde leidingen",
      "Professionele zuigwagens en graafmachines",
    ],
    metaTitle: "Ruiming septische put Bilzen-Hoeselt: beerput ruimen & reinigen | Riory",
    metaDescription: "Riory ruimt en reinigt septische putten voor eerlijke prijzen en met 24/7 service. Voorkom geurhinder en verstoppingen!",
  },
  {
    slug: "camera-inspectie",
    title: "Camera inspectie riool",
    description: "Gedetailleerde camera-inspectie van riool en afvoer om problemen snel en nauwkeurig te lokaliseren.",
    image: serviceCamera,
    longDescription:
      "Met onze professionele camera-inspectie van riool en afvoer krijgt u een duidelijk beeld van de toestand van uw rioleringssysteem. We brengen breuken, wortelingroei, verzakkingen en verstoppingen nauwkeurig in kaart. Na de inspectie ontvangt u een gedetailleerd rapport met beelden en advies voor eventuele herstellingen.",
    features: [
      "Gedetailleerde camera-inspectie van riool en afvoer",
      "Exacte lokalisatie van problemen",
      "Plaatsbepaling van ondergrondse afvoerleidingen",
      "Duidelijk rapport met beelden en advies",
      "Geschikt voor preventieve controles",
    ],
    metaTitle: "Camera inspectie riool & afvoer | Riory Bilzen-Hoeselt Limburg",
    metaDescription: "Laat verborgen beer-, septische putten en verstoppingen exact lokaliseren met gericht camera onderzoek. Geen breekwerk, wel snelle detectie!",
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Leegpompen en reinigen van kelders & regenputten",
    shortTitle: "Leegpompen en reinigen",
    description: "Leegpompen en reinigen bij wateroverlast, periodiek onderhoud en preventieve reiniging van uw rioleringssysteem.",
    image: serviceLeegpompen,
    longDescription:
      "Bij wateroverlast staan wij snel ter plaatse om kelders, putten en terreinen leeg te pompen. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud voor uw volledige rioleringssysteem. Regelmatig onderhoud voorkomt dure herstellingen en zorgt ervoor dat uw afvoersysteem optimaal blijft werken.",
    features: [
      "Leegpompen bij wateroverlast en noodgevallen",
      "Periodieke reiniging van rioleringssystemen",
      "Preventief onderhoud om verstoppingen te voorkomen",
      "Dakgootreiniging en afvoerbuizen",
      "Snel ter plaatse — 24/7 bereikbaar",
    ],
    metaTitle: "Kelder & regenput leegpompen & reinigen 24/7 Bilzen-Hoeselt | Riory",
    metaDescription: "Kelder of regenput ondergelopen? Riory pompt snel leeg, spoort de oorzaak op & maakt schoon. 24/7 beschikbaar!",
  },
];
