import { useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PolicyParametersPanelProps {
  negotiationId: string;
  budgetLevel: string;
  urgencyLevel: string;
  onBudgetChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
  onConsensusUpdate: (newConsensus: string) => void;
  disabled?: boolean;
}

export function PolicyParametersPanel({
  negotiationId,
  budgetLevel,
  urgencyLevel,
  onBudgetChange,
  onUrgencyChange,
  onConsensusUpdate,
  disabled = false,
}: PolicyParametersPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [implementationTimeline, setImplementationTimeline] = useState([30]);

  const handleRetriggerAI = async () => {
    setIsProcessing(true);
    try {
      // Fetch the negotiation to get grievance text
      const { data: negotiation, error: fetchError } = await supabase
        .from("arena_negotiations")
        .select("grievance_text, negotiation_log")
        .eq("id", negotiationId)
        .single();

      if (fetchError) throw fetchError;

      // Call the negotiate function with admin parameters
      const { data, error } = await supabase.functions.invoke("negotiate", {
        body: {
          grievanceText: negotiation.grievance_text,
          previousNegotiations: negotiation.negotiation_log,
          adminParameters: {
            budgetLevel,
            urgencyLevel,
            implementationDays: implementationTimeline[0],
          },
          mode: "finalize",
        },
      });

      if (error) throw error;

      // Update the negotiation with the new consensus
      if (data?.consensus) {
        const { error: updateError } = await supabase
          .from("arena_negotiations")
          .update({
            final_consensus: data.consensus,
            budget_level: budgetLevel,
            urgency_level: urgencyLevel,
          })
          .eq("id", negotiationId);

        if (updateError) throw updateError;

        onConsensusUpdate(data.consensus);
        toast({
          title: "Consensus Finalized",
          description: "The AI has generated an updated consensus based on policy parameters.",
        });
      }
    } catch (err) {
      console.error("Error retriggering AI:", err);
      toast({
        title: "Processing Error",
        description: "Failed to finalize consensus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Availability */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">Budget Availability</Label>
        <Select value={budgetLevel} onValueChange={onBudgetChange} disabled={disabled}>
          <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="restricted">Restricted (Emergency Only)</SelectItem>
            <SelectItem value="low">Low (Minor Adjustments)</SelectItem>
            <SelectItem value="medium">Medium (Standard Allocation)</SelectItem>
            <SelectItem value="high">High (Priority Funding)</SelectItem>
            <SelectItem value="unlimited">Unlimited (Critical Initiative)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          {["restricted", "low", "medium", "high", "unlimited"].map((level) => (
            <div
              key={level}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                ["restricted", "low", "medium", "high", "unlimited"].indexOf(budgetLevel) >=
                ["restricted", "low", "medium", "high", "unlimited"].indexOf(level)
                  ? "bg-emerald-500"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Urgency Level */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">Urgency Level</Label>
        <Select value={urgencyLevel} onValueChange={onUrgencyChange} disabled={disabled}>
          <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="low">Low (Routine Review)</SelectItem>
            <SelectItem value="normal">Normal (Standard Timeline)</SelectItem>
            <SelectItem value="high">High (Expedited)</SelectItem>
            <SelectItem value="critical">Critical (Immediate Action)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Implementation Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-sm font-medium">Implementation Timeline</Label>
          <span className="text-sm text-emerald-400 font-mono">
            {implementationTimeline[0]} days
          </span>
        </div>
        <Slider
          value={implementationTimeline}
          onValueChange={setImplementationTimeline}
          min={7}
          max={180}
          step={7}
          disabled={disabled}
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>1 Week</span>
          <span>6 Months</span>
        </div>
      </div>

      {/* Re-trigger AI Button */}
      {!disabled && (
        <Button
          onClick={handleRetriggerAI}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Parameters...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Finalize Consensus with Parameters
            </>
          )}
        </Button>
      )}
    </div>
  );
}
