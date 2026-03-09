import { useState } from "react";
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
  "Camera-inspectie",
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
      });

      if (error) throw error;

      toast.success("Uw offerte aanvraag is verzonden! Wij nemen spoedig contact op.");
      setFormData({ naam: "", email: "", telefoon: "", locatie: "", dienst: "", beschrijving: "" });
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting quote:", err);
      toast.error("Er ging iets mis bij het verzenden. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  // Update dienst when preselectedDienst changes while dialog opens
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
    </Dialog>
  );
};

export default QuoteFormDialog;
