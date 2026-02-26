import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/Sleek_SmartThinkerz_company_logo_on_dark_backgroun-17515430621_1771985098421.png";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  UserCircle,
  Palette,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/blog", label: "Blog", icon: FileText },
  { path: "/admin/clients", label: "Clients", icon: Users },
  { path: "/admin/team", label: "Team", icon: UserCog },
  { path: "/admin/branding", label: "Branding", icon: Palette },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, logoutPending } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Smarthinkerz" className="h-8 w-auto" data-testid="img-admin-logo" />
            <span className="text-white font-semibold text-sm">Studio Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  data-testid={`link-admin-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <Link href="/admin/profile">
            <div className={`px-3 py-2 mb-2 rounded-lg cursor-pointer transition-colors ${location === "/admin/profile" ? "bg-primary text-primary-foreground" : "hover:bg-slate-700"}`} data-testid="link-admin-profile">
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                <p className="text-sm font-medium" data-testid="text-admin-username">{user?.username}</p>
              </div>
              <p className="text-xs text-slate-400 capitalize ml-6">{user?.role}</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutPending}
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {logoutPending ? "Signing out..." : "Sign Out"}
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700 mt-1"
              data-testid="link-back-to-site"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
