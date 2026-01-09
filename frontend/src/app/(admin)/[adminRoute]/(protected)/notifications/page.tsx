"use client";

import { useState, useEffect } from "react";
import { 
  Bell, Trash2, Megaphone, Link as LinkIcon, 
  Plus, CheckCircle2, AlertCircle, Sparkles, X, Save, Clock
} from "lucide-react";

type Notification = {
  id: string;
  message: string;
  link?: string;
  type: "INFO" | "ALERT" | "NEW";
  isActive: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ message: "", link: "", type: "INFO" as const });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setList(data.notifications);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ message: "", link: "", type: "INFO" });
        await fetchNotifications();
      }
    } catch (err) { alert("Error posting update"); } 
    finally { setLoading(false); }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setList(prev => prev.map(n => n.id === id ? { ...n, isActive: !currentStatus } : n));
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
    } catch (err) { fetchNotifications(); }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "ALERT": return "bg-red-50 text-red-600 border-red-100";
      case "NEW": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* 🟢 HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Megaphone className="text-[#003153]" /> News Ticker
          </h1>
          <p className="text-slate-500 font-medium">Manage live updates and scrolling announcements</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 🟢 INPUT PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Plus size={20} className="text-[#003153]" /> Broadcast Update
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {["INFO", "ALERT", "NEW"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t as any })}
                      className={`py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${form.type === t ? 'border-[#003153] bg-[#003153] text-white shadow-lg' : 'border-slate-100 text-slate-400 bg-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Admission for Batch 2026 starts today!"
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-[#003153] transition-all"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target URL (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full border-2 border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:border-[#003153]"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003153] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-[#002540] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Clock className="animate-spin" size={18} /> : "Post Announcement"}
              </button>
            </form>
          </div>
        </div>

        {/* 🟢 TICKER FEED */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Feed</span>
             <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Live Connection</span>
          </div>

          <div className="space-y-3">
            {list.map((item) => (
              <div 
                key={item.id} 
                className={`group bg-white p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${!item.isActive ? 'opacity-50 grayscale border-slate-100' : 'border-slate-50 hover:border-[#D4AF37] shadow-sm hover:shadow-xl'}`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 p-2 rounded-xl border shrink-0 ${getTypeStyle(item.type)}`}>
                    {item.type === "ALERT" ? <AlertCircle size={18} /> : item.type === "NEW" ? <Sparkles size={18} /> : <Bell size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-tight mb-1">{item.message}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" className="text-[10px] font-bold text-blue-500 hover:text-[#003153] flex items-center gap-1 transition-colors">
                          <LinkIcon size={10} /> View Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                   <button
                     onClick={() => toggleStatus(item.id, item.isActive)}
                     className={`text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest transition-all ${item.isActive ? 'bg-[#003153] text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                   >
                     {item.isActive ? "VISIBLE" : "HIDDEN"}
                   </button>
                   <button 
                     onClick={() => setDeletingId(item.id)} 
                     className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}

            {list.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                   <Megaphone className="text-slate-200" size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm">No updates in the ticker feed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔴 DELETE CONFIRMATION */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <Trash2 className="text-red-600" size={28} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Remove Ticker?</h3>
             <p className="text-sm text-slate-500 mt-2 font-medium">This announcement will be permanently removed from all student views.</p>
             <div className="flex gap-4 mt-8">
               <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
               <button onClick={async () => {
                 try {
                   await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/${deletingId}`, { method: "DELETE", credentials: "include" });
                   setList(prev => prev.filter(n => n.id !== deletingId));
                   setDeletingId(null);
                 } catch (err) { alert("Delete failed"); }
               }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all">Delete</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}