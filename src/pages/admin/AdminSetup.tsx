import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, Lock, Mail, Key, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const setupSchema = z.object({
  setupSecret: z.string().min(8, "Setup secret must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminSetup() {
  const [setupSecret, setSetupSecret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmins, setIsCheckingAdmins] = useState(true);
  const [hasExistingAdmins, setHasExistingAdmins] = useState(false);
  const [step, setStep] = useState<"secret" | "credentials">("secret");
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingAdmins();
  }, []);

  const checkExistingAdmins = async () => {
    try {
      const { count, error } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");

      if (error) throw error;

      setHasExistingAdmins((count || 0) > 0);
    } catch (err) {
      console.error("Error checking admins:", err);
    } finally {
      setIsCheckingAdmins(false);
    }
  };

  const verifySetupSecret = async () => {
    if (!setupSecret) {
      toast({
        title: "Secret Required",
        description: "Please enter the admin setup secret",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call edge function to verify the setup secret
      const { data, error } = await supabase.functions.invoke("verify-setup-secret", {
        body: { secret: setupSecret },
      });

      if (error) throw error;

      if (data?.valid) {
        setStep("credentials");
        toast({
          title: "Secret Verified",
          description: "You may now create the first admin account",
        });
      } else {
        toast({
          title: "Invalid Secret",
          description: "The setup secret is incorrect",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error verifying secret:", err);
      toast({
        title: "Verification Failed",
        description: err.message || "Failed to verify the setup secret",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = setupSchema.safeParse({ setupSecret, email, password, confirmPassword });
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let userId: string | undefined;

      // Try to sign up the new admin user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      // Check if user already exists (user_repeated_signup case)
      if (authData?.user?.identities?.length === 0) {
        // User exists but email not confirmed - try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          throw new Error("This email is already registered. Please use the correct password or login directly.");
        }
        
        userId = signInData.user?.id;
      } else if (signUpError) {
        throw signUpError;
      } else {
        userId = authData?.user?.id;
      }

      if (!userId) {
        throw new Error("Failed to create or authenticate user account");
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin",
        });

      if (roleError) throw roleError;

      toast({
        title: "Admin Account Created",
        description: "You can now sign in to the admin portal",
      });

      navigate("/admin/login");
    } catch (err: any) {
      console.error("Error creating admin:", err);
      toast({
        title: "Setup Failed",
        description: err.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmins) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (hasExistingAdmins) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Setup Already Complete</h1>
          <p className="text-slate-400 mb-6">
            An admin account already exists. Please use the login page to access the admin portal.
          </p>
          <Button
            onClick={() => navigate("/admin/login")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Admin Setup Wizard
          </h1>
          <p className="text-slate-400 text-sm">
            Configure the first administrative account for VANI
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 ${step === "secret" ? "text-emerald-400" : "text-slate-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "secret" ? "bg-emerald-500/20 border border-emerald-500" : "bg-slate-700 border border-slate-600"}`}>
              {step === "credentials" ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            <span className="text-sm hidden sm:inline">Verify Secret</span>
          </div>
          <div className="w-8 h-px bg-slate-600" />
          <div className={`flex items-center gap-2 ${step === "credentials" ? "text-emerald-400" : "text-slate-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "credentials" ? "bg-emerald-500/20 border border-emerald-500" : "bg-slate-700 border border-slate-600"}`}>
              2
            </div>
            <span className="text-sm hidden sm:inline">Create Account</span>
          </div>
        </div>

        {/* Setup Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          {step === "secret" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="setupSecret" className="text-slate-300">
                  Admin Setup Secret
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="setupSecret"
                    type="password"
                    value={setupSecret}
                    onChange={(e) => setSetupSecret(e.target.value)}
                    placeholder="Enter the setup passphrase"
                    className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                    onKeyDown={(e) => e.key === "Enter" && verifySetupSecret()}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  This is the secret passphrase you configured during deployment (ADMIN_SETUP_SECRET)
                </p>
              </div>

              <Button
                onClick={verifySetupSecret}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Secret"
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Admin Email
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              This is a one-time setup. After creating the first admin,
              <br />
              additional admins can be invited through the dashboard.
            </p>
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
