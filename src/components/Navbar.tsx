import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { allServices } from "@/data/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoBlack from "@/assets/riory-logo-black.svg";
import logoWhite from "@/assets/riory-logo-white.svg";

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

const Navbar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [limburgOpen, setLimburgOpen] = useState(false);
  const [liegeOpen, setLiegeOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logo = theme === "dark" ? logoWhite : logoBlack;

  const navLinks = [
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
          <img src={logo} alt="RIORY - Sterk in Rioleringswerk" className="h-8 md:h-9 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs xl:text-sm font-body font-semibold uppercase tracking-wider whitespace-nowrap text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-xs xl:text-sm font-body font-semibold uppercase tracking-wider whitespace-nowrap text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-xs xl:text-sm font-body font-semibold uppercase tracking-wider whitespace-nowrap text-foreground hover:text-primary transition-colors outline-none">
              {t("nav.regions")}
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("nav.regionsLimburg")}
              </DropdownMenuLabel>
              {LIMBURG_CITIES.map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link to={localizedPath(`/regio/${c.slug}`)} className="cursor-pointer">
                    {c.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("nav.regionsLiege")}
              </DropdownMenuLabel>
              {LIEGE_CITIES.map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link to={localizedPath(`/regio/${c.slug}`)} className="cursor-pointer">
                    {c.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <LanguageSwitcher />
          <Button variant="cta" size="lg" className="rounded-full" asChild>
            <Link to={localizedPath("/afspraak")} data-track-cta="nav_appointment">{t("nav.appointment")}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className="relative z-50 w-10 h-10 flex items-center justify-center rounded border border-border text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" onClick={() => setIsOpen(false)} />
          <div className="absolute right-6 top-16 z-50 w-72 max-h-[80vh] overflow-y-auto bg-charcoal rounded-lg shadow-xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

              <div className="border-t border-white/10 mt-1 pt-2">
                <button
                  type="button"
                  onClick={() => setLimburgOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-primary hover:bg-white/10 transition-colors"
                  aria-expanded={limburgOpen}
                >
                  <span>{t("nav.regionsLimburg")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${limburgOpen ? "rotate-180" : ""}`} />
                </button>
                {limburgOpen && LIMBURG_CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={localizedPath(`/regio/${c.slug}`)}
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 text-sm font-body text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/10 mt-1 pt-2">
                <button
                  type="button"
                  onClick={() => setLiegeOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-primary hover:bg-white/10 transition-colors"
                  aria-expanded={liegeOpen}
                >
                  <span>{t("nav.regionsLiege")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${liegeOpen ? "rotate-180" : ""}`} />
                </button>
                {liegeOpen && LIEGE_CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={localizedPath(`/regio/${c.slug}`)}
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 text-sm font-body text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>


              <div className="border-t border-white/10 mt-1 pt-1">
                <LanguageSwitcher variant="mobile" />
              </div>
              <div className="px-3 pt-2 pb-1">
                <Button variant="cta" size="sm" className="w-full" asChild>
                  <Link to={localizedPath("/afspraak")} data-track-cta="mobile_nav_appointment" onClick={() => setIsOpen(false)}>{t("nav.appointment")}</Link>
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
