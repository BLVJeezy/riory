-- Persisted feature flag for the public price calculator.
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (key, enabled)
VALUES ('price_calculator_enabled', true);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Explicit Data API grants (required for newly exposed tables).
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

REVOKE INSERT, DELETE ON public.site_settings FROM anon, authenticated;

CREATE POLICY "Public can read site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
