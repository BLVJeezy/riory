import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoBlack from "@/assets/riory-logo-black.svg";
import logoWhite from "@/assets/riory-logo-white.svg";

const Navbar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logo = theme === "dark" ? logoWhite : logoBlack;

  const navLinks = [
    { label: t("nav.services"), href: localizedPath("/diensten"), isRoute: true },
    { label: t("nav.whyUs"), href: "#waarom-ons", isRoute: false },
    { label: t("nav.references"), href: "#projecten", isRoute: false },
  ];

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const homePath = localizedPath("/");
    if (location.pathname !== homePath) {
      navigate(homePath + href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-background"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20 px-6 md:px-8">
        <Link to={localizedPath("/")}>
          <img src={logo} alt="RIORY - Sterk in Rioleringswerk" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
          <LanguageSwitcher />
          <Button variant="cta" size="lg" className="rounded-full" asChild>
            <Link to={localizedPath("/afspraak")}>{t("nav.appointment")}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className="relative z-50 w-10 h-10 flex items-center justify-center rounded border border-border text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" onClick={() => setIsOpen(false)} />
          <div className="absolute right-6 top-16 z-50 w-56 bg-charcoal rounded-lg shadow-xl overflow-hidden lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col py-2">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 text-sm font-body font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { handleAnchorClick(e, link.href); setIsOpen(false); }}
                    className="px-5 py-3 text-sm font-body font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="border-t border-white/10 mt-1 pt-1">
                <LanguageSwitcher variant="mobile" />
              </div>
              <div className="px-3 pt-2 pb-1">
                <Button variant="cta" size="sm" className="w-full" asChild>
                  <Link to={localizedPath("/afspraak")} onClick={() => setIsOpen(false)}>{t("nav.appointment")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
