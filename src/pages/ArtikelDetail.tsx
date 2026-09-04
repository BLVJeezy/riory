import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Phone } from "lucide-react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useLanguage } from "@/i18n/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { allArticles, getArticleBySlug } from "@/data/articles";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });

const ArtikelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const article = slug ? getArticleBySlug(slug) : undefined;

  usePageView(`/artikels/${slug}`);
  useDocumentMeta(
    article ? `${article.title} | Riory BV` : undefined,
    article ? article.excerpt : undefined
  );

  if (!article) {
    return <Navigate to={localizedPath("/artikels")} replace />;
  }

  const related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-16 md:pb-24 bg-background min-h-screen">
        <div className="section-container px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={localizedPath("/artikels")} className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                {t("articlesPage.backToArticles", { defaultValue: "Terug naar artikels" })}
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-heading font-bold uppercase tracking-wider mb-4">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-8">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(article.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <div className="relative h-56 md:h-96 rounded-xl overflow-hidden mb-10">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="space-y-5">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-base text-muted-foreground font-body leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
                {t("articlesPage.ctaTitle", { defaultValue: "Probleem waar u zelf niet uitraakt?" })}
              </h2>
              <p className="text-muted-foreground font-body max-w-xl mx-auto mb-6">
                {t("articlesPage.ctaText", {
                  defaultValue: "Riory staat 24/7 voor u klaar in heel Limburg en de regio Luik.",
                })}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="cta" size="lg" asChild>
                  <Link to={localizedPath("/afspraak")} className="gap-2">
                    {t("common.appointment")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <a
                  href="tel:+32472502814"
                  data-track-cta="article_urgent_tel"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
                >
                  <Phone className="w-4 h-4" />
                  {t("common.callNow")} 0472 50 28 14
                </a>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="max-w-5xl mx-auto mt-16">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6 text-center">
                {t("articlesPage.moreArticles", { defaultValue: "Meer artikels" })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <Link
                    key={a.slug}
                    to={localizedPath(`/artikels/${a.slug}`)}
                    className="group rounded-xl overflow-hidden bg-card border border-border flex flex-col"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-heading font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ArtikelDetail;
