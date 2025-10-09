-- Create poets table
CREATE TABLE public.poets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  nationality TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poems table
CREATE TABLE public.poems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  poet_id UUID NOT NULL REFERENCES public.poets(id) ON DELETE CASCADE,
  year_published INTEGER,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create themes table
CREATE TABLE public.themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poem_themes junction table
CREATE TABLE public.poem_themes (
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  PRIMARY KEY (poem_id, theme_id)
);

-- Enable Row Level Security
ALTER TABLE public.poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_themes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (poetry is public content)
CREATE POLICY "Poets are viewable by everyone"
  ON public.poets FOR SELECT
  USING (true);

CREATE POLICY "Poems are viewable by everyone"
  ON public.poems FOR SELECT
  USING (true);

CREATE POLICY "Themes are viewable by everyone"
  ON public.themes FOR SELECT
  USING (true);

CREATE POLICY "Poem themes are viewable by everyone"
  ON public.poem_themes FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_poems_poet_id ON public.poems(poet_id);
CREATE INDEX idx_poems_views ON public.poems(views DESC);
CREATE INDEX idx_poems_favorites ON public.poems(favorites DESC);
CREATE INDEX idx_poem_themes_poem_id ON public.poem_themes(poem_id);
CREATE INDEX idx_poem_themes_theme_id ON public.poem_themes(theme_id);

-- Create function to increment views
CREATE OR REPLACE FUNCTION public.increment_poem_views(poem_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.poems
  SET views = views + 1
  WHERE id = poem_uuid;
END;
$$;