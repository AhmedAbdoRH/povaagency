-- Add hero_video_urls array column to store_settings table
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS hero_video_urls TEXT[];

-- Add phone_video_url column for the phone mockup video
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS phone_video_url TEXT;

-- Add comments to document the new columns
COMMENT ON COLUMN public.store_settings.hero_video_urls IS 'Array of hero background video URLs for random selection on homepage';
COMMENT ON COLUMN public.store_settings.phone_video_url IS 'URL for the video inside the phone mockup in hero section';