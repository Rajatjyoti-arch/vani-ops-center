import { UserCheck, Shield, Scale, BookOpen, Lock, Radio, Building } from "lucide-react";
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
import { useDeadManSwitch } from "@/contexts/DeadManSwitchContext";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Building,
    description: "System Overview",
    tourId: "nav-command",
  },
  {
    title: "Anonymous Credentialing",
    url: "/identity",
    icon: UserCheck,
    description: "Secure Authentication",
    tourId: "nav-identity",
  },
  {
    title: "Evidence Repository",
    url: "/vault",
    icon: Shield,
    description: "Encrypted Storage",
    tourId: "nav-vault",
    protected: true,
  },
  {
    title: "Resolution Matrix",
    url: "/arena",
    icon: Scale,
    description: "Governance Process",
    tourId: "nav-arena",
    protected: true,
  },
  {
    title: "Compliance Log",
    url: "/ledger",
    icon: BookOpen,
    description: "Transparency Records",
    tourId: "nav-ledger",
  },
  {
    title: "Public Disclosure",
    url: "/public-ledger",
    icon: Radio,
    description: "Transparency Archive",
    tourId: "nav-public-ledger",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { ghostIdentity, isAuthenticated } = useGhostSession();
  const { isActive: deadManActive } = useDeadManSwitch();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={`border-r border-border/50 bg-sidebar transition-all duration-300 ${deadManActive ? "doomsday-mode" : ""}`}>
      <SidebarHeader className="p-4 border-b border-border/50" data-tour="logo">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              deadManActive 
                ? "bg-destructive/20" 
                : "bg-primary/20"
            }`}>
              {/* Institutional Seal Placeholder */}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                deadManActive ? "border-destructive text-destructive" : "border-primary text-primary"
              }`}>
                <span className="font-bold text-xs">SEAL</span>
              </div>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-colors ${
              deadManActive ? "bg-destructive" : "bg-accent"
            }`} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-semibold text-base text-sidebar-foreground tracking-wide">VANI</h1>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">
                Institutional Reporting
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
                        hover:bg-sidebar-accent
                        ${isActive ? "bg-sidebar-accent border-l-2 border-sidebar-primary" : ""}
                        ${isLocked ? "opacity-60" : ""}
                      `}
                    >
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-3" data-tour={item.tourId}>
                        <div
                          className={`
                            p-2 rounded-md transition-all duration-200
                            ${isActive 
                              ? "bg-sidebar-primary/20 text-sidebar-primary" 
                              : "bg-sidebar-accent text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                            }
                          `}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        {!collapsed && (
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`
                                  text-sm font-medium transition-colors
                                  ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-primary"}
                                `}
                              >
                                {item.title}
                              </span>
                              {isLocked && <Lock className="w-3 h-3 text-sidebar-foreground/40" />}
                            </div>
                            <span className="text-[10px] text-sidebar-foreground/50">
                              {isLocked ? "Authentication Required" : item.description}
                            </span>
                          </div>
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

      {/* Emergency Disclosure Switch */}
      <DeadManSwitch collapsed={collapsed} />

      <LegacyThreads collapsed={collapsed} />

      {/* Settings Panel */}
      <div data-tour="settings">
        <SettingsPanel collapsed={collapsed} />
      </div>

      {/* System status footer */}
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {isAuthenticated && ghostIdentity ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sidebar-foreground">{ghostIdentity.ghost_name}</span>
                <span className="text-sidebar-foreground/50">Authenticated</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
              <div className="w-2 h-2 bg-status-warning rounded-full" />
              <span>Not Authenticated</span>
            </div>
          )}
        </div>
      )}
    </Sidebar>
  );
}
