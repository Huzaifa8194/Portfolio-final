"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { WORK_GALLERY_ITEMS } from "@/components/experience/work-gallery-data";
import { WorkGalleryProjectCard } from "@/components/experience/WorkGalleryProjectCard";
import { cn } from "@/lib/utils";

const SCROLL_END_DEBOUNCE_MS = 120;

/**
 * Touch-first portfolio: horizontal snap carousel. No GSAP — scroll-driven pin
 * behaves poorly on iOS/Android (rubber-banding, address bar, momentum vs scrub).
 */
export function MyWorkMobileGallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const n = WORK_GALLERY_ITEMS.length;

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const centerX = el.scrollLeft + el.clientWidth / 2;
    const children = Array.from(el.children) as HTMLElement[];
    let best = 0;
    let bestDist = Infinity;
    children.forEach((child, i) => {
      const cx = child.offsetLeft + child.offsetWidth / 2;
      const d = Math.abs(cx - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  const onScroll = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateActiveFromScroll();
      rafRef.current = null;
    });
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      updateActiveFromScroll();
    }, SCROLL_END_DEBOUNCE_MS);
  }, [updateActiveFromScroll]);

  useEffect(() => {
    return () => {
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => updateActiveFromScroll());
    return () => cancelAnimationFrame(id);
  }, [updateActiveFromScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.max(0, Math.min(n - 1, index));
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    const target =
      child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [n]);

  const goPrev = () => scrollToIndex(active - 1);
  const goNext = () => scrollToIndex(active + 1);

  return (
    <section
      className="pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2"
      aria-roledescription="carousel"
      aria-label="Portfolio projects"
    >
      <p className="text-center text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase mb-3 px-6">
        Swipe sideways
      </p>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={cn(
            "flex gap-4 overflow-x-auto snap-x snap-mandatory px-[7.5vw] pb-4",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            "touch-pan-x",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
          tabIndex={0}
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Project ${active + 1} of ${n}`}
        >
          {WORK_GALLERY_ITEMS.map((project, index) => (
            <article
              key={project.id}
              className="snap-center shrink-0 w-[85vw] max-w-[420px]"
              aria-hidden={index !== active}
            >
              <WorkGalleryProjectCard
                project={project}
                isActive={index === active}
                variant="featured"
                imagePriority={index === 0}
                className="w-full aspect-[3/4] max-h-[min(72dvh,560px)] min-h-[260px]"
              />
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-1 px-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={active <= 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-transform"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="flex flex-1 justify-center gap-1.5 max-w-[200px] flex-wrap">
            {WORK_GALLERY_ITEMS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/25 hover:bg-white/40",
                )}
                aria-label={`Go to project ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={active >= n - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-transform"
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <p className="text-center text-xs text-white/35 mt-3 tabular-nums">
          {active + 1} <span className="text-white/20">/</span> {n}
        </p>
      </div>
    </section>
  );
}
