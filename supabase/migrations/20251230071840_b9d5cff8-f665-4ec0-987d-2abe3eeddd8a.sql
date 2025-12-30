-- Add notification_email to ghost_identities for opt-in email notifications
ALTER TABLE public.ghost_identities 
ADD COLUMN notification_email text;

-- Add email_sent to admin_notifications to track delivery status
ALTER TABLE public.admin_notifications 
ADD COLUMN email_sent boolean NOT NULL DEFAULT false;

-- Add email_sent_at timestamp to track when email was sent
ALTER TABLE public.admin_notifications 
ADD COLUMN email_sent_at timestamp with time zone;