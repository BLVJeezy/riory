import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
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
  icon: React.ReactNode;
}

const serviceDefs: ServiceOption[] = [
  { id: "interventie", icon: <Wrench className="w-6 h-6" /> },
  { id: "camera", icon: <Camera className="w-6 h-6" /> },
  { id: "pompwerken", icon: <Droplets className="w-6 h-6" /> },
  { id: "dakgoot", icon: <Home className="w-6 h-6" /> },
  { id: "septisch", icon: <Trash2 className="w-6 h-6" /> },
  { id: "regenput", icon: <CloudRain className="w-6 h-6" /> },
];

const PriceCalculator = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
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

  const [interventieType, setInterventieType] = useState<"standaard" | "camera">("standaard");
  const [liftputOnderWater, setLiftputOnderWater] = useState<"ja" | "nee" | null>(null);
  const [dakgootMeters, setDakgootMeters] = useState({ v1: "", v2: "", v3: "" });
  const [regenputInhoud, setRegenputInhoud] = useState<string | null>(null);

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
      setDistanceError(t("calculator.addressError"));
    } finally {
      setDistanceLoading(false);
    }
  };

  const canProceedStep1 =
    address.straat && address.huisnummer && address.postcode && address.plaats;

  const travelLabel = distanceData
    ? `${t("calculator.travelCostsLabel")} ${distanceData.round_trip_km} km × € 1,45 = € ${distanceData.travel_cost.toFixed(2)}`
    : t("calculator.travelLabelDefault");

  const getPrice = (): { label: string; price: string; total: string | null; details: string[] } | null => {
    if (!selectedService) return null;
    const tc = distanceData?.travel_cost ?? null;
    const incl1Hour = t("calculator.incl1Hour");
    const exclVatPlain = t("calculator.exclVatPlain");

    const makeTotal = (base: number) =>
      tc !== null ? `€ ${(base + tc).toFixed(2)}` : null;

    switch (selectedService) {
      case "interventie":
        return interventieType === "standaard"
          ? {
              label: `${t("calculator.services.interventie.label")} (${t("calculator.standard")})`,
              price: "€ 165",
              total: makeTotal(165),
              details: [travelLabel, incl1Hour, exclVatPlain],
            }
          : {
              label: `${t("calculator.services.interventie.label")} (${t("calculator.withCamera")})`,
              price: "€ 275",
              total: makeTotal(275),
              details: [travelLabel, incl1Hour, exclVatPlain],
            };
      case "camera":
        return {
          label: t("calculator.services.camera.label"),
          price: "€ 275",
          total: makeTotal(275),
          details: [travelLabel, incl1Hour, exclVatPlain],
        };
      case "pompwerken":
        if (!liftputOnderWater) return null;
        return liftputOnderWater === "ja"
          ? {
              label: `${t("calculator.services.pompwerken.label")} – ${t("calculator.liftpitUnderWater")}`,
              price: "€ 615",
              total: makeTotal(615),
              details: [
                "€ 165 (1e uur) + € 450 toeslag liftput",
                travelLabel,
                exclVatPlain,
              ],
            }
          : {
              label: t("calculator.services.pompwerken.label"),
              price: "€ 165",
              total: makeTotal(165),
              details: [travelLabel, incl1Hour, exclVatPlain],
            };
      case "dakgoot": {
        const m1 = parseFloat(dakgootMeters.v1) || 0;
        const m2 = parseFloat(dakgootMeters.v2) || 0;
        const m3 = parseFloat(dakgootMeters.v3) || 0;
        const total = m1 * 8.5 + m2 * 9.5 + m3 * 11;
        const totalMeters = m1 + m2 + m3;
        if (totalMeters < 10)
          return {
            label: t("calculator.services.dakgoot.label"),
            price: t("calculator.minRequired"),
            total: null,
            details: [t("calculator.validUpTo"), t("calculator.minLength")],
          };
        return {
          label: t("calculator.services.dakgoot.label"),
          price: `€ ${total.toFixed(2)}`,
          total: makeTotal(total),
          details: [
            `${t("calculator.floor1")}: ${m1}m × € 8,50 = € ${(m1 * 8.5).toFixed(2)}`,
            `${t("calculator.floor2")}: ${m2}m × € 9,50 = € ${(m2 * 9.5).toFixed(2)}`,
            `${t("calculator.floor3")}: ${m3}m × € 11,00 = € ${(m3 * 11).toFixed(2)}`,
            travelLabel,
            t("calculator.validUpTo"),
            exclVatPlain,
          ],
        };
      }
      case "septisch":
        return {
          label: t("calculator.services.septisch.label"),
          price: "€ 225",
          total: makeTotal(225),
          details: [travelLabel, t("calculator.septicTankFull"), t("calculator.wellAccessible"), exclVatPlain],
        };
      case "regenput":
        if (!regenputInhoud) return null;
        const priceMap: Record<string, { label: string; value: number | null }> = {
          "5000": { label: "€ 329,45", value: 329.45 },
          "7500": { label: "€ 349,77", value: 349.77 },
          "10000": { label: "€ 369,45", value: 369.45 },
          "15000": { label: "€ 406,29", value: 406.29 },
          "20000": { label: t("calculator.onRequest"), value: null },
        };
        const p = priceMap[regenputInhoud] || { label: t("calculator.onRequest"), value: null };
        const rainOptions = t("calculator.rainTankOptions", { returnObjects: true }) as Record<string, string>;
        return {
          label: `${t("calculator.services.regenput.label")} (${rainOptions[regenputInhoud] || regenputInhoud})`,
          price: p.label,
          total: p.value !== null ? makeTotal(p.value) : null,
          details: [
            regenputInhoud !== "20000" ? travelLabel : "",
            t("calculator.rainTankNote"),
            exclVatPlain,
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
            <Label className="text-base font-heading font-semibold">{t("calculator.interventionType")}</Label>
            <RadioGroup
              value={interventieType}
              onValueChange={(v) => setInterventieType(v as "standaard" | "camera")}
              className="space-y-3"
            >
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="standaard" />
                <div>
                  <p className="font-medium">{t("calculator.standard")}</p>
                  <p className="text-sm text-muted-foreground">€ 165 {t("calculator.exclVat")} (+{t("calculator.travelCostsLabel").replace(":", "").toLowerCase()}) – {t("calculator.incl1Hour")}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="camera" />
                <div>
                  <p className="font-medium">{t("calculator.withCamera")}</p>
                  <p className="text-sm text-muted-foreground">€ 275 {t("calculator.exclVat")} – {t("calculator.incl1Hour")}</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        );

      case "pompwerken":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">{t("calculator.liftpitUnderWater")}</Label>
            <RadioGroup
              value={liftputOnderWater || ""}
              onValueChange={(v) => setLiftputOnderWater(v as "ja" | "nee")}
              className="space-y-3"
            >
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="ja" />
                <div>
                  <p className="font-medium">{t("calculator.yes")}</p>
                  <p className="text-sm text-muted-foreground">€ 615 {t("calculator.exclVat")}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <RadioGroupItem value="nee" />
                <div>
                  <p className="font-medium">{t("calculator.no")}</p>
                  <p className="text-sm text-muted-foreground">€ 165 {t("calculator.exclVat")} – {t("calculator.incl1Hour")}</p>
                </div>
              </label>
            </RadioGroup>
          </div>
        );

      case "dakgoot":
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">
              {t("calculator.metersPerFloor")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("calculator.metersHelp")}
            </p>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">{t("calculator.floor1")}</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder={t("calculator.meters")}
                  value={dakgootMeters.v1}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v1: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 8,50/m</span>
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">{t("calculator.floor2")}</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder={t("calculator.meters")}
                  value={dakgootMeters.v2}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v2: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 9,50/m</span>
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-32 text-sm">{t("calculator.floor3")}</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder={t("calculator.meters")}
                  value={dakgootMeters.v3}
                  onChange={(e) => setDakgootMeters((p) => ({ ...p, v3: e.target.value }))}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-muted-foreground">× € 11,00/m</span>
              </div>
            </div>
          </div>
        );

      case "regenput": {
        const rainOptions = t("calculator.rainTankOptions", { returnObjects: true }) as Record<string, string>;
        const opts = [
          { value: "5000", price: `€ 329,45 ${t("calculator.exclVat")}` },
          { value: "7500", price: `€ 349,77 ${t("calculator.exclVat")}` },
          { value: "10000", price: `€ 369,45 ${t("calculator.exclVat")}` },
          { value: "15000", price: `€ 406,29 ${t("calculator.exclVat")}` },
          { value: "20000", price: t("calculator.onRequest") },
        ];
        return (
          <div className="space-y-4">
            <Label className="text-base font-heading font-semibold">
              {t("calculator.rainTankContent")}
            </Label>
            <RadioGroup
              value={regenputInhoud || ""}
              onValueChange={setRegenputInhoud}
              className="grid gap-3 sm:grid-cols-2"
            >
              {opts.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors"
                >
                  <RadioGroupItem value={opt.value} />
                  <div>
                    <p className="font-medium">{rainOptions[opt.value]}</p>
                    <p className="text-sm text-muted-foreground">{opt.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("calculator.rainTankNote")}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        );
      }

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
              {t("calculator.badge")}
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {t("calculator.h1")}
          </h1>
        </div>

        {/* Step 0: Disclaimer */}
        {step === 0 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("calculator.disclaimer")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="akkoord"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
              />
              <Label htmlFor="akkoord" className="cursor-pointer leading-relaxed">
                {t("calculator.agree")}
              </Label>
            </div>
            <Button
              variant="cta"
              size="lg"
              disabled={!agreed}
              onClick={() => setStep(1)}
              className="w-full"
            >
              {t("calculator.continue")} <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-semibold">{t("calculator.addressTitle")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("calculator.addressSubtitle")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("calculator.street")} *</Label>
                <Input
                  value={address.straat}
                  onChange={(e) => setAddress((p) => ({ ...p, straat: e.target.value }))}
                  placeholder={t("calculator.streetPh")}
                />
              </div>
              <div>
                <Label>{t("calculator.houseNumber")} *</Label>
                <Input
                  value={address.huisnummer}
                  onChange={(e) => setAddress((p) => ({ ...p, huisnummer: e.target.value }))}
                  placeholder={t("calculator.houseNumberPh")}
                />
              </div>
              <div>
                <Label>{t("calculator.postcode")} *</Label>
                <Input
                  value={address.postcode}
                  onChange={(e) => setAddress((p) => ({ ...p, postcode: e.target.value }))}
                  placeholder={t("calculator.postcodePh")}
                />
              </div>
              <div>
                <Label>{t("calculator.city")} *</Label>
                <Input
                  value={address.plaats}
                  onChange={(e) => setAddress((p) => ({ ...p, plaats: e.target.value }))}
                  placeholder={t("calculator.cityPh")}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{t("calculator.country")}</Label>
                <Input
                  value={address.land}
                  onChange={(e) => setAddress((p) => ({ ...p, land: e.target.value }))}
                  placeholder={t("calculator.countryPh")}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="w-4 h-4" /> {t("calculator.back")}
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
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("calculator.calculating")}</>
                ) : (
                  <>{t("calculator.continue")} <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Service selection */}
        {step === 2 && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <h2 className="font-heading text-xl font-semibold">{t("calculator.chooseService")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceDefs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s.id);
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
                    <p className="font-medium text-foreground">{t(`calculator.services.${s.id}.label`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`calculator.services.${s.id}.description`)}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" /> {t("calculator.back")}
            </Button>
          </Card>
        )}

        {/* Step 3: Service-specific options + result */}
        {step === 3 && selectedService && (
          <Card className="p-6 md:p-8 space-y-6 animate-fade-in">
            <h2 className="font-heading text-xl font-semibold">
              {t(`calculator.services.${selectedService}.label`)}
            </h2>

            {renderServiceOptions()}

            {canShowResult() && result && (
              <div className="mt-6 p-4 sm:p-6 rounded-xl bg-primary/5 border border-primary/20 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider">
                    {t("calculator.indicativePrice")}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground break-words">
                  {result.total || result.price} <span className="text-sm sm:text-base font-normal text-muted-foreground">{t("calculator.exclVat")}</span>
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground">{result.label}</p>
                {distanceData && (
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <p>{t("calculator.travelCostsLabel")} € {distanceData.travel_cost.toFixed(2)}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground/70 italic">{t("calculator.priceTimeNote")}</p>
                  </div>
                )}
                <ul className="space-y-1">
                  {result.details.filter(d => !d.toLowerCase().includes('reiskosten') && !d.toLowerCase().includes('travel') && !d.toLowerCase().includes('déplacement') && !d.toLowerCase().includes('km ×')).map((d, i) => (
                    <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-1.5 sm:gap-2">
                      <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 shrink-0" />
                      <span className="break-words">{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] sm:text-xs text-muted-foreground/70 italic mt-2">
                  {t("calculator.estimateNote")}
                </p>
                <div className="pt-3 sm:pt-4">
                  <Button variant="cta" size="lg" className="w-full text-sm sm:text-base" asChild>
                    <Link data-track-cta="calculator_appointment" to={`${localizedPath("/afspraak")}?dienst=${encodeURIComponent(getServiceMapping())}&straat=${encodeURIComponent(address.straat)}&huisnummer=${encodeURIComponent(address.huisnummer)}&postcode=${encodeURIComponent(address.postcode)}&plaats=${encodeURIComponent(address.plaats)}`}>
                      {t("calculator.bookIntervention")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4" /> {t("calculator.back")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(0);
                  setAgreed(false);
                  setSelectedService(null);
                }}
              >
                {t("calculator.startOver")}
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
