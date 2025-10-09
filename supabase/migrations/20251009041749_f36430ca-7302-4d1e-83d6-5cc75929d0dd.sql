-- Fix search_path for increment_poem_views function
CREATE OR REPLACE FUNCTION public.increment_poem_views(poem_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.poems
  SET views = views + 1
  WHERE id = poem_uuid;
END;
$$;