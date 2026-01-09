"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, Calendar, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MousePointer2 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats?days=${days}`, {
          credentials: "include",
        });
        const json = await res.json();
        if (json.success) setData(json);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

  // Calculate Simple Growth (Current vs Start of period)
  const getGrowth = () => {
    if (!data?.trends || data.trends.length < 2) return 0;
    const first = data.trends[0].count;
    const last = data.trends[data.trends.length - 1].count;
    if (first === 0) return last * 100;
    return ((last - first) / first) * 100;
  };

  const growth = getGrowth();

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#003153] tracking-tight">Traffic Analytics</h2>
          <p className="text-slate-500 font-medium">Monitoring platform growth and visitor intent.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { label: "24h", val: 1 },
            { label: "7D", val: 7 },
            { label: "30D", val: 30 }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setDays(opt.val)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                days === opt.val 
                ? "bg-[#003153] text-white shadow-md" 
                : "text-slate-500 hover:text-[#003153]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Period Visits</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-slate-900">
              {data?.trends?.reduce((acc: number, curr: any) => acc + curr.count, 0).toLocaleString() || 0}
            </h4>
            <div className={`flex items-center text-xs font-bold mb-1 ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {growth >= 0 ? <TrendingUp size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(growth).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peak Daily Traffic</p>
          <h4 className="text-3xl font-bold text-slate-900">
            {Math.max(...(data?.trends?.map((t: any) => t.count) || [0])).toLocaleString()}
          </h4>
        </div>

        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement Rate</p>
          <h4 className="text-3xl font-bold text-slate-900">
            {((data?.stats?.notifications / (data?.stats?.visits || 1)) * 100).toFixed(2)}%
          </h4>
        </div>
      </div>

      {/* TRAFFIC CHART */}
      <div className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#003153]" /> Visitor Trend Line
          </h3>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Source: PageVisit Internal Logs
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.trends || []}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003153" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#003153" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                dy={10}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return days === 1 ? date.toLocaleTimeString([], {hour: '2-digit'}) : date.toLocaleDateString([], {day: 'numeric', month: 'short'});
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#003153" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorVisits)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}