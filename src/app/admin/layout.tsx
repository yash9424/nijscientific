"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  Users,
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  Star
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Hero Section", href: "/admin/hero", icon: ImageIcon },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    // Simple Auth Check
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('admin_session='));
    
    if (!sessionCookie) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-deep-twilight-100 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-deep-twilight-200 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-6">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-french-blue to-bright-teal-blue">
              Nij Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-french-blue/10 dark:bg-sky-aqua/10 text-french-blue dark:text-sky-aqua shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-deep-twilight-300 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-deep-twilight-300 rounded-xl transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              Toggle Theme
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
        {/* Top Header for Mobile */}
        <header className="lg:hidden h-16 bg-white dark:bg-deep-twilight-200 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-deep-twilight-300 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
