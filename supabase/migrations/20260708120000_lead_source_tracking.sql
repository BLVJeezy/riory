-- Lead source tracking: onderscheid tussen afspraken via de prijscalculator
-- en rechtstreekse afspraken, plus de berekende indicatieve prijs indien van toepassing.
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS lead_bron TEXT NOT NULL DEFAULT 'rechtstreeks',
  ADD COLUMN IF NOT EXISTS lead_bron_prijs TEXT;

COMMENT ON COLUMN public.appointments.lead_bron IS 'Hoe de afspraak tot stand kwam: "calculator" of "rechtstreeks"';
COMMENT ON COLUMN public.appointments.lead_bron_prijs IS 'Indicatieve prijs die de prijscalculator toonde (indien lead_bron = calculator)';
