CREATE TABLE public.custom_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '✨',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own categories" ON public.custom_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own categories" ON public.custom_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own categories" ON public.custom_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own categories" ON public.custom_categories FOR DELETE USING (auth.uid() = user_id);