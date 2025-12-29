import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ghost, Plus, RefreshCw, Star, Shield, Hash, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateHash, generateGhostName, generateAvatar } from "@/lib/crypto";
import { toast } from "@/hooks/use-toast";

interface GhostIdentity {
  id: string;
  roll_number_hash: string;
  ghost_name: string;
  avatar: string;
  reputation: number;
  reports_submitted: number;
  created_at: string;
}

const IdentityGhost = () => {
  const navigate = useNavigate();
  const [identities, setIdentities] = useState<GhostIdentity[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [hashPreview, setHashPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Generate hash in real-time as user types
  useEffect(() => {
    const updateHash = async () => {
      if (rollNumber.trim()) {
        const hash = await generateHash(rollNumber);
        setHashPreview(hash.substring(0, 16) + "...");
      } else {
        setHashPreview("");
      }
    };
    updateHash();
  }, [rollNumber]);

  // Submit new ghost identity
  const handleSubmit = async () => {
    if (!rollNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your roll number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const hash = await generateHash(rollNumber);

      // Check if hash already exists
      const { data: existing } = await supabase
        .from("ghost_identities")
        .select("id, ghost_name")
        .eq("roll_number_hash", hash)
        .maybeSingle();

      if (existing) {
        setActiveId(existing.id);
        toast({
          title: "Identity Found",
          description: `Welcome back, ${existing.ghost_name}! Your ghost identity has been activated.`,
        });
        setRollNumber("");
        return;
      }

      // Create new identity
      const newIdentity = {
        roll_number_hash: hash,
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

      setIdentities([data, ...identities]);
      setActiveId(data.id);
      setRollNumber("");

      // Show success notification
      toast({
        title: "⚡ Data Siphon Complete",
        description: `Ghost identity "${data.ghost_name}" has been forged. Your anonymity is secured.`,
        className: "bg-primary/20 border-primary text-foreground",
      });

      // Redirect to Resolution Ledger after short delay
      setTimeout(() => {
        navigate("/ledger");
      }, 2000);
    } catch (error) {
      console.error("Error creating identity:", error);
      toast({
        title: "Error",
        description: "Failed to create ghost identity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rotateIdentity = () => {
    const availableIds = identities.filter((i) => i.id !== activeId).map((i) => i.id);
    if (availableIds.length > 0) {
      const newActiveId = availableIds[Math.floor(Math.random() * availableIds.length)];
      setActiveId(newActiveId);
      const identity = identities.find((i) => i.id === newActiveId);
      toast({
        title: "Identity Rotated",
        description: `Now operating as ${identity?.ghost_name}`,
      });
    }
  };

  const activeIdentity = identities.find((i) => i.id === activeId);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Ghost className="w-7 h-7 text-primary" />
              Identity Ghost
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generate anonymous personas using SHA-256 hashing
            </p>
          </div>
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

        {/* Roll Number Input - Hash Generator */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Generate Ghost Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                placeholder="Enter your roll number..."
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="bg-secondary/50 border-border/50 font-mono"
              />
            </div>

            {hashPreview && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">SHA-256 Hash Preview:</p>
                <p className="font-mono text-sm text-primary break-all">{hashPreview}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!rollNumber.trim() || isSubmitting}
              className="w-full cyber-button bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Identity...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Forge Ghost Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Active Identity */}
        {activeIdentity && (
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
      </div>
    </DashboardLayout>
  );
};

export default IdentityGhost;
