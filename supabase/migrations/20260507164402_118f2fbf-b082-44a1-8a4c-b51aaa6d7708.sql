
-- 1. quote_requests: admin-only SELECT
DROP POLICY IF EXISTS "Authenticated users can read quote requests" ON public.quote_requests;
CREATE POLICY "Admins can read quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. quote-attachments storage: private + admin-only read
UPDATE storage.buckets SET public = false WHERE id = 'quote-attachments';

DROP POLICY IF EXISTS "Anyone can read quote attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public can read quote attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read quote attachments" ON storage.objects;

CREATE POLICY "Admins can read quote attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'quote-attachments' AND public.has_role(auth.uid(), 'admin'));

-- Restrict upload mime types to images + audio
DROP POLICY IF EXISTS "Anyone can upload quote attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload quote attachments" ON storage.objects;

CREATE POLICY "Anyone can upload quote attachments"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'quote-attachments'
    AND (
      (storage.objects.metadata->>'mimetype') LIKE 'image/%'
      OR (storage.objects.metadata->>'mimetype') LIKE 'audio/%'
    )
  );

-- 3. Pin search_path on helper functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
