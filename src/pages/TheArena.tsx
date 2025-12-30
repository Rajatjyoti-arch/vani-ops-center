import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Swords, Play, Shield, Building2, Scale, Zap, MessageSquare, TrendingUp, TrendingDown, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatrixRain } from "@/components/effects/MatrixRain";
import { TypewriterText } from "@/components/effects/TypewriterText";
import { HeatBar } from "@/components/arena/HeatBar";
import { EthicalViolationAlert } from "@/components/arena/EthicalViolationAlert";
import { DeepScanReveal } from "@/components/arena/DeepScanReveal";

interface VaultFile {
  id: string;
  file_name: string;
  file_path: string;
  secret_metadata: string | null;
  created_at: string;
}

interface NegotiationRound {
  round: number;
  agent: string;
  message: string;
  sentimentShift: number;
  timestamp: string;
  ethicalViolation?: boolean;
  berserkerMode?: boolean;
}

interface Negotiation {
  id: string;
  grievance_text: string;
  negotiation_log: NegotiationRound[];
  final_consensus: string | null;
  sentinel_score: number;
  governor_score: number;
  status: string;
}

const agentStyles = {
  Sentinel: {
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    label: "Sentinel-AI",
    subtitle: "Student Proxy",
    berserkerColor: "text-status-critical",
    berserkerBg: "bg-status-critical/20",
    berserkerBorder: "border-status-critical/50",
    berserkerLabel: "SENTINEL-AI [BERSERKER]",
  },
  Governor: {
    icon: Building2,
    color: "text-status-warning",
    bg: "bg-status-warning/10",
    border: "border-status-warning/30",
    label: "Governor-AI",
    subtitle: "Campus Admin",
  },
  Arbiter: {
    icon: Scale,
    color: "text-status-safe",
    bg: "bg-status-safe/10",
    border: "border-status-safe/30",
    label: "The Arbiter",
    subtitle: "Neutral Mediator",
    ethicsColor: "text-status-critical",
    ethicsBg: "bg-status-critical/20",
    ethicsBorder: "border-status-critical/50",
    ethicsLabel: "THE ARBITER [ETHICS OVERRIDE]",
  },
};

