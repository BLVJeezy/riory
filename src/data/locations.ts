export interface LocationData {
  slug: string;
  city: string;
  postalCode: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  services: {
    title: string;
    description: string;
    slug: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  nearbyAreas: string[];
}

export const allLocations: LocationData[] = [
  {
    slug: "hasselt",
    city: "Hasselt",
    postalCode: "3500",
    h1: "Loodgieter & Ontstoppingsdienst Hasselt — 24/7 Riory",
    metaTitle: "Loodgieter Hasselt | 24/7 Ontstopping | Riory",
    metaDescription: "Riool verstopt in Hasselt? Riory is binnen 2u ter plaatse — ook in Kermt, Kuringen & Sint-Lambrechts-Herk. ✓ 24/7 ✓ Vaste prijs ✓ 4.9★. Bel nu!",
    intro: "Riory is uw betrouwbare partner voor alle riolerings- en ontstoppingsdiensten in Hasselt en omgeving. Of het nu gaat om een verstopte WC, een gootsteen die niet afloopt, rioollucht in huis of het ledigen van uw septische put — wij staan 24/7 paraat om u snel en vakkundig te helpen. Als hoofdstad van Limburg bedienen wij zowel het centrum van Hasselt als de deelgemeenten Kermt, Kuringen, Stevoort, Wimmertingen en Sint-Lambrechts-Herk. Naast ontstoppingen verzorgt Riory ook professioneel loodgieterwerk en sanitair in Hasselt: van installatie en herstelling van leidingen tot rioolwerken, lekdetectie en aansluitingen — onze loodgieters combineren ervaring met moderne technieken voor elke klus.",
    services: [
      {
        title: "WC en afvoer ontstoppen in Hasselt",
        description: "WC verstopt in Hasselt? Gootsteen of douche die niet afloopt? Onze techniekers zijn binnen 1 à 2 uur ter plaatse met professionele hogedrukapparatuur. Wij verhelpen elke verstopping — van toilet en keukenafvoer tot hoofdriolering — snel en zonder onnodige schade.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Hasselt",
        description: "Met een professionele camera-inspectie brengen wij de toestand van uw riool in Hasselt nauwkeurig in kaart. Ideaal bij terugkerende verstoppingen, rioollucht in huis of bij de aankoop van een woning. U ontvangt een duidelijk rapport met beelden en advies.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Hasselt",
        description: "Septische put of beerput vol in Hasselt? Wij ledigen, reinigen en controleren uw put met gespecialiseerde zuigwagens. Regelmatig onderhoud voorkomt overlast en dure herstellingen.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen en regenput reinigen in Hasselt",
        description: "Kelder onder water of regenput die overloopt in Hasselt? Wij pompen snel leeg, sporen de oorzaak op en bieden preventief onderhoud aan om toekomstige problemen te voorkomen.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Hoe snel kan Riory ter plaatse zijn in Hasselt?",
        answer: "Bij spoedgevallen zoals een verstopte WC of wateroverlast streven wij ernaar om binnen 1 à 2 uur in Hasselt ter plaatse te zijn. Wij zijn 24/7 bereikbaar, ook in het weekend en op feestdagen.",
      },
      {
        question: "Wat kost een ontstopping in Hasselt?",
        answer: "Onze prijzen zijn transparant en vast, zonder verrassingen achteraf. Voor een duidelijke prijsschatting op maat van uw situatie kunt u terecht op onze prijscalculator (/prijscalculator). U krijgt altijd vooraf een helder voorstel.",
      },
      {
        question: "Bedient Riory ook de deelgemeenten van Hasselt?",
        answer: "Absoluut. Wij bedienen heel Hasselt inclusief Kermt, Kuringen, Stevoort, Wimmertingen, Sint-Lambrechts-Herk en alle omliggende wijken.",
      },
    ],
    nearbyAreas: ["Genk", "Zonhoven", "Diepenbeek", "Herk-de-Stad", "Lummen"],
  },
  {
    slug: "genk",
    city: "Genk",
    postalCode: "3600",
    h1: "Loodgieter & Ontstoppingsdienst Genk — 24/7 Riory",
    metaTitle: "Loodgieter Genk | 24/7 Ontstopping | Riory",
    metaDescription: "WC of riool verstopt in Genk? Riory lost het op — ook in Winterslag, Waterschei & Zwartberg. ✓ 24/7 ✓ Camera-inspectie ✓ Vaste prijs. Bel nu!",
    intro: "In Genk en omgeving kunt u rekenen op Riory voor snelle en professionele riolerings- en ontstoppingsdiensten. Van een verstopte WC of douche die niet afloopt tot het ledigen van septische putten en camera-inspecties — wij zijn 24/7 bereikbaar. Wij bedienen heel Genk, inclusief Winterslag, Waterschei, Zwartberg, Bokrijk en Gelieren. Riory is ook uw vaste loodgieter in Genk voor sanitair, loodgieterwerk en rioolwerken: leidingen plaatsen of herstellen, lekken opsporen, badkamers aansluiten en alle aansluitingen op het rioolnet — vakkundig en met vaste prijzen.",
    services: [
      {
        title: "WC en afvoer ontstoppen in Genk",
        description: "Verstopte WC, gootsteen of douche in Genk? Onze ontstoppingsdienst is 24/7 bereikbaar. Met professionele hogedrukapparatuur maken wij elke verstopping vrij — van toiletten en keukens tot hoofdrioleringen.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Genk",
        description: "Laat uw riool in Genk inspecteren met professionele camera-apparatuur. Wij lokaliseren breuken, wortelingroei en verstoppingen zonder breekwerk. Ideaal bij aankoop van een woning of terugkerende rioolproblemen.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Genk",
        description: "Septische put vol of beerput die overloopt in Genk? Wij zorgen voor een snelle en grondige ruiming met gespecialiseerde zuigwagens. Regelmatig ledigen voorkomt stankoverlast en rioolproblemen.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen in Genk",
        description: "Wateroverlast in uw kelder in Genk? Wij pompen snel leeg en sporen de oorzaak op. Ook voor het reinigen van regenputten en preventief onderhoud van uw rioleringssysteem.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Hoe snel is Riory ter plaatse in Genk?",
        answer: "Bij noodgevallen zoals een verstopte afvoer of ondergelopen kelder zijn wij meestal binnen 1 à 2 uur in Genk aanwezig. Onze dienst is 24/7 beschikbaar.",
      },
      {
        question: "Werkt Riory ook in de deelgemeenten van Genk?",
        answer: "Ja, wij bedienen heel Genk inclusief Winterslag, Waterschei, Zwartberg, Bokrijk, Gelieren en alle omliggende wijken.",
      },
      {
        question: "Kan ik een camera-inspectie laten uitvoeren bij aankoop van een woning in Genk?",
        answer: "Zeker. Een riool camera-inspectie bij aankoop geeft u zekerheid over de staat van de riolering. U ontvangt een rapport met beelden dat u kunt voorleggen aan de verkoper.",
      },
    ],
    nearbyAreas: ["Hasselt", "As", "Zutendaal", "Lanaken", "Maasmechelen"],
  },
  {
    slug: "hoeselt",
    city: "Hoeselt",
    postalCode: "3730",
    h1: "Loodgieter & Ontstoppingsdienst Hoeselt — 24/7 Riory",
    metaTitle: "Loodgieter Hoeselt | 24/7 Ontstopping | Riory",
    metaDescription: "Loodgieter & ontstoppingsdienst in Hoeselt — thuisbasis van Riory. Binnen 30 min ter plaatse. ✓ 24/7 ✓ Septische put ✓ Vaste prijs. Bel nu!",
    intro: "Als lokale specialist bedient Riory Hoeselt en omgeving met snelle en professionele rioleringsdiensten. Of uw WC verstopt zit, de gootsteen niet afloopt, u rioollucht ruikt in huis of uw septische put geledigd moet worden — wij zijn dag en nacht bereikbaar. Vanuit onze thuisbasis in de regio zijn wij razendsnel ter plaatse in Hoeselt, Romershoven, Werm, Alt-Hoeselt en Schalkhoven. Naast rioolwerken bent u bij Riory ook aan het juiste adres voor loodgieterwerk en sanitair in Hoeselt: lekkages herstellen, leidingen vernieuwen, kranen en toiletten plaatsen en alle bijhorende aansluitingen.",
    services: [
      {
        title: "Ontstopping in Hoeselt",
        description: "Verstopte WC, douche of gootsteen in Hoeselt? Wij verhelpen elke verstopping vakkundig met hogedrukreiniging. Ook bij borrelende afvoeren, rioolvliegjes of water dat terugkomt via de douche staan wij paraat.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Hoeselt",
        description: "Laat uw riolering in Hoeselt inspecteren met professionele cameratools. Wij brengen scheuren, verzakkingen en wortelingroei nauwkeurig in kaart — zonder breekwerk.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Hoeselt",
        description: "Septische put of beerput vol in Hoeselt? Riory komt snel langs met gespecialiseerde zuigwagens voor een grondige ruiming en reiniging.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen in Hoeselt",
        description: "Wateroverlast in Hoeselt? Wij pompen kelders en terreinen snel leeg en reinigen regenputten om herhaling te voorkomen.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Hoe snel kan Riory in Hoeselt zijn?",
        answer: "Hoeselt ligt in ons kerngebied. Bij spoedgevallen zijn wij vaak al binnen 30 minuten tot 1 uur ter plaatse. Wij zijn 24/7 bereikbaar.",
      },
      {
        question: "Wat kost het ledigen van een septische put in Hoeselt?",
        answer: "De prijs voor het ledigen van een septische put in Hoeselt hangt af van de grootte en toegankelijkheid. Neem contact op voor een vrijblijvende prijsindicatie.",
      },
    ],
    nearbyAreas: ["Bilzen", "Tongeren", "Riemst", "Kortessem", "Wellen"],
  },
  {
    slug: "tongeren",
    city: "Tongeren",
    postalCode: "3700",
    h1: "Loodgieter & Ontstoppingsdienst Tongeren — 24/7 Riory",
    metaTitle: "Loodgieter Tongeren | 24/7 Ontstopping | Riory",
    metaDescription: "Riool of WC verstopt in Tongeren? Riory is 24/7 actief in Tongeren, Vreren & Borgloon. ✓ Camera-inspectie ✓ Septische put ✓ Vaste prijs. Bel!",
    intro: "In Tongeren, de oudste stad van België, kunt u rekenen op Riory voor alle riolerings- en ontstoppingsdiensten. Van een verstopte WC of gootsteen tot het ledigen van septische putten en camera-inspecties van rioleringen — wij zijn 24/7 beschikbaar. Wij bedienen het centrum van Tongeren en alle deelgemeenten: Piringen, Riksingen, Mal, Nerem, Rutten, Vreren, Widooie, Berg en Kolmont. Riory is bovendien uw loodgieter in Tongeren voor sanitair en loodgieterwerk: nieuwe leidingen, lekherstel, aansluitingen op het rioolnet en alle rioolwerken in en rond uw woning — vakwerk met vaste prijzen.",
    services: [
      {
        title: "Ontstopping in Tongeren",
        description: "WC verstopt in Tongeren? Douche die niet afloopt of gootsteen die vastloopt? Onze techniekers komen snel ter plaatse met professionele apparatuur voor een duurzame oplossing.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Tongeren",
        description: "Rioolproblemen in Tongeren? Met een camera-inspectie brengen wij de exacte oorzaak in kaart. Vooral in de historische kern van Tongeren zijn oudere rioleringen gevoelig voor slijtage en wortelingroei.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Tongeren",
        description: "Veel woningen in Tongeren beschikken over een septische put of beerput. Wij ledigen en reinigen deze vakkundig met gespecialiseerde zuigwagens.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen in Tongeren",
        description: "Kelder onder water in Tongeren na hevige regenval? Wij pompen snel leeg, sporen de oorzaak op en adviseren over preventieve maatregelen.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Is Riory ook actief in de deelgemeenten van Tongeren?",
        answer: "Ja, wij bedienen heel Tongeren inclusief Piringen, Riksingen, Mal, Nerem, Rutten, Vreren, Widooie, Berg en Kolmont.",
      },
      {
        question: "Hoe snel is Riory ter plaatse bij een spoedgeval in Tongeren?",
        answer: "Bij dringende verstoppingen of wateroverlast in Tongeren zijn wij doorgaans binnen 1 à 2 uur aanwezig. Wij zijn 24/7 bereikbaar.",
      },
    ],
    nearbyAreas: ["Bilzen", "Hoeselt", "Riemst", "Borgloon", "Heers"],
  },
  {
    slug: "maasmechelen",
    city: "Maasmechelen",
    postalCode: "3630",
    h1: "Loodgieter & Ontstoppingsdienst Maasmechelen — 24/7 Riory",
    metaTitle: "Loodgieter Maasmechelen | 24/7 Ontstopping | Riory",
    metaDescription: "Verstopte afvoer in Maasmechelen? Riory lost het op — ook in Eisden, Opgrimbie & Vucht. ✓ 24/7 ✓ Hogedruk ontstopping ✓ Vaste prijs. Bel nu!",
    intro: "Riory biedt snelle en professionele rioleringsdiensten in Maasmechelen en omgeving. Of het gaat om een verstopte WC, een douche die niet afloopt, rioollucht in huis of het ruimen van een septische put — wij zijn 24/7 bereikbaar. Wij bedienen heel Maasmechelen, inclusief Mechelen-aan-de-Maas, Eisden, Opgrimbie, Leut, Vucht en Kotem. Daarnaast verzorgen onze loodgieters in Maasmechelen ook sanitair en loodgieterwerk: plaatsing en herstelling van leidingen, lekdetectie en alle rioolwerken — efficiënt en met heldere tarieven.",
    services: [
      {
        title: "Ontstopping in Maasmechelen",
        description: "Verstopte WC, gootsteen of afvoer in Maasmechelen? Onze ervaren techniekers lossen elke verstopping op met professionele hogedrukapparatuur. Ook bij rioolvliegjes, borrelende afvoeren of stankoverlast.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Maasmechelen",
        description: "Laat uw riolering in Maasmechelen inspecteren met camera-apparatuur. Ideaal bij terugkerende problemen, bij aankoop van een woning of voor preventieve controle.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Maasmechelen",
        description: "Septische put vol in Maasmechelen? Wij ruimen en reinigen uw put met gespecialiseerde zuigwagens voor een zorgeloze werking.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen in Maasmechelen",
        description: "Wateroverlast in uw kelder in Maasmechelen? Wij pompen snel leeg en reinigen regenputten om toekomstige overlast te voorkomen.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Hoe snel kan Riory ter plaatse zijn in Maasmechelen?",
        answer: "Bij spoedgevallen streven wij ernaar om binnen 1 à 2 uur in Maasmechelen aanwezig te zijn. Onze dienst is 24/7 beschikbaar.",
      },
      {
        question: "Werkt Riory ook in Eisden en Opgrimbie?",
        answer: "Ja, wij bedienen heel Maasmechelen inclusief Mechelen-aan-de-Maas, Eisden, Opgrimbie, Leut, Vucht en Kotem.",
      },
    ],
    nearbyAreas: ["Genk", "Lanaken", "Dilsen-Stokkem", "As", "Zutendaal"],
  },
  {
    slug: "sint-truiden",
    city: "Sint-Truiden",
    postalCode: "3800",
    h1: "Loodgieter & Ontstoppingsdienst Sint-Truiden — 24/7 Riory",
    metaTitle: "Loodgieter Sint-Truiden | 24/7 Ontstopping | Riory",
    metaDescription: "Riool verstopt in Sint-Truiden? Veel woningen hier hebben septische put — Riory kent het. ✓ 24/7 ✓ Zuigwagen ✓ Vaste prijs. Bel nu!",
    intro: "In Sint-Truiden en de ruime omgeving biedt Riory professionele riolerings- en ontstoppingsdiensten. Van een verstopte WC of gootsteen die niet afloopt tot het ledigen van septische putten en camera-inspecties — wij staan dag en nacht klaar. Wij bedienen het centrum van Sint-Truiden en alle deelgemeenten: Aalst, Brustem, Engelmanshoven, Gelinden, Groot-Gelmen, Kerkom, Melveren, Ordingen, Velm en Zepperen. Riory verzorgt ook al uw loodgieterwerk en sanitair in Sint-Truiden: leidingen vernieuwen, lekken opsporen, kranen en toiletten plaatsen en alle bijhorende rioolwerken.",
    services: [
      {
        title: "Ontstopping in Sint-Truiden",
        description: "WC verstopt in Sint-Truiden? Douche loopt niet af? Gootsteen vastgelopen? Onze techniekers komen snel ter plaatse met hogedrukapparatuur voor een effectieve en duurzame oplossing.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Camera-inspectie riool in Sint-Truiden",
        description: "Terugkerende verstoppingen of rioollucht in uw woning in Sint-Truiden? Een camera-inspectie brengt de oorzaak nauwkeurig in kaart zonder breekwerk.",
        slug: "camera-inspectie",
      },
      {
        title: "Septische put ledigen in Sint-Truiden",
        description: "In het buitengebied van Sint-Truiden zijn veel woningen aangesloten op een septische put. Riory ledigt en reinigt uw put professioneel met gespecialiseerde zuigwagens.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Kelder leegpompen in Sint-Truiden",
        description: "Kelder onder water in Sint-Truiden? Regenput die overloopt? Wij pompen snel leeg en bieden preventief onderhoud aan voor uw rioleringssysteem.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Hoe snel kan Riory in Sint-Truiden zijn?",
        answer: "Bij noodgevallen zijn wij doorgaans binnen 1 tot 2 uur in Sint-Truiden aanwezig. Wij zijn 24/7 bereikbaar, ook in het weekend.",
      },
      {
        question: "Bedient Riory ook deelgemeenten van Sint-Truiden?",
        answer: "Ja, wij zijn actief in heel Sint-Truiden inclusief Aalst, Brustem, Engelmanshoven, Gelinden, Groot-Gelmen, Kerkom, Melveren, Ordingen, Velm en Zepperen.",
      },
    ],
    nearbyAreas: ["Hasselt", "Borgloon", "Gingelom", "Herk-de-Stad", "Nieuwerkerken"],
  },
  {
    slug: "diepenbeek",
    city: "Diepenbeek",
    postalCode: "3590",
    h1: "Loodgieter & Ontstoppingsdienst Diepenbeek — 24/7 Riory",
    metaTitle: "Loodgieter Diepenbeek | 24/7 Ontstopping | Riory",
    metaDescription: "Loodgieter & ontstoppingsdienst in Diepenbeek — buren van Hasselt, bediend vanuit Bilzen. ✓ 24/7 ✓ Snel ter plaatse ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV is uw vaste loodgieter en ontstoppingsdienst in Diepenbeek en de omliggende gemeenten Rooierheide en Lutselus. Vanuit onze thuisbasis in Limburg staan wij dag en nacht klaar voor woningen, bedrijven en syndici in heel Diepenbeek. Diepenbeek ligt op de grens van stedelijk Hasselt en het meer landelijke Limburg — een mix van recente verkavelingen en oudere woningen met verouderde leidingen. Wij verzorgen al uw loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk. Riory is 24/7 bereikbaar en staat doorgaans binnen de 2 uur ter plaatse, ook in het weekend.",
    services: [
      { title: "Loodgieter in Diepenbeek", description: "Sanitair, leidingen, lekherstel en rioolwerken in Diepenbeek door ervaren loodgieters. Snelle interventie en heldere prijzen.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Diepenbeek", description: "Verstopte WC, gootsteen of afvoer in Diepenbeek? Onze hogedrukapparatuur lost elke verstopping op.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Diepenbeek", description: "Professionele camera-inspectie van uw riolering in Diepenbeek — diagnose zonder breekwerk.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Diepenbeek", description: "Riory ledigt en reinigt uw septische put in Diepenbeek met gespecialiseerde zuigwagens.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Diepenbeek?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Diepenbeek en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Doet Riory ook ontstoppingen in Diepenbeek tijdens het weekend?", answer: "Ja, onze ontstoppingsdienst in Diepenbeek werkt 24/7, ook in het weekend en op feestdagen." },
      { question: "Welke loodgieterwerken voert Riory uit in Diepenbeek?", answer: "Wij verzorgen sanitair, leidingen plaatsen of vervangen, lekdetectie, herstellingen en alle rioolwerken in en rond uw woning in Diepenbeek." },
    ],
    nearbyAreas: ["Hasselt", "Genk", "Bilzen", "Zonhoven", "Hoeselt"],
  },
  {
    slug: "riemst",
    city: "Riemst",
    postalCode: "3770",
    h1: "Loodgieter & Ontstoppingsdienst Riemst — 24/7 Riory",
    metaTitle: "Loodgieter Riemst | 24/7 Ontstopping | Riory",
    metaDescription: "Riool of WC verstopt in Riemst? Riory is actief in Riemst, Vroenhoven & Vlijtingen. ✓ 24/7 ✓ Camera-inspectie ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV is de lokale loodgieter en ontstoppingsdienst voor Riemst en de omliggende dorpen Vroenhoven, Kanne, Millen en Zichen-Zussen-Bolder. Riemst is een grensstreekgemeente met veel landelijke woningen, hoeves en oudere rioleringen — precies het type omgeving waar septische putten en trage afvoeren vaker voorkomen. Onze techniekers bedienen heel de gemeente, van het centrum tot in de kleinste deelgemeenten. Wij verzorgen al uw loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk. Riory is 24/7 bereikbaar en staat dankzij onze centrale ligging snel ter plaatse.",
    services: [
      { title: "Loodgieter in Riemst", description: "Sanitair en loodgieterwerk in Riemst: leidingen, kranen, toiletten, lekdetectie en herstellingen.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Riemst", description: "Verstopte afvoer of WC in Riemst? Wij komen snel langs met professionele apparatuur.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Riemst", description: "Brengt scheuren, verstoppingen en wortelingroei nauwkeurig in kaart zonder breekwerk.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Riemst", description: "Riory ledigt en reinigt septische putten en beerputten in Riemst met zuigwagens.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Riemst?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Riemst en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Vroenhoven en Kanne?", answer: "Ja, wij zijn actief in heel Riemst inclusief Vroenhoven, Kanne, Millen, Zichen-Zussen-Bolder en alle omliggende deelgemeenten." },
      { question: "Wat kost een ontstopping in Riemst?", answer: "Onze tarieven zijn vast en transparant. Vraag een offerte of gebruik onze prijscalculator voor een snelle indicatie." },
    ],
    nearbyAreas: ["Bilzen", "Tongeren", "Hoeselt", "Maasmechelen", "Lanaken"],
  },
  {
    slug: "wellen",
    city: "Wellen",
    postalCode: "3830",
    h1: "Loodgieter & Ontstoppingsdienst Wellen — 24/7 Riory",
    metaTitle: "Loodgieter Wellen | 24/7 Ontstopping | Riory",
    metaDescription: "Verstopte afvoer of septische put in Wellen? Riory helpt 24/7 — ook in Ulbeek & Wellen-centrum. ✓ Vaste prijs ✓ Snel ter plaatse. Bel nu!",
    intro: "Riory BV is uw loodgieter en ontstoppingsdienst in Wellen en de omliggende dorpen Berlingen en Ulbeek. Wellen ligt in het hart van Haspengouw — een regio met veel fruitteelt, kleigrond en oudere woningen die vaker kampen met verzakkende leidingen of volle septische putten. Onze ploeg kent de regio en is razendsnel ter plaatse voor zowel particulieren als ondernemingen. Wij staan in voor loodgieterwerk, rioolentstoppingen, camera-inspecties, het ledigen van septische putten en rioolreiniging onder hoge druk. Riory is 24/7 bereikbaar en lost uw probleem doorgaans binnen de 2 uur op.",
    services: [
      { title: "Loodgieter in Wellen", description: "Sanitair, leidingen, kranen en lekherstel in Wellen door ervaren loodgieters.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Wellen", description: "Verstopte WC, douche of gootsteen in Wellen? Wij verhelpen het snel met hogedrukreiniging.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Wellen", description: "Nauwkeurige diagnose van uw rioolstelsel in Wellen — zonder breekwerk.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Wellen", description: "Riory ledigt en reinigt septische putten in Wellen vakkundig en grondig.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Wellen?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Wellen en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Werkt Riory ook 's nachts in Wellen?", answer: "Ja, onze ontstoppingsdienst en loodgieter zijn 24/7 beschikbaar in Wellen — ook 's nachts, in het weekend en op feestdagen." },
      { question: "Doet Riory ook Berlingen en Ulbeek?", answer: "Ja, wij bedienen heel de gemeente Wellen inclusief de deelgemeenten Berlingen en Ulbeek." },
    ],
    nearbyAreas: ["Borgloon", "Alken", "Kortessem", "Tongeren", "Hoeselt"],
  },
  {
    slug: "zutendaal",
    city: "Zutendaal",
    postalCode: "3690",
    h1: "Loodgieter & Ontstoppingsdienst Zutendaal — 24/7 Riory",
    metaTitle: "Loodgieter Zutendaal | 24/7 Ontstopping | Riory",
    metaDescription: "Loodgieter & ontstoppingsdienst in Zutendaal — landelijke gemeente, veel septische putten. Riory 24/7. ✓ Zuigwagen ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV verzorgt loodgieterwerk en ontstoppingen in Zutendaal en de omliggende kernen Wiemesmeer en Papendaal. Zutendaal is een landelijke gemeente met veel vrijstaande woningen en hoeves — en dat betekent in de praktijk veel septische putten en regenputten die periodiek onderhoud nodig hebben. Onze techniekers bedienen het volledige grondgebied van de gemeente, van centrum tot in het buitengebied richting As en Genk. Wij voeren al uw loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk uit. Riory is 24/7 bereikbaar en garandeert een snelle interventie.",
    services: [
      { title: "Loodgieter in Zutendaal", description: "Sanitair, leidingen plaatsen of herstellen en lekdetectie in Zutendaal.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Zutendaal", description: "Verstopping in Zutendaal snel verholpen met professionele hogedrukapparatuur.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Zutendaal", description: "Diagnose van uw rioolstelsel in Zutendaal met professionele camera-inspectie.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Zutendaal", description: "Ledigen en reinigen van septische putten in Zutendaal met zuigwagens.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Zutendaal?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Zutendaal en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Wiemesmeer en Papendaal?", answer: "Ja, wij zijn actief in heel Zutendaal inclusief Wiemesmeer, Papendaal en alle gehuchten." },
      { question: "Wat doet Riory in Zutendaal naast ontstoppen?", answer: "Loodgieterwerk, sanitair, camera-inspecties, septische put ledigen en alle rioolwerken in en rond uw woning." },
    ],
    nearbyAreas: ["Genk", "As", "Maasmechelen", "Bilzen", "Lanaken"],
  },
  {
    slug: "vreren",
    city: "Vreren",
    postalCode: "3700",
    h1: "Loodgieter & Ontstoppingsdienst Vreren — 24/7 Riory",
    metaTitle: "Loodgieter Vreren | 24/7 Ontstopping | Riory",
    metaDescription: "Riool verstopt in Vreren? Riory is uw lokale ontstoppingsdienst — vlakbij Tongeren. ✓ 24/7 ✓ Septische put ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV bedient Vreren — deelgemeente van Tongeren — en de omliggende dorpen Rutten en Nerem voor alle loodgieter- en rioolwerken. Vreren is een landelijk dorp met oudere woningen en rioleringen die dateren uit een tijd dat septische putten de standaard waren. Onze ploeg is goed vertrouwd met die oudere infrastructuur en pakt elke opdracht doelgericht aan. Wij voeren loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk uit. Riory is 24/7 bereikbaar en staat snel bij u ter plaatse in Vreren.",
    services: [
      { title: "Loodgieter in Vreren", description: "Sanitair, leidingen en lekherstel in Vreren door ervaren loodgieters.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Vreren", description: "Wij ontstoppen WC, gootsteen en afvoer in Vreren met hogedrukapparatuur.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Vreren", description: "Diagnose van oudere rioleringen in Vreren met camera-inspectie.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Vreren", description: "Riory ledigt en reinigt septische putten in Vreren grondig en netjes.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Vreren?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Vreren en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Rutten en Nerem?", answer: "Ja, wij zijn actief in heel de deelgemeente Vreren en de omliggende dorpen Rutten en Nerem." },
      { question: "Werkt Riory in Vreren ook in het weekend?", answer: "Ja, onze loodgieter en ontstoppingsdienst zijn 24/7 beschikbaar in Vreren — ook in het weekend en op feestdagen." },
    ],
    nearbyAreas: ["Tongeren", "Riemst", "Hoeselt", "Bilzen", "Borgloon"],
  },
  {
    slug: "vliermaal",
    city: "Vliermaal",
    postalCode: "3723",
    h1: "Loodgieter & Ontstoppingsdienst Vliermaal — 24/7 Riory",
    metaTitle: "Loodgieter Vliermaal | 24/7 Ontstopping | Riory",
    metaDescription: "Verstopte afvoer in Vliermaal? Riory bedient Vliermaal & Kortessem — snel ter plaatse vanuit Bilzen. ✓ 24/7 ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV is de lokale loodgieter en ontstoppingsdienst in Vliermaal — deelgemeente van Kortessem — en de omliggende dorpen Vliermaalroot en Guigoven. Dit is typisch Haspengouws buitengebied: veel hoeves, fruitboomgaarden en woningen die niet zijn aangesloten op het centrale rioolnet. Septische putten zijn hier de regel. Onze techniekers staan dag en nacht klaar voor woningen, landbouwbedrijven en hoeves in de regio. Wij voeren loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk uit. Riory is 24/7 bereikbaar en staat snel bij u ter plaatse.",
    services: [
      { title: "Loodgieter in Vliermaal", description: "Sanitair en loodgieterwerk in Vliermaal: leidingen, lekdetectie en herstellingen.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Vliermaal", description: "Snelle ontstopping van WC, afvoer en hoofdriolering in Vliermaal.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Vliermaal", description: "Diagnose van uw rioolstelsel in Vliermaal zonder breekwerk.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Vliermaal", description: "Septische put of beerput in Vliermaal? Wij ledigen en reinigen vakkundig.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Vliermaal?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Vliermaal en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Vliermaalroot en Guigoven?", answer: "Ja, wij zijn actief in heel Vliermaal en de omliggende dorpen Vliermaalroot en Guigoven." },
      { question: "Doet Riory ook landbouwbedrijven in Vliermaal?", answer: "Zeker, wij hebben veel ervaring met rioolwerken voor woningen, hoeves en landbouwbedrijven in en rond Vliermaal." },
    ],
    nearbyAreas: ["Kortessem", "Borgloon", "Hoeselt", "Tongeren", "Alken"],
  },
  {
    slug: "kortessem",
    city: "Kortessem",
    postalCode: "3720",
    h1: "Loodgieter & Ontstoppingsdienst Kortessem — 24/7 Riory",
    metaTitle: "Loodgieter Kortessem | 24/7 Ontstopping | Riory",
    metaDescription: "Riool of WC verstopt in Kortessem? Riory 24/7 actief in Kortessem, Vliermaal & Guigoven. ✓ Camera-inspectie ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV is uw vaste loodgieter en ontstoppingsdienst in Kortessem en de deelgemeenten Vliermaal, Guigoven en Wintershoven. Kortessem is een landelijke fruitstreekgemeente in het hart van Haspengouw, met veel oudere woningen en een rioleringsstelsel dat niet overal is uitgebreid. Rioolproblemen en volle septische putten horen hier bij het dagelijkse straatbeeld. Onze techniekers bedienen het centrum en het ruime buitengebied. Wij verzorgen loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk. Riory is 24/7 bereikbaar en doorgaans binnen de 2 uur ter plaatse.",
    services: [
      { title: "Loodgieter in Kortessem", description: "Sanitair, leidingen, kranen, toiletten en lekherstel in Kortessem.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Kortessem", description: "Verstopte afvoer in Kortessem? Wij komen snel langs met hogedrukreiniging.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Kortessem", description: "Camera-inspectie van uw riolering in Kortessem — duidelijk rapport met beelden.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Kortessem", description: "Ledigen en reinigen van septische putten in Kortessem.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Kortessem?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Kortessem en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Wintershoven en Guigoven?", answer: "Ja, wij bedienen heel Kortessem inclusief de deelgemeenten Vliermaal, Guigoven en Wintershoven." },
      { question: "Wat kost een ontstopping in Kortessem?", answer: "Onze prijzen zijn vast en transparant. Vraag een offerte aan of bereken zelf via onze prijscalculator." },
    ],
    nearbyAreas: ["Hoeselt", "Borgloon", "Wellen", "Alken", "Tongeren"],
  },
  {
    slug: "alken",
    city: "Alken",
    postalCode: "3570",
    h1: "Loodgieter & Ontstoppingsdienst Alken — 24/7 Riory",
    metaTitle: "Loodgieter Alken | 24/7 Ontstopping | Riory",
    metaDescription: "Verstopte gootsteen of riool in Alken? Riory is uw ontstoppingsdienst tussen Hasselt en Tongeren. ✓ 24/7 ✓ Vaste prijs. Bel nu!",
    intro: "Riory BV staat in Alken en de omliggende dorpen Sint-Joris en Terkoest paraat voor alle loodgieter- en rioolwerken. Alken ligt middenin de as tussen Hasselt en Tongeren — een regio met een mix van recent gebouwde verkavelingen en oudere dorpswoningen met leidingen die al decennia meegaan. Onze techniekers bedienen heel de gemeente, ook in het meer landelijke buitengebied. Wij voeren loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk uit. Riory is 24/7 bereikbaar en garandeert een snelle interventie in Alken.",
    services: [
      { title: "Loodgieter in Alken", description: "Sanitair en loodgieterwerk in Alken: leidingen, kranen, toiletten en lekherstel.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Alken", description: "Verstopping in Alken snel en grondig opgelost met hogedrukapparatuur.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Alken", description: "Camera-inspectie van uw rioolstelsel in Alken zonder breekwerk.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Alken", description: "Riory ledigt en reinigt septische putten in Alken met zuigwagens.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Alken?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Alken en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook Sint-Joris en Terkoest?", answer: "Ja, wij zijn actief in heel Alken inclusief Sint-Joris en Terkoest." },
      { question: "Werkt Riory ook 's nachts in Alken?", answer: "Ja, onze loodgieter en ontstoppingsdienst zijn 24/7 beschikbaar in Alken — ook 's nachts en in het weekend." },
    ],
    nearbyAreas: ["Hasselt", "Wellen", "Borgloon", "Kortessem", "Diepenbeek"],
  },
  {
    slug: "borgloon",
    city: "Borgloon",
    postalCode: "3840",
    h1: "Loodgieter & Ontstoppingsdienst Borgloon — 24/7 Riory",
    metaTitle: "Loodgieter Borgloon | 24/7 Ontstopping | Riory",
    metaDescription: "Riool verstopt in Borgloon? Fruitstreek, veel septische putten — Riory kent het. ✓ 24/7 ✓ Zuigwagen ✓ Ledigen & reinigen. Bel nu!",
    intro: "Riory BV is uw vaste loodgieter en ontstoppingsdienst in Borgloon — hart van Haspengouw — en de omliggende dorpen Kuttekoven, Hendrieken en Voort. Borgloon is bekend om zijn fruitteelt en prachtig landschap, maar ook om de vele hoeves en oudere woningen met septische putten die geregeld geledigd moeten worden. De kleigrond in de regio zorgt bovendien voor meer verzakkingen in rioolbuizen dan elders in Limburg. Onze techniekers bedienen heel het grondgebied, ook voor de vele fruitteeltbedrijven en hoeves in de regio. Wij verzorgen loodgieterwerk, rioolentstoppingen, camera-inspecties, septische put ledigen en rioolreiniging met hogedruk. Riory is 24/7 bereikbaar en doorgaans binnen de 2 uur ter plaatse.",
    services: [
      { title: "Loodgieter in Borgloon", description: "Sanitair en loodgieterwerk in Borgloon: leidingen, kranen, lekdetectie en herstellingen.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Ontstopping in Borgloon", description: "Verstopte afvoer of WC in Borgloon? Wij verhelpen het vakkundig met hogedruk.", slug: "ontstoppingen-en-geurdetectie" },
      { title: "Camera-inspectie riool in Borgloon", description: "Professionele camera-inspectie van uw riolering in Borgloon.", slug: "camera-inspectie" },
      { title: "Septische put ledigen in Borgloon", description: "Ledigen en reinigen van septische putten in Borgloon met gespecialiseerde zuigwagens.", slug: "septische-put-ledigen" },
    ],
    faq: [
      { question: "Hoe snel komt een loodgieter van Riory ter plaatse in Borgloon?", answer: "Riory BV is 24/7 bereikbaar en staat bij spoedgevallen in Borgloon en omgeving doorgaans binnen de 2 uur ter plaatse." },
      { question: "Bedient Riory ook fruitbedrijven in Borgloon?", answer: "Ja, wij hebben ervaring met loodgieterwerk en rioolwerken voor woningen, hoeves en fruitteeltbedrijven in Borgloon en heel Haspengouw." },
      { question: "Bedient Riory ook Kuttekoven en Voort?", answer: "Ja, wij zijn actief in heel Borgloon inclusief Kuttekoven, Hendrieken, Voort en alle deelgemeenten." },
    ],
    nearbyAreas: ["Tongeren", "Sint-Truiden", "Wellen", "Kortessem", "Heers"],
  },
  {
    slug: "luik",
    city: "Luik",
    postalCode: "4000",
    h1: "Service de débouchage Liège — 24/7 Riory",
    metaTitle: "Débouchage Liège 24/7 | Égouts, WC & Fosse Septique | Riory",
    metaDescription: "Égout bouché à Liège ? Riory intervient 24/7. ✓ Débouchage WC ✓ Inspection caméra ✓ Vidange fosse septique ✓ Sur place en 1-2h. Appelez !",
    intro: "Riory est votre partenaire de confiance pour tous les services de débouchage et d'égouts à Liège et environs. Qu'il s'agisse d'un WC bouché, d'un évier qui ne s'écoule plus, d'odeurs d'égout ou de la vidange de votre fosse septique — nous sommes disponibles 24h/24 et 7j/7. Nous desservons le centre de Liège ainsi que les quartiers de Outremeuse, Sclessin, Jupille, Wandre, Chênée et Angleur.",
    services: [
      {
        title: "Débouchage WC et canalisations à Liège",
        description: "WC bouché à Liège ? Évier ou douche qui ne s'écoule plus ? Nos techniciens interviennent rapidement avec un équipement haute pression professionnel. Nous résolvons chaque obstruction — du toilette à l'égout principal — sans dégâts inutiles.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra des égouts à Liège",
        description: "Avec une inspection caméra professionnelle, nous établissons un diagnostic précis de vos canalisations à Liège. Idéal en cas d'obstructions récurrentes, d'odeurs ou lors de l'achat d'une habitation. Vous recevez un rapport détaillé avec images.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Liège",
        description: "Fosse septique pleine à Liège ? Nous vidons, nettoyons et contrôlons votre fosse avec des camions-citernes spécialisés. Un entretien régulier évite les nuisances et les réparations coûteuses.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave et nettoyage de citerne à Liège",
        description: "Cave inondée ou citerne d'eau de pluie qui déborde à Liège ? Nous pompons rapidement, identifions la cause et proposons un entretien préventif pour éviter les futurs problèmes.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "À quelle vitesse Riory peut-il intervenir à Liège ?",
        answer: "En cas d'urgence comme un WC bouché ou une inondation, nous nous engageons à être sur place à Liège en 1 à 2 heures. Nous sommes joignables 24h/24, week-ends et jours fériés inclus.",
      },
      {
        question: "Combien coûte un débouchage à Liège ?",
        answer: "Nos prix sont transparents et fixes, sans mauvaises surprises. Pour une estimation claire adaptée à votre situation, utilisez notre calculateur de prix (/prijscalculator). Vous recevez toujours une proposition précise à l'avance.",
      },
      {
        question: "Riory intervient-il aussi dans les quartiers de Liège ?",
        answer: "Absolument. Nous desservons tout Liège : Outremeuse, Sclessin, Jupille, Wandre, Chênée, Angleur et tous les quartiers environnants.",
      },
    ],
    nearbyAreas: ["Rocourt", "Ans", "Vottem", "Milmort", "Juprelle"],
  },
  {
    slug: "rocourt",
    city: "Rocourt",
    postalCode: "4000",
    h1: "Service de débouchage Rocourt — 24/7 Riory",
    metaTitle: "Débouchage Rocourt 24/7 | Égouts, WC & Fosse Septique | Riory",
    metaDescription: "Égout bouché à Rocourt ? Riory 24/7. ✓ Débouchage WC ✓ Inspection caméra ✓ Vidange fosse septique ✓ Intervention rapide. Appelez maintenant !",
    intro: "À Rocourt et dans toute la périphérie nord de Liège, Riory propose des services de débouchage et d'assainissement rapides et professionnels. Que votre WC soit bouché, votre évier obstrué ou votre fosse septique pleine — nous sommes joignables 24h/24. Depuis notre base régionale, nous intervenons rapidement à Rocourt et dans les quartiers voisins.",
    services: [
      {
        title: "Débouchage à Rocourt",
        description: "WC bouché, douche ou évier obstrué à Rocourt ? Nous résolvons chaque obstruction avec un équipement professionnel haute pression. Aussi pour les odeurs, mouches d'égout ou refoulements.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra à Rocourt",
        description: "Faites inspecter vos canalisations à Rocourt avec notre matériel caméra professionnel. Nous localisons fissures, affaissements et racines avec précision — sans casse.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Rocourt",
        description: "Fosse septique pleine à Rocourt ? Riory intervient rapidement avec des camions-citernes spécialisés pour une vidange et un nettoyage complets.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave à Rocourt",
        description: "Inondation à Rocourt ? Nous pompons rapidement caves et terrains et nettoyons les citernes pour éviter toute récidive.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "À quelle vitesse Riory peut-il intervenir à Rocourt ?",
        answer: "Rocourt fait partie de notre zone d'intervention prioritaire. En cas d'urgence, nous arrivons généralement en 1 à 2 heures. Service 24h/24 et 7j/7.",
      },
      {
        question: "Quel est le tarif d'un débouchage à Rocourt ?",
        answer: "Pour une estimation claire et précise selon votre situation, utilisez notre calculateur de prix en ligne (/prijscalculator). Tarifs transparents et sans engagement.",
      },
    ],
    nearbyAreas: ["Luik", "Ans", "Juprelle", "Vottem", "Milmort"],
  },
  {
    slug: "juprelle",
    city: "Juprelle",
    postalCode: "4450",
    h1: "Service de débouchage Juprelle — 24/7 Riory",
    metaTitle: "Débouchage Juprelle 24/7 | Égouts & Fosse Septique | Riory",
    metaDescription: "Problème d'égout à Juprelle ? Riory aide 24/7. ✓ Débouchage WC & canalisations ✓ Inspection caméra ✓ Vidange fosse ✓ Tarifs fixes. Appelez !",
    intro: "Riory est actif à Juprelle et dans toute la région liégeoise pour tous travaux de débouchage et d'assainissement. WC bouché, odeurs d'égout, fosse septique à vider — notre équipe est à votre service 24h/24. Nous desservons Juprelle, Paifve, Slins, Voroux-lez-Liers et Lantin.",
    services: [
      {
        title: "Débouchage à Juprelle",
        description: "Canalisation bouchée à Juprelle ? Nos techniciens interviennent vite avec hydrocureuse haute pression pour un résultat durable.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra à Juprelle",
        description: "Diagnostic précis de votre réseau d'évacuation à Juprelle grâce à notre caméra d'inspection. Indispensable lors d'obstructions récurrentes ou achat immobilier.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Juprelle",
        description: "Beaucoup d'habitations à Juprelle disposent d'une fosse septique. Nous assurons vidange et nettoyage avec nos camions-citernes spécialisés.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave à Juprelle",
        description: "Cave inondée à Juprelle après de fortes pluies ? Pompage rapide et conseils en prévention pour éviter le retour des dégâts.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Riory intervient-il dans tous les villages de Juprelle ?",
        answer: "Oui, nous couvrons l'ensemble de la commune : Juprelle, Paifve, Slins, Voroux-lez-Liers et Lantin.",
      },
      {
        question: "Délai d'intervention à Juprelle ?",
        answer: "En cas d'urgence à Juprelle, nous sommes généralement sur place en 1 à 2 heures. Disponibles 24h/24 et 7j/7.",
      },
    ],
    nearbyAreas: ["Rocourt", "Ans", "Milmort", "Vottem", "Luik"],
  },
  {
    slug: "ans",
    city: "Ans",
    postalCode: "4430",
    h1: "Service de débouchage Ans — 24/7 Riory",
    metaTitle: "Débouchage Ans 24/7 | Égouts, WC & Fosse Septique | Riory",
    metaDescription: "WC ou égout bouché à Ans ? Riory 24/7. ✓ Débouchage rapide ✓ Inspection caméra ✓ Vidange fosse septique ✓ Prix transparents. Appelez maintenant !",
    intro: "À Ans, commune dynamique de la périphérie liégeoise, Riory intervient pour tous problèmes de débouchage et d'assainissement. De la simple obstruction de WC à la vidange complète d'une fosse septique, notre équipe est joignable 24h/24. Nous couvrons Ans, Alleur, Loncin et Xhendremael.",
    services: [
      {
        title: "Débouchage à Ans",
        description: "WC, douche ou évier bouché à Ans ? Nos techniciens arrivent rapidement avec un matériel haute pression pour libérer toute canalisation.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra à Ans",
        description: "Inspection caméra professionnelle de vos égouts à Ans. Localisation précise des défauts sans travaux destructifs.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Ans",
        description: "Fosse septique ou puits perdu à vider à Ans ? Intervention rapide avec camion-citerne pour une vidange complète et propre.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave à Ans",
        description: "Inondation de cave à Ans ? Pompage d'urgence et nettoyage de citernes pour protéger durablement votre habitation.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Riory est-il disponible la nuit à Ans ?",
        answer: "Oui, nous intervenons 24h/24 et 7j/7 à Ans, y compris la nuit, le week-end et les jours fériés.",
      },
      {
        question: "Riory dessert-il aussi Alleur et Loncin ?",
        answer: "Oui, nous couvrons toute la commune d'Ans : Alleur, Loncin, Xhendremael ainsi que les quartiers voisins.",
      },
    ],
    nearbyAreas: ["Rocourt", "Luik", "Juprelle", "Vottem", "Milmort"],
  },
  {
    slug: "milmort",
    city: "Milmort",
    postalCode: "4041",
    h1: "Service de débouchage Milmort — 24/7 Riory",
    metaTitle: "Débouchage Milmort 24/7 | Égouts & Fosse Septique | Riory",
    metaDescription: "Canalisation bouchée à Milmort ? Riory 24/7. ✓ Débouchage WC ✓ Inspection caméra ✓ Vidange fosse ✓ Intervention rapide. Appelez maintenant !",
    intro: "Riory dessert Milmort et toute la commune de Herstal pour des interventions rapides en débouchage, inspection et assainissement. Que ce soit pour un WC bouché, une fosse septique pleine ou une cave inondée, notre équipe est disponible 24h/24.",
    services: [
      {
        title: "Débouchage à Milmort",
        description: "Obstruction d'évier, WC ou égout à Milmort ? Nos hydrocureuses haute pression viennent à bout de toutes les canalisations bouchées.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra à Milmort",
        description: "Inspection caméra de vos canalisations à Milmort. Diagnostic précis des fissures, racines et affaissements sans casse.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Milmort",
        description: "Vidange et nettoyage professionnels de votre fosse septique à Milmort avec nos camions-citernes spécialisés.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave à Milmort",
        description: "Cave inondée à Milmort ? Pompage rapide et entretien préventif des citernes et regards d'égout.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Délai d'intervention à Milmort ?",
        answer: "Nous intervenons généralement en 1 à 2 heures à Milmort. Service d'urgence 24h/24 et 7j/7.",
      },
      {
        question: "Quel est le tarif à Milmort ?",
        answer: "Pour une estimation tarifaire claire adaptée à votre situation à Milmort, consultez notre calculateur de prix (/prijscalculator). Tarifs transparents et fixes.",
      },
    ],
    nearbyAreas: ["Vottem", "Rocourt", "Juprelle", "Ans", "Luik"],
  },
  {
    slug: "vottem",
    city: "Vottem",
    postalCode: "4041",
    h1: "Service de débouchage Vottem — 24/7 Riory",
    metaTitle: "Débouchage Vottem 24/7 | Égouts, WC & Fosse Septique | Riory",
    metaDescription: "WC ou égout bouché à Vottem ? Riory intervient 24/7. ✓ Débouchage ✓ Inspection caméra ✓ Vidange fosse septique ✓ Tarifs fixes. Appelez !",
    intro: "À Vottem et dans toute la commune de Herstal, Riory propose des services complets de débouchage, inspection caméra et vidange de fosses septiques. Disponibles 24h/24, nos techniciens interviennent rapidement pour résoudre tout problème d'évacuation.",
    services: [
      {
        title: "Débouchage à Vottem",
        description: "WC, évier ou douche bouché à Vottem ? Notre équipe intervient rapidement avec hydrocureuse haute pression pour une solution efficace et durable.",
        slug: "ontstoppingen-en-geurdetectie",
      },
      {
        title: "Inspection caméra à Vottem",
        description: "Diagnostic précis de votre réseau d'égouts à Vottem grâce à notre caméra d'inspection professionnelle. Aucun travaux destructifs.",
        slug: "camera-inspectie",
      },
      {
        title: "Vidange fosse septique à Vottem",
        description: "Vidange complète et nettoyage de votre fosse septique à Vottem avec camion-citerne spécialisé.",
        slug: "septische-put-ledigen",
      },
      {
        title: "Pompage de cave à Vottem",
        description: "Cave ou terrain inondé à Vottem ? Pompage rapide et conseils en prévention pour protéger votre habitation.",
        slug: "leegpompen-en-reinigen",
      },
    ],
    faq: [
      {
        question: "Riory intervient-il en urgence à Vottem ?",
        answer: "Oui, nous sommes disponibles 24h/24 et 7j/7 à Vottem. Intervention typique en 1 à 2 heures.",
      },
      {
        question: "Quels services Riory propose-t-il à Vottem ?",
        answer: "Débouchage WC et canalisations, inspection caméra, vidange de fosse septique, pompage de cave et nettoyage de citernes — tout pour vos égouts.",
      },
    ],
    nearbyAreas: ["Milmort", "Rocourt", "Luik", "Ans", "Juprelle"],
  },
];
