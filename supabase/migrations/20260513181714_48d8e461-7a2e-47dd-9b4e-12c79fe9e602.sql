ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS visitor_id text;
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON public.page_views (visitor_id);