"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

import { WORK_GALLERY_ITEMS } from "@/components/experience/work-gallery-data";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import { Badge } from "@/components/ui/badge";

export function MyWorkGallery() {
  /** Stops rubber-band / scroll chaining past the page on mobile while using the wheel. */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overscrollBehavior;
    const prevBody = body.style.overscrollBehavior;
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    return () => {
      html.style.overscrollBehavior = prevHtml;
      body.style.overscrollBehavior = prevBody;
    };
  }, []);

  return (
    <div className="bg-black min-h-[100dvh] text-white overflow-x-hidden w-full overscroll-none">
      <div className="min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 px-6">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tighter">My Work</h1>
          <p className="text-xs font-light tracking-widest uppercase text-white/35 pt-1">
            Huzaifa Imran
          </p>
        </div>
        <p className="text-sm text-white/60 text-center max-w-md">
          Same pieces as &ldquo;What I&apos;ve Built&rdquo; — scroll to spin the wheel.
        </p>
        <div className="animate-bounce text-white/45 text-xs">↓ Scroll</div>
        <Link
          href="/"
          className="text-xs text-white/50 hover:text-white underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </div>

      <RadialScrollGallery
        className="!min-h-[min(100dvh,720px)] sm:!min-h-[600px]"
        baseRadius={400}
        mobileRadius={200}
        visiblePercentage={48}
        scrollDuration={1600}
        fullRotations={36}
        startTrigger="top 14%"
      >
        {(hoveredIndex) =>
          WORK_GALLERY_ITEMS.map((project, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={project.id}
                className="group relative w-[160px] h-[220px] min-[380px]:w-[180px] min-[380px]:h-[250px] sm:w-[220px] sm:h-[300px] overflow-hidden rounded-xl bg-neutral-950 border border-white/10 shadow-lg"
              >
                <div className="absolute inset-0 overflow-hidden p-2 flex items-center justify-center">
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    className={`object-contain object-center transition-[filter,opacity] duration-500 ease-out ${
                      isActive ? "opacity-100" : "opacity-90 grayscale-[25%]"
                    }`}
                    sizes="(max-width: 480px) 160px, (max-width: 640px) 180px, 220px"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-70" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0 bg-black/70 text-white border-white/10 backdrop-blur"
                    >
                      {project.cat}
                    </Badge>
                    <div
                      className={`w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transition-all duration-500 ${
                        isActive ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"
                      }`}
                    >
                      <ArrowUpRight size={12} />
                    </div>
                  </div>

                  <div
                    className={`transition-transform duration-500 ${
                      isActive ? "translate-y-0" : "translate-y-2"
                    }`}
                  >
                    <h3 className="text-xl font-bold leading-tight text-white">
                      {project.title}
                    </h3>
                    <div
                      className={`h-0.5 bg-white mt-2 transition-all duration-500 ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        }
      </RadialScrollGallery>
    </div>
  );
}
