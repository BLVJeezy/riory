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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
          {featured.map((article) => (
            <Link
              key={article.slug}
              to={localizedPath(`/artikels/${article.slug}`)}
              data-track-cta={`home_article_teaser_${article.slug}`}
              className="group block"
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
          ))}
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
