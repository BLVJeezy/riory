import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageProvider";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string | null;
}

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex-shrink-0 w-64 sm:w-80 bg-surface border border-border rounded-xl p-4 sm:p-5">
    <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-xs sm:text-sm font-heading font-bold text-primary">
          {review.reviewer_name.charAt(0)}
        </span>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-heading font-semibold text-foreground leading-tight">
          {review.reviewer_name}
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">{review.review_date}</p>
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
      {review.review_text}
    </p>
  </div>
);

const ScrollRow = ({ items, direction }: { items: Review[]; direction: "left" | "right" }) => {
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
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data, error } = await supabase
        .from("google_reviews")
        .select("id, reviewer_name, rating, review_text, review_date")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error || !data) {
        setLoading(false);
        return;
      }

      if (lang === "nl") {
        setReviews(data);
        setLoading(false);
        return;
      }

      const cacheKey = `reviews_translations_${lang}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const map = JSON.parse(cached) as Record<string, string>;
          setReviews(data.map((r) => ({ ...r, review_text: map[r.id] ?? r.review_text })));
          setLoading(false);
          return;
        } catch {
          /* ignore */
        }
      }

      setReviews(data);
      setLoading(false);

      try {
        const { data: tr, error: trErr } = await supabase.functions.invoke(
          "translate-reviews",
          { body: { reviews: data.map((r) => ({ id: r.id, text: r.review_text })), target: lang } }
        );
        if (cancelled || trErr || !tr?.translations) return;
        const map: Record<string, string> = {};
        for (const item of tr.translations as Array<{ id: string; text: string }>) {
          map[item.id] = item.text;
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(map));
        setReviews((prev) => prev.map((r) => ({ ...r, review_text: map[r.id] ?? r.review_text })));
      } catch (e) {
        console.error("Review translation failed", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const midpoint = Math.ceil(reviews.length / 2);
  const firstRow = reviews.slice(0, midpoint);
  const secondRow = reviews.slice(midpoint);

  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="section-padding bg-background overflow-hidden">
      <div className="section-container px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
            {t("reviews.title")}
          </h2>
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-xs sm:text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
              {t("reviews.label")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
            ))}
            <span className="text-xs sm:text-sm font-body text-muted-foreground ml-1">
              {t("reviews.rating")}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <ScrollRow items={firstRow} direction="left" />
        <ScrollRow items={secondRow} direction="right" />
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.google.com/search?sca_esv=6818e8eb8875f33b&rlz=1C1GCEA_enBE1132BE1132&sxsrf=ANbL-n7jLuRPovAcsY9HFr_UQQvYa6fJcw:1775994268322&q=Riory+-+ontstoppingsdienst+Limburg+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDI1Mbc0BkJDSxNTc0NjMzPDDYyMrxi1gjLziyoVdBXy80qKS_ILCjLz0otTMlPziksUfDJzk0qL0hWCUssyU8uLF7GSoBgAHtLntXUAAAA&rldimm=12547939391945713661&tbm=lcl&hl=nl-BE&sa=X&ved=2ahUKEwiuoPGbnuiTAxUGNfsDHVxzEGQQ9fQKegQIMRAG&biw=1920&bih=945&dpr=1#lkt=LocalPoiReviews"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          <Star className="w-4 h-4" />
          {t("reviews.writeReview")}
        </a>
      </div>
    </section>
  );
};

export default ReviewsSection;
