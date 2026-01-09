"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, BookOpen, Trash2, Edit2, X, Save, AlertTriangle, ArrowRight, Layers } from "lucide-react";

type Batch = {
  id: string;
  name: string;
  courseId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  course: { 
    title: string;
    subCategory: string; // From modular backend update
  };
};

type Course = { 
  id: string; 
  title: string; 
  subCategory: string; 
  category: string;
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    courseId: "", 
    startDate: "", 
    endDate: "" 
  });

  const fetchData = async () => {
    try {
      const batchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches`, { credentials: "include" });
      const batchData = await batchRes.json();
      if (batchData.success) setBatches(batchData.batches);

      const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, { credentials: "include" });
      const courseData = await courseRes.json();
      if (courseData.success) setCourses(courseData.courses);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseId) return alert("Please select a course");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchData();
        setForm({ name: "", courseId: "", startDate: "", endDate: "" });
        setIsCreateOpen(false);
      }
    } catch (error) { alert("Failed to create batch"); } 
    finally { setLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches/${editingBatch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editingBatch.name,
          startDate: editingBatch.startDate,
          endDate: editingBatch.endDate,
          isActive: editingBatch.isActive
        }),
      });
      if (res.ok) {
        await fetchData();
        setEditingBatch(null);
      }
    } catch (error) { alert("Failed to update"); }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBatches(batches.filter(b => b.id !== deletingId));
        setDeletingId(null);
      }
    } catch (error) { alert("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* 🟢 HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Batch Management</h1>
          <p className="text-slate-500 font-medium">Schedule and organize academic sessions</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#003153] text-white px-6 py-3 rounded-xl hover:bg-[#002540] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 font-bold"
        >
          <Users size={20} /> New Batch
        </button>
      </div>

      {/* 🟢 CREATE FORM (MODULAR DESIGN) */}
      {isCreateOpen && (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 mb-10 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#003153]">
                   <Calendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Launch New Batch</h2>
             </div>
             <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <X size={20} />
             </button>
          </div>

          <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Batch Name</label>
              <input required type="text" placeholder="e.g. June 2026 - Morning Session" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-medium" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Program</label>
              <select 
                required 
                className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153]"
                value={form.courseId}
                onChange={(e) => setForm({...form, courseId: e.target.value})}
              >
                <option value="">-- Choose Course --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.subCategory} | {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Start</label>
              <input required type="date" className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 outline-none bg-white font-medium focus:border-[#003153]" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Completion</label>
              <input type="date" className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 outline-none bg-white font-medium focus:border-[#003153]" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1 pt-2 flex items-end">
               <button 
                  type="submit" 
                  disabled={loading} 
                  className="relative w-full h-14 bg-[#003153] text-white font-bold text-sm uppercase tracking-widest rounded-xl border-b-4 border-[#001a2c] shadow-lg hover:bg-[#003d66] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 transition-all duration-200 group/btn overflow-hidden"
               >
                 <div className="flex items-center justify-center gap-2">
                    {loading ? <span className="text-[#D4AF37] animate-pulse">Initializing...</span> : <><span>Launch Batch</span><ArrowRight size={18} className="text-[#D4AF37] group-hover/btn:translate-x-1 transition-transform" /></>}
                 </div>
               </button>
            </div>
          </form>
        </div>
      )}

      {/* 🟢 BATCHES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {batches.map((batch) => (
          <div 
            key={batch.id} 
            className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#D4AF37] hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative"
          >
            <div className="px-6 pt-6 flex justify-between items-start">
               <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${batch.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${batch.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {batch.isActive ? 'Ongoing' : 'Closed'}
               </div>
               <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest bg-slate-900 px-2.5 py-1 rounded border border-slate-800 shadow-sm">
                  {batch.course?.subCategory || 'General'}
               </span>
            </div>

            <div className="p-6 pt-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-[#003153]">
                    <BookOpen size={12} />
                 </div>
                 <p className="text-[11px] font-bold text-blue-900/60 uppercase tracking-tight truncate">
                    {batch.course?.title || "Unknown Program"}
                 </p>
              </div>

              <h3 className="font-extrabold text-xl text-slate-800 mb-6 group-hover:text-[#003153] transition-colors leading-tight">
                {batch.name}
              </h3>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} className="text-[#D4AF37]" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Start</span>
                   </div>
                   <span className="text-xs font-bold text-slate-700">
                      {new Date(batch.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                   </span>
                </div>
                {batch.endDate && (
                   <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 text-slate-400">
                         <div className="w-[14px] h-[1px] bg-slate-300" />
                         <span className="text-[10px] font-black uppercase tracking-tighter">End</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                         {new Date(batch.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                   </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {batch.id.slice(0,6)}</span>
              <div className="flex items-center gap-1 transition transform group-hover:-translate-x-2 duration-300">
                <button onClick={() => setEditingBatch(batch)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition shadow-sm border border-transparent hover:border-slate-200 cursor-pointer"><Edit2 size={15} /></button>
                <button onClick={() => setDeletingId(batch.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition shadow-sm border border-transparent hover:border-slate-200 cursor-pointer"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ${batch.isActive ? 'bg-green-500 w-full' : 'bg-slate-300 w-full opacity-50'}`} />
          </div>
        ))}
      </div>

      {/* 🟢 EDIT MODAL */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="bg-[#003153] p-6 text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg"><Edit2 size={20} className="text-[#D4AF37]" /></div>
                  <h3 className="text-lg font-bold">Edit Batch Details</h3>
               </div>
               <button onClick={() => setEditingBatch(null)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Name</label>
                <input className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] font-bold text-slate-700" value={editingBatch.name} onChange={(e) => setEditingBatch({...editingBatch, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                    <input type="date" className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-600" value={editingBatch.startDate ? new Date(editingBatch.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingBatch({...editingBatch, startDate: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
                    <input type="date" className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-600" value={editingBatch.endDate ? new Date(editingBatch.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingBatch({...editingBatch, endDate: e.target.value})} />
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${editingBatch.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}><Layers size={18} /></div>
                   <span className="text-sm font-bold text-slate-700">Admission Open</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={editingBatch.isActive} onChange={(e) => setEditingBatch({...editingBatch, isActive: e.target.checked})} />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#003153] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <button type="submit" className="w-full bg-[#003153] text-white py-4 rounded-xl font-bold shadow-xl flex justify-center items-center gap-3 hover:bg-[#002540] transition-all">
                <Save size={20} className="text-[#D4AF37]" /> Save Schedule Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-100">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md"><AlertTriangle className="text-red-600" size={32} /></div>
             <h3 className="text-xl font-bold text-slate-800">Delete Batch?</h3>
             <p className="text-sm text-slate-500 mt-2 font-medium">This action cannot be undone. All schedule data will be lost.</p>
             <div className="flex gap-4 mt-8">
               <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
               <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">Confirm</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}