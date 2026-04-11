import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.webp";
import serviceLeidingen from "@/assets/service-leidingen-septisch.webp";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.webp";
import serviceCamera from "@/assets/service-camera-inspectie.webp";
import dakgootHoogte1 from "@/assets/refs/dakgoot-hoogte-1.jpg";
import dakgootHoogte2 from "@/assets/refs/dakgoot-hoogte-2.jpg";
import dakgootHoogte3 from "@/assets/refs/dakgoot-hoogte-3.jpg";
import regenput1 from "@/assets/refs/regenput-1.jpg";
import regenput2 from "@/assets/refs/regenput-2.jpg";
import regenput3 from "@/assets/refs/regenput-3.jpg";
import regenput4 from "@/assets/refs/regenput-4.jpg";
import sifon1 from "@/assets/refs/sifon-1.jpg";
import sifon2 from "@/assets/refs/sifon-2.jpg";
import sifon3 from "@/assets/refs/sifon-3.jpg";

export interface ReferenceProject {
  title: string;
  location: string;
  description: string;
  images?: string[];
}

export interface ReferenceCategory {
  slug: string;
  title: string;
  image: string;
  description: string;
  projects: ReferenceProject[];
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
        title: "Dakgootreiniging op Hoogte",
        location: "Tongeren, Limburg",
        description: "Dakgootreiniging van een hoog appartementsgebouw met behulp van een telescopische camera en speciaal reinigingsmateriaal. Veilig en efficiënt uitgevoerd.",
        images: [dakgootHoogte1, dakgootHoogte2, dakgootHoogte3],
      },
    ],
  },
  {
    slug: "ledigen-van-septische-putten",
    title: "Ledigen van septische putten",
    image: serviceLeidingen,
    description:
      "Professioneel ledigen en reinigen van septische putten met gespecialiseerde zuigwagens. Wij zorgen voor een correcte afvoer conform de milieuwetgeving.",
    projects: [],
  },
  {
    slug: "leegpompen-en-reinigen",
    title: "Leegpompen en reinigen",
    image: serviceLeegpompen,
    description:
      "Bij wateroverlast staan wij snel ter plaatse om kelders, putten en terreinen leeg te pompen. Daarnaast bieden we periodieke reiniging aan als preventief onderhoud.",
    projects: [
      {
        title: "Reinigen Regenput",
        location: "Limburg",
        description: "Volledige reiniging van een regenput inclusief inspectie van leidingen en vlotter. De put werd grondig schoongemaakt zodat het regenwater weer correct kan worden opgevangen.",
        images: [regenput1, regenput2, regenput3, regenput4],
      },
    ],
  },
  {
    slug: "ontstoppingen-en-geurdetectie",
    title: "Ontstoppingen en geurdetectie",
    image: serviceOntstoppingen,
    description:
      "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen. Wij sporen geurhinder en rioolvliegjes op aan de bron en verhelpen het probleem duurzaam.",
    projects: [],
  },
];
