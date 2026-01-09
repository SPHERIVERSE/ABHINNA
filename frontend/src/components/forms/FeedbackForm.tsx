"use client";

import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({ name: "", comment: "", rating: 5 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if this device already sent feedback
  useEffect(() => {
    if (localStorage.getItem("feedback_sent")) {
      setIsSubmitted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        localStorage.setItem("feedback_sent", "true"); // Prevent immediate re-submission
        setFormData({ name: "", comment: "", rating: 5 }); // 🟢 Clear form data
      }
    } catch (error) {
      console.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 SUCCESS STATE: Shows the "Successfully Submitted" view
  if (isSubmitted) {
    return (
      <div className="bg-[#D4AF37] text-[#003153] p-10 rounded-[2.5rem] text-center space-y-4 animate-in fade-in zoom-in">
        <div className="h-16 w-16 bg-[#003153] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black">Submission Successful!</h3>
        <p className="font-bold opacity-80">
          Thank you for your valuable feedback. It has been sent for admin review.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)} 
          className="text-xs underline font-black uppercase tracking-widest mt-4 opacity-50 hover:opacity-100"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-6 text-left border-t-4 border-[#D4AF37]">
      <div className="space-y-4">
        {/* Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={24} 
                onClick={() => setFormData({...formData, rating: s})}
                className={`cursor-pointer transition-colors ${s <= formData.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-200"}`}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
          <input
            required
            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#003153] p-4 rounded-2xl outline-none transition-all font-bold text-[#003153]"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Comment */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
          <textarea
            rows={3}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#003153] p-4 rounded-2xl outline-none transition-all font-medium text-slate-600 resize-none"
            placeholder="Share your experience with us..."
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-[#003153] text-[#D4AF37] py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "Sending..." : <><Send size={18} /> Send Feedback</>}
      </button>
    </form>
  );
}