"use client";

import { useState } from "react";
import { User, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FacultyCard({ f }: { f: any }) {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="snap-start flex-shrink-0 w-[280px] md:w-[320px] group relative bg-white rounded-[2.5rem] shadow-xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#D4AF37]/30">
      
      {/* 🖼️ PHOTO CONTAINER */}
      <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
        <img 
          src={f.photo?.fileUrl} 
          alt={f.name} 
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />

        {/* 🟢 EXPERIENCE BADGE (Floating Design) */}
        {f.experience && (
          <div className="absolute top-6 left-6 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md w-14 h-14 rounded-2xl shadow-lg border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:scale-110 transition-all duration-500">
            <span className="text-[#003153] font-black text-xl leading-none">
              {f.experience}+
            </span>
            <span className="text-[7px] font-bold text-[#003153]/60 uppercase tracking-tighter group-hover:text-[#003153]">
              Yrs Exp
            </span>
          </div>
        )}
        
        {/* SCROLLABLE BIO OVERLAY */}
        <div className={cn(
          "absolute inset-0 bg-[#003153]/95 backdrop-blur-md p-6 flex flex-col transition-all duration-500 z-30",
          showBio ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
          <div className="flex items-center gap-2 mb-4 shrink-0 border-b border-white/10 pb-3">
            <GraduationCap size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px]">Faculty Profile</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pointer-events-auto">
            <div className="space-y-4">
               <h4 className="text-white font-black text-lg leading-tight">{f.name}</h4>
              <p className="text-slate-200 text-sm leading-relaxed font-medium pb-4">
                {f.bio || "Leading academic mentor dedicated to student success and specialized subject mastery at Abhinna Institute."}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37] translate-x-8 -translate-y-8 rotate-45 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500" />
      </div>

      {/* 📝 INFO AREA */}
      <div className="p-8 text-center relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#003153] text-[#D4AF37] px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border border-[#D4AF37]/30 whitespace-nowrap z-20">
          {f.categories?.[0] || "Expert Mentor"}
        </div>

        <div className="pt-4">
          <h4 className="font-mono font-bold text-xl text-[#003153] uppercase tracking-tighter group-hover:text-[#D4AF37] transition-colors duration-300">
            {f.name}
          </h4>
          <div className="h-0.5 w-12 bg-[#D4AF37]/30 mx-auto my-3 group-hover:w-20 transition-all duration-500" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {f.designation}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4 opacity-100">
           <button 
             onClick={() => setShowBio(!showBio)}
             className={cn(
               "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2 z-20",
               showBio 
                ? "bg-[#D4AF37] text-[#003153] scale-105"
                : "bg-[#003153] text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#003153]"
             )}
           >
              {showBio ? (
                <><ChevronDown size={14} className="animate-bounce" /> Hide Bio</>
              ) : (
                <><User size={14} /> View Bio</>
              )}
           </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
      `}</style>
    </div>
  );
}