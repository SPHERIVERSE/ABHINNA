"use client";

import { useRef, useState, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TestimonialSection({ testimonials }: { testimonials: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update progress bar based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="relative group">
      {/* 🟢 HORIZONTAL SCROLL CONTAINER */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth px-4"
      >
        {testimonials.map((review: any) => (
          <div 
            key={review.id} 
            className="snap-start flex-shrink-0 w-[85vw] md:w-[400px] bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-100"} 
                  />
                ))}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic line-clamp-4">
                "{review.comment}"
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-50">
              <div className="h-10 w-10 rounded-full bg-[#003153] text-[#D4AF37] flex items-center justify-center font-black text-sm">
                {review.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-[#003153] text-sm">{review.name}</h4>
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Verified Aspirant</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 NAVIGATION INDICATORS (Visible below cards) */}
      <div className="flex flex-col items-center gap-6 mt-4">
        {/* Progress Track */}
        <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-150 ease-out"
            style={{ width: `${Math.max(10, scrollProgress)}%` }}
          />
        </div>

        {/* Interaction Hint */}
        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">
            Slide to Read More
          </span>
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  scrollProgress > (i * 33) ? "bg-[#D4AF37]" : "bg-slate-200"
                )}
              />
            ))}
          </div>
          <ChevronRight size={14} className="text-[#D4AF37] animate-bounce-x" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s infinite;
        }
      `}</style>
    </div>
  );
}