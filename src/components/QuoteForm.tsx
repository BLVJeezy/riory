import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, User, Mail, Phone, MapPin, FileText, Calculator, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { EstimationData } from "@/pages/Index";

const diensten = [
  "Septische put ledigen",
  "Regenput reinigen",
  "Ontstopping",
  "Dakgootreiniging",
  "Camera-inspectie",
  "Plaatsbepaling afvoeren",
  "Geurhinder",
  "Rioolvliegjes",
  "Periodieke reiniging",
  "Wateroverlast",
];

interface QuoteFormProps {
  estimation?: EstimationData | null;
  onClearEstimation?: () => void;
}

const QuoteForm = ({ estimation, onClearEstimation }: QuoteFormProps) => {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    locatie: "",
    dienst: "",
    beschrijving: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("quote_requests").insert({
        naam: formData.naam,
        email: formData.email,
        telefoon: formData.telefoon || null,
        locatie: formData.locatie || null,
        dienst: formData.dienst || null,
        beschrijving: formData.beschrijving || null,
        schatting_project_type: estimation?.projectType || null,
        schatting_lengte: estimation?.length || null,
        schatting_grondtype: estimation?.groundType || null,
        schatting_locatie: estimation?.location || null,
        schatting_min: estimation?.min || null,
        schatting_max: estimation?.max || null,
      });

      if (error) throw error;

      toast.success("Uw offerte aanvraag is verzonden! Wij nemen spoedig contact op.");
      setFormData({ naam: "", email: "", telefoon: "", locatie: "", dienst: "", beschrijving: "" });
      onClearEstimation?.();
    } catch (err) {
      console.error("Error submitting quote:", err);
      toast.error("Er ging iets mis bij het verzenden. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

  return (
    <section id="offerte" className="section-padding bg-surface">
      <div className="section-container px-6 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Vraag een Offerte
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground font-body max-w-lg mx-auto">
            Vul onderstaand formulier in en wij bezorgen u vrijblijvend een offerte op maat.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-background rounded-xl p-5 sm:p-8 md:p-10 border border-border max-w-2xl mx-auto shadow-sm"
        >
          {/* Estimation summary banner */}
          {estimation && (
            <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4 relative">
              <button
                type="button"
                onClick={onClearEstimation}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Verwijder kostenraming"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-primary" />
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                  Kostenraming bijgevoegd
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-body text-foreground">
                <span className="text-muted-foreground">Project:</span>
                <span>{estimation.projectType}</span>
                <span className="text-muted-foreground">Lengte:</span>
                <span>{estimation.length}m</span>
                <span className="text-muted-foreground">Grondtype:</span>
                <span>{estimation.groundType}</span>
                {estimation.location && (
                  <>
                    <span className="text-muted-foreground">Locatie:</span>
                    <span>{estimation.location}</span>
                  </>
                )}
              </div>
              <p className="text-lg sm:text-xl font-heading font-bold text-foreground mt-3">
                €{estimation.min.toLocaleString("nl-BE")} – €{estimation.max.toLocaleString("nl-BE")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
            {/* Naam */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Naam <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="naam"
                  value={formData.naam}
                  onChange={handleChange}
                  required
                  placeholder="Uw volledige naam"
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Email <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="uw@email.be"
                  maxLength={255}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Telefoon */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Telefoon
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  name="telefoon"
                  value={formData.telefoon}
                  onChange={handleChange}
                  placeholder="+32 4XX XX XX XX"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Locatie */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Locatie
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="locatie"
                  value={formData.locatie}
                  onChange={handleChange}
                  placeholder="Stad of gemeente"
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Dienst */}
          <div className="mb-5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Gewenste dienst
            </label>
            <select
              name="dienst"
              value={formData.dienst}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
            >
              <option value="">Selecteer een dienst (optioneel)</option>
              {diensten.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Beschrijving */}
          <div className="mb-6">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Beschrijving
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <textarea
                name="beschrijving"
                value={formData.beschrijving}
                onChange={handleChange}
                rows={4}
                placeholder="Beschrijf kort uw project of probleem..."
                maxLength={1000}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow"
              />
            </div>
          </div>

          <Button
            variant="cta"
            size="lg"
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto text-sm py-5 px-10 gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? "VERZENDEN..." : "OFFERTE AANVRAGEN"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default QuoteForm;
