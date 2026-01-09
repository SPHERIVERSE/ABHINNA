"use client";

import { Trophy, Medal, GraduationCap, Award } from "lucide-react";

export default function ResultCard({ item }: { item: any }) {
  // Mapping logic:
  // title -> Student Name
  // categoryGroup -> Exam Name
  // subCategory -> Score/Rank
  // fileUrl -> Student Photo

  return (
    <div className="snap-start flex-shrink-0 w-[260px] md:w-[300px] h-[450px] md:h-[550px] group relative bg-white rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
      
      {/* 🖼️ STUDENT PHOTO */}
      <div className="h-[60%] w-full relative overflow-hidden bg-slate-200">
        <img 
          src={item.fileUrl} 
          alt={item.title} 
          className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        
        {/* 🟢 SCORE/RANK BADGE (Featured on the Photo) */}
        {item.rank && (
          <div className="absolute top-0 right-6 bg-[#D4AF37] text-[#003153] py-2 rounded-2xl shadow-2xl z-10 flex flex-col items-center min-w-[80px] border-b-4 border-[#003153]/20 animate-in fade-in zoom-in duration-700">
             <Award size={16} className="mb-1 opacity-80" />
            <span className="text-xl font-black leading-tight tracking-tighter">
              {item.rank}
            </span>
          </div>
        )}

        
      </div>

     {/* 📝 INFO AREA */}
    <div className="relative bg-white px-6 pt-10 pb-8 min-h-[220px] flex flex-col items-center text-center">
    
    {/* 🟢 FLOATING TROPHY ICON */}
    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#003153] rounded-2xl flex items-center justify-center text-[#D4AF37] border-4 border-white shadow-xl group-hover:rotate-[15deg] transition-all duration-500 z-20">
        <Trophy size={24} />
    </div>

    <div className="w-full space-y-4">
        {/* 🟢 STUDENT NAME (No longer truncated, handles wrapping) */}
    <div className="h-6">
        <h4 className="text-[#003153] font-black uppercase tracking-tighter leading-tight px-2 break-words">
        {item.title}
        </h4>
    </div>
        {/* 🟢 HIGHLIGHTED EXAM NAME SECTION */}
        <div className="flex flex-col items-center">
        {/* Visual Divider/Icon */}
        <div className="flex items-center gap-2 mb-4 opacity-60">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#003153]" />
            <GraduationCap size={16} className="text-[#D4AF37]" />
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#003153]" />
        </div>

        {/* The Highlighted Badge */}
        {/* Swaps to Navy background with Gold text on card hover */}
        <div className="inline-block px-6 py-2.5 rounded-xl bg-[#D4AF37] border border-[#003153]/10 shadow-md group-hover:bg-[#003153] transition-all duration-500 transform group-hover:scale-105">
            <p className="text-[#003153] font-black text-[12px] uppercase tracking-[0.3em] leading-none group-hover:text-[#D4AF37]">
            {item.subCategory || "National Exam"}
            </p>
        </div>
        
        {/* Professional Sub-label */}
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3 block">
            Qualified Aspirant
        </span>
        </div>
    </div>

    {/* Luxury Border Overlay */}
    <div className="absolute inset-0 border-[8px] border-white/5 pointer-events-none rounded-[3rem]" />
    </div>
    </div>
  );
}