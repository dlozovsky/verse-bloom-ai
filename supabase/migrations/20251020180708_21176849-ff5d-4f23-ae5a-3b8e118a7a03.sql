-- Create comments table for reader-poet interaction
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments are viewable by everyone
CREATE POLICY "Comments are viewable by everyone"
ON public.comments
FOR SELECT
USING (true);

-- Users can create comments when authenticated
CREATE POLICY "Authenticated users can create comments"
ON public.comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.comments
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updating updated_at on comments
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create collections table for curated reading lists
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Public collections are viewable by everyone
CREATE POLICY "Public collections are viewable by everyone"
ON public.collections
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Users can create their own collections
CREATE POLICY "Users can create their own collections"
ON public.collections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update their own collections"
ON public.collections
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections"
ON public.collections
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updating updated_at on collections
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create collection_poems join table
CREATE TABLE public.collection_poems (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_id, poem_id)
);

-- Enable RLS on collection_poems
ALTER TABLE public.collection_poems ENABLE ROW LEVEL SECURITY;

-- Collection poems are viewable if collection is viewable
CREATE POLICY "Collection poems viewable if collection is viewable"
ON public.collection_poems
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE id = collection_id
    AND (is_public = true OR user_id = auth.uid())
  )
);

-- Users can add poems to their own collections
CREATE POLICY "Users can add poems to their own collections"
ON public.collection_poems
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE id = collection_id
    AND user_id = auth.uid()
  )
);

-- Users can remove poems from their own collections
CREATE POLICY "Users can remove poems from their own collections"
ON public.collection_poems
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE id = collection_id
    AND user_id = auth.uid()
  )
);