import { useState } from "react";
import SubmitResultOverlay from "@/components/SubmitResultOverlay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const diensten = [
  "Septische put ledigen",
  "Regenput reinigen",
  "Ontstopping",
  "Dakgootreiniging",
  "Camera inspectie riool",
  "Plaatsbepaling afvoeren",
  "Geurhinder",
  "Rioolvliegjes",
  "Periodieke reiniging",
  "Wateroverlast",
];

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    locatie: "",
    dienst: "",
    beschrijving: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("quote_requests").insert({
        id,
        naam: formData.naam,
        email: formData.email,
        telefoon: formData.telefoon || null,
        locatie: formData.locatie || null,
        dienst: formData.dienst || null,
        beschrijving: formData.beschrijving || null,
        schatting_project_type: null,
        schatting_lengte: null,
        schatting_grondtype: null,
        schatting_locatie: null,
        schatting_min: null,
        schatting_max: null,
        audio_url: null,
        photo_urls: null,
      });

      if (error) throw error;

      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'quote-notification',
          recipientEmail: formData.email,
          idempotencyKey: `quote-notify-${id}`,
          templateData: {
            naam: formData.naam,
            email: formData.email,
            telefoon: formData.telefoon || undefined,
            locatie: formData.locatie || undefined,
            dienst: formData.dienst || undefined,
            beschrijving: formData.beschrijving || undefined,
          },
        },
      });

      setSubmitResult("success");
      setFormData({ naam: "", email: "", telefoon: "", locatie: "", dienst: "", beschrijving: "" });
    } catch (err) {
      console.error("Error submitting quote:", err);
      setRetryCount((c) => c + 1);
      setSubmitResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

  return (
    <>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
            {/* Naam */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Naam <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="naam" value={formData.naam} onChange={handleChange} required placeholder="Uw volledige naam" maxLength={100} className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Email <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="uw@email.be" maxLength={255} className={inputClass} />
              </div>
            </div>

            {/* Telefoon */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Telefoon
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" name="telefoon" value={formData.telefoon} onChange={handleChange} placeholder="+32 4XX XX XX XX" className={inputClass} />
              </div>
            </div>

            {/* Locatie */}
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Locatie
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="locatie" value={formData.locatie} onChange={handleChange} placeholder="Stad of gemeente" maxLength={100} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Dienst */}
          <div className="mb-5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Gewenste dienst
            </label>
            <select name="dienst" value={formData.dienst} onChange={handleChange} className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow">
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
              <textarea name="beschrijving" value={formData.beschrijving} onChange={handleChange} rows={4} placeholder="Beschrijf kort uw project of probleem..." maxLength={1000} className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow" />
            </div>
          </div>

          <Button variant="cta" size="lg" type="submit" disabled={submitting} className="w-full sm:w-auto text-sm py-5 px-10 gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "VERZENDEN..." : "OFFERTE AANVRAGEN"}
          </Button>
        </form>
      </div>
    </section>
    <SubmitResultOverlay
      status={submitResult}
      retryCount={retryCount}
      onClose={() => setSubmitResult(null)}
      onRetry={() => setSubmitResult(null)}
      onStartOver={() => {
        setRetryCount(0);
        setFormData({ naam: "", email: "", telefoon: "", locatie: "", dienst: "", beschrijving: "" });
      }}
      successTitle="Offerte aanvraag verzonden!"
      successMessage="Wij nemen zo snel mogelijk contact met u op."
      errorTitle="Er ging iets mis"
      errorMessage="Uw offerte aanvraag kon niet worden verzonden. Probeer het opnieuw."
    />
    </>
  );
};

export default QuoteForm;
