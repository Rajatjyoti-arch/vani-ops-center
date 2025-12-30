import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Key, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Fingerprint
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CUJLogo } from "@/components/ui/CUJLogo";
import { supabase } from "@/integrations/supabase/client";
import { generateHash, generateMnemonicPhrase, generateGhostName, generateAvatar } from "@/lib/crypto";
import { toast } from "@/hooks/use-toast";
import { useGhostSession } from "@/contexts/GhostSessionContext";

export function ZeroKnowledgeLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useGhostSession();
  
  const [accessPhrase, setAccessPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPhrase, setGeneratedPhrase] = useState<string[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/student-dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGeneratePhrase = () => {
    const phrase = generateMnemonicPhrase();
    setGeneratedPhrase(phrase);
    setIsNewUser(true);
    toast({
      title: "Secure Phrase Generated",
      description: "Write down these 12 words in order. This is your only way to access your account.",
    });
  };

  const handleCopyPhrase = async () => {
    if (!generatedPhrase) return;
    
    try {
      await navigator.clipboard.writeText(generatedPhrase.join(" "));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      toast({
        title: "Copied to Clipboard",
        description: "Make sure to store this phrase securely and delete from clipboard.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the phrase.",
        variant: "destructive",
      });
    }
  };

  const handleUseGeneratedPhrase = () => {
    if (!generatedPhrase) return;
    setAccessPhrase(generatedPhrase.join(" "));
    setGeneratedPhrase(null);
  };

  const handleAccess = async () => {
    const phrase = accessPhrase.trim().toLowerCase();
    
    if (!phrase) {
      toast({
        title: "Access Phrase Required",
        description: "Please enter your 12-word secret access phrase.",
        variant: "destructive",
      });
      return;
    }

    const words = phrase.split(/\s+/);
    if (words.length !== 12) {
      toast({
        title: "Invalid Phrase Length",
        description: "Your access phrase must contain exactly 12 words.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Hash the phrase locally - the phrase NEVER leaves the browser
      const phraseHash = await generateHash(phrase);
      
      // Check if this hash exists in the database
      const { data: existingIdentity, error: fetchError } = await supabase
        .from("ghost_identities")
        .select("*")
        .eq("roll_number_hash", phraseHash)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingIdentity) {
        // Existing user - log them in
        login(existingIdentity);
        toast({
          title: "Access Granted",
          description: `Welcome back, ${existingIdentity.ghost_name}`,
        });
        navigate("/student-dashboard");
      } else if (isNewUser) {
        // New user - create identity
        const newIdentity = {
          roll_number_hash: phraseHash,
          ghost_name: generateGhostName(),
          avatar: generateAvatar(),
          reputation: 50,
          reports_submitted: 0,
        };

        const { data, error } = await supabase
          .from("ghost_identities")
          .insert(newIdentity)
          .select()
          .single();

        if (error) throw error;

        login(data);
        toast({
          title: "Identity Created",
          description: `Your anonymous identity "${data.ghost_name}" has been established.`,
        });
        navigate("/student-dashboard");
      } else {
        // Unknown phrase - not a new user
        toast({
          title: "Access Denied",
          description: "No identity found for this phrase. Generate a new phrase if you're a new user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Access error:", error);
      toast({
        title: "Access Error",
        description: "Failed to verify access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Clear the phrase from memory for security
      setAccessPhrase("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <CUJLogo size={40} className="text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Central University of Jammu
              </h1>
              <p className="text-xs text-muted-foreground">
                VANI - Zero-Knowledge Access Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Security Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="bg-accent/10 text-accent border-accent/30 px-4 py-2 text-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Mathematically Private: No server-side logs of your access phrase exist
            </Badge>
          </div>

          {/* Login Card */}
          <Card className="border-border/50 professional-shadow">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                  <Fingerprint className="w-10 h-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Zero-Knowledge Access</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your 12-word secret phrase to access your anonymous identity
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generated Phrase Display */}
              {generatedPhrase && (
                <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-accent flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Your Secret Recovery Phrase
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPhrase}
                      className="text-accent hover:text-accent/80"
                    >
                      {isCopied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {generatedPhrase.map((word, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-2 rounded bg-background border border-border/50"
                      >
                        <span className="text-xs text-muted-foreground w-4">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-mono text-foreground">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleUseGeneratedPhrase}
                    className="w-full"
                    variant="secondary"
                  >
                    Use This Phrase to Continue
                  </Button>
                </div>
              )}

              {/* Access Phrase Input */}
              <div className="space-y-2">
                <Label htmlFor="accessPhrase" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Secret Access Phrase
                </Label>
                <div className="relative">
                  <Input
                    id="accessPhrase"
                    type={showPhrase ? "text" : "password"}
                    value={accessPhrase}
                    onChange={(e) => setAccessPhrase(e.target.value)}
                    placeholder="Enter your 12-word secret phrase..."
                    className="pr-10 font-mono text-sm h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhrase(!showPhrase)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your phrase is hashed locally. It never leaves your browser.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAccess}
                  disabled={isLoading || !accessPhrase.trim()}
                  className="w-full h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Access Portal
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">
                      New to VANI?
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGeneratePhrase}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Secure Phrase
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Warning Card */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Critical Security Notice
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If you lose this phrase, your reports and history are permanently locked. 
                    Neither the University nor the VANI developers can recover it. 
                    This is by design to ensure your complete anonymity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Return to main platform
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
