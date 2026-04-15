import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Calculator,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Camera,
  Droplets,
  Home,
  Trash2,
  CloudRain,
  Info,
} from "lucide-react";

type ServiceId =
  | "interventie"
  | "camera"
  | "pompwerken"
  | "dakgoot"
  | "septisch"
  | "regenput";

interface ServiceOption {
  id: ServiceId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const services: ServiceOption[] = [
  {
    id: "interventie",
    label: "Interventie / Ontstopping",
    icon: <Wrench className="w-6 h-6" />,
    description: "Standaard of met camera-inspectie",
  },
  {
    id: "camera",
    label: "Camera-inspectie / Plaatsbepaling afvoeren",
    icon: <Camera className="w-6 h-6" />,
    description: "Inclusief 1 uur ter plaatse",
  },
  {
    id: "pompwerken",
    label: "Pompwerken / Wateroverlast",
    icon: <Droplets className="w-6 h-6" />,
    description: "Bij wateroverlast of liftput",
  },
  {
    id: "dakgoot",
    label: "Dakgootreiniging",
    icon: <Home className="w-6 h-6" />,
    description: "Prijs per strekkende meter",
  },
  {
    id: "septisch",
    label: "Ledigen septische put",
    icon: <Trash2 className="w-6 h-6" />,
    description: "Tot 2000L, goed bereikbaar",
  },
  {
    id: "regenput",
    label: "Reinigen regenput",
    icon: <CloudRain className="w-6 h-6" />,
    description: "Bepaal de inhoud van uw regenwaterput",
  },
];

const PriceCalculator = () => {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [address, setAddress] = useState({
    straat: "",
    huisnummer: "",
    postcode: "",
    plaats: "",
    land: "België",
  });
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);

  // Service-specific state
  const [interventieType, setInterventieType] = useState<"standaard" | "camera">("standaard");
  const [liftputOnderWater, setLiftputOnderWater] = useState<"ja" | "nee" | null>(null);
  const [dakgootMeters, setDakgootMeters] = useState({ v1: "", v2: "", v3: "" });
  const [regenputInhoud, setRegenputInhoud] = useState<string | null>(null);

