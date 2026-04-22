import { useState } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import stap1 from "@/assets/stap-1.png";
import stap2 from "@/assets/stap-2.jpg";
import stap3 from "@/assets/stap-3.jpg";
import stap4 from "@/assets/stap-4.jpg";
import stap5 from "@/assets/stap-5.jpg";
import stap6 from "@/assets/stap-6.jpg";

const images = [stap1, stap2, stap3, stap4, stap5, stap6];

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const [openStep, setOpenStep] = useState<number | null>(null);

  const qualities = (t("whyUs.qualities", { returnObjects: true }) as { title: string; description: string }[]).map(
    (q, i) => ({ number: i + 1, title: q.title, description: q.description, image: images[i] })
  );

  const activeQuality = openStep !== null ? qualities.find((q) => q.number === openStep) : null;

  return (
    <section id="waarom-ons" className="section-padding bg-charcoal">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white text-center mb-4">
          {t("whyUs.title")}
        </h2>
        <p className="text-muted-foreground font-body text-center max-w-2xl mx-auto mb-10">
          {t("whyUs.subtitle")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {qualities.map((q) => (
            <div key={q.number} className="bg-primary rounded-xl p-4 md:p-5 flex flex-col">
              <span className="text-xs font-heading font-bold uppercase text-white/50 tracking-wider">
                {t("whyUs.step")} {q.number}
              </span>
              <h3 className="text-xs md:text-sm font-heading font-bold uppercase text-white mt-1 mb-2 leading-tight">
                {q.title}
              </h3>
              <p className="text-xs text-white/80 font-body leading-relaxed flex-1">
                {q.description}
              </p>
              <button
                onClick={() => setOpenStep(q.number)}
                className="flex items-center gap-1 text-[10px] md:text-xs text-white/70 hover:text-white transition-colors font-body mt-3 self-start"
              >
                <Info className="w-3 h-3" />
                {t("whyUs.moreInfo")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openStep !== null} onOpenChange={(open) => !open && setOpenStep(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase">
              {t("whyUs.step")} {activeQuality?.number} — {activeQuality?.title}
            </DialogTitle>
            <DialogDescription className="font-body pt-2">
              {activeQuality?.description}
            </DialogDescription>
          </DialogHeader>
          {activeQuality && (
            <img src={activeQuality.image} alt={activeQuality.title} className="w-full rounded-lg mt-2" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WhyChooseUs;
