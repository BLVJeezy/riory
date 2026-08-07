CREATE TABLE public.calculator_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text,
  step integer NOT NULL DEFAULT 0,
  service text,
  service_subtype text,
  price_eur numeric,
  plaats text,
  postcode text,
  distance_km numeric,
  page_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_calculator_sessions_session_id ON public.calculator_sessions (session_id);
CREATE INDEX idx_calculator_sessions_created_at ON public.calculator_sessions (created_at DESC);

GRANT INSERT ON public.calculator_sessions TO anon, authenticated;
GRANT SELECT ON public.calculator_sessions TO authenticated;
GRANT ALL ON public.calculator_sessions TO service_role;

ALTER TABLE public.calculator_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log calculator steps"
ON public.calculator_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read calculator sessions"
ON public.calculator_sessions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS calculator_session_id text;