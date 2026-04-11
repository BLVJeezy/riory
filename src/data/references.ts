import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";

export interface ReferenceCategory {
  slug: string;
  title: string;
  image: string;
  description: string;
  projects: {
    title: string;
    location: string;
    description: string;
  }[];
}

export const referenceCategories: ReferenceCategory[] = [
  {
    slug: "dakgootreinigingen",
    title: "Dakgootreinigingen",
    image: serviceCamera,
    description:
      "Wij reinigen dakgoten grondig om wateroverlast en schade aan uw woning te voorkomen. Bladeren, mos en vuil worden volledig verwijderd zodat het regenwater weer vrij kan aflopen.",
    projects: [
      {
        title: "Dakgootreiniging Appartementsgebouw",
        location: "Bilzen, Limburg",
        description: "Volledige reiniging van dakgoten en afvoerbuizen van een appartementsgebouw met 12 wooneenheden.",
      },
      {
        title: "Preventief Onderhoud Woonwijk",
        location: "Hasselt, Limburg",
        description: "Jaarlijkse dakgootreiniging voor een volledige woonwijk als preventief onderhoud.",
      },
    ],
  },
  {
    slug: "ledigen-van-septische-putten",
    title: "Ledigen van septische putten",
    image: serviceLeidingen,
    description:
      "Professioneel ledigen en reinigen van septische putten met gespecialiseerde zuigwagens. Wij zorgen voor een correcte afvoer conform de milieuwetgeving.",
    projects: [
      {
        title: "Septische Put Ledigen Woonhuis",
        location: "Genk, Limburg",
        description: "Ledigen en reinigen van een septische put bij een alleenstaande woning.",
      },
      {
        title: "Septische Putten Vakantiepark",
        location: "Maasmechelen, Limburg",
        description: "Periodiek ledigen van meerdere septische putten op een vakantiepark.",
      },
    ],
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Leegpompen en reinigen",
    image: serviceLeegpompen,
    description:
      "Bij wateroverlast staan wij snel ter plaatse om kelders, putten en terreinen leeg te pompen. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud.",
    projects: [
      {
        title: "Kelder Leegpompen na Overstroming",
        location: "Tongeren, Limburg",
        description: "Spoedinterventie na hevige regenval: kelder volledig leeggepompt en gereinigd.",
      },
      {
        title: "Reiniging Industrieel Rioolstelsel",
        location: "Hasselt, Limburg",
        description: "Periodieke reiniging van het volledige rioleringssysteem van een industrieel complex.",
      },
    ],
  },
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Ontstoppingen en geurdetectie",
    image: serviceOntstoppingen,
    description:
      "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen. Wij sporen geurhinder en rioolvliegjes op aan de bron en verhelpen het probleem duurzaam.",
    projects: [
      {
        title: "Rioolaansluiting Woonwijk",
        location: "Bilzen, Limburg",
        description: "Volledige rioleringsaansluiting en ontstopping voor een nieuwe residentiële verkaveling.",
      },
      {
        title: "Geurdetectie Kantoorgebouw",
        location: "Genk, Limburg",
        description: "Opsporing en verhelping van hardnekkige stankoverlast in een kantoorgebouw.",
      },
    ],
  },
];