  // Distance calculation state
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceData, setDistanceData] = useState<{
    distance_km: number;
    round_trip_km: number;
    travel_cost: number;
    duration_minutes: number;
  } | null>(null);
  const [distanceError, setDistanceError] = useState<string | null>(null);

  const calculateDistance = async () => {
    setDistanceLoading(true);
    setDistanceError(null);
    setDistanceData(null);
    try {
      const { data, error } = await supabase.functions.invoke("calculate-distance", {
        body: {
          straat: address.straat,
          huisnummer: address.huisnummer,
          postcode: address.postcode,
          plaats: address.plaats,
          land: address.land,
        },
      });
      if (error) throw error;
      if (data.error) {
        setDistanceError(data.error);
      } else {
        setDistanceData(data);
      }
    } catch (err: any) {
      setDistanceError("Kon afstand niet berekenen. Controleer het adres.");
    } finally {
      setDistanceLoading(false);
    }
  };

  const canProceedStep1 =
    address.straat && address.huisnummer && address.postcode && address.plaats;

  const travelLabel = distanceData
    ? `Reiskosten: ${distanceData.round_trip_km} km × € 1,45 = € ${distanceData.travel_cost.toFixed(2)}`
    : "+ reiskosten (€ 1,45/km heen en terug)";

  const getPrice = (): { label: string; price: string; total: string | null; details: string[] } | null => {
    if (!selectedService) return null;
    const tc = distanceData?.travel_cost ?? null;

    const makeTotal = (base: number) =>
      tc !== null ? `€ ${(base + tc).toFixed(2)}` : null;

    switch (selectedService) {
      case "interventie":
        return interventieType === "standaard"
          ? {
              label: "Interventie / Ontstopping (Standaard)",
              price: "€ 165",
              total: makeTotal(165),
              details: [travelLabel, "Inclusief 1 uur ter plaatse", "Prijzen excl. BTW"],
            }
          : {
              label: "Interventie / Ontstopping (Met camera)",
              price: "€ 275",
              total: makeTotal(275),
              details: [travelLabel, "Inclusief 1 uur ter plaatse", "Prijzen excl. BTW"],
            };
      case "camera":
        return {
          label: "Camera-inspectie / Plaatsbepaling afvoeren",
          price: "€ 275",
          total: makeTotal(275),
          details: [travelLabel, "Inclusief 1 uur ter plaatse", "Prijzen excl. BTW"],
        };
      case "pompwerken":
        if (!liftputOnderWater) return null;
        return liftputOnderWater === "ja"
          ? {
              label: "Pompwerken – Liftput onder water",
              price: "€ 615",
              total: makeTotal(615),
              details: [
                "€ 165 (1e uur) + € 450 toeslag liftput",
                travelLabel,
                "Prijzen excl. BTW",
              ],
            }
          : {
              label: "Pompwerken / Wateroverlast",
              price: "€ 165",
              total: makeTotal(165),
              details: [travelLabel, "Inclusief 1 uur ter plaatse", "Prijzen excl. BTW"],
            };
      case "dakgoot": {
        const m1 = parseFloat(dakgootMeters.v1) || 0;
        const m2 = parseFloat(dakgootMeters.v2) || 0;
        const m3 = parseFloat(dakgootMeters.v3) || 0;
        const total = m1 * 8.5 + m2 * 9.5 + m3 * 11;
        const totalMeters = m1 + m2 + m3;
        if (totalMeters < 10)
          return {
            label: "Dakgootreiniging",
            price: "Min. 10m vereist",
            total: null,
            details: ["Geldig tot 3 verdiepen of 10 meter hoogte", "Minimum 10m lengte te reinigen"],
          };
        return {
          label: "Dakgootreiniging",
          price: `€ ${total.toFixed(2)}`,
          total: makeTotal(total),
          details: [
            `1 verdiep: ${m1}m × € 8,50 = € ${(m1 * 8.5).toFixed(2)}`,
            `2 verdiepen: ${m2}m × € 9,50 = € ${(m2 * 9.5).toFixed(2)}`,
            `3 verdiepen: ${m3}m × € 11,00 = € ${(m3 * 11).toFixed(2)}`,
            travelLabel,
            "Geldig tot 3 verdiepen of 10 meter hoogte",
            "Prijzen excl. BTW",
          ].filter((d) => !d.startsWith("0m")),
        };
      }
      case "septisch":
        return {
          label: "Ledigen septische put",
          price: "€ 225",
          total: makeTotal(225),
          details: [travelLabel, "Tot 2000L", "Goed bereikbaar", "Prijzen excl. BTW"],
        };
      case "regenput":
        if (!regenputInhoud) return null;
        const priceMap: Record<string, { label: string; value: number | null }> = {
          "5000": { label: "€ 329,45", value: 329.45 },
          "7500": { label: "€ 349,77", value: 349.77 },
          "10000": { label: "€ 369,45", value: 369.45 },
          "15000": { label: "€ 406,29", value: 406.29 },
          "20000": { label: "Op aanvraag", value: null },
        };
        const p = priceMap[regenputInhoud] || { label: "Op aanvraag", value: null };
        return {
          label: `Reinigen regenput (${regenputInhoud === "20000" ? "20.000L" : `≤ ${parseInt(regenputInhoud).toLocaleString("nl-BE")}L`})`,
          price: p.label,
          total: p.value !== null ? makeTotal(p.value) : null,
          details: [
            regenputInhoud !== "20000" ? travelLabel : "",
            "Deksel goed bereikbaar en toegankelijk",
            "Inclusief 5 cm slib op de bodem",
            "Prijzen excl. BTW",
          ].filter(Boolean),
        };
      default:
        return null;
    }
  };

  const getServiceMapping = (): string => {
    const map: Record<ServiceId, string> = {
      interventie: interventieType === "camera" ? "Camera inspectie riool" : "Ontstopping",
      camera: "Camera inspectie riool",
      pompwerken: "Wateroverlast/pompwerken",
      dakgoot: "Dakgootreiniging",
      septisch: "Septische put ledigen",
      regenput: "Reinigen van regenput",
    };
    return selectedService ? map[selectedService] : "";
  };

  const canShowResult = (): boolean => {
    if (!selectedService) return false;
    switch (selectedService) {
      case "interventie":
      case "camera":
      case "septisch":
        return true;
      case "pompwerken":
        return liftputOnderWater !== null;
      case "dakgoot": {
        const m1 = parseFloat(dakgootMeters.v1) || 0;
        const m2 = parseFloat(dakgootMeters.v2) || 0;
        const m3 = parseFloat(dakgootMeters.v3) || 0;
        return m1 + m2 + m3 > 0;
      }
      case "regenput":
        return regenputInhoud !== null;
      default:
        return false;
    }
  };

  const renderServiceOptions = () => {
    if (!selectedService) return null;

    switch (selectedService) {
      case "interventie":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">Type interventie</Label>
            <RadioGroup
              value={interventieType}
              onValueChange={(v) => setInterventieType(v as "standaard" | "camera")}
              className="space-y-3"
            >
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="standaard" />
                <div>
                  <p className="font-medium">Standaard</p>
                  <p className="text-sm text-muted-foreground">€ 165 excl. BTW (+reiskosten) – Incl. 1 uur ter plaatse</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="camera" />
                <div>
                  <p className="font-medium">Met camera-inspectie</p>
                  <p className="text-sm text-muted-foreground">€ 275 excl. BTW (+reiskosten) – Incl. 1 uur ter plaatse</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        );

      case "pompwerken":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">Liftput onder water?</Label>
            <RadioGroup
              value={liftputOnderWater || ""}
              onValueChange={(v) => setLiftputOnderWater(v as "ja" | "nee")}
              className="space-y-3"
            >
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="ja" />
                <div>
                  <p className="font-medium">Ja</p>
                  <p className="text-sm text-muted-foreground">€ 165 (1e uur) + € 450 toeslag liftput (+reiskosten) excl. BTW</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="nee" />
                <div>
                  <p className="font-medium">Nee</p>
                  <p className="text-sm text-muted-foreground">€ 165 excl. BTW (+reiskosten) – Incl. 1 uur ter plaatse</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        );

      case "dakgoot":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">
              Geschatte meters per verdieping
            </Label>
            <p className="text-sm text-muted-foreground">
              Geldig tot 3 verdiepen of 10 meter hoogte. Minimum 10m lengte te reinigen.
            </p>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">1 verdiep</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="meter"
                  value={dakgootMeters.v1}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v1: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 8,50/m</span>
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">2 verdiepen</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="meter"
                  value={dakgootMeters.v2}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v2: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 9,50/m</span>
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">3 verdiepen</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="meter"
                  value={dakgootMeters.v3}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v3: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 11,00/m</span>
              </div>
            </div>
          </div>
        );

      case "regenput":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">
              Bepaal de inhoud van uw regenwaterput
            </Label>
            <RadioGroup
              value={regenputInhoud || ""}
              onValueChange={setRegenputInhoud}
              className="grid gap-3 sm:grid-cols-2"
            >
              {[
                { value: "5000", label: "≤ 5.000L", price: "€ 329,45 excl. BTW (+reiskosten)" },
                { value: "7500", label: "7.500L", price: "€ 349,77 excl. BTW (+reiskosten)" },
                { value: "10000", label: "10.000L", price: "€ 369,45 excl. BTW (+reiskosten)" },
                { value: "15000", label: "15.000L", price: "€ 406,29 excl. BTW (+reiskosten)" },
                { value: "20000", label: "20.000L", price: "Op aanvraag" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors"
                >
                  <RadioGroupItem value={opt.value} />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.price}</p>
                    <p className="text-xs text-muted-foreground">
                      Deksel goed bereikbaar en toegankelijk. Incl. 5 cm slib.
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case "camera":
      case "septisch":
      default:
        return null;
    }
  };

  const result = getPrice();

  return (
    <section id="prijscalculator" className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Calculator className="w-5 h-5" />
            <span className="font-heading font-semibold text-sm uppercase tracking-wider">
              Prijscalculator
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Bereken uw indicatieve prijs
          </h1>
        </div>

        {/* Step 0: Disclaimer */}
        {step === 0 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deze berekeningen zijn louter informatief. Riory kan in geen enkel geval
                gebonden worden aan deze prijs. Elke interventie is uniek en kan niet
                vergeleken worden met andere klanten door de verschillende rijkosten per
                klant. De exacte prijs van de interventie zal steeds ter plaatse afgerekend
                worden net na de interventie.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="akkoord"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
              />
              <Label htmlFor="akkoord" className="cursor-pointer leading-relaxed">
                Ik begrijp dat deze prijzen louter informatief zijn en niet bindend.
              </Label>
            </div>
            <Button
              variant="cta"
              size="lg"
              disabled={!agreed}
              onClick={() => setStep(1)}
              className="w-full"
            >
              Verder <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-semibold">Werkadres</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Vul het werkadres in. Reiskosten worden berekend aan € 1,45/km van Riory
              tot klant en terug. Beperkt tot 30 min reistijd.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Straat *</Label>
                <Input
                  value={address.straat}
                  onChange={(e) => setAddress((p) => ({ ...p, straat: e.target.value }))}
                  placeholder="Straatnaam"
                />
              </div>
              <div>
                <Label>Huisnummer *</Label>
                <Input
                  value={address.huisnummer}
                  onChange={(e) => setAddress((p) => ({ ...p, huisnummer: e.target.value }))}
                  placeholder="Nr."
                />
              </div>
              <div>
                <Label>Postcode *</Label>
                <Input
                  value={address.postcode}
                  onChange={(e) => setAddress((p) => ({ ...p, postcode: e.target.value }))}
                  placeholder="Postcode"
                />
              </div>
              <div>
                <Label>Plaats *</Label>
                <Input
                  value={address.plaats}
                  onChange={(e) => setAddress((p) => ({ ...p, plaats: e.target.value }))}
                  placeholder="Gemeente"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Land</Label>
                <Input
                  value={address.land}
                  onChange={(e) => setAddress((p) => ({ ...p, land: e.target.value }))}
                  placeholder="Land"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="w-4 h-4" /> Terug
              </Button>
              <Button
                variant="cta"
                size="lg"
                disabled={!canProceedStep1 || distanceLoading}
                onClick={async () => {
                  await calculateDistance();
                  setStep(2);
                }}
                className="flex-1"
              >
                {distanceLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Afstand berekenen...</>
                ) : (
                  <>Verder <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Service selection */}
        {step === 2 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <h2 className="font-heading text-xl font-semibold">Kies een van onze diensten</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s.id);
                    // Reset sub-options
                    setInterventieType("standaard");
                    setLiftputOnderWater(null);
                    setDakgootMeters({ v1: "", v2: "", v3: "" });
                    setRegenputInhoud(null);
                    setStep(3);
                  }}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card text-left hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" /> Terug
            </Button>
          </Card>
        )}

        {/* Step 3: Service-specific options + result */}
        {step === 3 && selectedService && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <h2 className="font-heading text-xl font-semibold">
              {services.find((s) => s.id === selectedService)?.label}
            </h2>

            {renderServiceOptions()}

            {canShowResult() && result && (
              <div className="mt-6 p-4 sm:p-6 rounded-xl bg-primary/5 border border-primary/20 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider">
                    Indicatieve prijs
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground break-words">
                  {result.total || result.price} <span className="text-sm sm:text-base font-normal text-muted-foreground">excl. BTW</span>
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground">{result.label}</p>
                {distanceData && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Reiskosten (heen & terug): € {distanceData.travel_cost.toFixed(2)}
                  </p>
                )}
                <ul className="space-y-1">
                  {result.details.filter(d => !d.toLowerCase().includes('reiskosten') && !d.toLowerCase().includes('km ×')).map((d, i) => (
                    <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-1.5 sm:gap-2">
                      <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 shrink-0" />
                      <span className="break-words">{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] sm:text-xs text-muted-foreground/70 italic mt-2">
                  Dit is een indicatieve schatting en geen definitief offerte. De uiteindelijke prijs kan afwijken na inspectie ter plaatse.
                </p>
                <div className="pt-3 sm:pt-4">
                  <Button variant="cta" size="lg" className="w-full text-sm sm:text-base" asChild>
                    <Link to={`/afspraak?dienst=${encodeURIComponent(getServiceMapping())}&straat=${encodeURIComponent(address.straat)}&huisnummer=${encodeURIComponent(address.huisnummer)}&postcode=${encodeURIComponent(address.postcode)}&plaats=${encodeURIComponent(address.plaats)}`}>
                      Interventie boeken <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4" /> Terug
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(0);
                  setAgreed(false);
                  setSelectedService(null);
                }}
              >
                Opnieuw beginnen
              </Button>
            </div>
          </Card>
        )}

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                s === step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
