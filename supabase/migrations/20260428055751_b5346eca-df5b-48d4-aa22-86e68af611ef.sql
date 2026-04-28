-- Replace broad SELECT policies with owner-folder-scoped policies
-- (public URLs continue to work because public buckets bypass RLS for direct file access)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Backgrounds are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public read backgrounds" ON storage.objects;

CREATE POLICY "Users can list own avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can list own backgrounds"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
-- handle_new_user runs from the auth trigger as postgres; update_updated_at_column runs from triggers.
-- Neither needs to be callable from PostgREST.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;