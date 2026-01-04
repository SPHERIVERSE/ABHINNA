"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Users,
  Bell,
  BarChart3,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Assets", href: "assets", icon: Image },
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex w-64 bg-white border-r flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-lg font-bold text-blue-900">
            Coaching Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.endsWith(`/${item.href}`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-yellow-500" : "text-gray-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
            <LogOut size={18} className="text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <h1 className="text-sm font-medium text-gray-700">
            Admin Dashboard
          </h1>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

