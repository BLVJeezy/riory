import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { allArticles } from "@/data/articles";

const ArticlesTeaserSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const featured = allArticles.slice(0, 3);
  const trackRef = useRef<HTMLDivElement>(null);

  // Infinite loop on mobile: render three copies of the cards and keep the
  // scroll position centred on the middle copy. When a swipe carries the
  // viewport into the first or third copy, we reposition (once scrolling has
  // fully stopped) to the identical card in the middle copy — invisible
  // because the content is the same. This makes swiping past the last card
  // wrap to the first, and swiping before the first wrap to the last.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Width of one full set, measured from the actual card positions so it
    // aligns exactly with the snap points (independent of flex gaps).
    const setWidth = () => {
      const cards = el.querySelectorAll("a");
      if (cards.length >= 6) {
        return (cards[3] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
      }
      return el.scrollWidth / 3 || 0;
    };
    const init = () => {
      const w = setWidth();
      if (w && Math.abs(el.scrollLeft - w) > 1) el.scrollLeft = w;
    };
    init();
    const recenter = () => {
      const w = setWidth();
      if (!w) return;
      const x = el.scrollLeft;
      if (x >= w * 2) el.scrollLeft = x - w;
      else if (x < w) el.scrollLeft = x + w;
    };
    // scrollend fires when scrolling (incl. momentum/snap) fully stops.
    // A 500ms fallback covers browsers that don't emit scrollend reliably.
    let t: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (t) clearTimeout(t);
      t = setTimeout(recenter, 500);
    };
    el.addEventListener("scrollend", recenter, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", init);
    return () => {
      el.removeEventListener("scrollend", recenter);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", init);
      if (t) clearTimeout(t);
    };
  }, []);

  const loop = [...featured, ...featured, ...featured];

  const renderCard = (article: (typeof featured)[number], key: string | number) => (
    <Link
      key={key}
      to={localizedPath(`/artikels/${article.slug}`)}
      data-track-cta={`home_article_teaser_${article.slug}`}
      className="group block shrink-0 basis-full snap-center sm:basis-auto sm:shrink"
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-wider">
          {article.category}
        </span>
      </div>
      <h3 className="text-sm font-heading font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
    </Link>
  );

  return (
    <section className="py-14 md:py-20 bg-muted/30 border-t border-border/40">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-primary mb-2">
            {t("articlesTeaser.eyebrow", { defaultValue: "Tips & advies" })}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-foreground mb-3">
            {t("articlesTeaser.title", { defaultValue: "Onze Artikels" })}
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm md:text-base">
            {t("articlesTeaser.subtitle", {
              defaultValue: "Handige tips over ontstopping, septische putten en meer, geschreven door onze vakmensen.",
            })}
          </p>
        </div>

        {/* Mobile: infinite horizontal loop */}
        <div
          ref={trackRef}
          className="sm:hidden flex gap-4 mb-8 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loop.map((article, i) => renderCard(article, `m-${i}`))}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
          {featured.map((article) => renderCard(article, article.slug))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to={localizedPath("/artikels")} data-track-cta="home_articles_view_all" className="gap-2">
              {t("articlesTeaser.viewAll", { defaultValue: "Bekijk alle artikels" })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticlesTeaserSection;
