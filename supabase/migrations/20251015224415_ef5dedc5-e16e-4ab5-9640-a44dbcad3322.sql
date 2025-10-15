-- Create reading history table
CREATE TABLE public.reading_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, poem_id)
);

-- Enable RLS
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reading history"
  ON public.reading_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their reading history"
  ON public.reading_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_read_at ON public.reading_history(read_at DESC);