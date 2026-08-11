CREATE TABLE public.phone_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  phone text NOT NULL,
  cta_label text,
  page_url text,
  visitor_id text,
  device text,
  referrer text
);
GRANT INSERT ON public.phone_clicks TO anon, authenticated;
GRANT SELECT ON public.phone_clicks TO authenticated;
GRANT ALL ON public.phone_clicks TO service_role;
ALTER TABLE public.phone_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log phone clicks" ON public.phone_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read phone clicks" ON public.phone_clicks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_phone_clicks_created_at ON public.phone_clicks (created_at DESC);