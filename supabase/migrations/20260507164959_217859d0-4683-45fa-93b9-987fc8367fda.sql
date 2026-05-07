UPDATE public.simpla_health_incidents
SET status = 'resolved', resolved_at = now(), consecutive_failures = 0
WHERE status = 'open';