const TheArena = () => {
  const navigate = useNavigate();
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [sentinelScore, setSentinelScore] = useState(50);
  const [governorScore, setGovernorScore] = useState(50);
  const [ethicalViolationDetected, setEthicalViolationDetected] = useState(false);
  const [showViolationAlert, setShowViolationAlert] = useState(false);

  // Fetch vault files with grievances
  useEffect(() => {
    const fetchVaultFiles = async () => {
      const { data, error } = await supabase
        .from('stealth_vault')
        .select('id, file_name, file_path, secret_metadata, created_at')
        .not('secret_metadata', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vault files:', error);
        return;
      }

      setVaultFiles(data || []);
    };

    fetchVaultFiles();
  }, []);

  const startNegotiation = async () => {
    if (!selectedFileId) {
      toast.error("Select a grievance file to begin negotiation");
      return;
    }

    const selectedFile = vaultFiles.find(f => f.id === selectedFileId);
    if (!selectedFile?.secret_metadata) {
      toast.error("No grievance data found in selected file");
      return;
    }

    setIsNegotiating(true);
    setSentinelScore(50);
    setGovernorScore(50);
    setCurrentRound(1);
    setEthicalViolationDetected(false);
    setShowViolationAlert(false);

    // Create negotiation record
    const { data: newNegotiation, error } = await supabase
      .from('arena_negotiations')
      .insert({
        vault_file_id: selectedFileId,
        grievance_text: selectedFile.secret_metadata,
        negotiation_log: [],
        sentinel_score: 50,
        governor_score: 50,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating negotiation:', error);
      toast.error("Failed to start negotiation");
      setIsNegotiating(false);
      return;
    }

    setNegotiation({
      ...newNegotiation,
      negotiation_log: (newNegotiation.negotiation_log as unknown) as NegotiationRound[],
    });

    // Start the negotiation rounds
    await runNegotiationRounds(newNegotiation.id, selectedFile.secret_metadata, []);
  };

  const runNegotiationRounds = async (negotiationId: string, grievanceText: string, existingLog: NegotiationRound[]) => {
    let log = [...existingLog];
    let round = 1;
    let sentScore = 50;
    let govScore = 50;
    const maxRounds = 4;

    for (let i = 0; i < maxRounds * 2; i++) {
      const isArbiterNeeded = round > 3 && log.length >= 6;
      
      if (isArbiterNeeded) {
        // Arbiter intervention
        round = 4;
        setCurrentRound(4);
      }

      try {
        // Check if we need ethics override
        const lastEntry = log[log.length - 1];
        const needsEthicsOverride = lastEntry?.ethicalViolation && lastEntry.agent === 'Governor';
        
        if (needsEthicsOverride) {
          setEthicalViolationDetected(true);
          setShowViolationAlert(true);
          // Wait for user to acknowledge the alert
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        const response = await supabase.functions.invoke('negotiate', {
          body: {
            grievanceText,
            currentRound: round,
            negotiationLog: log,
            ethicalViolationDetected: needsEthicsOverride,
          },
        });

        if (response.error) {
          console.error('Negotiation error:', response.error);
          toast.error("Negotiation round failed");
          break;
        }

        const roundResult: NegotiationRound = response.data;
        log = [...log, roundResult];

        // Update scores based on agent
        if (roundResult.agent === 'Sentinel') {
          sentScore = Math.max(0, Math.min(100, sentScore + roundResult.sentimentShift));
        } else if (roundResult.agent === 'Governor') {
          govScore = Math.max(0, Math.min(100, govScore + roundResult.sentimentShift));
        }

        setSentinelScore(sentScore);
        setGovernorScore(govScore);
        setNegotiation(prev => prev ? { ...prev, negotiation_log: log } : null);

        // Update database
        await supabase
          .from('arena_negotiations')
          .update({
            negotiation_log: log as unknown as string,
            sentinel_score: sentScore,
            governor_score: govScore,
          })
          .eq('id', negotiationId);

        // Check if we've reached the arbiter's final say
        if (roundResult.agent === 'Arbiter') {
          // Save final consensus
          await supabase
            .from('arena_negotiations')
            .update({
              final_consensus: roundResult.message,
              status: 'completed',
            })
            .eq('id', negotiationId);

          setNegotiation(prev => prev ? { 
            ...prev, 
            final_consensus: roundResult.message,
            status: 'completed' 
          } : null);

          toast.success("Data Siphon Complete", {
            description: "Negotiation concluded. Consensus reached.",
            className: "cyber-glow",
          });

          setTimeout(() => {
            navigate('/resolution-ledger');
          }, 2000);
          break;
        }

        // Increment round after both agents speak
        if (roundResult.agent === 'Governor') {
          round++;
          setCurrentRound(round);
        }

        // Small delay between rounds for visual effect
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.error('Round error:', error);
        toast.error("Negotiation interrupted");
        break;
      }
    }

    // If no arbiter was triggered, complete normally after 4 rounds
    if (log.length >= 8 && !log.some(l => l.agent === 'Arbiter')) {
      await supabase
        .from('arena_negotiations')
        .update({
          final_consensus: "Negotiation concluded after 4 rounds. Review the arguments above.",
          status: 'completed',
        })
        .eq('id', negotiationId);

      toast.success("Data Siphon Complete", {
        description: "Negotiation completed. Redirecting to ledger...",
        className: "cyber-glow",
      });

      setTimeout(() => {
        navigate('/resolution-ledger');
      }, 2000);
    }

    setIsNegotiating(false);
  };

  const victoryProbability = () => {
    const total = sentinelScore + governorScore;
    if (total === 0) return 50;
    return Math.round((sentinelScore / total) * 100);
  };

  return (
    <DashboardLayout>
      {/* Ethical Violation Alert */}
      <EthicalViolationAlert 
        isVisible={showViolationAlert} 
        onDismiss={() => setShowViolationAlert(false)} 
      />
      
      <div className="space-y-6 animate-fade-in relative">
        {/* Matrix Rain Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
          <MatrixRain />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Swords className="w-7 h-7 text-primary" />
              The Arena
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-Agent Negotiation Matrix
            </p>
          </div>
        </div>

        {/* File Selection & Start */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Select Grievance File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedFileId} onValueChange={setSelectedFileId} disabled={isNegotiating}>
                <SelectTrigger className="flex-1 bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Choose from Stealth Vault..." />
                </SelectTrigger>
                <SelectContent>
                  {vaultFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>{file.file_name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({new Date(file.created_at).toLocaleDateString()})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={startNegotiation} 
                disabled={!selectedFileId || isNegotiating}
                className="cyber-button gap-2 bg-primary text-primary-foreground"
              >
                {isNegotiating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isNegotiating ? "Negotiating..." : "Initiate Matrix"}
              </Button>
            </div>

            {selectedFileId && vaultFiles.find(f => f.id === selectedFileId) && (
              <div className="p-3 bg-secondary/30 rounded border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-mono">GRIEVANCE PAYLOAD:</p>
                  {vaultFiles.find(f => f.id === selectedFileId)?.file_path.match(/\.(png|jpg|jpeg|webp)$/i) && (
                    <DeepScanReveal 
                      vaultFileId={selectedFileId}
                      filePath={vaultFiles.find(f => f.id === selectedFileId)!.file_path}
                      fileName={vaultFiles.find(f => f.id === selectedFileId)!.file_name}
                    />
                  )}
                </div>
                <p className="text-sm text-foreground">
                  {vaultFiles.find(f => f.id === selectedFileId)?.secret_metadata}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Negotiation Metrics */}
        {negotiation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sentinel Score */}
            <Card className={`bg-card/80 backdrop-blur-sm border-primary/30`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-mono text-sm text-primary">SENTINEL STRENGTH</span>
                </div>
                <div className="space-y-2">
                  <Progress value={sentinelScore} className="h-3" />
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Power Level</span>
                    <span className="text-primary">{sentinelScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Victory Probability */}
            <Card className="bg-card/80 backdrop-blur-sm border-status-safe/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-status-safe" />
                  <span className="font-mono text-sm text-status-safe">VICTORY PROBABILITY</span>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold font-mono text-foreground">{victoryProbability()}%</span>
                  <p className="text-xs text-muted-foreground mt-1">Student Advantage</p>
                </div>
              </CardContent>
            </Card>

            {/* Governor Score */}
            <Card className={`bg-card/80 backdrop-blur-sm border-status-warning/30`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-status-warning" />
                  <span className="font-mono text-sm text-status-warning">GOVERNOR STRENGTH</span>
                </div>
                <div className="space-y-2">
                  <Progress value={governorScore} className="h-3" />
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Power Level</span>
                    <span className="text-status-warning">{governorScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Round Indicator */}
        {negotiation && (
          <>
            <div className="flex items-center justify-center gap-4 py-2">
              {[1, 2, 3, 4].map((round) => (
                <div 
                  key={round}
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold
                    transition-all duration-300
                    ${ethicalViolationDetected && currentRound === round
                      ? 'border-status-critical bg-status-critical/20 text-status-critical scale-110 animate-pulse'
                      : currentRound === round 
                        ? 'border-primary bg-primary/20 text-primary scale-110 cyber-glow' 
                        : currentRound > round 
                          ? 'border-status-safe/50 bg-status-safe/10 text-status-safe' 
                          : 'border-border/50 bg-secondary/30 text-muted-foreground'
                    }
                  `}
                >
                  {ethicalViolationDetected && currentRound === round ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : round}
                </div>
              ))}
            </div>
            
            {/* Heat Bar */}
            <HeatBar 
              sentinelScore={sentinelScore} 
              governorScore={governorScore} 
              isActive={isNegotiating}
              ethicalViolation={ethicalViolationDetected}
            />
          </>
        )}

        {/* Negotiation Log */}
        {negotiation && negotiation.negotiation_log.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Negotiation Transcript
            </h2>
            
            <div className="space-y-3">
              {negotiation.negotiation_log.map((entry, index) => {
                const baseStyle = agentStyles[entry.agent as keyof typeof agentStyles];
                const Icon = baseStyle.icon;
                
                // Determine if this entry is in special mode
                const isBerserker = entry.berserkerMode && entry.agent === 'Sentinel';
                const isEthicsOverride = entry.ethicalViolation && entry.agent === 'Arbiter';
                
                // Get appropriate styles with safe fallbacks
                const berserkerColor = 'berserkerColor' in baseStyle ? baseStyle.berserkerColor : baseStyle.color;
                const berserkerBg = 'berserkerBg' in baseStyle ? baseStyle.berserkerBg : baseStyle.bg;
                const berserkerBorder = 'berserkerBorder' in baseStyle ? baseStyle.berserkerBorder : baseStyle.border;
                const berserkerLabel = 'berserkerLabel' in baseStyle ? baseStyle.berserkerLabel : baseStyle.label;
                
                const ethicsColor = 'ethicsColor' in baseStyle ? baseStyle.ethicsColor : baseStyle.color;
                const ethicsBg = 'ethicsBg' in baseStyle ? baseStyle.ethicsBg : baseStyle.bg;
                const ethicsBorder = 'ethicsBorder' in baseStyle ? baseStyle.ethicsBorder : baseStyle.border;
                const ethicsLabel = 'ethicsLabel' in baseStyle ? baseStyle.ethicsLabel : baseStyle.label;
                
                const style = {
                  color: isBerserker ? berserkerColor : isEthicsOverride ? ethicsColor : baseStyle.color,
                  bg: isBerserker ? berserkerBg : isEthicsOverride ? ethicsBg : baseStyle.bg,
                  border: isBerserker ? berserkerBorder : isEthicsOverride ? ethicsBorder : baseStyle.border,
                  label: isBerserker ? berserkerLabel : isEthicsOverride ? ethicsLabel : baseStyle.label,
                };
                
                return (
                  <Card 
                    key={index}
                    className={`
                      ${style.bg} border ${style.border}
                      animate-fade-in transition-all duration-300
                      ${isBerserker || isEthicsOverride ? 'ring-2 ring-status-critical/50' : ''}
                    `}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${style.bg} ${style.border} border ${isBerserker ? 'animate-pulse' : ''}`}>
                          <Icon className={`w-5 h-5 ${style.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${style.color} ${isBerserker ? 'glitch-text' : ''}`}>
                                {style.label || baseStyle.label}
                              </span>
                              {(isBerserker || isEthicsOverride) && (
                                <AlertTriangle className="w-4 h-4 text-status-critical animate-pulse" />
                              )}
                              {!isBerserker && !isEthicsOverride && (
                                <span className="text-xs text-muted-foreground">({baseStyle.subtitle})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {entry.sentimentShift !== 0 && (
                                <span className={`text-xs font-mono flex items-center gap-1 ${entry.sentimentShift > 0 ? 'text-status-safe' : 'text-status-critical'}`}>
                                  {entry.sentimentShift > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  {entry.sentimentShift > 0 ? '+' : ''}{entry.sentimentShift}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground font-mono">
                                R{entry.round}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            isBerserker 
                              ? 'font-bold text-status-critical glitch-text' 
                              : isEthicsOverride 
                                ? 'font-semibold text-status-critical' 
                                : 'text-foreground'
                          }`}>
                            <TypewriterText 
                              text={entry.message} 
                              speed={isBerserker ? 8 : 15} 
                              enableSound={index === negotiation.negotiation_log.length - 1}
                            />
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Final Consensus */}
        {negotiation?.final_consensus && (
          <Card className={`cyber-glow ${ethicalViolationDetected ? 'bg-status-critical/10 border-status-critical/30' : 'bg-status-safe/10 border-status-safe/30'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${ethicalViolationDetected ? 'text-status-critical' : 'text-status-safe'}`}>
                <Scale className="w-5 h-5" />
                {ethicalViolationDetected ? 'Ethics Override Ruling' : 'Final Consensus'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{negotiation.final_consensus}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isNegotiating && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-mono text-sm animate-pulse">Processing negotiation matrix...</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TheArena;
