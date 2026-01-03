-- Create student_profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_no TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  ghost_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '👻',
  reputation INTEGER NOT NULL DEFAULT 50,
  reports_submitted INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create student_otp_codes table for OTP management
CREATE TABLE public.student_otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  enrollment_no TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster OTP lookups
CREATE INDEX idx_student_otp_email ON public.student_otp_codes(email, is_used);
CREATE INDEX idx_student_otp_expires ON public.student_otp_codes(expires_at);

-- Enable RLS on both tables
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_profiles
CREATE POLICY "Anyone can read student profiles"
ON public.student_profiles
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert student profiles"
ON public.student_profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update student profiles"
ON public.student_profiles
FOR UPDATE
USING (true);

-- RLS policies for student_otp_codes (edge function access via service role)
CREATE POLICY "Anyone can insert OTP codes"
ON public.student_otp_codes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read OTP codes"
ON public.student_otp_codes
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update OTP codes"
ON public.student_otp_codes
FOR UPDATE
USING (true);

-- Trigger for updating updated_at on student_profiles
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();