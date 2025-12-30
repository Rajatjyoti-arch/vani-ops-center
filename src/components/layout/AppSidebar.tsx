import { UserCheck, Shield, Scale, BookOpen, Lock, Radio, Building, HelpCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { VaniLogo } from "@/components/ui/VaniLogo";
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
    title: "Credentialing",
    url: "/identity",
    icon: UserCheck,
    description: "Anonymous Authentication",
    tourId: "nav-identity",
  },
  {
    title: "Repository",
    url: "/vault",
    icon: Shield,
    description: "Evidence Archive",
    tourId: "nav-vault",
    protected: true,
  },
  {
    title: "Resolution Matrix",
    url: "/arena",
    icon: Scale,
    description: "Authentication Required",
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
  {
    title: "Help & Documentation",
    url: "/help",
    icon: HelpCircle,
    description: "Platform Guidelines",
    tourId: "nav-help",
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
            <div className={`transition-all duration-300 ${deadManActive ? "opacity-90" : ""
              }`}>
              <VaniLogo
                variant={collapsed ? "icon" : "full"}
                size={collapsed ? "sm" : "md"}
              />
            </div>
            <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full transition-colors ${deadManActive ? "bg-destructive" : "bg-accent"
              }`} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in flex-1">
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider mt-0.5">
                Anonymous Reporting System
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
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
