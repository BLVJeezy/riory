import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/riory-logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Diensten", href: "/diensten" },
  { label: "Projecten", href: "#projecten" },
  { label: "Offerte", href: "#offerte" },
  { label: "Over Ons", href: "#over-ons" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Button variant="cta" size="lg" asChild>
            <a href="#offerte">OFFERTE AANVRAGEN</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="flex flex-col gap-1 p-6">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  {link.label}
                </a>
              )
            )}
            <Button variant="cta" size="lg" className="mt-4" asChild>
              <a href="#offerte" onClick={() => setIsOpen(false)}>OFFERTE AANVRAGEN</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
