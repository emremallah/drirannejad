"use client";

import { useEffect, useRef, useState } from "react";
import { PAPER_WIDTH, ResumeDocument, type ResumeTest } from "./ResumeDocument";
import type { Resume } from "@/lib/resume";

/** Shrinks the A4 resume to fit whatever width its container has. */
export function ScaledPreview({
  resume,
  tests,
  maxHeight,
  className = "",
}: {
  resume: Resume;
  tests?: ResumeTest[];
  /** Crop the preview (e.g. thumbnails) instead of showing the whole page. */
  maxHeight?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const box = outer.current;
    const paper = inner.current;
    if (!box || !paper) return;
    const measure = () => {
      const next = box.clientWidth / PAPER_WIDTH;
      setScale(next);
      setHeight(paper.offsetHeight * next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);

  const shown = maxHeight ? Math.min(height, maxHeight) : height;

  return (
    <div
      ref={outer}
      className={`relative overflow-hidden ${className}`}
      style={{ height: shown || undefined, visibility: scale ? "visible" : "hidden" }}
    >
      <div
        ref={inner}
        className="absolute top-0 origin-top-left"
        style={{ transform: `scale(${scale || 0.01})`, left: 0 }}
        dir="ltr"
      >
        <ResumeDocument resume={resume} tests={tests} />
      </div>
    </div>
  );
}
