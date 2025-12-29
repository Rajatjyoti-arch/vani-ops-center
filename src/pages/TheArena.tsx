import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, Plus, MessageSquare, ThumbsUp, ThumbsDown, Clock, Filter } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  category: "safety" | "academic" | "facilities" | "general";
  author: string;
  authorAvatar: string;
  replies: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
}

const mockThreads: Thread[] = [
  { id: "1", title: "Night patrol schedule concerns at Main Gate", category: "safety", author: "NightOwl", authorAvatar: "🦉", replies: 24, upvotes: 45, downvotes: 3, createdAt: "2h ago", lastActivity: "5m ago", isPinned: true },
  { id: "2", title: "Library closing time during exam week", category: "academic", author: "ShadowWolf", authorAvatar: "🐺", replies: 18, upvotes: 32, downvotes: 2, createdAt: "4h ago", lastActivity: "15m ago" },
  { id: "3", title: "Water supply issues in Hostel 2", category: "facilities", author: "PhantomEcho", authorAvatar: "👻", replies: 31, upvotes: 67, downvotes: 1, createdAt: "1d ago", lastActivity: "1h ago" },
  { id: "4", title: "Suggestion: Anonymous feedback for professors", category: "general", author: "CyberRaven", authorAvatar: "🦅", replies: 42, upvotes: 89, downvotes: 12, createdAt: "2d ago", lastActivity: "30m ago" },
  { id: "5", title: "Parking area lighting improvements needed", category: "safety", author: "MysticBlade", authorAvatar: "⚔️", replies: 15, upvotes: 28, downvotes: 0, createdAt: "3d ago", lastActivity: "2h ago" },
];

const categoryColors = {
  safety: "bg-status-critical/20 text-status-critical border-status-critical/30",
  academic: "bg-primary/20 text-primary border-primary/30",
  facilities: "bg-status-warning/20 text-status-warning border-status-warning/30",
  general: "bg-muted text-muted-foreground border-border",
};

const TheArena = () => {
  const [threads] = useState(mockThreads);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = threads.filter((thread) => {
    if (activeCategory && thread.category !== activeCategory) return false;
    if (searchQuery && !thread.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { id: "safety", label: "Campus Safety", count: threads.filter((t) => t.category === "safety").length },
    { id: "academic", label: "Academic Issues", count: threads.filter((t) => t.category === "academic").length },
    { id: "facilities", label: "Facilities", count: threads.filter((t) => t.category === "facilities").length },
    { id: "general", label: "General", count: threads.filter((t) => t.category === "general").length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Swords className="w-7 h-7 text-primary" />
              The Arena
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Anonymous discussion forums for campus issues
            </p>
          </div>
          <Button className="cyber-button gap-2 bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            New Thread
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border-border/50 pl-10"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`
                  cyber-button text-xs
                  ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : ""}
                `}
              >
                {cat.label}
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-background/20 font-mono text-[10px]">
                  {cat.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`
                bg-card/80 backdrop-blur-sm border-border/50 
                hover:border-primary/30 transition-all duration-300 cursor-pointer
                ${thread.isPinned ? "ring-1 ring-primary/20" : ""}
              `}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-status-safe">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {thread.upvotes - thread.downvotes}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-status-critical">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.isPinned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                          Pinned
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[thread.category]}`}>
                        {thread.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{thread.authorAvatar}</span>
                        <span className="text-primary">{thread.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{thread.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Active {thread.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TheArena;
