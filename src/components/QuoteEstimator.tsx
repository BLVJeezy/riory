import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Ruler, Layers, MapPin, Wrench, RefreshCw } from "lucide-react";

const projectTypes = [
  { value: "rioolaansluiting", label: "Rioolaansluiting", baseCost: 1500 },
  { value: "riolering", label: "Riolering aanleg", baseCost: 2000 },
  { value: "drainage", label: "Drainage systeem", baseCost: 1200 },
  { value: "grondwerk", label: "Grondwerken", baseCost: 800 },
  { value: "herstelling", label: "Herstelling", baseCost: 600 },
];

const groundTypes = [
  { value: "zand", label: "Zandgrond", multiplier: 1 },
  { value: "klei", label: "Kleigrond", multiplier: 1.3 },
  { value: "rots", label: "Rotsachtig", multiplier: 1.8 },
  { value: "gemengd", label: "Gemengd", multiplier: 1.15 },
];

const inputClass =
  "w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

const QuoteEstimator = () => {
  const [projectType, setProjectType] = useState("");
  const [length, setLength] = useState("");
  const [groundType, setGroundType] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);
  const [animatedMin, setAnimatedMin] = useState(0);
  const [animatedMax, setAnimatedMax] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculate = () => {
    const project = projectTypes.find((p) => p.value === projectType);
    const ground = groundTypes.find((g) => g.value === groundType);
    if (!project || !ground || !length) return;

    const len = parseFloat(length);
    const base = project.baseCost + len * 80 * ground.multiplier;
    const min = Math.round(base * 0.85);
    const max = Math.round(base * 1.25);

    setResult({ min, max });
    setShowResult(false);
    setAnimatedMin(0);
    setAnimatedMax(0);

    setTimeout(() => {
      setShowResult(true);
      const steps = 20;
      let step = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        step++;
        setAnimatedMin(Math.round((min / steps) * step));
        setAnimatedMax(Math.round((max / steps) * step));
        if (step >= steps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setAnimatedMin(min);
          setAnimatedMax(max);
        }
      }, 30);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isValid = projectType && length && groundType;

  return (
    <section id="calculator" className="section-padding bg-background">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground">
              Kostenraming
            </h2>
          </div>
          <div className="w-16 h-1 bg-primary mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-muted-foreground font-body max-w-lg mx-auto">
            Bereken een indicatieve prijs voor uw project. Voor een exacte offerte nemen wij contact met u op.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-5 sm:p-8 md:p-10 border border-border max-w-2xl mx-auto shadow-sm">
          {!showResult ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Project type */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Project type <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecteer type</option>
                    {projectTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lengte */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Lengte (meter) <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="bv. 25"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Grondtype */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Grondtype <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={groundType}
                    onChange={(e) => setGroundType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecteer grondtype</option>
                    {groundTypes.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locatie */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
                  Locatie
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="bv. Hasselt"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-1">
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full sm:w-auto text-sm py-5 px-10 gap-2"
                  onClick={calculate}
                  disabled={!isValid}
                >
                  <Calculator className="w-4 h-4" />
                  BEREKEN
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-8">
              <p className="text-xs sm:text-sm font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Geschatte prijs
              </p>
              <p className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground">
                €{animatedMin.toLocaleString("nl-BE")} – €{animatedMax.toLocaleString("nl-BE")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-body mt-4 sm:mt-6 mb-6 sm:mb-8">
                Dit is een indicatieve prijs. Voor een exacte offerte nemen wij contact met u op.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="cta" size="lg" className="text-sm py-5 px-8" asChild>
                  <a href="#offerte">VRAAG EEN EXACTE OFFERTE</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm py-5 px-8 gap-2"
                  onClick={() => {
                    setShowResult(false);
                    setResult(null);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Nieuwe berekening
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteEstimator;
