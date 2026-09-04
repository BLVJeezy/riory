import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ExternalLink } from "lucide-react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useLanguage } from "@/i18n/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { allArticles } from "@/data/articles";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });

const Artikels = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  usePageView("/artikels");
  useDocumentMeta(
    t("articlesPage.metaTitle", { defaultValue: "Artikels & Tips over Riolering | Riory BV" }),
    t("articlesPage.metaDescription", {
      defaultValue:
        "Handige tips en advies over ontstopping, septische putten, camera-inspectie en meer. Alle artikels van Riory op een rij.",
    })
  );

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-16 md:pb-24 bg-background min-h-screen">
        <div className="section-container px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={localizedPath("/")} className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                {t("common.backHome")}
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <span className="inline-block text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-primary mb-3">
              {t("articlesPage.eyebrow", { defaultValue: "Tips & advies van Riory" })}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-foreground mb-4">
              {t("articlesPage.h1", { defaultValue: "Artikels" })}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              {t("articlesPage.intro", {
                defaultValue:
                  "Praktische tips en achtergrondinformatie over ontstopping, septische putten, camera-inspectie en meer — geschreven door de vakmensen van Riory.",
              })}
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allArticles.map((article) => (
              <div
                key={article.slug}
                className="group rounded-xl overflow-hidden bg-card border border-border flex flex-col shrink-0 basis-[88%] snap-center md:basis-auto md:shrink"
              >

                <Link
                  to={localizedPath(`/artikels/${article.slug}`)}
                  data-track-cta={`article_card_${article.slug}`}
                  className="flex flex-col flex-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-heading font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-body mb-2">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(article.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                    <h2 className="text-base md:text-lg font-heading font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-primary w-fit">
                      {t("articlesPage.readMore", { defaultValue: "Lees meer" })}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
                <a
                  href={article.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track-cta={`article_source_${article.slug}`}
                  className="inline-flex items-center gap-1.5 px-5 py-3 border-t border-border text-[11px] text-muted-foreground font-body hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {t("articlesPage.sourceLabel", { defaultValue: "Bron" })}: {article.source.label}
                  </span>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
              {t("articlesPage.ctaTitle", { defaultValue: "Probleem waar u zelf niet uitraakt?" })}
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto mb-6">
              {t("articlesPage.ctaText", {
                defaultValue: "Riory staat 24/7 voor u klaar in heel Limburg en de regio Luik.",
              })}
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link to={localizedPath("/afspraak")} className="gap-2">
                {t("common.appointment")} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Artikels;
