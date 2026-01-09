"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, MessageSquare, User, Quote } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks);
    } catch (error) {
      console.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });
      if (res.ok) fetchFeedback();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchFeedback();
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-black text-[#003153] tracking-tight">Student Feedback</h2>
        <p className="text-slate-500 font-medium">Manage testimonials and reviews for the homepage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((item) => (
          <div key={item.id} className={`bg-white border-2 rounded-[2rem] p-6 transition-all duration-300 relative overflow-hidden ${item.isFeatured ? 'border-[#D4AF37] shadow-lg' : 'border-slate-50 shadow-sm'}`}>
            
            {/* 🟢 FEATURED BADGE */}
            {item.isFeatured && (
              <div className="absolute top-0 right-10 bg-[#D4AF37] text-[#003153] px-4 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-widest">
                Featured on Site
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[#003153]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-slate-50 -z-0" />
              <p className="text-slate-600 text-sm leading-relaxed italic relative z-10 pl-4">
                {item.comment || "No comment provided."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Submitted: {new Date(item.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleFeatured(item.id, item.isFeatured)}
                  className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
                    item.isFeatured 
                    ? "bg-[#D4AF37] text-[#003153]" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Star size={16} className={item.isFeatured ? "fill-[#003153]" : ""} />
                  {item.isFeatured ? "Featured" : "Feature"}
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} // 🟢 Attach the function here
                  className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
          <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">No student feedback records found yet.</p>
        </div>
      )}
    </div>
  );
}