
-- Add columns for file attachments on quote_requests
ALTER TABLE public.quote_requests
  ADD COLUMN audio_url text DEFAULT NULL,
  ADD COLUMN photo_urls text[] DEFAULT NULL;

-- Create storage bucket for quote attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', true);

-- Allow anyone to upload to quote-attachments bucket
CREATE POLICY "Anyone can upload quote attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quote-attachments');

-- Allow anyone to read quote attachments (needed for admin to view)
CREATE POLICY "Anyone can read quote attachments"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'quote-attachments');

-- Allow admins to delete quote attachments
CREATE POLICY "Admins can delete quote attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quote-attachments' AND public.has_role(auth.uid(), 'admin'));
