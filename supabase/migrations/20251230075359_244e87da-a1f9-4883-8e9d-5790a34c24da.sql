-- Add UPDATE policy for ghost_identities to allow updating notification_email
CREATE POLICY "Anyone can update their ghost identity" 
ON public.ghost_identities 
FOR UPDATE 
USING (true)
WITH CHECK (true);