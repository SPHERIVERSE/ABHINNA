"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, Users, Image as ImageIcon, 
  Video, BookOpen, ArrowUpRight, 
  PlusCircle, Globe, ShieldCheck, Activity, 
  Clock, AlertCircle, List 
} from "lucide-react";
import Link from "next/link";
import LogsModal from "@/components/admin/LogsModal"; // 🟢 Import the new Modal

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    visits: 0,
    assets: 0,
    courses: 0,
    videos: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]); 
  const [teamStats, setTeamStats] = useState<any[]>([]);   
  const [loading, setLoading] = useState(true);

  // 🟢 State for the Logs Modal
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentLogs(data.recentLogs || []);
          setTeamStats(data.teamStats || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        // Small delay to prevent layout thrashing on fast loads
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Platform Visits", value: stats.visits, icon: BarChart3, color: "text-[#003153]", bg: "bg-blue-50" },
    { label: "Active Courses", value: stats.courses, icon: BookOpen, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Media Assets", value: stats.assets, icon: ImageIcon, color: "text-purple-700", bg: "bg-purple-50" },
    { label: "Video Library", value: stats.videos, icon: Video, color: "text-[#D4AF37]", bg: "bg-amber-50" },
  ];

  // 泙 1. SKELETON LOADER (Professional UX)
  if (loading) {
    return (
      <div className="space-y-10 pb-10 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-40 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="h-40 bg-slate-100 rounded-3xl"></div>
            ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-64 bg-slate-100 rounded-[2rem]"></div>
            <div className="h-64 bg-slate-100 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* 2. LUXURY HEADER (Matching Homepage Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Command Center</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#003153] tracking-tighter">
            Admin Overview
          </h2>
          <p className="text-slate-500 font-medium mt-2 text-sm">Real-time administrative audit and team engagement metrics.</p>
        </div>
        <div className="flex gap-3">
          <Link href="assets" className="flex items-center gap-2 bg-[#003153] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-blue-900/20 hover:bg-[#002642] transition-all active:scale-95">
            <PlusCircle size={16} /> New Asset
          </Link>
          <a href="/" target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 text-[#003153] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-[#D4AF37]/50 transition-all">
            <Globe size={16} /> Live Site
          </a>
        </div>
      </div>

      {/* 泙 3. STATS GRID (Polished Hover Effects) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-slate-100 rounded-3xl p-6 relative group hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-500 shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                  <Icon size={24} />
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-300">
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#003153]" />
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-black text-[#003153] mt-1 tracking-tight">{(stat.value || 0).toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 泙 4. SYSTEM STATUS CARD (Visual Enhancement) */}
        <div className="lg:col-span-2 bg-[#003153] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#003153] to-[#001f35]" />
          
          {/* Animated Background Rings */}
          <div className="absolute -right-20 -top-20 w-80 h-80 border-[30px] border-white/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Systems Online</span>
                  </div>
                  <div className="h-px w-10 bg-white/10" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guwahati Central Node</span>
              </div>
              
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-2">Operations Normal</h3>
                <p className="text-blue-100/60 text-sm max-w-lg font-medium leading-relaxed">
                  Database synchronization and CDN latency are within optimal ranges. 
                  Currently tracking <b>{stats.visits.toLocaleString()}</b> real-time interactions across the platform.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm w-fit">
               <div className="flex -space-x-3">
                  {teamStats.slice(0, 3).map((admin, i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-[#003153] bg-[#D4AF37] flex items-center justify-center text-[10px] font-black text-[#003153] uppercase shadow-lg z-0 hover:z-10 hover:scale-110 transition-transform cursor-help" title={admin.username}>
                      {admin.username.substring(0, 2)}
                    </div>
                  ))}
                  {teamStats.length > 3 && (
                     <div className="h-10 w-10 rounded-full border-2 border-[#003153] bg-white flex items-center justify-center text-[10px] font-bold text-[#003153] shadow-lg">
                        +{teamStats.length - 3}
                     </div>
                  )}
               </div>
               <div className="flex flex-col">
                   <span className="text-lg font-black leading-none">{teamStats.length}</span>
                   <span className="text-[8px] font-bold text-blue-200/50 uppercase tracking-widest">Active Admins</span>
               </div>
            </div>
          </div>
          <ShieldCheck className="absolute -right-12 -bottom-12 h-64 w-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </div>

        {/* 泙 5. ACTIVITY LOGS (Updated with View All Button) */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm h-full flex flex-col">
           {/* 🟢 Updated Header */}
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-black text-[#003153] flex items-center gap-2 uppercase tracking-widest">
                <Activity size={16} className="text-[#D4AF37]" /> Security Audit
             </h3>
             {/* 🟢 View All Button */}
             <button 
                onClick={() => setShowLogsModal(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#003153] uppercase tracking-wider transition-colors"
             >
                View Full History <List size={12} />
             </button>
           </div>
           
           <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar flex-1">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="flex flex-col gap-1 items-center min-w-[60px]">
                    <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter w-full text-center shadow-sm
                      ${log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' : 
                        log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'}`}>
                      {log.action}
                    </div>
                    <span className="text-[6px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">{log.category}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate group-hover:text-[#003153]">{log.targetTitle || 'System Event'}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                        {log.adminName}
                        </p>
                        <p className="text-[9px] text-slate-300 ml-auto">
                           {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2">
                    <AlertCircle size={24} />
                    <p className="text-xs font-bold italic">No logs recorded</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 泙 6. TEAM LEADERBOARD */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
        <h3 className="text-sm font-black text-[#003153] mb-8 flex items-center gap-2 uppercase tracking-widest">
          <Users size={16} className="text-[#D4AF37]" /> Access Monitor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamStats.map((admin) => (
            <div key={admin.id} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl hover:bg-white hover:border-[#D4AF37]/30 border border-transparent hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 text-[#003153] flex items-center justify-center font-black text-sm group-hover:bg-[#003153] group-hover:text-[#D4AF37] transition-all z-10 shadow-sm">
                {admin.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 z-10">
                <p className="text-sm font-bold text-slate-700 group-hover:text-[#003153] transition-colors">{admin.username}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={10} className="text-slate-300 group-hover:text-[#D4AF37]" />
                  <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">
                    {admin.lastLogin ? (
                      <>
                        {new Date(admin.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        <span className="mx-1 opacity-30">|</span>
                        {new Date(admin.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </>
                    ) : 'No Login History'}
                  </p>
                </div>
              </div>
              <div className="text-right z-10 pl-4 border-l border-slate-200/50">
                <p className="text-xl font-black text-slate-300 group-hover:text-[#003153] transition-colors leading-none">{admin.totalVisits || 0}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 Render the Logs Modal outside the main grid */}
      <LogsModal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} admins={teamStats || []} />

    </div>
  );
}