CREATE TABLE IF NOT EXISTS public.simpla_health_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'open',
  opened_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  last_alert_at timestamptz,
  alert_count integer NOT NULL DEFAULT 0,
  last_error_message text,
  last_http_status integer,
  consecutive_failures integer NOT NULL DEFAULT 0
);

ALTER TABLE public.simpla_health_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage incidents"
ON public.simpla_health_incidents
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read incidents"
ON public.simpla_health_incidents
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_simpla_health_incidents_open
  ON public.simpla_health_incidents (status, opened_at DESC);