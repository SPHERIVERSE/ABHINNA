"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  Users,
  Bell,
  BarChart3,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Assets", href: "assets", icon: ImageIcon },
  { label: "Courses", href: "courses", icon: BookOpen },
  { label: "Faculty", href: "faculty", icon: Users },
  { label: "Notifications", href: "notifications", icon: Bell },
  { label: "Analytics", href: "analytics", icon: BarChart3 },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ LOGOUT LOGIC
  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
      });
      if (res.ok) {
        // Redirect to the public home or login page after clearing session
        router.push("/"); 
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 🔹 SIDEBAR */}
      {/* Removed harsh black borders; using subtle slate-200 */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col">
        
        {/* ✅ BRAND LOGO AREA */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-20 rounded-[15%] overflow-hidden shadow-sm border border-white">
              <img src="/logo.jpg" alt="Icon" className="w-full h-full object-contain" />
            </div>
            <div>
            <img src="/brand.jpg" alt="Abhinna" className="h-8 object-contain" />
            <p className="font-script text-[#D4AF37] text-xs tracking-tight italic">
              A destination of Art & Academia
            </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            // Updated active logic to handle nested routes properly
            const active = pathname.includes(`/${item.href}`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#003153] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-[#D4AF37]" : "text-slate-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ✅ LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={30} />
            Logout 
          </button>
        </div>
      </aside>

      {/* 🔹 MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h1>
          
          {/* Quick Stats or User Profile could go here */}
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                ADM
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}