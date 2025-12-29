import { Ghost, Shield, Swords, BookOpen } from "lucide-react";
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

const navItems = [
  {
    title: "Command Center",
    url: "/",
    icon: Shield,
    description: "System Overview",
  },
  {
    title: "Identity Ghost",
    url: "/identity",
    icon: Ghost,
    description: "Anonymous Personas",
  },
  {
    title: "Stealth Vault",
    url: "/vault",
    icon: Shield,
    description: "Secure Files",
  },
  {
    title: "The Arena",
    url: "/arena",
    icon: Swords,
    description: "Discussions",
  },
  {
    title: "Resolution Ledger",
    url: "/ledger",
    icon: BookOpen,
    description: "Issue Tracking",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="p-4 border-b border-border/50">
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
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        group relative overflow-hidden transition-all duration-200
                        hover:bg-secondary/80 hover:scale-[1.02]
                        ${isActive ? "bg-primary/10 border border-primary/30" : ""}
                      `}
                    >
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-3">
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
                          <div className="flex flex-col animate-fade-in">
                            <span
                              className={`
                                text-sm font-medium transition-colors
                                ${isActive ? "text-primary text-glow" : "text-foreground group-hover:text-primary"}
                              `}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
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

      {/* Legacy Threads */}
      <LegacyThreads collapsed={collapsed} />

      {/* System status footer */}
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-status-safe rounded-full pulse-cyan" />
            <span className="font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
