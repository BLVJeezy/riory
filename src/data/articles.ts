import imgOntstopping from "@/assets/service-ontstoppingen-geurdetectie.jpg";
import imgSeptisch from "@/assets/service-leidingen-septisch.jpg";
import imgCamera from "@/assets/service-camera-inspectie.jpg";
import imgRegenput from "@/assets/service-regenput.jpg";
import imgRiolering from "@/assets/service-riolering.jpg";
import imgDakgoot from "@/assets/service-dakgoot.jpg";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}

export const allArticles: Article[] = [
  {
    slug: "wc-verstopt-wat-nu",
    title: "WC verstopt: wat nu? 5 stappen voor u de loodgieter belt",
    excerpt:
      "Een verstopte WC is vervelend, maar niet altijd reden voor paniek. Met deze 5 stappen achterhaalt u snel of u het zelf kunt oplossen — en wanneer u beter belt.",
    image: imgOntstopping,
    category: "Ontstopping",
    date: "2026-01-12",
    readTime: "4 min",
    content: [
      "Een verstopte WC overkomt iedereen wel eens. Voor u paniekeert of meteen naar de telefoon grijpt, zijn er een aantal stappen die u zelf kunt proberen — snel, veilig en zonder breekwerk.",
      "Stap 1: stop met doorspoelen. Elke extra spoelbeurt verhoogt de kans dat het water overloopt. Laat het waterpeil eerst zakken.",
      "Stap 2: probeer een ontstoppingsveer of plopper. Een lichte verstopping door toiletpapier of doekjes lost daar vaak al mee op.",
      "Stap 3: giet voorzichtig een emmer warm water (geen kokend water bij porselein) met een scheutje afwasmiddel in de pot en laat even inwerken.",
      "Stap 4: controleer of het probleem zich beperkt tot één toestel of dat ook andere afvoerpunten in huis traag lopen. Dat laatste wijst vaak op een verstopping verderop in de riolering.",
      "Stap 5: lost het niet op, of komt het steeds terug? Dan zit het probleem dieper in de leiding of riolering. Riory is 24/7 bereikbaar in heel Limburg en Luik met professionele hogedrukapparatuur om elke verstopping — hoe hardnekkig ook — zonder breekwerk te verhelpen.",
    ],
  },
  {
    slug: "septische-put-hoe-vaak-ledigen",
    title: "Septische put ledigen: hoe vaak is écht nodig?",
    excerpt:
      "Te weinig ledigen leidt tot stankoverlast en dure schade, te vaak ledigen kost onnodig geld. Wij zetten de vuistregels op een rij.",
    image: imgSeptisch,
    category: "Septische put",
    date: "2025-11-03",
    readTime: "5 min",
    content: [
      "Een septische put die niet tijdig geledigd wordt, kan verstopt geraken, gaan overlopen of stankoverlast veroorzaken in huis en tuin. Maar hoe vaak is ledigen nu écht nodig?",
      "Als vuistregel geldt: een individuele septische put wordt best om de 1 à 3 jaar geledigd, afhankelijk van het aantal bewoners, het volume van de put en het gebruik. Bij een gezin van vier personen en een gemiddelde put ligt dat meestal rond de 2 jaar.",
      "Let op signalen: trage afvoer in het hele huis, een borrelend geluid in de leidingen, of een onaangename geur in tuin of kelder wijzen erop dat de put aan ledigen toe is.",
      "Regelmatig onderhoud voorkomt niet alleen stankoverlast, maar ook duurdere herstellingen aan de put en de aansluitende leidingen op langere termijn.",
      "Riory ledigt, reinigt en controleert septische putten in heel Limburg en de regio Luik met gespecialiseerde zuigwagens — snel, netjes en met een vaste, transparante prijs.",
    ],
  },
  {
    slug: "signalen-riool-camera-inspectie",
    title: "6 signalen dat uw riool een camera-inspectie nodig heeft",
    excerpt:
      "Terugkerende verstoppingen of rioollucht in huis? Deze signalen wijzen op een dieperliggend probleem dat u zonder breekwerk kunt laten opsporen.",
    image: imgCamera,
    category: "Camera-inspectie",
    date: "2025-09-18",
    readTime: "4 min",
    content: [
      "Een camera-inspectie brengt de exacte toestand van uw riolering in kaart, zonder dat er iets opengebroken hoeft te worden. Maar wanneer is dat nu echt nodig?",
      "1. Terugkerende verstoppingen — als eenzelfde afvoer telkens opnieuw verstopt raakt, zit het probleem meestal dieper dan een simpele ontstopping oplost.",
      "2. Aanhoudende rioollucht in huis, ook na reiniging van sifons en afvoerputjes.",
      "3. Verzakkingen in de tuin of oprit boven het tracé van de riolering.",
      "4. Vochtplekken of een muffe geur in de kelder zonder duidelijke oorzaak.",
      "5. U koopt of verkoopt een woning en wilt zekerheid over de staat van de riolering vóór de overdracht.",
      "6. Uw woning is ouder dan 30 jaar en de riolering is nooit eerder geïnspecteerd.",
      "Herkent u een van deze signalen? Riory voert camera-inspecties uit in heel Limburg en Luik en levert een duidelijk rapport met beelden en advies.",
    ],
  },
  {
    slug: "kelder-water-na-regenval",
    title: "Kelder blank na hevige regenval: oorzaken en snelle oplossingen",
    excerpt:
      "Na een zware regenbui staat het water plots in de kelder. Wij leggen uit wat de meest voorkomende oorzaken zijn en wat u meteen kunt doen.",
    image: imgRegenput,
    category: "Wateroverlast",
    date: "2025-07-22",
    readTime: "5 min",
    content: [
      "Na een hevige regenbui blank staan in de kelder is een van de meest gestreste momenten voor een huiseigenaar. Snel handelen beperkt de schade.",
      "Meest voorkomende oorzaken: een overbelast of verstopt rioolstelsel, een regenput die overloopt, een defecte pompinstallatie, of een terugslagklep die niet meer goed sluit waardoor water terugstroomt.",
      "Wat kunt u meteen doen? Schakel elektrische toestellen in de kelder uit indien veilig, probeer waardevolle spullen te verplaatsen, en bel voor een leegpompdienst als het waterpeil blijft stijgen.",
      "Op langere termijn loont het om de oorzaak te laten opsporen: een camera-inspectie brengt aan het licht of het gaat om een lokale verstopping, een defecte terugslagklep, of een structureel probleem met de riolering.",
      "Riory pompt kelders leeg, reinigt regenputten en spoort de oorzaak van wateroverlast op — 24/7 bereikbaar in heel Limburg, ook tijdens en na noodweer.",
    ],
  },
  {
    slug: "rioollucht-in-huis-oorzaken",
    title: "Rioollucht in huis: 4 vaakst voorkomende oorzaken",
    excerpt:
      "Een vieze geur die maar niet weggaat, ook na poetsen? Dit zijn de meest voorkomende oorzaken van rioollucht in huis — en hoe Riory ze oplost.",
    image: imgRiolering,
    category: "Geurdetectie",
    date: "2025-05-14",
    readTime: "3 min",
    content: [
      "Rioollucht in huis is niet alleen onaangenaam, het kan ook wijzen op een probleem dat beter niet blijft aanslepen.",
      "1. Een droge sifon — bij toestellen die weinig gebruikt worden (bijvoorbeeld een reservetoilet of gootsteen in de bijkeuken) kan het waterslot verdampen, waardoor riooldampen vrij naar binnen kunnen.",
      "2. Een gescheurde of verzakte afvoerleiding die riooldampen laat ontsnappen in muren of vloeren.",
      "3. Een verstopte of slecht werkende ontluchtingsbuis op het dak, waardoor riooldampen zich een weg zoeken via het sanitair binnen.",
      "4. Vetaanslag of organisch materiaal dat zich opstapelt in de afvoer en op termijn een blijvende geur veroorzaakt.",
      "Riory spoort de bron van rioollucht op met professionele geurdetectie en camera-inspectie, en lost het probleem meteen mee op — zonder onnodig breekwerk.",
    ],
  },
  {
    slug: "dakgoot-onderhoud-tips",
    title: "Dakgoot reinigen: waarom het meer is dan bladeren ruimen",
    excerpt:
      "Een verstopte dakgoot lijkt onschuldig, maar kan leiden tot lekkages, vochtschade en zelfs schade aan de fundering. Zo pakt u het goed aan.",
    image: imgDakgoot,
    category: "Onderhoud",
    date: "2025-03-02",
    readTime: "4 min",
    content: [
      "Een dakgoot vol bladeren, mos en vuil lijkt op het eerste gezicht een klein ongemak, maar kan op termijn voor ernstige schade zorgen.",
      "Wat gaat er mis? Regenwater dat niet weg kan, loopt over de rand van de dakgoot en langs de gevel naar beneden. Dat leidt tot vochtplekken, schimmel en op termijn schade aan gevelbepleistering en fundering.",
      "In de winter kan stilstaand water in een verstopte dakgoot bevriezen, uitzetten en de goot laten barsten of loskomen.",
      "Onze aanbeveling: laat de dakgoot minstens twee keer per jaar controleren en reinigen — in het najaar na bladval en in het voorjaar. Bij bomen in de directe omgeving van de woning kan vaker nodig zijn.",
      "Riory reinigt en controleert dakgoten en regenafvoer in heel Limburg en Luik, en verhelpt meteen kleine lekken of losgekomen bevestigingen.",
    ],
  },
];

export const getArticleBySlug = (slug: string) =>
  allArticles.find((article) => article.slug === slug);
