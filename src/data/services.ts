import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";

export interface Service {
  slug: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  features: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export const allServices: Service[] = [
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Ontstoppingen en geurdetectie",
    description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen. Opsporing en verhelping van stankoverlast en rioolvliegjes.",
    image: serviceOntstoppingen,
    longDescription:
      "Heeft u last van een verstopte afvoer, rioolverstopping of stankoverlast? Wij zorgen voor een snelle en grondige oplossing. Met professionele hogedrukapparatuur maken wij elke verstopping vrij — van keukens en badkamers tot hoofdrioleringen. Daarnaast sporen wij geurhinder en rioolvliegjes op aan de bron en verhelpen het probleem duurzaam.",
    features: [
      "Ontstopping van rioleringen, afvoeren en leidingen",
      "Hogedrukreiniging met gespecialiseerd materiaal",
      "Opsporing en verhelping van stankoverlast",
      "Bestrijding van rioolvliegjes aan de bron",
      "24/7 beschikbaar voor noodgevallen",
    ],
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
  },
  {
    slug: "camera-inspectie",
    title: "Camera-inspectie",
    description: "Gedetailleerde camera-inspectie van rioleringen om problemen snel en nauwkeurig te lokaliseren.",
    image: serviceCamera,
    longDescription:
      "Met onze professionele camera-inspectie krijgt u een duidelijk beeld van de toestand van uw rioleringssysteem. We brengen breuken, wortelingroei, verzakkingen en verstoppingen nauwkeurig in kaart. Na de inspectie ontvangt u een gedetailleerd rapport met beelden en advies voor eventuele herstellingen.",
    features: [
      "Gedetailleerde camera-inspectie van rioleringen",
      "Exacte lokalisatie van problemen",
      "Plaatsbepaling van ondergrondse afvoerleidingen",
      "Duidelijk rapport met beelden en advies",
      "Geschikt voor preventieve controles",
    ],
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Leegpompen en reinigen",
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
  },
];
