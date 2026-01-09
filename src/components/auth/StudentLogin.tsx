import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, Mail, GraduationCap, Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { VaniLogo } from '@/components/ui/VaniLogo';
import { useStudentSession } from '@/contexts/StudentSessionContext';
import { supabase } from '@/integrations/supabase/client';

type LoginStep = 'credentials' | 'otp';

export function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useStudentSession();
  
  const [step, setStep] = useState<LoginStep>('credentials');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = (location.state as { from?: string })?.from || '/student-dashboard';
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Validate enrollment number format (e.g., 23BEMNC42, 24BECSE15, 25BECCS61)
  const validateEnrollmentNo = (value: string): boolean => {
    // Format: 2-digit year (22-25) + BE + branch code (CSE/MNC/CCS etc.) + roll number
    const enrollmentRegex = /^(22|23|24|25)BE(CSE|MNC|CCS)[A-Z]?\d{1,3}$/i;
    return enrollmentRegex.test(value);
  };

  // Validate university email format (enrollmentno.branch@cuj.ac.in)
  const validateEmail = (value: string): boolean => {
    const universityEmailRegex = /^(22|23|24|25)BE(CSE|MNC|CCS)[A-Z]?\d{1,3}\.(cse|mnc|ccs)@cuj\.ac\.in$/i;
    return universityEmailRegex.test(value);
  };

  const handleSendOTP = async () => {
    if (!enrollmentNo.trim() || !email.trim()) {
      toast.error('Please enter both enrollment number and email');
      return;
    }

    // Validate enrollment number format
    if (!validateEnrollmentNo(enrollmentNo)) {
      toast.error('Invalid enrollment number format. Example: 23BEMNC42');
      return;
    }

    // Validate university email format
    if (!validateEmail(email)) {
      toast.error('Invalid email format. Use: enrollmentno.branch@cuj.ac.in');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-student-otp', {
        body: {
          enrollment_no: enrollmentNo.trim(),
          email: email.trim().toLowerCase(),
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success('Verification code sent to your email');
      setStep('otp');
      setResendCooldown(60);
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-student-otp', {
        body: {
          enrollment_no: enrollmentNo.trim(),
          email: email.trim().toLowerCase(),
          otp_code: otpCode,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setOtpCode('');
        return;
      }

      if (data.success && data.profile) {
        login(data.profile);
        toast.success(`Welcome, ${data.profile.ghost_name}!`);
        const returnUrl = (location.state as { from?: string })?.from || '/student-dashboard';
        navigate(returnUrl, { replace: true });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Verification failed. Please try again.');
      setOtpCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    await handleSendOTP();
  };

  const handleBack = () => {
    setStep('credentials');
    setOtpCode('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <VaniLogo size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
            <p className="text-muted-foreground text-sm">
              Secure access with email verification
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg py-2 px-4 border border-border/50">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>End-to-end encrypted • Your identity remains anonymous</span>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">
              {step === 'credentials' ? 'Enter Your Details' : 'Verify Your Email'}
            </CardTitle>
            <CardDescription>
              {step === 'credentials' 
                ? 'We\'ll send a verification code to your email'
                : `Enter the 6-digit code sent to ${email}`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'credentials' ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="enrollment" className="text-sm font-medium">
                      Enrollment Number
                    </Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="enrollment"
                        type="text"
                        placeholder="e.g., 23BEMNC42"
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase())}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format: YearBEBranchRoll (e.g., 23BEMNC42, 24BECSE15)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      University Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="23BEMNC42.mnc@cuj.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format: enrollmentno.branch@cuj.ac.in (e.g., 23BEMNC42.mnc@cuj.ac.in)
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSendOTP}
                  disabled={isLoading || !enrollmentNo.trim() || !email.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={setOtpCode}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Code expires in 5 minutes
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify & Login
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      disabled={isLoading}
                      className="text-muted-foreground"
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      Back
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={isLoading || resendCooldown > 0}
                      className="text-muted-foreground"
                    >
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-muted-foreground text-sm"
          >
            ← Return to Platform
          </Button>
        </div>
      </div>
    </div>
  );
}
