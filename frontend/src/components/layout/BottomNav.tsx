"use client";

import Link from "next/link";
import { Home, BookOpen, Users, Trophy } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-white/95 backdrop-blur-md border-t-2 border-[#D4AF37]/30 flex justify-around items-center py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <Link href="/" className="flex flex-col items-center gap-1 text-[#003153] hover:text-[#D4AF37] transition-colors">
        <Home size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
      </Link>
      <Link href="#courses" className="flex flex-col items-center gap-1 text-[#003153] hover:text-[#D4AF37] transition-colors">
        <BookOpen size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Courses</span>
      </Link>
      <Link href="#faculty" className="flex flex-col items-center gap-1 text-[#003153] hover:text-[#D4AF37] transition-colors">
        <Users size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Faculty</span>
      </Link>
      <Link href="#results" className="flex flex-col items-center gap-1 text-[#003153] hover:text-[#D4AF37] transition-colors">
        <Trophy size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Results</span>
      </Link>
    </nav>
  );
}