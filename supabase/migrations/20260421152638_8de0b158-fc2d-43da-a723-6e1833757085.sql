
CREATE TABLE public.simpla_health_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  http_status INTEGER,
  latency_ms INTEGER,
  error_message TEXT
);

ALTER TABLE public.simpla_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read health checks"
  ON public.simpla_health_checks FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage health checks"
  ON public.simpla_health_checks FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_simpla_health_checks_checked_at ON public.simpla_health_checks(checked_at DESC);
