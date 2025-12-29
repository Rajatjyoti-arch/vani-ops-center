-- Create arena_negotiations table for storing negotiation logs
CREATE TABLE public.arena_negotiations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_file_id UUID REFERENCES public.stealth_vault(id),
  grievance_text TEXT NOT NULL,
  negotiation_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  final_consensus TEXT,
  sentinel_score INTEGER DEFAULT 50,
  governor_score INTEGER DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.arena_negotiations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create negotiations" 
ON public.arena_negotiations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Negotiations are publicly readable" 
ON public.arena_negotiations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update negotiations" 
ON public.arena_negotiations 
FOR UPDATE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_arena_negotiations_updated_at
BEFORE UPDATE ON public.arena_negotiations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_negotiations;