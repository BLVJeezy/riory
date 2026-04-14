import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import logo from "@/assets/riory-logo-footer.svg";

const Footer = () => {
  return (
    <footer className="bg-charcoal section-padding py-12 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={logo} alt="RIORY" className="h-10 mb-4" />
            <p className="text-sm text-primary-foreground/50 font-body">
              Sterk in Rioleringswerk.<br />
              Professionele infrastructuurwerken in België.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              Snelle links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Home</a>
              </li>
              <li>
                <Link to="/diensten" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Onze Diensten</Link>
              </li>
              <li>
                <a href="#waarom-ons" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Waarom Kiezen Voor Ons?</a>
              </li>
              <li>
                <a href="#projecten" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Referenties</a>
              </li>
              <li>
                <a href="#prijscalculator" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Prijscalculator</a>
              </li>
              <li>
                <Link to="/afspraak" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body">Afspraak</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              Volg ons
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1Ad153BttY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/riory/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/riorybv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/10 text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/30 font-body">
            © {new Date().getFullYear()} RIORY. Alle rechten voorbehouden.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              to="/data-protection"
              className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
            >
              Data Protection Notice
            </Link>
            <Link
              to="/privacy-policy"
              className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
            >
              Privacy Policy
            </Link>
            <Link
              to="/gebruiksvoorwaarden"
              className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
            >
              Gebruiksvoorwaarden
            </Link>
            <Link
              to="/algemene-voorwaarden"
              className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
            >
              Algemene Voorwaarden
            </Link>
            <Link
              to="/cookie-policy"
              className="text-xs text-primary-foreground/30 hover:text-primary transition-colors font-body"
            >
              Privacy & Cookiebeleid
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
