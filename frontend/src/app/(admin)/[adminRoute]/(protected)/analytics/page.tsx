"use client";

import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-blue-900">Analytics</h2>
        <p className="text-sm text-gray-500">Traffic and usage insights</p>
      </div>

      <div className="bg-white border rounded-xl p-6 text-center">
        <BarChart3 size={32} className="mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Analytics data will appear here.
        </p>
      </div>
    </div>
  );
}

