"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, X, Save, AlertTriangle, BookOpen, GraduationCap, Briefcase, ArrowRight, Layers, Clock } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string;
  category: "ENTRANCE" | "ACADEMIC";
  subCategory?: string;
  stream: "NONE" | "COMMERCE" | "SCIENCE" | "ARTS";
  duration?: string;
  isActive: boolean;
  _count?: { batches: number };
};

const SUB_CATEGORIES = {
  ENTRANCE: ["UGC-NET", "NTA-SLET", "PhD Entrance", "JRF", "Competitive Exam"],
  ACADEMIC: ["HS (Higher Secondary)", "Degree (B.A/B.Sc)", "PG (Post Graduate)", "Diploma"]
};

const CATEGORIES = [
  { label: "Entrance / Competitive (UGC-NET, PhD)", value: "ENTRANCE" },
  { label: "Academic / Studies (HS, Degree)", value: "ACADEMIC" },
];

const STREAMS = [
  { label: "None / General", value: "NONE" },
  { label: "Science", value: "SCIENCE" },
  { label: "Arts", value: "ARTS" },
  { label: "Commerce", value: "COMMERCE" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🟢 UI STATES
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    title: "",
    description: "",
    category: "ENTRANCE",
    subCategory: "UGC-NET",
    stream: "NONE",
    duration: ""
  });

  // 1. Fetch Data
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCourses(); }, []);

  // 2. Create Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchCourses();
        setForm({ title: "", description: "", category: "ENTRANCE",subCategory: "UGC-NET", stream: "NONE", duration: "" });
        setIsCreateOpen(false);
      }
    } catch (error) { alert("Failed to create"); } 
    finally { setLoading(false); }
  };

  // 3. Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          isActive: editingCourse.isActive,
          category: editingCourse.category,
          subCategory: editingCourse.subCategory,
          stream: editingCourse.stream,
          duration: editingCourse.duration
        }),
      });
      if (res.ok) {
        setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
        setEditingCourse(null);
      }
    } catch (error) { alert("Failed to update"); }
  };

  // 4. Delete Handler
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== deletingId));
        setDeletingId(null);
      }
    } catch (error) { alert("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses Directory</h1>
          <p className="text-slate-500 text-sm">Manage academic programs and batches</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#003153] text-white px-5 py-2.5 rounded-lg hover:bg-[#002540] transition shadow-lg flex items-center gap-2 font-medium"
        >
          <BookOpen size={18} /> Add Course
        </button>
      </div>

      {/* 🟢 CREATE FORM (PROFESSIONAL MODULAR VIEW) */}
      {isCreateOpen && (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 mb-10 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#003153]">
                   <Layers size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">New Program Setup</h2>
             </div>
             <button 
                onClick={() => setIsCreateOpen(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"
             >
                <X size={20} />
             </button>
          </div>

          <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-6">
            {/* Primary Details Row */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Title / Subject</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Political Science or Mathematics" 
                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-medium" 
                value={form.title} 
                onChange={(e) => setForm({...form, title: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 6 Months" 
                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-medium" 
                value={form.duration} 
                onChange={(e) => setForm({...form, duration: e.target.value})} 
              />
            </div>

            {/* Classification Section */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Program Category</label>
                  <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                     <button 
                        type="button" 
                        onClick={() => setForm({...form, category: 'ENTRANCE', subCategory: SUB_CATEGORIES.ENTRANCE[0]})} 
                        className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${form.category === 'ENTRANCE' ? 'bg-[#003153] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                        ENTRANCE
                     </button>
                     <button 
                        type="button" 
                        onClick={() => setForm({...form, category: 'ACADEMIC', subCategory: SUB_CATEGORIES.ACADEMIC[0]})} 
                        className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${form.category === 'ACADEMIC' ? 'bg-[#003153] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                        ACADEMIC
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Specific Level</label>
                <select 
                  className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153] transition-all" 
                  value={form.subCategory} 
                  onChange={(e) => setForm({...form, subCategory: e.target.value})}
                >
                    {SUB_CATEGORIES[form.category as keyof typeof SUB_CATEGORIES].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Stream</label>
               <select 
                  className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153] transition-all" 
                  value={form.stream} 
                  onChange={(e) => setForm({...form, stream: e.target.value as any})}
                >
                 {STREAMS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
               </select>
            </div>

            {/* Description Row */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Description</label>
              <textarea 
                required 
                rows={3}
                placeholder="Provide a professional summary of the course for prospective students..." 
                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-medium" 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
              />
            </div>

            {/* Submission Button */}
            <div className="md:col-span-3 pt-2">
               <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#003153] text-white py-4 rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#002540] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
               >
                 {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                 ) : (
                    <>
                      <Save size={18} />
                      Publish Program
                    </>
                 )}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* 🟢 COURSES GRID - REFINED MODULAR VIEW */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div 
            key={course.id} 
            onClick={() => setViewingCourse(course)}
            className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col overflow-hidden relative cursor-pointer"
          >
            {/* Top Interactive Bar */}
            <div className="px-6 pt-6 flex justify-between items-start">
               <div className={`p-2.5 rounded-xl shadow-sm ${course.category === 'ENTRANCE' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  {course.category === 'ENTRANCE' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
               </div>
               
               <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${course.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {course.isActive ? 'Live' : 'Draft'}
                  </div>
               </div>
            </div>

            <div className="p-6 pt-4 flex-1">
              {/* Modular Metadata Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                 <span className="px-2 py-1 rounded-md bg-slate-900 text-[#D4AF37] text-[10px] font-bold uppercase tracking-tighter border border-slate-800">
                    {course.subCategory}
                 </span>
                 {course.stream !== "NONE" && (
                    <span className="px-2 py-1 rounded-md bg-white text-slate-500 text-[10px] font-bold uppercase border border-slate-200 shadow-sm">
                      {course.stream} Stream
                    </span>
                 )}
              </div>

              <h3 className="font-extrabold text-xl text-slate-800 mb-2 group-hover:text-[#003153] transition-colors leading-tight">
                {course.title}
              </h3>

              {course.duration && (
                <div className="flex items-center gap-1.5 text-amber-600 mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                   <p className="text-[11px] font-bold uppercase tracking-tight">{course.duration}</p>
                </div>
              )}

              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                {course.description}
              </p>
            </div>

            {/* Footer Console */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-1">
                    {[...Array(Math.min(course._count?.batches || 0, 3))].map((_, i) => (
                       <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-[#003153] flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                       </div>
                    ))}
                 </div>
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                   {course._count?.batches || 0} {course._count?.batches === 1 ? 'Batch' : 'Batches'}
                 </span>
              </div>

              <div className="flex items-center gap-1 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button 
                   onClick={(e) => { e.stopPropagation(); setEditingCourse(course); }} 
                   className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 hover: transform hover:scale-130" 
                   title="Quick Edit"
                 >
                   <Edit2 size={14} />
                 </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingId(course.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 hover: transform hover:scale-130"
                    title="Remove Program"
                  >
                    <Trash2 size={14} />
                  </button>
              </div>
            </div>

            {/* Professional Accent Border (Hover) */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#003153] group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* 🟢 EDIT MODAL - REFINED MODULAR VIEW */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            
            {/* ================= HEADER (STICKY) ================= */}
            <div className="bg-[#003153] p-6 text-white flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Edit2 size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Modify Program</h3>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">
                    ID: {editingCourse.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* ================= SCROLLABLE CONTENT ================= */}
            <form
              onSubmit={handleUpdate}
              className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-6"
            >
              {/* Program Title */}
              <div className="col-span-2 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Program Title
                </label>
                <input
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-bold text-slate-700"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, title: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Primary Category
                </label>
                <select
                  className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153]"
                  value={editingCourse.category}
                  onChange={(e) => {
                    const newCat = e.target.value as "ENTRANCE" | "ACADEMIC";
                    setEditingCourse({
                      ...editingCourse,
                      category: newCat,
                      subCategory: SUB_CATEGORIES[newCat][0],
                    });
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Specific Level
                </label>
                <select
                  className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153]"
                  value={editingCourse.subCategory || ""}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      subCategory: e.target.value,
                    })
                  }
                >
                  {SUB_CATEGORIES[
                    editingCourse.category as keyof typeof SUB_CATEGORIES
                  ].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Academic Stream
                </label>
                <select
                  className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 outline-none bg-white font-bold text-slate-700 text-sm focus:border-[#003153]"
                  value={editingCourse.stream || ""}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      stream: e.target.value as any,
                    })
                  }
                >
                  {STREAMS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Duration
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className="w-full border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#003153] transition-all font-bold text-slate-700"
                    placeholder="e.g., 5–6 months"
                    value={editingCourse.duration || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Public Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#003153] transition-all font-medium text-slate-600"
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Visibility */}
              <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      editingCourse.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Program Status
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Control course visibility
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editingCourse.isActive}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      isActive: e.target.checked,
                    })
                  }
                />
              </div>
            </form>

            {/* ================= FOOTER (STICKY) ================= */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 z-20">
              <button
                type="submit"
                form="update-form"
                className="w-full bg-[#003153] text-white py-4 rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#002540] transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
              >
                <Save size={20} className="text-[#D4AF37]" />
                Update Program Details
              </button>
            </div>

          </div>
        </div>
      )}


      {/* 🟢 VIEW DETAILS MODAL - BALANCED & RESPONSIVE */}
      {viewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-[85%] md:w-[75%] lg:max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
            
            {/* Modal Header - Fixed Height */}
            <div className="bg-[#003153] p-5 md:p-8 text-white relative shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-widest border ${viewingCourse.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                          {viewingCourse.isActive ? '• Live' : '• Draft'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          {viewingCourse.category}
                        </span>
                     </div>
                     <button onClick={() => setViewingCourse(null)} className="bg-white/10 hover:bg-red-500/20 p-2 rounded-full transition-all hover:rotate-90 cursor-pointer">
                        <X size={20} />
                     </button>
                  </div>
                  <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">{viewingCourse.subCategory}</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">{viewingCourse.title}</h2>
               </div>
            </div>
            
            {/* Modal Body - Professional Scrolling Area */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
               
               {/* Modular Info Grid - 3 columns on desktop, 1 on mobile for clarity */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 sm:border-none sm:bg-transparent">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Academic Stream</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-sm font-bold text-slate-700">
                          {!viewingCourse.stream || viewingCourse.stream === 'NONE' ? "GENERAL" : viewingCourse.stream}
                        </p>
                     </div>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 sm:border-none sm:bg-transparent">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Program Level</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <p className="text-sm font-bold text-slate-700">{viewingCourse.subCategory}</p>
                     </div>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 sm:border-none sm:bg-transparent">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Duration</p>
                     <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <p className="text-sm font-bold text-slate-700">{viewingCourse.duration || 'Flexible'}</p>
                     </div>
                  </div>
               </div>

               {/* Description Section */}
               <div className="space-y-3">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} className="text-[#003153]" /> Program Curriculum & Overview
                 </h4>
                 <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                    <p className="text-slate-600 leading-relaxed text-sm text-base font-medium">
                       {viewingCourse.description}
                    </p>
                 </div>
               </div>

               {/* Stats & Batch Summary */}
               <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <div className="w-full sm:flex-1 bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                     <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Batches</p>
                        <h5 className="text-3xl font-black text-white leading-none">
                           {viewingCourse._count?.batches || 0}
                        </h5>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <BookOpen className="text-[#D4AF37]" size={24} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer - Static Quick Action */}
            <div className="p-5 md:p-8 bg-slate-50 border-t border-slate-200 shrink-0">
               <button className="w-full py-4 bg-[#003153] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#002540] transition-all hover:shadow-xl active:scale-[0.98] group hover: cursor-pointer">
                  <span className="uppercase tracking-widest">Manage Course Batches</span>
                  <ArrowRight size={20} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔴 DELETE CONFIRM MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
             <div className="text-center">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" /></div>
               <h3 className="text-lg font-bold">Delete Course?</h3>
               <p className="text-sm text-slate-500 mt-2">This will remove the course and associated data permanently.</p>
               <div className="flex gap-3 mt-6">
                 <button onClick={() => setDeletingId(null)} className="flex-1 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
