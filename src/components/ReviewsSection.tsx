import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEWS_LIST, type ReviewItem } from "@/data/reviewsList";
import { REVIEW_STATS } from "@/data/reviews";

const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJq6qqqlTmwEcRHdPYblaJxK0";

const formatDate = (d: string) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const ReviewCard = ({ r }: { r: ReviewItem }) => (
  <div className="w-[300px] md:w-[340px] shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="font-heading font-semibold text-foreground truncate">{r.author}</span>
      <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatDate(r.date)}</span>
    </div>
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
      ))}
    </div>
    <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-5">{r.text}</p>
  </div>
);

const Row = ({ items, direction }: { items: ReviewItem[]; direction: "left" | "right" }) => (
  <div className="overflow-hidden group">
    <div
      className={`flex w-max gap-4 group-hover:[animation-play-state:paused] ${
        direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
      }`}
      style={{ animationDuration: `${items.length * 6}s` }}
    >
      {[...items, ...items].map((r, i) => (
        <ReviewCard key={i} r={r} />
      ))}
    </div>
  </div>
);

const ReviewsSection = () => {
  const half = Math.ceil(REVIEWS_LIST.length / 2);
  const top = REVIEWS_LIST.slice(0, half);
  const bottom = REVIEWS_LIST.slice(half);

  return (
    <section id="reviews" className="section-padding bg-background overflow-hidden">
      <div className="section-container px-4 sm:px-6 md:px-8 text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-foreground mb-3">
          Wat onze klanten zeggen
        </h2>
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <span className="font-heading font-bold text-foreground">{REVIEW_STATS.ratingValue}</span>
          <span className="text-muted-foreground text-sm">({REVIEW_STATS.reviewCount} Google reviews)</span>
        </div>
        <Button variant="outline" asChild>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
            Plaats een review <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
      <div className="space-y-4">
        <Row items={top} direction="left" />
        <Row items={bottom} direction="right" />
      </div>
    </section>
  );
};

export default ReviewsSection;
