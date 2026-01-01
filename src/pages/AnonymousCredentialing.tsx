import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, RefreshCw, Star, Shield, Loader2, LogOut, CheckCircle, Fingerprint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateHash, generateGhostName, generateAvatar } from "@/lib/crypto";
import { toast } from "@/hooks/use-toast";
import { useGhostSession } from "@/contexts/GhostSessionContext";
import { NeuralScanner } from "@/components/identity/NeuralScanner";
import { DigitalShredder } from "@/components/identity/DigitalShredder";
import { NeuralScanResult } from "@/components/identity/NeuralScanResult";
import { NotificationPreferences } from "@/components/identity/NotificationPreferences";

interface GhostIdentity {
  id: string;
  roll_number_hash: string;
  ghost_name: string;
  avatar: string;
  reputation: number;
  reports_submitted: number;
  created_at: string;
}

type ScanPhase = "idle" | "neural-scan" | "shredding" | "result";

const IdentityGhost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ghostIdentity: sessionIdentity, isAuthenticated, login, logout } = useGhostSession();

  const [identities, setIdentities] = useState<GhostIdentity[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Neural scan state
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [generatedHash, setGeneratedHash] = useState("");
  const [resultData, setResultData] = useState<{
    ghostName: string;
    hashSuffix: string;
    isNewIdentity: boolean;
  } | null>(null);

  // Get return URL from navigation state
  const returnUrl = (location.state as { from?: string })?.from;

  // Fetch all ghost identities
  const fetchIdentities = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("ghost_identities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching identities:", error);
    } else {
      setIdentities(data || []);
      if (data && data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
    }
    setIsLoading(false);
  }, [activeId]);

  useEffect(() => {
    fetchIdentities();
  }, [fetchIdentities]);

  // Start the neural scan process
  const handleStartScan = async () => {
    if (!rollNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your institutional ID to authenticate",
        variant: "destructive",
      });
      return;
    }

    // Generate hash first
    const hash = await generateHash(rollNumber);
    setGeneratedHash(hash);

    // Start neural scan phase
    setScanPhase("neural-scan");
  };

  // Called when neural scan completes
  const handleScanComplete = () => {
    setScanPhase("shredding");
  };

  // Called when shredding completes
  const handleShredComplete = async () => {
    try {
      // Check if hash already exists
      const { data: existing } = await supabase
        .from("ghost_identities")
        .select("id, ghost_name")
        .eq("roll_number_hash", generatedHash)
        .maybeSingle();

      if (existing) {
        // Fetch full identity data for session
        const { data: fullIdentity } = await supabase
          .from("ghost_identities")
          .select("*")
          .eq("id", existing.id)
          .single();

        if (fullIdentity) {
          login(fullIdentity);
          setActiveId(existing.id);
          setResultData({
            ghostName: existing.ghost_name,
            hashSuffix: generatedHash.slice(-4).toUpperCase(),
            isNewIdentity: false,
          });
          setScanPhase("result");
        }
        return;
      }

      // Create new identity
      const newIdentity = {
        roll_number_hash: generatedHash,
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

      // Log in with new identity
      login(data);
      setIdentities([data, ...identities]);
      setActiveId(data.id);
      setResultData({
        ghostName: data.ghost_name,
        hashSuffix: generatedHash.slice(-4).toUpperCase(),
        isNewIdentity: true,
      });
      setScanPhase("result");
    } catch (error) {
      console.error("Error creating identity:", error);
      toast({
        title: "Error",
        description: "Failed to create anonymous credential. Please try again.",
        variant: "destructive",
      });
      setScanPhase("idle");
    }
  };

  // Navigate after result is shown
  useEffect(() => {
    if (scanPhase === "result") {
      const timeout = setTimeout(() => {
        navigate(returnUrl || "/dashboard");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [scanPhase, navigate, returnUrl]);

  const resetScan = () => {
    setScanPhase("idle");
    setRollNumber("");
    setGeneratedHash("");
    setResultData(null);
  };

  const rotateIdentity = () => {
    const availableIds = identities.filter((i) => i.id !== activeId).map((i) => i.id);
    if (availableIds.length > 0) {
      const newActiveId = availableIds[Math.floor(Math.random() * availableIds.length)];
      setActiveId(newActiveId);
      const identity = identities.find((i) => i.id === newActiveId);
      if (identity) {
        login(identity);
        toast({
          title: "Identity Changed",
          description: `Now authenticated as ${identity.ghost_name}`,
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setActiveId(null);
    toast({
      title: "Session Ended",
      description: "Anonymous credential deactivated.",
    });
  };

  const activeIdentity = identities.find((i) => i.id === activeId);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Fingerprint className="w-7 h-7 text-primary" />
              Anonymous Credentialing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Secure identity verification with SHA-256 encryption
            </p>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                End Session
              </Button>
            )}
            <Button
              onClick={rotateIdentity}
              variant="outline"
              className="gap-2"
              disabled={identities.length < 2}
            >
              <RefreshCw className="w-4 h-4" />
              Switch Identity
            </Button>
          </div>
        </div>

        {/* Authentication Interface */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              {scanPhase === "idle" && "Authenticate Identity"}
              {scanPhase === "neural-scan" && "Biometric Verification in Progress"}
              {scanPhase === "shredding" && "Processing Credentials"}
              {scanPhase === "result" && "Authentication Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Phase: Idle - Input */}
            {scanPhase === "idle" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="flex items-center gap-2">
                    Enter Institutional ID
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="Enter your student/staff ID..."
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="text-base h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your ID will be cryptographically hashed to create an anonymous credential.
                  </p>
                </div>

                <Button
                  onClick={handleStartScan}
                  disabled={!rollNumber.trim()}
                  className="w-full h-12"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Authenticate
                </Button>
              </div>
            )}

            {/* Phase: Neural Scan */}
            {scanPhase === "neural-scan" && (
              <NeuralScanner isScanning={true} onScanComplete={handleScanComplete} />
            )}

            {/* Phase: Shredding */}
            {scanPhase === "shredding" && (
              <DigitalShredder
                isActive={true}
                inputData={rollNumber}
                outputHash={generatedHash}
                onComplete={handleShredComplete}
              />
            )}

            {/* Phase: Result */}
            {scanPhase === "result" && resultData && (
              <NeuralScanResult
                isVisible={true}
                ghostName={resultData.ghostName}
                hashSuffix={resultData.hashSuffix}
                isNewIdentity={resultData.isNewIdentity}
              />
            )}

            {/* Cancel button during scan */}
            {scanPhase !== "idle" && scanPhase !== "result" && (
              <Button
                onClick={resetScan}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Active Identity */}
        {activeIdentity && scanPhase === "idle" && (
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-accent flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ACTIVE CREDENTIAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeIdentity.ghost_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-status-warning" />
                      <span>{activeIdentity.reputation}%</span>
                      <span className="text-muted-foreground">trust score</span>
                    </div>
                    <div className="text-muted-foreground">
                      {activeIdentity.reports_submitted} submissions
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Preferences */}
        {activeIdentity && scanPhase === "idle" && (
          <NotificationPreferences
            ghostIdentityId={activeIdentity.id}
            currentEmail={(activeIdentity as any).notification_email}
            onUpdate={() => fetchIdentities()}
          />
        )}

        {/* All Identities Grid */}
        {scanPhase === "idle" && (
          <div>
            <h2 className="text-base font-medium mb-4">
              Credential Registry ({identities.length})
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {identities.map((identity) => (
                  <Card
                    key={identity.id}
                    className={`
                      cursor-pointer transition-all duration-200
                      hover:shadow-md
                      ${identity.id === activeId ? "border-accent ring-1 ring-accent/30" : "border-border/50"}
                    `}
                    onClick={() => setActiveId(identity.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{identity.ghost_name}</h4>
                            {identity.id === activeId && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-status-warning" />
                            <span>{identity.reputation}%</span>
                            <span>•</span>
                            <span>{identity.reports_submitted} submissions</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdentityGhost;
