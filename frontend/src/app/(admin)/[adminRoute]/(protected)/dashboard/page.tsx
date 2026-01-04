"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, Image, Bell } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    visits: 0,
    users: 0,
    assets: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Real Data on Load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          credentials: "include", // Important for Auth
        });
        const data = await res.json();
        
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Define cards mapping to our state
  const statCards = [
    {
      label: "Total Visits",
      value: stats.visits.toLocaleString(), // Adds commas (e.g. 1,000)
      icon: BarChart3,
      color: "text-blue-900",
      bg: "bg-blue-50",
    },
    {
      label: "Registrations",
      value: stats.users.toLocaleString(),
      icon: Users,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      label: "Total Assets",
      value: stats.assets.toLocaleString(),
      icon: Image,
      color: "text-purple-700",
      bg: "bg-purple-50",
    },
    {
      label: "Active Alerts",
      value: stats.notifications.toLocaleString(),
      icon: Bell,
      color: "text-orange-700",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-blue-900">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-500">
          Quick snapshot of platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-800">
            System Status
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Operational
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Database connection is active. All services are running normally.
          </p>
        </div>
      </div>
    </div>
  );
}