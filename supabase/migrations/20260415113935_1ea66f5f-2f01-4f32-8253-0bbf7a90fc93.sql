
-- Create google_reviews table
CREATE TABLE public.google_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  review_text TEXT NOT NULL,
  review_date TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  google_review_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(google_review_id)
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews (public website)
CREATE POLICY "Anyone can read reviews"
ON public.google_reviews
FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can manage reviews
CREATE POLICY "Admins can insert reviews"
ON public.google_reviews
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
ON public.google_reviews
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
ON public.google_reviews
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Service role can manage reviews (for Edge Function)
CREATE POLICY "Service role can manage reviews"
ON public.google_reviews
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Index for ordering
CREATE INDEX idx_google_reviews_created_at ON public.google_reviews(created_at DESC);
