import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
          Contacteer Ons
        </h2>
        <div className="w-16 h-1 bg-primary mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">Telefoon</h3>
                <a href="tel:+32472502814" className="text-muted-foreground font-body hover:text-primary transition-colors">
                  +32 472 50 28 14
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">Email</h3>
                <a href="mailto:info@riory.be" className="text-muted-foreground font-body hover:text-primary transition-colors">
                  info@riory.be
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">Adres</h3>
                <p className="text-muted-foreground font-body">
                  Tongersesteenweg 19<br />
                  3740 Bilzen, België
                </p>
              </div>
            </div>
          </div>

          <div className="rounded overflow-hidden border border-border h-72 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.5!2d5.52!3d50.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDUyJzEyLjAiTiA1wrAzMScxMi4wIkU!5e0!3m2!1snl!2sbe!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RIORY locatie"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
