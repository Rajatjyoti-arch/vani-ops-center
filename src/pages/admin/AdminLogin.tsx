import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Shield, Loader2, Lock, Mail, Smartphone, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { user, isAdmin, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const from = location.state?.from?.pathname || "/admin";
  const pendingConfirmation = searchParams.get("pending_confirmation") === "true";

  useEffect(() => {
    if (user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setEmailNotConfirmed(false);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      // Check if error is about email not being confirmed
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setEmailNotConfirmed(true);
      } else {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/login`,
      },
    });
    setIsResending(false);

    if (error) {
      toast({
        title: "Failed to Resend",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Confirmation Email Sent",
        description: "Please check your inbox and click the confirmation link.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Institutional Personnel Login
          </h1>
          <p className="text-slate-400 text-sm">
            Central University of Jammu • Administrative Portal
          </p>
        </div>

        {/* Pending Confirmation Banner */}
        {pendingConfirmation && !emailNotConfirmed && (
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 mb-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-emerald-400 font-medium text-sm">Account Created Successfully</p>
              <p className="text-slate-400 text-xs mt-1">
                Please check your email and click the confirmation link before signing in.
              </p>
            </div>
          </div>
        )}

        {/* Email Not Confirmed Error */}
        {emailNotConfirmed && (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-400 font-medium text-sm">Email Not Confirmed</p>
                <p className="text-slate-400 text-xs mt-1">
                  Please check your email inbox (and spam folder) for a confirmation link. You must confirm your email before signing in.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="mt-3 text-amber-400 border-amber-700 hover:bg-amber-900/30"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-3 h-3 mr-2" />
                      Resend Confirmation Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Institutional Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cujammu.ac.in"
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* MFA Placeholder */}
            <div className="space-y-2 opacity-50">
              <Label className="text-slate-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Multi-Factor Authentication
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">Coming Soon</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                className="bg-slate-900/50 border-slate-700 text-slate-500"
                disabled
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Administrative Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
            <p className="text-xs text-slate-500 text-center">
              Access restricted to authorized institutional personnel only.
            </p>
            <div className="flex flex-col items-center gap-2">
              <a
                href="/admin/password-reset"
                className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                Forgot your password?
              </a>
              <a
                href="/admin/setup"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                First time? Set up admin account →
              </a>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            ← Return to main platform
          </a>
        </div>
      </div>
    </div>
  );
}
