"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PROJECT_PARALLAX_FILL_IMAGES } from "@/components/projects/parallax-fill-images";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_SRC = "/images/sr.png";

export function SrProjectView() {
  const images = [
    { src: HERO_SRC, alt: "Nordic Relocators platform" },
    ...PROJECT_PARALLAX_FILL_IMAGES,
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
          Nordic Relocators
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
          Nordic Relocators is a multilingual immigration and relocation platform built to
          streamline case management and client onboarding across multiple countries.
          Developed using React and Laravel, it supports structured workflows, document
          handling, and user communication, enabling efficient processing of immigration
          services. The platform focuses on scalability, compliance, and user-friendly
          design to support both clients and case officers.
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-md bg-white text-black hover:bg-white/90"
          >
            <a
              href="https://sr-web-latest.vercel.app"
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
