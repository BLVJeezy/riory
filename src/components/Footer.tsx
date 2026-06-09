import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import logo from "@/assets/riory-logo-footer.svg";

const LIMBURG_CITIES = [
  { slug: "hasselt", label: "Hasselt" },
  { slug: "genk", label: "Genk" },
  { slug: "hoeselt", label: "Hoeselt" },
  { slug: "tongeren", label: "Tongeren" },
  { slug: "maasmechelen", label: "Maasmechelen" },
  { slug: "sint-truiden", label: "Sint-Truiden" },
];

const LIEGE_CITIES = [
  { slug: "luik", label: "Luik / Liège" },
  { slug: "rocourt", label: "Rocourt" },
  { slug: "juprelle", label: "Juprelle" },
  { slug: "ans", label: "Ans" },
  { slug: "milmort", label: "Milmort" },
  { slug: "vottem", label: "Vottem" },
];

const Footer = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  return (
    <footer className="bg-charcoal section-padding py-12 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <img src={logo} alt="RIORY" className="h-10 mb-4" />
            <p className="text-sm text-primary-foreground/50 font-body">
              {t("footer.tagline1")}<br />
              {t("footer.tagline2")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              <li><Link to={`${localizedPath("/")}#home`} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.home")}</Link></li>
              <li><Link to={localizedPath("/diensten")} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.services")}</Link></li>
              <li><Link to={`${localizedPath("/")}#waarom-ons`} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.whyUs")}</Link></li>
              <li><Link to={`${localizedPath("/")}#projecten`} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.references")}</Link></li>
              <li><Link to={`${localizedPath("/")}#prijscalculator`} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.calculator")}</Link></li>
              <li><Link to={localizedPath("/afspraak")} data-track-cta="footer_appointment" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">{t("footer.appointment")}</Link></li>
              <li><Link to={localizedPath("/sollicitatie")} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Vacatures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              {t("footer.regionsLimburg")}
            </h4>
            <ul className="space-y-2">
              {LIMBURG_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link to={localizedPath(`/regio/${c.slug}`)} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              {t("footer.regionsLiege")}
            </h4>
            <ul className="space-y-2">
              {LIEGE_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link to={localizedPath(`/regio/${c.slug}`)} className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              {t("footer.follow")}
            </h4>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1Ad153BttY/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/riory/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/riorybv/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/30 font-body">
            © {new Date().getFullYear()} RIORY. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to={localizedPath("/data-protection")} className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body">{t("footer.dataProtection")}</Link>
            <Link to={localizedPath("/privacy-policy")} className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body">{t("footer.privacy")}</Link>
            <Link to={localizedPath("/gebruiksvoorwaarden")} className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body">{t("footer.terms")}</Link>
            <Link to={localizedPath("/algemene-voorwaarden")} className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body">{t("footer.generalTerms")}</Link>
            <Link to={localizedPath("/cookie-policy")} className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body">{t("footer.cookies")}</Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-primary-foreground/5 text-center">
          <a
            href="https://solyn-global.com/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
          >
            Created by Solyn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
