"use client";

import Link from "next/link";
import { useEffect } from "react";

import { WORK_GALLERY_ITEMS } from "@/components/experience/work-gallery-data";
import { WorkGalleryProjectCard } from "@/components/experience/WorkGalleryProjectCard";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";

export function MyWorkGallery() {
  /** Vertical overscroll lock only helps the long pinned scroll on desktop (md+). */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      const on = mq.matches;
      document.documentElement.style.overscrollBehavior = on ? "none" : "";
      document.body.style.overscrollBehavior = on ? "none" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  return (
    <div className="bg-black min-h-[100dvh] text-white overflow-x-hidden w-full overscroll-none">
      <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2 md:pb-6 px-6 md:min-h-[220px] md:pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tighter">My Work</h1>
          <p className="text-xs font-light tracking-widest uppercase text-white/35 pt-1">
            Huzaifa Imran
          </p>
        </div>

        <p className="md:hidden text-sm text-white/60 text-center max-w-md leading-relaxed">
          <span className="text-white/80">Drag the wheel left or right</span> to spin it.
        </p>
        <p className="hidden md:block text-sm text-white/60 text-center max-w-md">
          Scroll down to spin the wheel.
        </p>

        <div className="md:hidden text-white/40 text-xs tracking-wide">← drag →</div>
        <div className="hidden md:flex animate-bounce text-white/45 text-xs">↓ Scroll</div>

        <Link
          href="/"
          className="text-xs text-white/50 hover:text-white underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </div>

      <RadialScrollGallery
        className="-mt-1 md:mt-0 !min-h-[min(100dvh,720px)] md:!min-h-[600px]"
        baseRadius={400}
        mobileRadius={200}
        visiblePercentage={52}
        scrollDuration={1600}
        fullRotations={36}
        startTrigger="top 14%"
      >
        {(hoveredIndex) =>
          WORK_GALLERY_ITEMS.map((project, index) => (
            <WorkGalleryProjectCard
              key={project.id}
              project={project}
              isActive={hoveredIndex === index}
              variant="wheel"
              imagePriority={index === 0}
              className="w-[220px] h-[300px]"
            />
          ))
        }
      </RadialScrollGallery>
    </div>
  );
}
