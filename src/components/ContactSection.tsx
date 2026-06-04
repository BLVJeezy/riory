import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
          {t("contact.title")}
        </h2>
        <div className="w-16 h-1 bg-primary mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{t("contact.phone")}</h3>
                <a href="tel:+32472502814" data-track-cta="contact_section_tel" className="text-muted-foreground font-body hover:text-primary transition-colors">
                  +32 472 50 28 14
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{t("contact.email")}</h3>
                <a href="mailto:info@riory.be" className="text-muted-foreground font-body hover:text-primary transition-colors">
                  info@riory.be
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{t("contact.address")}</h3>
                <p className="text-muted-foreground font-body">
                  {t("contact.addressLine1")}<br />
                  {t("contact.addressLine2")}
                </p>
                <p className="text-muted-foreground/70 font-body text-sm mt-1">
                  {t("contact.serviceArea")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded overflow-hidden border border-border h-72 md:h-auto">
            <iframe
              src="https://www.google.com/maps?q=Natveld+47,+3740+Bilzen-Hoeselt,+Belgi%C3%AB&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Riory BV – Natveld 47, 3740 Bilzen-Hoeselt op Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
