"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { WORK_GALLERY_ITEMS } from "@/components/experience/work-gallery-data";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import { Badge } from "@/components/ui/badge";

export function MyWorkGallery() {
  return (
    <div className="bg-black min-h-[600px] text-white overflow-hidden w-full">
      <div className="h-[240px] sm:h-[300px] flex flex-col items-center justify-center space-y-4 pt-8 px-6">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tighter">My Work</h1>
        </div>
        <p className="text-sm text-white/60 text-center max-w-md">
          Same pieces as &ldquo;What I&apos;ve Built&rdquo; — scroll to explore the wheel.
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
        className="!min-h-[600px]"
        baseRadius={400}
        mobileRadius={250}
        visiblePercentage={50}
        scrollDuration={2000}
      >
        {(hoveredIndex) =>
          WORK_GALLERY_ITEMS.map((project, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={project.id}
                className="group relative w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] overflow-hidden rounded-xl bg-neutral-950 border border-white/10 shadow-lg"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    className={`object-cover transition-transform duration-700 ease-out ${
                      isActive
                        ? "scale-110 blur-0"
                        : "scale-100 blur-[1px] grayscale-[30%]"
                    }`}
                    sizes="(max-width: 640px) 200px, 240px"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60" />
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

      <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-white/[0.03] border-t border-white/[0.06]">
        <h2 className="text-xl font-light tracking-widest uppercase text-white/45">
          Huzaifa Imran
        </h2>
      </div>
    </div>
  );
}
