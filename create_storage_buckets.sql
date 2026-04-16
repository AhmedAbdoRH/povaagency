-- =====================================================
-- Create Storage Buckets for POVA Agency
-- =====================================================

-- Enable storage extension
INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true) ON CONFLICT (id) DO NOTHING;

-- Create policies for the services bucket
-- Allow public read access
CREATE POLICY "Public can view services bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'services');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload to services bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'services');

-- Allow authenticated users to update
CREATE POLICY "Authenticated can update services bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  WITH CHECK (bucket_id = 'services');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete from services bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'services');

DO $$
BEGIN
    RAISE NOTICE 'Storage bucket "services" created successfully!';
END $$;
