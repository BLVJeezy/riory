CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL UNIQUE,
  visitors integer NOT NULL DEFAULT 0,
  pageviews integer NOT NULL DEFAULT 0,
  bounce_rate numeric(5,2),
  avg_duration_seconds integer,
  top_pages jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  devices jsonb NOT NULL DEFAULT '[]'::jsonb,
  countries jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read snapshots"
  ON public.analytics_snapshots FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert snapshots"
  ON public.analytics_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update snapshots"
  ON public.analytics_snapshots FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete snapshots"
  ON public.analytics_snapshots FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS analytics_snapshots_date_idx ON public.analytics_snapshots (snapshot_date DESC);