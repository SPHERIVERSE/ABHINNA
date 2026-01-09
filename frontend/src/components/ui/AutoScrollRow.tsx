"use client";

import { useRef, useEffect, useState } from "react";

interface AutoScrollProps {
  children: React.ReactNode;
  speed?: number; // px per second
}

export default function AutoScrollRow({
  children,
  speed = 30,
}: AutoScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);

  // internal mutable refs
  const xRef = useRef(0);
  const dirRef = useRef(-1); // -1 = left, 1 = right
  const lastRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  /* Measure overflow */
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      if (content.scrollWidth <= container.clientWidth) {
        setEnabled(false);
        xRef.current = 0;
        content.style.transform = "translate3d(0,0,0)";
      } else {
        setEnabled(true);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

 useEffect(() => {
  if (!enabled) return;

  let rafId: number;

  const loop = (time: number) => {
    // 🔒 SAFETY GUARDS
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    if (!lastRef.current) lastRef.current = time;
    const dt = (time - lastRef.current) / 1000;
    lastRef.current = time;

    if (!paused && !draggingRef.current) {
      xRef.current += dirRef.current * speed * dt;

      const minX = container.clientWidth - content.scrollWidth;
      const maxX = 0;

      if (xRef.current <= minX) {
        xRef.current = minX;
        dirRef.current = 1;
      } else if (xRef.current >= maxX) {
        xRef.current = maxX;
        dirRef.current = -1;
      }

      content.style.transform =
        `translate3d(${xRef.current}px,0,0)`;
    }

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
  };
}, [enabled, paused, speed]);


const DRAG_THRESHOLD = 6;
const movedRef = useRef(false);

const onPointerDown = (e: React.PointerEvent) => {
  draggingRef.current = true;
  movedRef.current = false;

  startXRef.current = e.clientX;
  startOffsetRef.current = xRef.current;
};

const onPointerMove = (e: React.PointerEvent) => {
  if (!draggingRef.current) return;

  const dx = e.clientX - startXRef.current;

  // Commit to drag only after threshold
  if (!movedRef.current && Math.abs(dx) > DRAG_THRESHOLD) {
    movedRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  if (!movedRef.current) return;

  const container = containerRef.current!;
  const content = contentRef.current!;

  const minX = container.clientWidth - content.scrollWidth;
  const maxX = 0;

  xRef.current = Math.min(
    maxX,
    Math.max(minX, startOffsetRef.current + dx)
  );

  content.style.transform = `translate3d(${xRef.current}px,0,0)`;
};

const onPointerUp = (e: React.PointerEvent) => {
  draggingRef.current = false;

  if (movedRef.current) {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } else {
    // True click / tap
    setPaused(p => !p);
  }
};

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full overflow-hidden contain-layout"
    >
      <div
        ref={contentRef}
        className={`flex gap-6 py-4 will-change-transform select-none
          ${enabled ? "justify-start cursor-grab" : "justify-center"}`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </div>
    </div>
  );
}
