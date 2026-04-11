
-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Step 1: Akkoord
  akkoord_voorwaarden BOOLEAN NOT NULL DEFAULT true,
  
  -- Step 2: Dienst
  dienst TEXT NOT NULL,
  
  -- Step 3: Urgentie
  urgent BOOLEAN NOT NULL DEFAULT false,
  
  -- Step 4: Klantentype
  klant_type TEXT NOT NULL, -- particulier, bedrijf, vrij_beroep, syndicus
  
  -- Step 5: Conditionele vragen
  woning_ouder_dan_10_jaar BOOLEAN,
  werfadres_is_facturatieadres BOOLEAN,
  
  -- Facturatiegegevens
  fact_naam TEXT,
  fact_voornaam TEXT,
  fact_bedrijfsnaam TEXT,
  fact_btw_nummer TEXT,
  fact_kbo_nummer TEXT,
  fact_straat TEXT,
  fact_huisnummer TEXT,
  fact_postcode TEXT,
  fact_plaats TEXT,
  fact_email TEXT NOT NULL,
  fact_facturatie_email TEXT,
  fact_telefoon TEXT,
  
  -- Werfadres (indien anders)
  werf_projectnaam TEXT,
  werf_contactpersoon TEXT,
  werf_straat TEXT,
  werf_huisnummer TEXT,
  werf_postcode TEXT,
  werf_plaats TEXT,
  werf_telefoon TEXT,
  
  -- Syndicus gegevens
  syndicus_naam TEXT,
  syndicus_voornaam TEXT,
  syndicus_kantoor TEXT,
  syndicus_straat TEXT,
  syndicus_huisnummer TEXT,
  syndicus_postcode TEXT,
  syndicus_plaats TEXT,
  syndicus_telefoon TEXT,
  syndicus_email TEXT,
  syndicus_facturatie_email TEXT,
  syndicus_naam_vme TEXT,
  syndicus_kbo_nummer TEXT,
  
  -- Step 6: Omschrijving
  beschrijving TEXT,
  
  -- Step 7: Hoe gevonden
  gevonden_via TEXT,
  gevonden_detail TEXT
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit an appointment"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can read
CREATE POLICY "Admins can read appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
