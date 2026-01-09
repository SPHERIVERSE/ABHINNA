"use client";

import { useState, useEffect } from "react";
import { 
  X, ChevronLeft, ChevronRight, 
  Filter, Loader2, Calendar, User, Tag, Shield 
} from "lucide-react";

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admins: any[]; // 🟢 Prop to populate Admin Dropdown
}

// Common categories in your system
const CATEGORIES = [
  "ALL",
  "ASSET",
  "VIDEO",
  "COURSE",
  "BATCH",
  "FACULTY",
  "NOTIFICATION",
  "SYSTEM",
];


export default function LogsModal({ isOpen, onClose, admins }: LogsModalProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🟢 Filter States
  const [selectedAdmin, setSelectedAdmin] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🟢 Fetch Logic (Triggered when any filter changes)
  useEffect(() => {
    if (!isOpen) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "10");

        // Append filters only if they are active
        if (selectedAdmin !== "ALL") params.append("adminId", selectedAdmin);
        if (selectedCategory !== "ALL") params.append("category", selectedCategory);
        if (selectedAction !== "ALL") params.append("action", selectedAction);
        if (selectedDate) params.append("date", selectedDate);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logs?${params.toString()}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setLogs(data.logs);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error("Fetch Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isOpen, page, selectedAdmin, selectedCategory, selectedAction, selectedDate]);

  // Reset page when filters change
  const handleFilterChange = (setter: any, value: string) => {
    setter(value);
    setPage(1); // Always reset to page 1 on filter change
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FDFBF7]">
          <div>
            <h3 className="text-xl font-black text-[#003153] uppercase tracking-tighter">System Audit Log</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Filtered History View</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        {/* 🟢 FILTER TOOLBAR (Grid Layout) */}
        <div className="p-5 bg-white border-b border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* 1. Admin Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               <User size={10} /> Admin User
            </label>
            <select 
              value={selectedAdmin}
              onChange={(e) => handleFilterChange(setSelectedAdmin, e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#003153] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Admins</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.username}>{admin.username}</option>
              ))}
            </select>
          </div>

          {/* 2. Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               <Tag size={10} /> Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#003153] focus:outline-none focus:border-[#D4AF37]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat === "ALL" ? "All Categories" : cat}</option>
              ))}
            </select>
          </div>

          {/* 3. Action Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               <Shield size={10} /> Action Type
            </label>
            <select 
              value={selectedAction}
              onChange={(e) => handleFilterChange(setSelectedAction, e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#003153] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>

          {/* 4. Date Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               <Calendar size={10} /> Specific Date
            </label>
            <div className="relative">
                <input 
                type="date"
                value={selectedDate}
                onChange={(e) => handleFilterChange(setSelectedDate, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#003153] focus:outline-none focus:border-[#D4AF37] uppercase"
                />
                {selectedDate && (
                    <button 
                        onClick={() => handleFilterChange(setSelectedDate, "")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-slate-200 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                    >
                        <X size={10} />
                    </button>
                )}
            </div>
          </div>

        </div>

        {/* DATA TABLE */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Applying Filters...</span>
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-[#D4AF37]/30 hover:shadow-lg transition-all group flex flex-col md:flex-row gap-4 items-start md:items-center">
                  
                  {/* Action Badge */}
                  <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center
                    ${log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600' : 
                      log.action === 'DELETE' ? 'bg-red-50 text-red-600' : 
                      'bg-blue-50 text-blue-600'}`}>
                    {log.action}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-black text-[#003153]">{log.targetTitle || "System Operation"}</p>
                    <div className="flex flex-wrap gap-4 items-center">
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          <Tag size={10} /> {log.category}
                       </span>
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <User size={10} /> {log.adminName}
                       </span>
                       <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Calendar size={10} /> {new Date(log.createdAt).toLocaleString()}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
               <Filter size={32} className="opacity-20" />
               <p className="text-sm font-bold italic">No logs found for selected filters.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Page {page} of {totalPages}
           </span>
           <div className="flex gap-2">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="p-2 rounded-lg border border-slate-200 hover:bg-[#003153] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
             >
               <ChevronLeft size={16} />
             </button>
             <button 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="p-2 rounded-lg border border-slate-200 hover:bg-[#003153] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
             >
               <ChevronRight size={16} />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}