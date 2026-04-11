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
import geurdetectie1 from "@/assets/refs/geurdetectie-1.jpg";
import ontstoppingAfvoerput1 from "@/assets/refs/ontstopping-afvoerput-1.jpg";
import opsporenSeptisch1 from "@/assets/refs/opsporen-septisch-1.jpg";
import septisch1 from "@/assets/refs/septisch-1.jpg";
import septisch2 from "@/assets/refs/septisch-2.jpg";
import septisch3 from "@/assets/refs/septisch-3.jpg";
import septisch4 from "@/assets/refs/septisch-4.jpg";
import septisch5 from "@/assets/refs/septisch-5.jpg";
import septisch6 from "@/assets/refs/septisch-6.jpg";
import septisch7 from "@/assets/refs/septisch-7.jpg";
import septisch8 from "@/assets/refs/septisch-8.jpg";
import septisch9 from "@/assets/refs/septisch-9.jpg";

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
    projects: [
      {
        title: "Ledigen Septische put",
        location: "Limburg",
        description: "Volledige ledigen en vernieuwing van een septische put bij een woning. Inclusief graafwerken, zuiging en heraanleg van de riolering.",
        images: [septisch1, septisch2, septisch3, septisch4, septisch5, septisch6, septisch7, septisch8, septisch9],
      },
      {
        title: "Opsporen septische put",
        location: "Limburg",
        description: "Opsporing en blootleggen van een septische put voor inspectie en onderhoud.",
        images: [opsporenSeptisch1],
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
    projects: [
      {
        title: "Opsporen en traceren gebroken sifon",
        location: "Limburg",
        description: "Opsporing en tracering van een gebroken sifon met gespecialiseerd materiaal. De beschadigde sifon werd gelokaliseerd, uitgegraven en vakkundig hersteld.",
        images: [sifon1, sifon2, sifon3],
      },
      {
        title: "Geurdetectie",
        location: "Limburg",
        description: "Opsporing van geurhinder met rooktesten om lekken in de riolering te detecteren.",
        images: [geurdetectie1],
      },
      {
        title: "Ontstopping afvoerput",
        location: "Limburg",
        description: "Ontstopping van een verstopte afvoerput. De verstopping werd vakkundig verwijderd zodat het water weer correct kan aflopen.",
        images: [ontstoppingAfvoerput1],
      },
    ],
  },
];
