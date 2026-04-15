import { Star } from "lucide-react";

const reviews = [
  {
    name: "Josy Stulens",
    rating: 5,
    text: "Super service & 100% vakman! Heel tevreden na snelle interventie + scherpe prijs. Echte aanrader!",
    date: "2 maanden geleden",
  },
  {
    name: "Danique van Mierlo",
    rating: 5,
    text: "Vakkundig en snel geholpen!",
    date: "een maand geleden",
  },
  {
    name: "Margriet Simenon",
    rating: 5,
    text: "Heel content. Vriendelijke en aimabele werkman.",
    date: "een maand geleden",
  },
  {
    name: "Fabienne Pirotte",
    rating: 5,
    text: "Dank je wel voor de super service en dat op een zondag!",
    date: "3 maanden geleden",
  },
  {
    name: "Dirk",
    rating: 5,
    text: "Heel snel en goed geholpen. Prima service!",
    date: "4 maanden geleden",
  },
  {
    name: "Davy Steegen",
    rating: 5,
    text: "Heel vriendelijke mensen! Na de camera inspectie werden we gerust gesteld dat er niets aan de hand is. Zeer professioneel!",
    date: "7 maanden geleden",
  },
  {
    name: "Cindy Moors",
    rating: 5,
    text: "Vlugge interventie toen onze riolering verstopt was. Daarna een goede herstelling van onze put met deksel. Heel tevreden van team Riory.",
    date: "6 maanden geleden",
  },
  {
    name: "Jan Slegers",
    rating: 5,
    text: "Speurden de geurhinder zonder problemen op. Snelle duidelijke oplossing. Proper gewerkt. Zeer fijne ervaring.",
    date: "7 maanden geleden",
  },
  {
    name: "Gerwin Smeets",
    rating: 5,
    text: "Snelle en correcte oplossing. Vriendelijke mannen, heel behulpzaam. Deze kun je met gemak contacteren. Niets is teveel.",
    date: "7 maanden geleden",
  },
  {
    name: "LEON RAMAEKERS",
    rating: 5,
    text: "Zeer snelle interventie. Eerste probleem meteen opgelost. Overzichtelijke en efficiënte website. Goede opvolging en alles correct afgehandeld.",
    date: "11 maanden geleden",
  },
  {
    name: "Els Heedfeld",
    rating: 5,
    text: "'s Morgens gebeld en 's middags al geholpen en dat op een brugdag. Professioneel, vriendelijk en tegen een correcte prijs!",
    date: "11 maanden geleden",
  },
  {
    name: "Peter Nijssen",
    rating: 5,
    text: "Riory heeft onze zeer moeilijk toegankelijke keukenafvoer open gekregen met gezond verstand en veel volharding. Correcte prijs!",
    date: "11 maanden geleden",
  },
  {
    name: "Johan Remels",
    rating: 5,
    text: "Zeer professionele firma! Weten duidelijk waar ze mee bezig zijn. Verstopping was onmiddellijk opgelost met professioneel materiaal.",
    date: "een jaar geleden",
  },
  {
    name: "Jurgen Machiels",
    rating: 5,
    text: "Super service. Eerlijke prijs. Zeer snelle reactie op contactformulier. Top gasten. Probleem volledig opgelost. Zeker aanraders 100%!",
    date: "een jaar geleden",
  },
  {
    name: "William Stassen",
    rating: 5,
    text: "Verstopte toilet op vrijdagavond. Gelukkig is Riory meteen zaterdagochtend kunnen komen en heeft het probleem snel verholpen.",
    date: "een jaar geleden",
  },
  {
    name: "Jos Oude Vrielink",
    rating: 5,
    text: "In minder dan 2 uur na mijn telefoontje stond de auto voor mijn deur. Een auto met alles erop en eraan. Hulde en een pluim!",
    date: "10 maanden geleden",
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
    <div
      className="overflow-x-auto scrollbar-hide select-none px-4 sm:px-6 md:px-8 group"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div
        className={`flex gap-3 sm:gap-4 w-max ${animationClass} group-hover:[animation-play-state:paused]`}
      >
        {[...items, ...items].map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section id="reviews" className="section-padding bg-background overflow-hidden">
      <div className="section-container px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
            Wat onze klanten zeggen
          </h2>
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
              4.9/5 — 79 beoordelingen
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <ScrollRow items={reviews} direction="left" />
        <ScrollRow items={[...reviews].reverse()} direction="right" />
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.google.com/search?sca_esv=6818e8eb8875f33b&rlz=1C1GCEA_enBE1132BE1132&sxsrf=ANbL-n7jLuRPovAcsY9HFr_UQQvYa6fJcw:1775994268322&q=Riory+-+ontstoppingsdienst+Limburg+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDI1Mbc0BkJDSxNTc0NjMzPDDYyMrxi1gjLziyoVdBXy80qKS_ILCjLz0otTMlPziksUfDJzk0qL0hWCUssyU8uLF7GSoBgAHtLntXUAAAA&rldimm=12547939391945713661&tbm=lcl&hl=nl-BE&sa=X&ved=2ahUKEwiuoPGbnuiTAxUGNfsDHVxzEGQQ9fQKegQIMRAG&biw=1920&bih=945&dpr=1#lkt=LocalPoiReviews"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          <Star className="w-4 h-4" />
          Plaats een review
        </a>
      </div>
    </section>
  );
};

export default ReviewsSection;
