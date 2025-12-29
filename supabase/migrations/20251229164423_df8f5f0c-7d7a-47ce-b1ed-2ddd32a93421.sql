-- Create ghost_identities table for anonymous personas
CREATE TABLE public.ghost_identities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number_hash TEXT NOT NULL UNIQUE,
  ghost_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '👻',
  reputation INTEGER NOT NULL DEFAULT 50,
  reports_submitted INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ghost_identities
ALTER TABLE public.ghost_identities ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ghost identities (they're anonymous)
CREATE POLICY "Ghost identities are publicly readable"
ON public.ghost_identities
FOR SELECT
USING (true);

-- Allow anyone to insert new ghost identities (anonymous system)
CREATE POLICY "Anyone can create ghost identities"
ON public.ghost_identities
FOR INSERT
WITH CHECK (true);

-- Create stealth_vault table for evidence and grievances
CREATE TABLE public.stealth_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT,
  secret_metadata TEXT,
  ghost_identity_id UUID REFERENCES public.ghost_identities(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stealth_vault
ALTER TABLE public.stealth_vault ENABLE ROW LEVEL SECURITY;

-- Allow public read for vault items (anonymous system)
CREATE POLICY "Vault items are publicly readable"
ON public.stealth_vault
FOR SELECT
USING (true);

-- Allow anyone to upload to vault
CREATE POLICY "Anyone can upload to vault"
ON public.stealth_vault
FOR INSERT
WITH CHECK (true);

-- Create sentiment_logs table for campus sentiment tracking
CREATE TABLE public.sentiment_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  concern_level TEXT NOT NULL CHECK (concern_level IN ('safe', 'warning', 'critical')),
  reports_count INTEGER NOT NULL DEFAULT 0,
  last_report_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sentiment_logs
ALTER TABLE public.sentiment_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read for sentiment logs
CREATE POLICY "Sentiment logs are publicly readable"
ON public.sentiment_logs
FOR SELECT
USING (true);

-- Allow public updates to sentiment logs
CREATE POLICY "Anyone can update sentiment logs"
ON public.sentiment_logs
FOR UPDATE
USING (true);

-- Allow public inserts to sentiment logs
CREATE POLICY "Anyone can insert sentiment logs"
ON public.sentiment_logs
FOR INSERT
WITH CHECK (true);

-- Create reports table for Resolution Ledger
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  zone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'investigating', 'resolved')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ghost_identity_id UUID REFERENCES public.ghost_identities(id),
  vault_file_id UUID REFERENCES public.stealth_vault(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public read for reports (anonymous transparency)
CREATE POLICY "Reports are publicly readable"
ON public.reports
FOR SELECT
USING (true);

-- Allow public inserts for reports
CREATE POLICY "Anyone can submit reports"
ON public.reports
FOR INSERT
WITH CHECK (true);

-- Enable realtime for sentiment_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.sentiment_logs;

-- Insert initial zone data for the sentiment map
INSERT INTO public.sentiment_logs (zone_id, zone_name, concern_level, reports_count, last_report_at)
VALUES 
  ('hostel-1', 'Hostel 1', 'critical', 12, now() - interval '2 hours'),
  ('hostel-2', 'Hostel 2', 'warning', 5, now() - interval '4 hours'),
  ('academic', 'Academic Block', 'safe', 2, now() - interval '1 day'),
  ('library', 'Library', 'safe', 1, now() - interval '3 days'),
  ('cafeteria', 'Cafeteria', 'warning', 7, now() - interval '6 hours'),
  ('sports', 'Sports Complex', 'safe', 0, NULL),
  ('admin', 'Admin Block', 'safe', 3, now() - interval '2 days'),
  ('parking', 'Parking Area', 'warning', 4, now() - interval '12 hours'),
  ('gate', 'Main Gate', 'critical', 8, now() - interval '1 hour');

-- Create storage bucket for decoy-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('decoy-images', 'decoy-images', true);

-- Allow public uploads to decoy-images bucket
CREATE POLICY "Anyone can upload decoy images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'decoy-images');

-- Allow public read of decoy images
CREATE POLICY "Decoy images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'decoy-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_ghost_identities_updated_at
BEFORE UPDATE ON public.ghost_identities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sentiment_logs_updated_at
BEFORE UPDATE ON public.sentiment_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();