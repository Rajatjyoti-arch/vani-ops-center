-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_invites table for invite-only system
CREATE TABLE public.admin_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    invite_token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role app_role NOT NULL DEFAULT 'admin',
    accepted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_invites
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_invites
CREATE POLICY "Admins can manage invites"
ON public.admin_invites
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view their invite by token"
ON public.admin_invites
FOR SELECT
USING (true);

-- Add admin approval fields to arena_negotiations
ALTER TABLE public.arena_negotiations
ADD COLUMN admin_approved_by UUID REFERENCES auth.users(id),
ADD COLUMN admin_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN admin_notes TEXT,
ADD COLUMN priority TEXT DEFAULT 'normal',
ADD COLUMN department TEXT,
ADD COLUMN budget_level TEXT DEFAULT 'medium',
ADD COLUMN urgency_level TEXT DEFAULT 'normal';

-- Create admin_notifications table for student notifications
CREATE TABLE public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID REFERENCES public.arena_negotiations(id) ON DELETE CASCADE,
    ghost_identity_id UUID REFERENCES public.ghost_identities(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_notifications
CREATE POLICY "Notifications are viewable by ghost identity"
ON public.admin_notifications
FOR SELECT
USING (true);

CREATE POLICY "Admins can create notifications"
ON public.admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));