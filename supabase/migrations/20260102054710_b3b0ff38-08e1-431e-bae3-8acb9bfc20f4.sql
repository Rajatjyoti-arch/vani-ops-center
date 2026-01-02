-- RLS Policies for user_roles table

-- Allow anyone to count/check if admins exist (needed for setup check)
CREATE POLICY "Allow reading user_roles for auth checks"
ON public.user_roles
FOR SELECT
USING (true);

-- Allow inserting admin role when no admins exist (first-time setup)
-- OR when the current user is already an admin
CREATE POLICY "Allow inserting user_roles for setup or by admins"
ON public.user_roles
FOR INSERT
WITH CHECK (
  -- First admin setup: allow if no admin roles exist yet
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  OR
  -- Existing admins can add new roles
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Only admins can update roles
CREATE POLICY "Allow admins to update user_roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Only admins can delete roles
CREATE POLICY "Allow admins to delete user_roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);