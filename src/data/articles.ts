import malafideImgAsset from "@/assets/malafide-loodgieter-factuur.png.asset.json";
import vrijwilligersImgAsset from "@/assets/vrijwilligers-noodweer.png.asset.json";
import heldenImgAsset from "@/assets/helden-van-hier.png.asset.json";
import { assetUrl } from "@/lib/assetUrl";

export interface ArticleSource {
  label: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
  /** Externe nieuwsbron waarop dit artikel gebaseerd is. */
  source: ArticleSource;
}

export const allArticles: Article[] = [
  {
    slug: "malafide-loodgieters-herkennen",
    title: "Zo herken je een malafide loodgieter of ontstoppingsdienst",
    excerpt:
      "1.400 euro voor het ontstoppen van een toilet? Het Belang van Limburg berichtte over Limburgers die torenhoge facturen kregen van louche ontstoppingsdiensten. Zo herkent u een malafide loodgieter voor het te laat is.",
    image: assetUrl(malafideImgAsset.url),
    category: "Consumeninfo",
    date: "2026-02-10",
    readTime: "4 min",
    content: [
      "Het Belang van Limburg berichtte recent over Limburgers die na een verstopping torenhoge facturen kregen van louche ontstoppingsdiensten — tot 1.400 euro voor het ontstoppen van een toilet. \"Dat is belachelijk\", klonk het terecht bij de gedupeerden.",
      "De truc is telkens dezelfde: online of via een advertentie lijkt de dienst spotgoedkoop, met een lage voorrijkost. Eenmaal ter plaatse wordt plots beweerd dat de verstopping tientallen meters diep zit, aan een prijs per meter. Zo loopt de factuur in enkele minuten op tot honderden of zelfs duizenden euro's — vaak zonder dat de klant vooraf een duidelijke prijsindicatie kreeg.",
      "Hoe herkent u zo'n malafide aanbieder? Let op deze signalen: geen vast adres of ondernemingsnummer op de website, enkel bereikbaar via een mobiel nummer, geen duidelijke offerte of maximumprijs vóór de start van de werken, en aandringen op onmiddellijke (cash) betaling voor er iets is gecontroleerd.",
      "Onze aanbeveling: vraag altijd vooraf een duidelijke prijsindicatie, met een maximumbedrag. Vraag naar het ondernemingsnummer en het fysieke adres van het bedrijf. Twijfelt u? Bel gerust even terug voor u iemand binnenlaat.",
      "Riory is een lokaal, erkend en verzekerd bedrijf in Limburg en de regio Luik. Wij werken met vaste, vooraf gecommuniceerde tarieven — geen verrassingen achteraf, geen prijs per meter die plots oploopt. Twijfelt u over een factuur die u kreeg van een andere dienst? Bel ons gerust voor een eerlijk tweede advies.",
    ],
    source: {
      label: "Het Belang van Limburg — Zo kan je frauduleuze loodgieters herkennen",
      url: "https://www.hbvl.be/regio/limburg/zo-kan-je-frauduleuze-loodgieters-herkennen-1.400-euro-voor-ontstopping-toilet-dat-is-belachelijk/26294678.html",
    },
  },
  {
    slug: "vrijwilligers-noodweer-opruimen-solidariteit",
    title: "Uit alle hoeken van het land: vrijwilligers die meehielpen opruimen na noodweer",
    excerpt:
      "Na zware wateroverlast trokken vrijwilligers van overal naartoe om buren te helpen opruimen. Mensen moesten zich naar eigen zeggen bedwingen om de helpers niet te knuffelen — een mooi voorbeeld van solidariteit na een ramp.",
    image: assetUrl(vrijwilligersImgAsset.url),
    category: "Wateroverlast",
    date: "2025-08-05",
    readTime: "3 min",
    content: [
      "Na zware wateroverlast staat een huishouden vaak van de ene op de andere dag met een ondergelopen kelder, een gezin dat spullen kwijt is en een berg werk om alles weer leefbaar te krijgen. HLN berichtte over hoe vrijwilligers uit alle hoeken van het land naar de getroffen gebieden trokken om mee te helpen opruimen — mensen moesten zich naar eigen zeggen bedwingen om de helpers niet te knuffelen van dankbaarheid.",
      "Met scheppen, emmers en hogedrukreinigers gingen vrijwilligers aan de slag om modder en water uit kelders en woonkamers te halen, meubels naar buiten te dragen en samen met de bewoners een eerste keer op te ruimen. Die spontane solidariteit maakt na een ramp vaak het grootste verschil — niet alleen praktisch, maar ook emotioneel.",
      "Naast alle helpende handen blijft het wel belangrijk om snel professioneel te laten nakijken wat er precies aan de hand is. Water dat blijft staan in kelder of vloer kan op termijn schimmel en structurele schade veroorzaken, en een verstopte of beschadigde riolering lost zichzelf niet op met een emmer en een dweil.",
      "Riory staat 24/7 klaar om kelders leeg te pompen, regenputten te reinigen en de oorzaak van wateroverlast met een camera-inspectie op te sporen — in heel Limburg en de regio Luik, ook tijdens en net na noodweer.",
    ],
    source: {
      label: "HLN — Uit alle hoeken van het land komen vrijwilligers om mee op te ruimen",
      url: "https://www.hln.be/binnenland/uit-alle-hoeken-van-het-land-komen-vrijwilligers-om-mee-op-te-ruimen-mensen-moesten-zich-bedwingen-om-ons-niet-te-knuffelen~ac5e54ef/",
    },
  },
  {
    slug: "helden-van-hier-helpende-handen",
    title: "Helden van Hier: Helpende Handen — hoe Vlaanderen hielp na de overstromingen",
    excerpt:
      "In de VTM-special 'Helden van Hier: Helpende Handen' trokken tal van Vlamingen naar de getroffen gebieden om te helpen opruimen na de overstromingen. Verhalen die inspireren en tonen hoe groot de nood aan snelle hulp kan zijn.",
    image: assetUrl(heldenImgAsset.url),
    category: "Community",
    date: "2025-08-19",
    readTime: "3 min",
    content: [
      "In de VTM-special \"Helden van Hier: Helpende Handen\" volgde de reportagemakers tal van Vlamingen die op eigen initiatief naar de zwaar getroffen gebieden trokken om te helpen na de overstromingen. Gewone mensen die alles opzij zetten om buren en onbekenden bij te staan.",
      "Zo trok Marie-Rose uit Dendermonde met kuisproducten en voeding naar Verviers, en zette Yordi met zijn bedrijf, dat normaal grote opruim- en kuisklussen doet, zich in om ondergelopen huizen in het zwaar getroffen Pepinster leeg te ruimen. Ook de dierenorganisatie 'Natte Pootjes' trok met vrijwilligers naar het rampgebied om verloren huisdieren op te sporen, te vangen en terug bij hun eigenaar te brengen.",
      "Wat deze verhalen gemeen hebben: wanneer het water toeslaat, is de nood aan snelle, praktische hulp enorm — en maakt elke helpende hand het verschil, of het nu gaat om een emmer water, een warme maaltijd of een huisdier dat wordt teruggevonden.",
      "Wij herkennen ons in die inzet. Als professionele dienst voor riolering en afvoer staan wij 24/7 paraat wanneer wateroverlast toeslaat, in heel Limburg en de regio Luik — snel ter plaatse om kelders leeg te pompen, riolen te ontstoppen en de schade zoveel mogelijk te beperken.",
    ],
    source: {
      label: "VTM GO — Helden van Hier: Helpende Handen",
      url: "https://www.vtmgo.be/vtmgo/helden-van-hier-helpende-handen~b68a7ae5-875f-4322-bb71-14626275a7cf",
    },
  },
];

export const getArticleBySlug = (slug: string) =>
  allArticles.find((article) => article.slug === slug);
