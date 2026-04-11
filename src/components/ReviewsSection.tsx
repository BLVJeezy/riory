import { Star } from "lucide-react";

const reviews = [
  {
    name: "Tom Vandenberghe",
    rating: 5,
    text: "Uitstekende service! Riory was binnen het uur ter plaatse voor een dringende ontstopping. Zeer professioneel en proper afgewerkt.",
    date: "2 weken geleden",
  },
  {
    name: "Sarah Martens",
    rating: 5,
    text: "Onze septische put werd perfect geledigd. Vriendelijk personeel en eerlijke prijs. Absolute aanrader!",
    date: "1 maand geleden",
  },
  {
    name: "Kevin Peeters",
    rating: 5,
    text: "Camera-inspectie laten doen van onze riolering. Heel duidelijke uitleg en snel geholpen. Top service!",
    date: "3 weken geleden",
  },
  {
    name: "Lies Janssen",
    rating: 4,
    text: "Dakgoten gereinigd en regenput leeggemaakt. Alles netjes achtergelaten. Zeker een aanrader voor iedereen in Limburg.",
    date: "2 maanden geleden",
  },
  {
    name: "Marc Wouters",
    rating: 5,
    text: "Al twee keer beroep gedaan op Riory. Telkens snel, vakkundig en aan een correcte prijs. Blijven terugkomen!",
    date: "1 maand geleden",
  },
  {
    name: "Eline De Smedt",
    rating: 5,
    text: "Wateroverlast in de kelder en Riory was er dezelfde avond nog. Probleem snel opgelost. Dankbaar!",
    date: "3 weken geleden",
  },
  {
    name: "Johan Claes",
    rating: 5,
    text: "Periodiek onderhoud van onze riolering. Werken altijd stipt op afspraak en laten alles proper achter.",
    date: "1 maand geleden",
  },
  {
    name: "Nathalie Hermans",
    rating: 4,
    text: "Geurhinder opgelost na één bezoek. Heel blij dat we Riory gevonden hebben. Professioneel team!",
    date: "6 weken geleden",
  },
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="flex-shrink-0 w-64 sm:w-80 bg-surface border border-border rounded-xl p-4 sm:p-5">
    <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-xs sm:text-sm font-heading font-bold text-primary">
          {review.name.charAt(0)}
        </span>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-heading font-semibold text-foreground leading-tight">
          {review.name}
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">{review.date}</p>
      </div>
    </div>
    <div className="flex gap-0.5 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
            i < review.rating ? "fill-primary text-primary" : "text-border"
          }`}
        />
      ))}
    </div>
    <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
      {review.text}
    </p>
  </div>
);

const ScrollRow = ({ items, direction }: { items: typeof reviews; direction: "left" | "right" }) => {
  const animationClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="overflow-hidden select-none px-4 sm:px-6 md:px-8">
      <div className={`flex gap-3 sm:gap-4 w-max ${animationClass}`}>
        {[...items, ...items].map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="section-container px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-xs sm:text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
              Google Reviews
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
            ))}
            <span className="text-xs sm:text-sm font-body text-muted-foreground ml-1">
              4.9/5 — 73 beoordelingen
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <ScrollRow items={reviews} direction="left" />
        <ScrollRow items={[...reviews].reverse()} direction="right" />
      </div>
    </section>
  );
};

export default ReviewsSection;
