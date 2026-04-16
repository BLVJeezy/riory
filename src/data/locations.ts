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
    h1: "Ontstopping & rioleringsdienst in Hasselt",
    metaTitle: "Ontstoppingsdienst Hasselt 24/7 | Riool, WC & Septische Put | Riory",
    metaDescription: "Verstopte afvoer of riool in Hasselt? Riory is 24/7 bereikbaar. ✓ WC ontstoppen ✓ Camera-inspectie ✓ Septische put ledigen ✓ Binnen 1-2 uur ter plaatse. Bel nu!",
    intro: "Riory is uw betrouwbare partner voor alle riolerings- en ontstoppingsdiensten in Hasselt en omgeving. Of het nu gaat om een verstopte WC, een gootsteen die niet afloopt, rioollucht in huis of het ledigen van uw septische put — wij staan 24/7 paraat om u snel en vakkundig te helpen. Als hoofdstad van Limburg bedienen wij zowel het centrum van Hasselt als de deelgemeenten Kermt, Kuringen, Stevoort, Wimmertingen en Sint-Lambrechts-Herk.",
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
        slug: "leidingen-en-septische-putten",
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
        answer: "Onze prijzen zijn transparant en vast. Een standaard ontstopping in Hasselt start vanaf €95 inclusief verplaatsing. Geen verrassingen achteraf — u krijgt altijd vooraf een duidelijke prijs.",
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
    h1: "Ontstopping & rioleringsdienst in Genk",
    metaTitle: "Ontstoppingsdienst Genk 24/7 | Riool, WC & Septische Put | Riory",
    metaDescription: "Rioolverstopping in Genk? Riory lost het op — 24/7. ✓ WC ontstoppen ✓ Riool camera-inspectie ✓ Septische put ruimen ✓ Vaste prijzen. Bel nu!",
    intro: "In Genk en omgeving kunt u rekenen op Riory voor snelle en professionele riolerings- en ontstoppingsdiensten. Van een verstopte WC of douche die niet afloopt tot het ledigen van septische putten en camera-inspecties — wij zijn 24/7 bereikbaar. Wij bedienen heel Genk, inclusief Winterslag, Waterschei, Zwartberg, Bokrijk en Gelieren.",
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
        slug: "leidingen-en-septische-putten",
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
    h1: "Ontstopping & rioleringsdienst in Hoeselt",
    metaTitle: "Ontstoppingsdienst Hoeselt 24/7 | Riool & Septische Put | Riory",
    metaDescription: "Rioolprobleem in Hoeselt? Riory helpt 24/7. ✓ Ontstopping WC & afvoer ✓ Camera-inspectie ✓ Septische put ledigen ✓ Snel ter plaatse. Bel nu!",
    intro: "Als lokale specialist bedient Riory Hoeselt en omgeving met snelle en professionele rioleringsdiensten. Of uw WC verstopt zit, de gootsteen niet afloopt, u rioollucht ruikt in huis of uw septische put geledigd moet worden — wij zijn dag en nacht bereikbaar. Vanuit onze thuisbasis in de regio zijn wij razendsnel ter plaatse in Hoeselt, Romershoven, Werm, Alt-Hoeselt en Schalkhoven.",
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
        slug: "leidingen-en-septische-putten",
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
    h1: "Ontstopping & rioleringsdienst in Tongeren",
    metaTitle: "Ontstoppingsdienst Tongeren 24/7 | Riool, WC & Septische Put | Riory",
    metaDescription: "Verstopte riool of WC in Tongeren? Riory helpt 24/7. ✓ Ontstopping ✓ Camera-inspectie riool ✓ Septische put ledigen ✓ Vaste tarieven. Bel nu!",
    intro: "In Tongeren, de oudste stad van België, kunt u rekenen op Riory voor alle riolerings- en ontstoppingsdiensten. Van een verstopte WC of gootsteen tot het ledigen van septische putten en camera-inspecties van rioleringen — wij zijn 24/7 beschikbaar. Wij bedienen het centrum van Tongeren en alle deelgemeenten: Piringen, Riksingen, Mal, Nerem, Rutten, Vreren, Widooie, Berg en Kolmont.",
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
        slug: "leidingen-en-septische-putten",
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
    h1: "Ontstopping & rioleringsdienst in Maasmechelen",
    metaTitle: "Ontstoppingsdienst Maasmechelen 24/7 | Riool & WC | Riory",
    metaDescription: "Verstopte afvoer in Maasmechelen? Riory is 24/7 beschikbaar. ✓ WC ontstoppen ✓ Riool inspectie ✓ Septische put ruimen ✓ Snel ter plaatse. Bel nu!",
    intro: "Riory biedt snelle en professionele rioleringsdiensten in Maasmechelen en omgeving. Of het gaat om een verstopte WC, een douche die niet afloopt, rioollucht in huis of het ruimen van een septische put — wij zijn 24/7 bereikbaar. Wij bedienen heel Maasmechelen, inclusief Mechelen-aan-de-Maas, Eisden, Opgrimbie, Leut, Vucht en Kotem.",
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
        slug: "leidingen-en-septische-putten",
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
    h1: "Ontstopping & rioleringsdienst in Sint-Truiden",
    metaTitle: "Ontstoppingsdienst Sint-Truiden 24/7 | Riool & Septische Put | Riory",
    metaDescription: "Rioolverstopping in Sint-Truiden? Riory helpt 24/7. ✓ WC ontstoppen ✓ Camera-inspectie ✓ Septische put ledigen ✓ Vaste prijzen. Bel nu!",
    intro: "In Sint-Truiden en de ruime omgeving biedt Riory professionele riolerings- en ontstoppingsdiensten. Van een verstopte WC of gootsteen die niet afloopt tot het ledigen van septische putten en camera-inspecties — wij staan dag en nacht klaar. Wij bedienen het centrum van Sint-Truiden en alle deelgemeenten: Aalst, Brustem, Engelmanshoven, Gelinden, Groot-Gelmen, Kerkom, Melveren, Ordingen, Velm en Zepperen.",
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
        slug: "leidingen-en-septische-putten",
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
];
