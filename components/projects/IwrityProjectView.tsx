"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const IWRITY_SRC = "/images/iwrity.png";

/** Filler images for the parallax stack (iWrity is index 0 — main zoom). */
const PARALLAX_FILL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Modern architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "City at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Abstract gradient",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Minimal design",
  },
  {
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Ocean",
  },
];

export function IwrityProjectView() {
  const images = [
    { src: IWRITY_SRC, alt: "iWrity platform" },
    ...PARALLAX_FILL_IMAGES,
  ];

  return (
    <main className="min-h-screen w-full bg-black text-white">
      <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-8 md:min-h-[45vh]">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full",
            "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]",
            "blur-[30px]",
          )}
        />
        <Link
          href="/my-work"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          My Work
        </Link>
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-5xl">
          iWrity
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-white/55 md:text-base">
          Scroll to explore — zoom parallax, then read the story.
        </p>
      </div>

      <ZoomParallax images={images} />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-16 md:pt-24">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          About
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-white/85 md:text-xl">
          iWrity is a platform designed mainly for self-published authors to gain genuine
          Amazon reviews through a community-driven, point-based system. Instead of paying
          for reviews—which violates Amazon policies—users earn points by reviewing other
          authors&apos; books and then use those points to receive reviews on their own
          work, creating a structured and compliant exchange. It focuses on real readers,
          genre matching, and early traction for new books that struggle with visibility
          due to lack of reviews, making it a practical growth tool for indie authors,
          though its effectiveness depends heavily on active user participation.
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-md bg-white text-black hover:bg-white/90"
          >
            <a
              href="https://iwrity.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
