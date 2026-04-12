import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import logoBlack from "@/assets/riory-logo-black.svg";
import logoWhite from "@/assets/riory-logo-white.svg";

const navLinks = [
  { label: "Onze Diensten", href: "/diensten" },
  { label: "Waarom Kiezen Voor Ons?", href: "#waarom-ons" },
  { label: "Referenties", href: "#projecten" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logo = theme === "dark" ? logoWhite : logoBlack;

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
        <a href="#home">
          <img src={logo} alt="RIORY - Sterk in Rioleringswerk" className="h-10 md:h-12 w-auto" />
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
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
                className="text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
          <Button variant="cta" size="lg" className="rounded-full" asChild>
            <a href="#offerte">Afspraak</a>
          </Button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-foreground hover:text-primary transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded border border-border text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
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
          <div className="absolute right-6 top-16 z-50 w-48 bg-charcoal rounded-lg shadow-xl overflow-hidden lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col py-2">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
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
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 text-sm font-body font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="px-3 pt-2 pb-1">
                <Button variant="cta" size="sm" className="w-full" asChild>
                  <a href="#offerte" onClick={() => setIsOpen(false)}>Afspraak</a>
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
