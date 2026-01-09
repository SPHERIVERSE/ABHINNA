"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { 
  Pencil, Trash2, UserPlus, X, Save, GraduationCap, Award,
  AlertTriangle, Briefcase, Star, Plus, CheckCircle2, Loader2 
} from "lucide-react";

type Faculty = {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  experience: number;
  categories: ("TEACHING" | "LEADERSHIP" | "MANAGEMENT")[];
  photo?: { fileUrl: string };
};

const CATEGORY_OPTIONS = ["TEACHING", "LEADERSHIP", "MANAGEMENT"];

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Faculty | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    name: "", designation: "", bio: "", photoUrl: "", experience: 0, categories: ["TEACHING"] 
  });

  const fetchFaculty = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFacultyList(data.facultyList);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const openEditModal = (member: Faculty) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      designation: member.designation,
      bio: member.bio || "",
      photoUrl: member.photo?.fileUrl || "",
      experience: member.experience,
      categories: member.categories
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photoUrl) return alert("Please upload a photo first");
    setLoading(true);
    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchFaculty();
        setIsFormOpen(false);
        setEditingId(null);
      }
    } catch (error) { alert("Failed to save profile"); } 
    finally { setLoading(false); }
  };

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat as any)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat as any]
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* 🟢 HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Faculty Directory</h1>
          <p className="text-slate-500 font-medium">Manage professional profiles and institutional roles</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: "", designation: "", bio: "", photoUrl: "", experience: 0, categories: ["TEACHING"] }); setIsFormOpen(true); }} className="bg-[#003153] text-white px-6 py-3 rounded-xl hover:bg-[#002540] transition-all shadow-xl flex items-center gap-2 font-bold">
          <UserPlus size={20} /> Add Member
        </button>
      </div>

      {/* 🟢 GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-12">
        {facultyList.map((member) => (
          <div 
            key={member.id} 
            onClick={() => setViewingMember(member)}
            className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#D4AF37] hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col relative"
          >
            {/* 🟢 FLOATING EXPERIENCE BADGE (Half-In, Half-Out) */}
            <div className="absolute top-0 right-6 z-[5] -translate-y-1/4">
               <div className="
               bg-[#D4AF37] text-[#003153] 
               w-14 h-16 md:w-16 md:h-20 py-8
               rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
               border-4 border-white 
               flex flex-col items-center justify-center 
               transition-transform
               ">
                  <div>
                  {/* Large Experience Number */}
                  <span className="text-2xl md:text-2xl font-black leading-none tracking-tighter">
                  {member.experience}
                  </span>
                  <span className="text-1xl md:text-1xl font-black leading-none tracking-tighter">+</span>
                  </div>
                  {/* Subtext Labels */}
                  <div className="flex flex-col items-center -mt-0.5 md: -py-0.5 -my-2">
                  <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest leading-none">Yrs</span>
                  <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-tighter opacity-80">Exp.</span>
                  </div>

                  {/* Subtle Polished Shine */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-xl pointer-events-none" />
               </div>
            </div>

            <div className="p-6 pt-12">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 group-hover:scale-105 transition-transform duration-500">
                    <img src={member.photo?.fileUrl || "/placeholder.jpg"} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex gap-1 items-end">
                    {member.categories.map(cat => (
                       <span key={cat} className="text-[8px] font-black px-2 py-1 my-8 rounded bg-slate-900 text-[#D4AF37] border border-slate-800 uppercase tracking-widest">
                          {cat}
                       </span>
                    ))}
                 </div>
              </div>
              <h3 className="font-extrabold text-xl text-slate-800 group-hover:text-[#003153] transition-colors">{member.name}</h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1 mb-4">{member.designation}</p>
              <p className="text-slate-500 text-sm line-clamp-2 italic leading-relaxed">"{member.bio}"</p>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center group-hover:bg-white transition-colors">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expertise Level</span>
               <div className="flex gap-1 group-hover:-translate-x-2 duration-300 transition-transform">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(member); }} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-200"><Pencil size={15}/></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeletingId(member.id); }} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 shadow-sm border border-transparent hover:border-slate-200"><Trash2 size={15}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 VIEW DETAILS MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
            <div className="bg-[#003153] p-8 text-white relative shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <div className="relative z-10 flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                     <div className="w-20 h-20 rounded-2xl border-4 border-white/10 overflow-hidden shadow-xl">
                        <img src={viewingMember.photo?.fileUrl} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <div className="flex gap-2 mb-2">
                           {viewingMember.categories.map(cat => (
                              <span key={cat} className="px-2 py-0.5 text-[9px] font-black rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">{cat}</span>
                           ))}
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight">{viewingMember.name}</h2>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">{viewingMember.designation}</p>
                     </div>
                  </div>
                  <button onClick={() => setViewingMember(null)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-transform hover:rotate-90"><X size={20} /></button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg"><Star size={20} /></div>
                     <div><p className="text-[10px] font-black text-slate-400 uppercase">Experience</p><p className="text-sm font-bold text-slate-700">{viewingMember.experience} Years</p></div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#003153] text-white flex items-center justify-center shadow-lg"><Briefcase size={20} /></div>
                     <div><p className="text-[10px] font-black text-slate-400 uppercase">Roles</p><p className="text-sm font-bold text-slate-700">{viewingMember.categories.length} Areas</p></div>
                  </div>
               </div>
               <div>
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Biography</h4>
                 <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">"{viewingMember.bio}"</div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 CREATE/EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full sm:w-[85%] md:w-[75%] lg:max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 border border-slate-100">
              <div className="bg-slate-50 p-5 md:p-6 border-b flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Modify Profile' : 'Register Member'}</h2>
                 <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                   {/* Photo Section with Blinking Loader */}
                   <div className="flex flex-col items-center justify-center space-y-4 bg-slate-50/50 rounded-2xl p-6 border-2 border-dashed border-slate-200 relative">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group">
                         {isUploading ? (
                            <div className="absolute inset-0 bg-[#003153]/80 flex flex-col items-center justify-center text-[#D4AF37] z-30 animate-pulse">
                               <Loader2 className="animate-spin mb-2" size={32} />
                               <span className="text-[10px] font-black uppercase tracking-tighter">Uploading...</span>
                            </div>
                         ) : (
                            <img src={form.photoUrl || "/placeholder.jpg"} className="w-full h-full object-cover" />
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <ImageUpload 
                               onUploadStart={() => setIsUploading(true)}
                               onUploadComplete={(url) => { setForm({...form, photoUrl: url}); setIsUploading(false); }} 
                            />
                         </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Profile Headshot</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Roles</label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORY_OPTIONS.map(cat => (
                              <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border-2 transition-all ${form.categories.includes(cat as any) ? 'bg-[#003153] border-[#003153] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}>
                                {cat}
                              </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Experience</label>
                         <input type="number" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-[#003153]" value={isNaN(form.experience) ? "" : form.experience} onChange={(e) => {const val = parseInt(e.target.value);setForm({ ...form, experience: isNaN(val) ? 0 : val });}} />
                      </div>
                   </div>

                   <div className="md:col-span-2 space-y-4">
                      <input required placeholder="Full Name" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:border-[#003153]" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                      <input required placeholder="Professional Designation" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:border-[#003153]" value={form.designation} onChange={(e) => setForm({...form, designation: e.target.value})} />
                      <textarea placeholder="Member Biography..." rows={4} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-medium text-slate-600 outline-none focus:border-[#003153]" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
                   </div>
                </form>
              </div>

              <div className="p-6 bg-slate-50 border-t shrink-0">
                 <button onClick={handleSubmit} disabled={loading || isUploading} className="w-full h-14 bg-[#003153] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#002540] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? "Saving Changes..." : <><Save size={20} className="text-[#D4AF37]" /> Save Profile</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 🔴 DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-100">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md"><AlertTriangle className="text-red-600" size={32} /></div>
             <h3 className="text-xl font-bold text-slate-800">Delete Profile?</h3>
             <p className="text-sm text-slate-500 mt-2 font-medium">This profile and all associated data will be removed permanently.</p>
             <div className="flex gap-4 mt-8">
               <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
               <button onClick={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${deletingId}`, { method: "DELETE", credentials: "include" });
                    if (res.ok) { setFacultyList(prev => prev.filter(f => f.id !== deletingId)); setDeletingId(null); }
                  } catch (err) { alert("Delete failed"); }
               }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/20">Delete</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}