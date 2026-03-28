"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { BUILT_SLIDES } from "./built-carousel-data";

/** One full pass through all slides (seconds) — billboard speed */
const MARQUEE_DURATION_SEC = 48;

export function WhatIveBuilt() {
  const n = BUILT_SLIDES.length;
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [leadingPhysical, setLeadingPhysical] = useState(0);
  const x = useMotionValue(0);

  const measureViewport = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = el.clientWidth;
    if (vw > 0) {
      const w = Math.min(vw * 0.72, 560);
      setSlideWidth(w);
    }
  }, []);

  useLayoutEffect(() => {
    measureViewport();
    const id = requestAnimationFrame(() => measureViewport());
    const ro = new ResizeObserver(() => measureViewport());
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measureViewport);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      window.removeEventListener("resize", measureViewport);
    };
  }, [measureViewport]);

  const loopDistance = n * slideWidth;

  useEffect(() => {
    if (!slideWidth || loopDistance <= 0) return;
    if (reduceMotion) {
      x.set(0);
      setLeadingPhysical(0);
      return;
    }

    x.set(0);
    const controls = animate(x, [0, -loopDistance], {
      duration: MARQUEE_DURATION_SEC,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [slideWidth, loopDistance, reduceMotion, x]);

  useMotionValueEvent(x, "change", (latest) => {
    if (!slideWidth) return;
    const p = Math.floor(-latest / slideWidth);
    const normalized = ((p % (2 * n)) + (2 * n)) % (2 * n);
    setLeadingPhysical((prev) => (prev === normalized ? prev : normalized));
  });

  const marqueeSlides = [...BUILT_SLIDES, ...BUILT_SLIDES].map((slide, k) => ({
    slide,
    k,
  }));

  return (
    <section
      className="relative z-0 overflow-x-hidden border-t border-white/[0.06] bg-black px-6 py-20 md:px-10 md:py-28 lg:px-16"
      aria-labelledby="built-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id="built-heading"
            className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3rem]"
          >
            What I&apos;ve Built.
          </h2>
          <p className="mt-3 text-lg font-medium text-white/80 md:text-2xl md:font-normal">
            Crafted Web Experiences
          </p>
        </motion.div>
      </div>

      <div className="relative mt-12 w-screen max-w-[100vw] -translate-x-1/2 left-1/2 md:mt-16">
        <div ref={viewportRef} className="w-full overflow-hidden">
          <motion.div
            className="flex w-max will-change-transform"
            style={{
              x,
              gap: 0,
            }}
          >
            {marqueeSlides.map(({ slide, k }) => {
              const isLeading = k === leadingPhysical;
              return (
                <motion.div
                  key={`${slide.src}-${k}`}
                  className="relative shrink-0 select-none bg-neutral-950"
                  style={{
                    width: slideWidth > 0 ? slideWidth : "100%",
                  }}
                  animate={
                    reduceMotion
                      ? { y: 0 }
                      : { y: isLeading ? -4 : 0 }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }
                  }
                >
                  <div className="relative flex w-full items-center justify-center bg-neutral-950">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={1920}
                      height={1080}
                      className="h-auto w-full object-contain object-center"
                      sizes="72vw"
                      draggable={false}
                      priority={k === 0}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
