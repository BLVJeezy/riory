import { useState } from "react";
import { Info } from "lucide-react";
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

const qualities = [
  {
    number: 1,
    title: "24/7 Bereikbaar",
    description:
      "Riory is 24 uur per dag en 7 dagen per week bereikbaar. Met één telefoontje zijn al uw problemen opgelost!",
    image: stap1,
  },
  {
    number: 2,
    title: "Propere en snelle lediging",
    description:
      "In een mum van tijd ledigen onze vakmensen uw septische put met professioneel materiaal. En dit voor een eerlijke prijs.",
    image: stap2,
  },
  {
    number: 3,
    title: "Kwalitatief werk",
    description:
      "Onze werknemers beschikken over de benodigde expertise om kwalitatief, grondig en proper werk te leveren.",
    image: stap3,
  },
  {
    number: 4,
    title: "Niet vies van vuil werk",
    description:
      "Voor onze vakmensen is geen klusje te vuil. Wij klaren de vuilste werken en laten de omgeving netjes achter.",
    image: stap4,
  },
  {
    number: 5,
    title: "Professioneel materiaal",
    description:
      "Wij beschikken over modern en professioneel materiaal om de vuilste werken grondig te klaren.",
    image: stap5,
  },
  {
    number: 6,
    title: "Maak je afspraak",
    description:
      "Plan snel en eenvoudig een afspraak via ons formulier. Urgentie? Bel ons direct op 0472 50 28 14!",
    image: stap6,
  },
];

const WhyChooseUs = () => {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const activeQuality = openStep !== null ? qualities.find((q) => q.number === openStep) : null;

  return (
    <section id="waarom-ons" className="section-padding bg-charcoal">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white text-center mb-4">
          Waarom kiezen voor ons?
        </h2>
        <p className="text-muted-foreground font-body text-center max-w-2xl mx-auto mb-10">
          Ontdek waarom mensen voor Riory kiezen: 24/7 bereikbaar, professioneel materiaal, kwalitatief werk en snelle service voor al uw rioleringsproblemen.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {qualities.map((q) => (
            <div
              key={q.number}
              className="rounded-xl overflow-hidden flex flex-col"
            >
              {/* Step label */}
              <div className="bg-primary px-3 py-1.5 text-center">
                <span className="text-xs font-heading font-bold uppercase text-primary-foreground tracking-wider">
                  Stap {q.number}
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={q.image}
                  alt={q.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Title + button */}
              <div className="bg-primary px-3 py-2.5 flex flex-col items-center gap-1.5">
                <h3 className="text-xs md:text-sm font-heading font-bold uppercase text-white text-center leading-tight">
                  {q.title}
                </h3>
                <button
                  onClick={() => setOpenStep(q.number)}
                  className="flex items-center gap-1 text-[10px] md:text-xs text-white/80 hover:text-white transition-colors font-body"
                >
                  <Info className="w-3 h-3" />
                  Meer informatie
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup dialog */}
      <Dialog open={openStep !== null} onOpenChange={(open) => !open && setOpenStep(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase">
              Stap {activeQuality?.number} — {activeQuality?.title}
            </DialogTitle>
            <DialogDescription className="font-body pt-2">
              {activeQuality?.description}
            </DialogDescription>
          </DialogHeader>
          {activeQuality && (
            <img
              src={activeQuality.image}
              alt={activeQuality.title}
              className="w-full rounded-lg mt-2"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WhyChooseUs;
