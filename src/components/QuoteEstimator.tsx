import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

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

    // Tick-up animation
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
      <div className="section-container">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground">
            Kostenraming
          </h2>
        </div>
        <div className="w-16 h-1 bg-primary mb-4" />
        <p className="text-muted-foreground font-body mb-10 max-w-xl">
          Bereken een indicatieve prijs voor uw project. Voor een exacte offerte nemen wij contact met u op.
        </p>

        <div className="bg-surface rounded p-6 md:p-10 border border-border">
          {!showResult ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                  Project type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Selecteer type</option>
                  {projectTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                  Lengte (meter)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="bv. 25"
                  className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                  Grondtype
                </label>
                <select
                  value={groundType}
                  onChange={(e) => setGroundType(e.target.value)}
                  className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Selecteer grondtype</option>
                  {groundTypes.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold uppercase tracking-wider text-foreground mb-2">
                  Locatie
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="bv. Hasselt"
                  className="w-full h-12 px-4 rounded bg-background border border-border text-foreground font-body focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full md:w-auto text-base py-6 px-10"
                  onClick={calculate}
                  disabled={!isValid}
                >
                  BEREKEN
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Geschatte prijs
              </p>
              <p className="text-5xl md:text-7xl font-heading font-bold text-foreground animate-tick-up">
                €{animatedMin.toLocaleString("nl-BE")} – €{animatedMax.toLocaleString("nl-BE")}
              </p>
              <p className="text-muted-foreground font-body mt-6 mb-8">
                Voor een exacte offerte nemen wij contact met u op.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cta" size="lg" className="text-base py-6 px-10" asChild>
                  <a href="#offerte">VRAAG EEN EXACTE OFFERTE</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base py-6 px-10"
                  onClick={() => {
                    setShowResult(false);
                    setResult(null);
                  }}
                >
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
