ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS background_url TEXT,
  ADD COLUMN IF NOT EXISTS accent_color TEXT,
  ADD COLUMN IF NOT EXISTS text_size TEXT NOT NULL DEFAULT 'md';

INSERT INTO storage.buckets (id, name, public) VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Backgrounds publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'backgrounds');
CREATE POLICY "Users upload own background" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own background" ON storage.objects
  FOR UPDATE USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own background" ON storage.objects
  FOR DELETE USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);