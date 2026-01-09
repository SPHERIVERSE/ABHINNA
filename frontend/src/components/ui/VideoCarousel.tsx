"use client";

import { Play, Video as VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoProps {
  videos: any[];
  title: string;
  type: "LONG_FORM" | "SHORT";
}

export default function VideoCarousel({ videos, title, type }: VideoProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // 🟢 Autoscroll Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainer) {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // If reached the end, reset to start smoothly
        if (scrollContainer.scrollLeft >= maxScroll - 1) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: 2, behavior: "auto" }); // "auto" for constant crawl
        }
      }
    }, 30); // Speed of the crawl

    return () => clearInterval(interval);
  }, [isPaused, videos]);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-xl bg-[#003153] flex items-center justify-center text-[#D4AF37]">
          <VideoIcon size={20} />
        </div>
        <h3 className="text-2xl font-black text-[#003153] tracking-tight">{title}</h3>
      </div>

      <div 
        ref={scrollRef}
        // 🟢 Event Listeners to pause/resume
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex overflow-x-auto pb-6 gap-6 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth"
      >
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={`snap-start flex-shrink-0 group cursor-pointer ${
              type === "LONG_FORM" ? "w-[320px] md:w-[450px]" : "w-[200px] md:w-[280px]"
            }`}
          >
            {/* VIDEO CONTAINER */}
            <div className={`relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 border-2 border-transparent group-hover:border-[#D4AF37] ${
              type === "LONG_FORM" ? "aspect-video" : "aspect-[9/16]"
            }`}>
              <iframe
                src={`https://www.youtube.com/embed/${video.externalId}?autoplay=0`}
                className="w-full h-full object-cover pointer-events-auto"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={16} className="text-white fill-white" />
              </div>
            </div>

            {/* VIDEO INFO */}
            <div className="mt-4 px-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {video.category} • {video.platform}
              </p>
              <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#003153] transition-colors">
                {video.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}