ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS lead_bron text DEFAULT 'rechtstreeks',
ADD COLUMN IF NOT EXISTS lead_bron_prijs text;