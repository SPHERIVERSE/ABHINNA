"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Leader = {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  photo?: {
    fileUrl: string;
  };
};

export default function LeadershipSection({ leadership }: { leadership: Leader[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-16">
      {leadership.map((leader, index) => {
        const isExpanded = expandedId === leader.id;
        const isReverse = index % 2 !== 0;

        return (
          <article
            key={leader.id}
            className={cn(
              "relative group bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500",
              "rounded-3xl px-6 py-10 sm:px-10 md:px-14",
              "flex flex-col lg:flex-row items-center gap-10",
              isReverse && "lg:flex-row-reverse"
            )}
          >
            {/* IMAGE */}
            <div className="relative shrink-0">
              {/* Decorative background (desktop only) */}
              <div className="hidden lg:block absolute inset-0 bg-[#D4AF37]/20 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform" />

              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={leader.photo?.fileUrl}
                  alt={leader.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div
              className={cn(
                "flex-1 text-center lg:text-left",
                isReverse && "lg:text-right"
              )}
            >
              <h3 className="text-2xl sm:text-3xl font-black text-[#003153]">
                {leader.name}
              </h3>

              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                {leader.designation}
              </p>

              {/* BIO */}
              <div className="mt-5">
                <p
                  className={cn(
                    "text-slate-600 text-sm leading-relaxed transition-all duration-300",
                    !isExpanded && "line-clamp-3"
                  )}
                >
                  {leader.bio}
                </p>

                {leader.bio && leader.bio.length > 120 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : leader.id)}
                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#003153] hover:text-[#D4AF37] transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
