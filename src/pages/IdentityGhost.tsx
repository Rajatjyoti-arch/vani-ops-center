import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost, Plus, RefreshCw, Star, Shield } from "lucide-react";

interface GhostIdentity {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  reportsSubmitted: number;
  createdAt: string;
  isActive: boolean;
}

const mockIdentities: GhostIdentity[] = [
  { id: "1", name: "ShadowWolf", avatar: "🐺", reputation: 87, reportsSubmitted: 12, createdAt: "2024-01-15", isActive: true },
  { id: "2", name: "NightOwl", avatar: "🦉", reputation: 92, reportsSubmitted: 18, createdAt: "2024-01-10", isActive: false },
  { id: "3", name: "PhantomEcho", avatar: "👻", reputation: 76, reportsSubmitted: 7, createdAt: "2024-01-20", isActive: false },
];

const IdentityGhost = () => {
  const [identities, setIdentities] = useState(mockIdentities);
  const [activeId, setActiveId] = useState<string | null>("1");

  const generateRandomName = () => {
    const adjectives = ["Shadow", "Night", "Phantom", "Silent", "Mystic", "Cyber", "Ghost", "Void"];
    const nouns = ["Wolf", "Owl", "Echo", "Storm", "Raven", "Specter", "Blade", "Hawk"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
  };

  const createNewIdentity = () => {
    const avatars = ["🐺", "🦉", "👻", "🦅", "🐉", "🦊", "🐱", "🦇"];
    const newIdentity: GhostIdentity = {
      id: Date.now().toString(),
      name: generateRandomName(),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      reputation: 50,
      reportsSubmitted: 0,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: false,
    };
    setIdentities([newIdentity, ...identities]);
  };

  const rotateIdentity = () => {
    const availableIds = identities.filter((i) => i.id !== activeId).map((i) => i.id);
    if (availableIds.length > 0) {
      const newActiveId = availableIds[Math.floor(Math.random() * availableIds.length)];
      setActiveId(newActiveId);
    }
  };

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
              Manage your anonymous personas for secure reporting
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={rotateIdentity}
              variant="outline"
              className="cyber-button gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Rotate Identity
            </Button>
            <Button
              onClick={createNewIdentity}
              className="cyber-button gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Ghost
            </Button>
          </div>
        </div>

        {/* Active Identity */}
        {activeId && (
          <Card className="bg-primary/5 border-primary/30 cyber-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ACTIVE IDENTITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              {identities.filter((i) => i.id === activeId).map((identity) => (
                <div key={identity.id} className="flex items-center gap-4">
                  <div className="text-5xl">{identity.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground text-glow">
                      {identity.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-status-warning" />
                        <span className="font-mono">{identity.reputation}%</span>
                        <span className="text-muted-foreground">reputation</span>
                      </div>
                      <div className="text-muted-foreground">
                        {identity.reportsSubmitted} reports submitted
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Identities Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Ghost Identities</h2>
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
                        <h4 className="font-medium text-foreground">{identity.name}</h4>
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
                        <span>{identity.reportsSubmitted} reports</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IdentityGhost;
