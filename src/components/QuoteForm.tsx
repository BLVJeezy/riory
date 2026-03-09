import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    locatie: "",
    beschrijving: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      toast.success("Uw offerte aanvraag is verzonden! Wij nemen spoedig contact op.");
      setFormData({ naam: "", email: "", telefoon: "", locatie: "", beschrijving: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <section id="offerte" className="section-padding bg-surface">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
          Vraag een Offerte
        </h2>
        <div className="w-16 h-1 bg-primary mb-4" />
        <p className="text-muted-foreground font-body mb-10 max-w-xl">
          Vul onderstaand formulier in en wij bezorgen u vrijblijvend een offerte op maat.
        </p>

        <form onSubmit={handleSubmit} className="bg-background rounded p-6 md:p-10 border border-border max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                Naam *
              </label>
              <input
                type="text"
                name="naam"
                value={formData.naam}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                Telefoon
              </label>
              <input
                type="tel"
                name="telefoon"
                value={formData.telefoon}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                Project locatie
              </label>
              <input
                type="text"
                name="locatie"
                value={formData.locatie}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
              Beschrijving project
            </label>
            <textarea
              name="beschrijving"
              value={formData.beschrijving}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
            />
          </div>

          <Button variant="cta" size="lg" type="submit" disabled={submitting} className="text-base py-6 px-10">
            {submitting ? "VERZENDEN..." : "OFFERTE AANVRAGEN"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default QuoteForm;
