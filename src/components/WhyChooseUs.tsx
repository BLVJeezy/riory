const qualities = [
  {
    number: 1,
    title: "24/7 Bereikbaar",
    description:
      "Riory is 24 uur per dag en 7 dagen per week bereikbaar. Met één telefoontje zijn al uw problemen opgelost!",
  },
  {
    number: 2,
    title: "Propere en snelle lediging",
    description:
      "In een mum van tijd ledigen onze vakmensen uw septische put met professioneel materiaal. En dit voor een eerlijke prijs.",
  },
  {
    number: 3,
    title: "Kwalitatief werk",
    description:
      "Onze werknemers beschikken over de benodigde expertise om kwalitatief, grondig en proper werk te leveren.",
  },
  {
    number: 4,
    title: "Niet vies van vuil werk",
    description:
      "Voor onze vakmensen is geen klusje te vuil. Wij klaren de vuilste werken en laten de omgeving netjes achter.",
  },
  {
    number: 5,
    title: "Professioneel materiaal",
    description:
      "Wij beschikken over modern en professioneel materiaal om de vuilste werken grondig te klaren.",
  },
  {
    number: 6,
    title: "Maak je afspraak",
    description:
      "Plan snel en eenvoudig een afspraak via ons formulier. Urgentie? Bel ons direct op 0472 50 28 14!",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="waarom-ons" className="section-padding bg-charcoal">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white text-center mb-10">
          Waarom kiezen voor ons?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {qualities.map((q) => (
            <div
              key={q.number}
              className="bg-primary rounded-xl p-4 md:p-5"
            >
              <span className="text-2xl md:text-3xl font-heading font-bold text-white/30">{q.number}</span>
              <h4 className="text-xs md:text-sm font-heading font-bold uppercase text-white mt-1 mb-2 leading-tight">
                {q.title}
              </h4>
              <p className="text-xs text-white/80 font-body leading-relaxed">
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
