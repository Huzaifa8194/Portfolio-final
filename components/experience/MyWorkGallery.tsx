"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MyWorkMobileGallery } from "@/components/experience/MyWorkMobileGallery";
import { WORK_GALLERY_ITEMS } from "@/components/experience/work-gallery-data";
import { WorkGalleryProjectCard } from "@/components/experience/WorkGalleryProjectCard";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";

export function MyWorkGallery() {
  /** `null` until client knows viewport — avoids mounting GSAP on phones (hidden still mounts in React). */
  const [galleryMode, setGalleryMode] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setGalleryMode(mq.matches ? "desktop" : "mobile");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Pinned GSAP + vertical overscroll — only when the radial gallery is actually mounted. */
  useEffect(() => {
    if (galleryMode !== "desktop") {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
      return;
    }
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [galleryMode]);

  return (
    <div className="bg-black min-h-[100dvh] text-white overflow-x-hidden w-full overscroll-none">
      <div className="min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 md:pb-6 px-6">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tighter">My Work</h1>
          <p className="text-xs font-light tracking-widest uppercase text-white/35 pt-1">
            Huzaifa Imran
          </p>
        </div>

        {galleryMode === "mobile" && (
          <>
            <p className="text-sm text-white/60 text-center max-w-md leading-relaxed">
              Same pieces as &ldquo;What I&apos;ve Built.&rdquo; Swipe through each project below.
            </p>
            <div className="text-white/40 text-xs tracking-wide">← Swipe →</div>
          </>
        )}
        {galleryMode === "desktop" && (
          <>
            <p className="text-sm text-white/60 text-center max-w-md">
              Same pieces as &ldquo;What I&apos;ve Built&rdquo; — scroll to spin the wheel.
            </p>
            <div className="flex animate-bounce text-white/45 text-xs">↓ Scroll</div>
          </>
        )}
        {galleryMode === null && (
          <p className="text-sm text-white/45 text-center max-w-xs">Preparing gallery…</p>
        )}

        <Link
          href="/"
          className="text-xs text-white/50 hover:text-white underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </div>

      <div
        className={
          galleryMode !== null
            ? "min-h-0"
            : "min-h-[min(52dvh,420px)] flex items-center justify-center px-8"
        }
      >
        {galleryMode === null && (
          <div
            className="h-40 w-full max-w-sm rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse"
            aria-hidden
          />
        )}
        {galleryMode === "mobile" && <MyWorkMobileGallery />}
        {galleryMode === "desktop" && (
          <RadialScrollGallery
            className="!min-h-[600px]"
            baseRadius={400}
            mobileRadius={200}
            visiblePercentage={48}
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
        )}
      </div>
    </div>
  );
}
