import logo from "@/assets/riory-logo-footer.svg";

const Footer = () => {
  return (
    <footer className="bg-charcoal section-padding py-12 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={logo} alt="RIORY" className="h-10 mb-4 brightness-0 invert" />
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
              {["Home", "Diensten", "Projecten", "Offerte", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace("offerte", "offerte")}`}
                    className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-wider text-primary-foreground mb-4 text-sm">
              Volg ons
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1Ad153BttY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/riory/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/50 hover:text-primary transition-colors font-body"
              >
                LinkedIn
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://wa.me/32472502814"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
              >
                WhatsApp ons
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6">
          <p className="text-xs text-primary-foreground/30 font-body text-center">
            © {new Date().getFullYear()} RIORY. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
