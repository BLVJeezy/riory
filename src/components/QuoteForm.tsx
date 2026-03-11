import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, User, Mail, Phone, MapPin, FileText, Calculator, X, Mic, Square, ImagePlus, Trash2 } from "lucide-react";
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

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Photo upload state
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Audio Recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      toast.error("Kan microfoon niet openen. Geef toestemming in uw browser.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const removeAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  // --- Photo Upload ---
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast.error("Maximaal 5 foto's toegestaan.");
      return;
    }
    const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error("Sommige bestanden zijn te groot (max 10MB).");
    }
    setPhotos((prev) => [...prev, ...validFiles]);
    const newUrls = validFiles.map((f) => URL.createObjectURL(f));
    setPhotoPreviewUrls((prev) => [...prev, ...newUrls]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const quoteId = crypto.randomUUID();
      let uploadedAudioUrl: string | null = null;
      const uploadedPhotoUrls: string[] = [];

      // Upload audio if exists
      if (audioBlob) {
        const audioPath = `${quoteId}/audio.webm`;
        const { error: audioErr } = await supabase.storage
          .from("quote-attachments")
          .upload(audioPath, audioBlob, { contentType: "audio/webm" });
        if (audioErr) throw audioErr;
        const { data: urlData } = supabase.storage
          .from("quote-attachments")
          .getPublicUrl(audioPath);
        uploadedAudioUrl = urlData.publicUrl;
      }

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const ext = photos[i].name.split(".").pop() || "jpg";
        const photoPath = `${quoteId}/photo-${i}.${ext}`;
        const { error: photoErr } = await supabase.storage
          .from("quote-attachments")
          .upload(photoPath, photos[i], { contentType: photos[i].type });
        if (photoErr) throw photoErr;
        const { data: urlData } = supabase.storage
          .from("quote-attachments")
          .getPublicUrl(photoPath);
        uploadedPhotoUrls.push(urlData.publicUrl);
      }

      const { error } = await supabase.from("quote_requests").insert({
        id: quoteId,
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
        audio_url: uploadedAudioUrl,
        photo_urls: uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : null,
      });

      if (error) throw error;

      toast.success("Uw offerte aanvraag is verzonden! Wij nemen spoedig contact op.");
      setFormData({ naam: "", email: "", telefoon: "", locatie: "", dienst: "", beschrijving: "" });
      removeAudio();
      setPhotos([]);
      photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPhotoPreviewUrls([]);
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
          <div className="mb-5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Beschrijving
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <textarea name="beschrijving" value={formData.beschrijving} onChange={handleChange} rows={4} placeholder="Beschrijf kort uw project of probleem..." maxLength={1000} className="w-full pl-11 pr-4 py-3 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow" />
            </div>
          </div>

          {/* Voice Recording */}
          <div className="mb-5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Spraakbericht (optioneel)
            </label>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              {!audioBlob ? (
                <div className="flex items-center gap-3">
                  {isRecording ? (
                    <>
                      <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-full shrink-0" onClick={stopRecording}>
                        <Square className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        <span className="text-sm font-body text-foreground">{formatTime(recordingTime)}</span>
                      </div>
                    </>
                  ) : (
                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={startRecording}>
                      <Mic className="w-4 h-4" />
                      Opnemen
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <audio src={audioUrl!} controls className="h-10 flex-1 min-w-0" />
                  <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={removeAudio}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
              Foto's (optioneel, max 5)
            </label>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {photoPreviewUrls.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {photos.length < 5 && (
                <>
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="w-4 h-4" />
                    Foto toevoegen
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
                </>
              )}
            </div>
          </div>

          <Button variant="cta" size="lg" type="submit" disabled={submitting} className="w-full sm:w-auto text-sm py-5 px-10 gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "VERZENDEN..." : "OFFERTE AANVRAGEN"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default QuoteForm;
