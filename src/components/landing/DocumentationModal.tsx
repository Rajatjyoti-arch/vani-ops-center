import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Scale,
  FileText,
  Users,
  Server,
  Database,
  Cpu,
  ArrowRight,
  CheckCircle,
  Eye,
  Activity,
  Network,
  Zap,
  BookOpen,
  GitBranch,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentationModal({ open, onOpenChange }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">VANI Documentation</DialogTitle>
              <p className="text-sm text-muted-foreground">Complete system architecture and flow guide</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b border-border/50 px-6 bg-background/50">
            <TabsList className="h-12 bg-transparent gap-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Layers className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="architecture" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <GitBranch className="w-4 h-4 mr-2" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="flow" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Network className="w-4 h-4 mr-2" />
                User Flow
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Cpu className="w-4 h-4 mr-2" />
                AI System
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">What is VANI?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    <strong>V</strong>erifiable <strong>A</strong>nonymous <strong>N</strong>etwork <strong>I</strong>ntelligence — 
                    A next-generation grievance redressal platform designed for institutional transparency.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Users, title: "For Students", desc: "Submit grievances anonymously with cryptographic identity protection" },
                    { icon: Shield, title: "For Administrators", desc: "Review cases with AI-assisted analysis and resolution recommendations" },
                    { icon: Scale, title: "For Institutions", desc: "Maintain transparent governance with immutable audit trails" }
                  ].map((item, i) => (
                    <Card key={i} className="border-border/50 bg-card/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "Zero-Knowledge Auth",
                        "Encrypted Vault",
                        "AI Resolution",
                        "Public Ledger",
                        "Real-time Analytics",
                        "Multi-Agent AI",
                        "GDPR Compliant",
                        "Audit Trails"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Architecture Tab */}
              <TabsContent value="architecture" className="m-0 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">System Architecture</h2>
                  <p className="text-muted-foreground">Three-tier architecture with AI governance layer</p>
                </div>

                {/* Architecture Diagram */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="relative">
                      {/* Client Layer */}
                      <div className="flex justify-center mb-8">
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center min-w-[300px]">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <Users className="w-6 h-6 text-primary" />
                            <h3 className="font-bold text-lg">Client Layer</h3>
                          </div>
                          <div className="flex gap-4 justify-center text-sm">
                            <span className="px-3 py-1 bg-background/50 rounded-full">React + Vite</span>
                            <span className="px-3 py-1 bg-background/50 rounded-full">TailwindCSS</span>
                            <span className="px-3 py-1 bg-background/50 rounded-full">TypeScript</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center mb-8">
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <div className="w-0.5 h-8 bg-border" />
                          <ArrowRight className="w-4 h-4 rotate-90" />
                          <span className="text-xs">HTTPS / WebSocket</span>
                        </div>
                      </div>

                      {/* API & AI Layer */}
                      <div className="flex justify-center gap-6 mb-8">
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center flex-1 max-w-[280px]">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <Server className="w-6 h-6 text-accent" />
                            <h3 className="font-bold">API Layer</h3>
                          </div>
                          <div className="text-sm space-y-2">
                            <span className="block px-3 py-1 bg-background/50 rounded-full">Edge Functions</span>
                            <span className="block px-3 py-1 bg-background/50 rounded-full">RLS Policies</span>
                          </div>
                        </div>

                        <div className="bg-[#4285F4]/10 border border-[#4285F4]/30 rounded-xl p-6 text-center flex-1 max-w-[280px]">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <Cpu className="w-6 h-6 text-[#4285F4]" />
                            <h3 className="font-bold">AI Layer</h3>
                          </div>
                          <div className="text-sm space-y-2">
                            <span className="block px-3 py-1 bg-background/50 rounded-full">Google Gemini 2.5</span>
                            <span className="block px-3 py-1 bg-background/50 rounded-full">Multi-Agent System</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center mb-8">
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <div className="w-0.5 h-8 bg-border" />
                          <ArrowRight className="w-4 h-4 rotate-90" />
                          <span className="text-xs">Encrypted Queries</span>
                        </div>
                      </div>

                      {/* Database Layer */}
                      <div className="flex justify-center">
                        <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-6 text-center min-w-[300px]">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <Database className="w-6 h-6 text-status-warning" />
                            <h3 className="font-bold text-lg">Data Layer</h3>
                          </div>
                          <div className="flex gap-4 justify-center text-sm">
                            <span className="px-3 py-1 bg-background/50 rounded-full">PostgreSQL</span>
                            <span className="px-3 py-1 bg-background/50 rounded-full">Encrypted Storage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "React 18", desc: "UI Framework" },
                    { name: "TypeScript", desc: "Type Safety" },
                    { name: "TailwindCSS", desc: "Styling" },
                    { name: "Supabase", desc: "Backend" },
                    { name: "PostgreSQL", desc: "Database" },
                    { name: "Edge Functions", desc: "Serverless" },
                    { name: "Google Gemini", desc: "AI Engine" },
                    { name: "SHA-256", desc: "Hashing" }
                  ].map((tech, i) => (
                    <Card key={i} className="border-border/50">
                      <CardContent className="p-4 text-center">
                        <p className="font-semibold text-sm">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* User Flow Tab */}
              <TabsContent value="flow" className="m-0 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">User Journey</h2>
                  <p className="text-muted-foreground">From submission to resolution</p>
                </div>

                {/* Flow Diagram */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-status-warning" />
                  
                  {[
                    { step: 1, title: "Portal Entry", desc: "Student accesses VANI via university portal", icon: Users, color: "primary" },
                    { step: 2, title: "OTP Verification", desc: "Enrollment-based email verification (enrollmentno.branch@cuj.ac.in)", icon: Lock, color: "primary" },
                    { step: 3, title: "Ghost Identity Created", desc: "SHA-256 hash generates anonymous ghost identity", icon: Shield, color: "accent" },
                    { step: 4, title: "Evidence Upload", desc: "Files encrypted and stored in Stealth Vault", icon: FileText, color: "accent" },
                    { step: 5, title: "Grievance Submission", desc: "Report categorized and assigned priority", icon: Activity, color: "status-info" },
                    { step: 6, title: "AI Analysis", desc: "Sentinel, Governor & Arbiter agents analyze case", icon: Cpu, color: "[#4285F4]" },
                    { step: 7, title: "Admin Review", desc: "Administrators review AI recommendations", icon: Eye, color: "status-warning" },
                    { step: 8, title: "Resolution Published", desc: "Outcome recorded on public ledger", icon: Scale, color: "emerald-500" }
                  ].map((item, i) => (
                    <div key={i} className="relative pl-20 pb-8 last:pb-0">
                      <div className={cn(
                        "absolute left-5 w-7 h-7 rounded-full border-4 border-background flex items-center justify-center z-10",
                        `bg-${item.color}`
                      )}>
                        <span className="text-xs font-bold text-white">{item.step}</span>
                      </div>
                      <Card className="border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", `bg-${item.color}/10`)}>
                            <item.icon className={cn("w-5 h-5", `text-${item.color}`)} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="m-0 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Security Architecture</h2>
                  <p className="text-muted-foreground">Multi-layered protection for complete anonymity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Lock,
                      title: "Zero-Knowledge Authentication",
                      desc: "Your enrollment is hashed using SHA-256. We verify you're a valid student without storing your actual identity.",
                      details: ["One-way hash function", "No plaintext storage", "Collision resistant"]
                    },
                    {
                      icon: Shield,
                      title: "Ghost Identity System",
                      desc: "Each user receives a unique, randomly generated ghost name and avatar that cannot be traced back.",
                      details: ["Random name generation", "Unique avatar assignment", "No identity mapping"]
                    },
                    {
                      icon: FileText,
                      title: "Encrypted Evidence Vault",
                      desc: "All uploaded files are encrypted at rest and in transit using AES-256 encryption.",
                      details: ["AES-256 encryption", "Secure key management", "Auto-expiry support"]
                    },
                    {
                      icon: Database,
                      title: "Row Level Security",
                      desc: "Database policies ensure users can only access their own data. Admins see anonymized versions.",
                      details: ["PostgreSQL RLS", "Policy-based access", "Audit logging"]
                    }
                  ].map((item, i) => (
                    <Card key={i} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.details.map((detail, j) => (
                                <span key={j} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  {detail}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <h3 className="font-semibold">Compliance & Standards</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {["GDPR Compliant", "Data Minimization", "Right to Erasure", "Consent Management"].map((item, i) => (
                        <div key={i} className="p-3 bg-background/50 rounded-lg">
                          <p className="text-sm font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI System Tab */}
              <TabsContent value="ai" className="m-0 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">AI Governance System</h2>
                  <p className="text-muted-foreground">Powered by Google Gemini 2.5 Flash</p>
                </div>

                {/* Multi-Agent Diagram */}
                <Card className="border-[#4285F4]/20 bg-gradient-to-br from-[#4285F4]/5 to-[#D96570]/5">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          name: "SENTINEL",
                          role: "Risk Assessor",
                          color: "#4285F4",
                          desc: "Analyzes grievance severity, identifies policy violations, and flags urgent cases",
                          tasks: ["Severity scoring", "Policy matching", "Urgency detection"]
                        },
                        {
                          name: "GOVERNOR",
                          role: "Resolution Architect",
                          color: "#9B72CB",
                          desc: "Proposes fair resolutions based on precedent and institutional guidelines",
                          tasks: ["Precedent analysis", "Resolution drafting", "Resource allocation"]
                        },
                        {
                          name: "ARBITER",
                          role: "Final Mediator",
                          color: "#D96570",
                          desc: "Balances competing proposals and generates final consensus recommendation",
                          tasks: ["Conflict resolution", "Consensus building", "Final recommendation"]
                        }
                      ].map((agent, i) => (
                        <div key={i} className="text-center">
                          <div 
                            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}40` }}
                          >
                            <Cpu className="w-10 h-10" style={{ color: agent.color }} />
                          </div>
                          <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{agent.role}</p>
                          <p className="text-sm mb-4">{agent.desc}</p>
                          <div className="space-y-2">
                            {agent.tasks.map((task, j) => (
                              <div key={j} className="text-xs px-3 py-1.5 rounded-full bg-background/50">
                                {task}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Irene Assistant */}
                <Card className="border-[#9B72CB]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570] flex items-center justify-center shrink-0">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Meet Irene</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your AI Compliance Assistant powered by Gemini 2.5 Flash. Irene provides real-time guidance on 
                          policies, procedures, and your rights within the grievance system.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["24/7 Available", "Policy Expert", "Procedure Guide", "Rights Advisor"].map((tag, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-[#9B72CB]/10 text-[#9B72CB] rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <div className="p-4 border-t border-border/50 bg-card/50 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close Documentation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
