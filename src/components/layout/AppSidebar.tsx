import { Ghost, Shield, Swords, BookOpen, Lock } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { DeadManSwitch } from "@/components/sidebar/DeadManSwitch";
import { LegacyThreads } from "@/components/sidebar/LegacyThreads";
import { SettingsPanel } from "@/components/sidebar/SettingsPanel";
import { useGhostSession } from "@/contexts/GhostSessionContext";

const navItems = [
  {
    title: "Command Center",
    url: "/",
    icon: Shield,
    description: "System Overview",
    tourId: "nav-command",
  },
  {
    title: "Identity Ghost",
    url: "/identity",
    icon: Ghost,
    description: "Anonymous Personas",
    tourId: "nav-identity",
  },
  {
    title: "Stealth Vault",
    url: "/vault",
    icon: Shield,
    description: "Secure Files",
    tourId: "nav-vault",
    protected: true,
  },
  {
    title: "The Arena",
    url: "/arena",
    icon: Swords,
    description: "Discussions",
    tourId: "nav-arena",
    protected: true,
  },
  {
    title: "Resolution Ledger",
    url: "/ledger",
    icon: BookOpen,
    description: "Issue Tracking",
    tourId: "nav-ledger",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { ghostIdentity, isAuthenticated } = useGhostSession();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="p-4 border-b border-border/50" data-tour="logo">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center cyber-glow">
              <span className="text-primary font-mono font-bold text-lg">V</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full pulse-cyan" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-foreground tracking-wide">VANI</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Network Intelligence
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                const isLocked = item.protected && !isAuthenticated;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        group relative overflow-hidden transition-all duration-200
                        hover:bg-secondary/80 hover:scale-[1.02]
                        ${isActive ? "bg-primary/10 border border-primary/30" : ""}
                        ${isLocked ? "opacity-60" : ""}
                      `}
                    >
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-3" data-tour={item.tourId}>
                        <div
                          className={`
                            p-2 rounded-md transition-all duration-200
                            ${isActive 
                              ? "bg-primary/20 text-primary cyber-glow" 
                              : "bg-secondary/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                            }
                          `}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        {!collapsed && (
                          <div className="flex flex-col flex-1 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <span
                                className={`
                                  text-sm font-medium transition-colors
                                  ${isActive ? "text-primary text-glow" : "text-foreground group-hover:text-primary"}
                                `}
                              >
                                {item.title}
                              </span>
                              {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {isLocked ? "Requires ghost identity" : item.description}
                            </span>
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Dead Man's Switch */}
      <DeadManSwitch collapsed={collapsed} />

      <LegacyThreads collapsed={collapsed} />

      {/* Settings Panel */}
      <div data-tour="settings">
        <SettingsPanel collapsed={collapsed} />
      </div>

      {/* System status footer */}
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-border/50">
          {isAuthenticated && ghostIdentity ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-lg">{ghostIdentity.avatar}</span>
              <div className="flex flex-col">
                <span className="font-mono text-primary">{ghostIdentity.ghost_name}</span>
                <span className="text-muted-foreground">Session Active</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-status-warning rounded-full" />
              <span className="font-mono">NO IDENTITY</span>
            </div>
          )}
        </div>
      )}
    </Sidebar>
  );
}
