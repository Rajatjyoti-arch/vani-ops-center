import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ghost, RefreshCw, Star, Shield, Loader2, LogOut, Scan, Fingerprint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateHash, generateGhostName, generateAvatar } from "@/lib/crypto";
import { toast } from "@/hooks/use-toast";
import { useGhostSession } from "@/contexts/GhostSessionContext";
import { NeuralScanner } from "@/components/identity/NeuralScanner";
import { DigitalShredder } from "@/components/identity/DigitalShredder";
import { NeuralScanResult } from "@/components/identity/NeuralScanResult";

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
        description: "Please enter your ID for neural scan",
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
        description: "Failed to create ghost identity. Please try again.",
        variant: "destructive",
      });
      setScanPhase("idle");
    }
  };

  // Navigate after result is shown
  useEffect(() => {
    if (scanPhase === "result") {
      const timeout = setTimeout(() => {
        navigate(returnUrl || "/vault");
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
          title: "Identity Rotated",
          description: `Now operating as ${identity.ghost_name}`,
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setActiveId(null);
    toast({
      title: "Session Terminated",
      description: "Ghost identity deactivated. Access revoked.",
    });
  };

  const activeIdentity = identities.find((i) => i.id === activeId);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Fingerprint className="w-7 h-7 text-primary" />
              Neural Identity Scanner
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Bio-data purged • Identity obfuscated • SHA-256 encrypted
            </p>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                End Session
              </Button>
            )}
            <Button
              onClick={rotateIdentity}
              variant="outline"
              className="cyber-button gap-2"
              disabled={identities.length < 2}
            >
              <RefreshCw className="w-4 h-4" />
              Rotate Identity
            </Button>
          </div>
        </div>

        {/* Neural Scan Interface */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary animate-pulse" />
              {scanPhase === "idle" && "Initiate Neural Scan"}
              {scanPhase === "neural-scan" && "Face Geometry Scan in Progress"}
              {scanPhase === "shredding" && "Digital Shredder Active"}
              {scanPhase === "result" && "Identity Forged"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Phase: Idle - Input */}
            {scanPhase === "idle" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="flex items-center gap-2">
                    <Ghost className="w-4 h-4 text-primary" />
                    Enter ID for Neural Scan
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="Enter your roll number or ID..."
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="bg-secondary/50 border-border/50 font-mono text-lg h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your ID will be combined with a neural scan and shredded into an anonymous hash.
                  </p>
                </div>

                <Button
                  onClick={handleStartScan}
                  disabled={!rollNumber.trim()}
                  className="w-full cyber-button bg-primary text-primary-foreground h-12 text-lg"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Begin Neural Scan
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
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Cancel Scan
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Active Identity */}
        {activeIdentity && scanPhase === "idle" && (
          <Card className="bg-primary/5 border-primary/30 cyber-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ACTIVE IDENTITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{activeIdentity.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground text-glow">
                    {activeIdentity.ghost_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-status-warning" />
                      <span className="font-mono">{activeIdentity.reputation}%</span>
                      <span className="text-muted-foreground">reputation</span>
                    </div>
                    <div className="text-muted-foreground">
                      {activeIdentity.reports_submitted} reports submitted
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Identities Grid */}
        {scanPhase === "idle" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Ghost Registry ({identities.length})
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
                      bg-card/80 backdrop-blur-sm cursor-pointer transition-all duration-300
                      hover:border-primary/50 hover:scale-[1.02]
                      ${identity.id === activeId ? "border-primary/50 ring-1 ring-primary/30" : "border-border/50"}
                    `}
                    onClick={() => setActiveId(identity.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{identity.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{identity.ghost_name}</h4>
                            {identity.id === activeId && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-status-warning" />
                            <span className="font-mono">{identity.reputation}%</span>
                            <span>•</span>
                            <span>{identity.reports_submitted} reports</span>
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
