const qualities = [
  {
    number: 1,
    title: "24/7 Bereikbaar",
    description:
      "Riory is 24 uur per dag en 7 dagen per week bereikbaar voor een afspraak. Wij staan u direct te woord om zo snel mogelijk een afspraak in te plannen. Met één telefoontje zijn al uw problemen opgelost!",
  },
  {
    number: 2,
    title: "Propere en snelle lediging",
    description:
      "In een mum van tijd ledigen onze vakmensen uw septische put. Wij beschikken over de benodigde expertise en professioneel materiaal om alle septische putten en ondergelopen kelders proper en leeg te maken. En dit voor een eerlijke prijs.",
  },
  {
    number: 3,
    title: "Kwalitatief werk",
    description:
      "\"A fool with a tool is still a fool!\" Daarom beschikken onze werknemers, naast professioneel materiaal, over de benodigde expertise om kwalitatief, grondig en proper werk te leveren. Kwaliteit is onze grootste P(Riory)teit!",
  },
  {
    number: 4,
    title: "Niet vies van vuil werk",
    description:
      "Voor de vakmensen van Riory is geen klusje te vuil. Uitdagingen gaan wij niet uit de weg. Zonder poespas klaren wij de vuilste werken en niet onbelangrijk; laten we de omgeving netjes achter. Wij leveren grondig werk!",
  },
  {
    number: 5,
    title: "Professioneel materiaal",
    description:
      "Naast de benodigde expertise beschikken wij over modern en professioneel materiaal om de vuilste werken grondig te klaren. Zonder is het onbegonnen werk. Uw afvoer heeft voor ons geen geheimen.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-primary-foreground text-center mb-14">
          Waarom kiezen voor ons?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Left column - tagline */}
          <div className="flex items-center md:row-span-1">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase text-white italic leading-tight">
              Onze kwaliteiten spreken voor zichzelf!
            </h3>
          </div>

          {/* Items 1 & 2 */}
          {qualities.slice(0, 2).map((q) => (
            <div
              key={q.number}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-6"
            >
              <span className="text-4xl font-heading font-bold text-white/30">{q.number}</span>
              <div className="w-12 h-0.5 bg-white/40 mt-1 mb-3" />
              <h4 className="text-base md:text-lg font-heading font-bold uppercase text-white mb-3 leading-tight">
                {q.title}
              </h4>
              <p className="text-sm text-white/80 font-body leading-relaxed">
                {q.description}
              </p>
            </div>
          ))}

          {/* Items 3, 4 & 5 */}
          {qualities.slice(2).map((q) => (
            <div
              key={q.number}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-6"
            >
              <span className="text-4xl font-heading font-bold text-white/30">{q.number}</span>
              <div className="w-12 h-0.5 bg-white/40 mt-1 mb-3" />
              <h4 className="text-base md:text-lg font-heading font-bold uppercase text-white mb-3 leading-tight">
                {q.title}
              </h4>
              <p className="text-sm text-white/80 font-body leading-relaxed">
                {q.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
