import { useRef, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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

const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Infinite auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    const speed = 0.5;

    const animate = () => {
      if (!isHovered && !isDragging && el) {
        el.scrollLeft += speed;
        // Reset to start when halfway (we duplicate the items)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Duplicate reviews for seamless loop
  const displayReviews = [...reviews, ...reviews];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="section-container px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
                Google Reviews
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <span className="text-sm font-body text-muted-foreground ml-1">
                4.9/5 — {reviews.length} beoordelingen
              </span>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-surface transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex gap-4 overflow-x-hidden cursor-grab active:cursor-grabbing select-none px-6 md:px-8"
      >
        {displayReviews.map((review, index) => (
          <div
            key={`${review.name}-${index}`}
            className="flex-shrink-0 w-72 sm:w-80 bg-surface border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-sm font-heading font-bold text-primary">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-heading font-semibold text-foreground leading-tight">
                  {review.name}
                </p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? "fill-primary text-primary"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
