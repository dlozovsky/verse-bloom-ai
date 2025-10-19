-- Allow anyone to insert poets (needed for data loader)
CREATE POLICY "Anyone can insert poets"
ON public.poets
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to insert poems (needed for data loader)
CREATE POLICY "Anyone can insert poems"
ON public.poems
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to create poem-theme associations (needed for data loader)
CREATE POLICY "Anyone can insert poem themes"
ON public.poem_themes
FOR INSERT
TO public
WITH CHECK (true);