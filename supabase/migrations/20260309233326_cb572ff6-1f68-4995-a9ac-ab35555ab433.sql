-- Create table for quote requests
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT,
  locatie TEXT,
  dienst TEXT,
  beschrijving TEXT,
  schatting_project_type TEXT,
  schatting_lengte TEXT,
  schatting_grondtype TEXT,
  schatting_locatie TEXT,
  schatting_min INTEGER,
  schatting_max INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form, no auth required)
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Authenticated users can read quote requests"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (true);