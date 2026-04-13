import { useState } from "react";
import SubmitResultOverlay from "@/components/SubmitResultOverlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedDienst?: string;
}

const QuoteFormDialog = ({ open, onOpenChange, preselectedDienst }: QuoteFormDialogProps) => {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    locatie: "",
    dienst: preselectedDienst || "",
    beschrijving: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);

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
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting quote:", err);
      setSubmitResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && preselectedDienst) {
      setFormData((prev) => ({ ...prev, dienst: preselectedDienst }));
    }
    onOpenChange(newOpen);
  };

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold uppercase text-foreground">
            Offerte Aanvragen
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Naam <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="naam" value={formData.naam} onChange={handleChange} required placeholder="Uw volledige naam" maxLength={100} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Email <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="uw@email.be" maxLength={255} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Telefoon
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" name="telefoon" value={formData.telefoon} onChange={handleChange} placeholder="+32 4XX XX XX XX" className={inputClass} />
              </div>
            </div>
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

          <div>
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

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Beschrijving
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <textarea name="beschrijving" value={formData.beschrijving} onChange={handleChange} rows={3} placeholder="Beschrijf kort uw project of probleem..." maxLength={1000} className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow" />
            </div>
          </div>

          <Button variant="cta" size="lg" type="submit" disabled={submitting} className="w-full text-sm py-5 gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "VERZENDEN..." : "OFFERTE AANVRAGEN"}
          </Button>
        </form>
      </DialogContent>
      <SubmitResultOverlay
        status={submitResult}
        onClose={() => setSubmitResult(null)}
        onRetry={() => setSubmitResult(null)}
        successTitle="Offerte aanvraag verzonden!"
        successMessage="Wij nemen zo snel mogelijk contact met u op."
        errorTitle="Er ging iets mis"
        errorMessage="Uw offerte aanvraag kon niet worden verzonden. Probeer het opnieuw."
      />
    </Dialog>
  );
};

export default QuoteFormDialog;
