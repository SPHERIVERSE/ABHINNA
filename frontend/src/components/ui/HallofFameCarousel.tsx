"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ResultCard from "./ResultCard";
import { cn } from "@/lib/utils";

export default function HallOfFameCarousel({ results }: { results: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setIsScrollable(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [results]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 300 + 32; // Card width + gap
      if (direction === "right") {
        const isAtEnd = scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 50;
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      } else {
        scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (isPaused || !isScrollable || results.length <= 1) return;
    const interval = setInterval(() => scroll("right"), 4500);
    return () => clearInterval(interval);
  }, [isPaused, isScrollable, results.length, scroll]);

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // 🟢 Add touch handlers to pause auto-scroll during interaction
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* 🎮 NAVIGATION ARROWS */}
      {isScrollable && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-left-8 md:-right-8 z-40 pointer-events-none">
          <button 
            onClick={() => scroll("left")}
            className="pointer-events-auto p-4 rounded-full bg-[#D4AF37] text-[#003153] shadow-2xl transition-all hover:bg-white active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="pointer-events-auto p-4 rounded-full bg-[#D4AF37] text-[#003153] shadow-2xl transition-all hover:bg-white active:scale-90"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* 🟢 DYNAMIC TRACK */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex gap-8 pb-12 pt-4 no-scrollbar transition-all duration-500 px-4",
          // 🟢 touch-pan-y is critical here to allow vertical page scrolling
          isScrollable 
            ? "overflow-x-auto snap-x snap-mandatory touch-pan-x touch-pan-y scroll-smooth md:px-[30%]" 
            : "justify-center" 
        )}
      >
        {results.map((item: any) => (
          <div key={item.id} className={cn("flex-shrink-0", isScrollable && "snap-center")}>
             <ResultCard item={item} />
          </div>
        ))}
        
        {isScrollable && <div className="flex-shrink-0 w-[30%] pointer-events-none" />}
      </div>

      {/* 📍 PROGRESS DOTS */}
      {isScrollable && (
        <div className="flex justify-center gap-2 -mt-4">
          {results.map((_, idx) => (
            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30" />
          ))}
        </div>
      )}
    </div>
  );
}