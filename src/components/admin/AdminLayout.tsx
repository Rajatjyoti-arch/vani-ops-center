import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Bell
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { CUJLogo } from "@/components/ui/CUJLogo";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Pending Resolutions", url: "/admin/resolutions", icon: FileCheck },
  { title: "Personnel Management", url: "/admin/personnel", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="text-emerald-500">
              <CUJLogo size={40} />
            </div>
            <div>
              <h1 className="font-semibold text-white text-sm">CUJ Admin Portal</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                Administrative Oversight
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              Administrative Oversight Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/10 border border-emerald-600/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">System Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
