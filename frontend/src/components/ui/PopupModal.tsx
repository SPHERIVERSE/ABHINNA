"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";

// 👇 CONFIGURATION
const WA_NUMBER = "919876543210"; 
const WA_MESSAGE = "Hello, I saw the notice on your website and would like to know more.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

type PopupModalProps = {
  notifications: any[];
};

export default function PopupModal({ notifications }: PopupModalProps) {
  const [popup, setPopup] = useState<{ id: string; message: string; link?: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const activePopup = notifications.find((n: any) => n.type === "POPUP");
    
    if (activePopup) {
      const hasSeen = sessionStorage.getItem(`seen_popup_${activePopup.id}`);
      if (!hasSeen) {
        setPopup(activePopup);
        // 5 Second Delay
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the link if clicked near the edge
    e.preventDefault();
    setIsVisible(false);
    if (popup) {
      sessionStorage.setItem(`seen_popup_${popup.id}`, "true");
    }
  };

  if (!popup) return null;

  // Image Detection
  const isImagePoster = popup.link && (
    popup.link.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) || 
    popup.link.includes("cloudinary") || 
    popup.link.includes("images")
  );

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`relative w-full ${isImagePoster ? 'max-w-lg' : 'max-w-md'} transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
      >
        
        {/* ❌ CLOSE BUTTON (Floating Outside Top-Right) */}
        {/* We place this outside the <a> tag so clicking it doesn't open WhatsApp */}
        <button 
          onClick={handleClose} 
          className="absolute -top-10 right-0 z-50 flex items-center gap-2 text-white hover:text-red-400 transition-colors group"
        >
          <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
          <div className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20">
            <X size={20} />
          </div>
        </button>

        {/* 🔗 THE CLICKABLE CONTAINER */}
        <a 
          href={WA_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group relative rounded-xl overflow-hidden shadow-2xl bg-white"
        >
          {isImagePoster ? (
            // 🎨 POSTER MODE (Image is the hero)
            <div className="relative">
               <img 
                 src={popup.link} 
                 alt="Notice" 
                 className="w-full h-auto object-contain bg-black" 
               />
               
               {/* "Click to know more" Overlay */}
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 text-center">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest animate-pulse">
                     <ExternalLink size={14} /> Click to know more
                  </div>
               </div>
            </div>
          ) : (
            // 📝 TEXT MODE
            <div>
              <div className="bg-[#003153] p-5">
                <h3 className="text-white font-bold text-lg text-center font-cinzel tracking-wide">
                  Important Update
                </h3>
              </div>
              <div className="p-8 text-center bg-white">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed font-medium">
                  {popup.message}
                </p>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 mt-4 group-hover:text-[#003153] transition-colors">
                   Tap card to enquire <ExternalLink size={12} />
                </div>
              </div>
            </div>
          )}
        </a>

      </div>
    </div>
  );
}