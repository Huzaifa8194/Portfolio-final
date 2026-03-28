"use client";

import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useState, useLayoutEffect } from "react";
import {
  CAROUSEL_BLEND,
  carouselExpandMotionActive,
  expandProgressForSlide,
  leftRailOpacityFromV,
  progressToP,
  T_WORK_INTERACT,
  workChromeGate,
} from "@/components/experience/hero-scroll-timeline";
import { SELECTED_PROJECTS, SELECTED_PROJECT_IMAGE_FALLBACKS } from "./projects";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

type SelectedWorkProps = {
  scrollYProgress: MotionValue<number>;
  sceneOpacity: MotionValue<number>;
};

const BLEND = CAROUSEL_BLEND;

function slideOpacityAtP(p: number, i: number): number {
  if (p <= 0) return i === 0 ? 1 : 0;
  if (i === 0) {
    if (p < 1 - BLEND) return 1;
    if (p < 1) return (1 - p) / BLEND;
    return 0;
  }
  if (i === 1) {
    if (p < 1) return 0;
    if (p < 1 + BLEND) return (p - 1) / BLEND;
    if (p < 2 - BLEND) return 1;
    if (p < 2) return (2 - p) / BLEND;
    return 0;
  }
  if (p < 2) return 0;
  if (p < 2 + BLEND) return (p - 2) / BLEND;
  return 1;
}

function activeIndexFromP(p: number): number {
  if (p < 1) return 0;
  if (p < 2) return 1;
  return 2;
}

const PROJECT_TAGS = [
  "Travel & discovery",
  "Campaign intelligence",
  "Author growth",
] as const;

export function SelectedWork({ scrollYProgress, sceneOpacity }: SelectedWorkProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [interact, setInteract] = useState(false);
  const [leftRailInteractive, setLeftRailInteractive] = useState(false);

  const op0 = useTransform(scrollYProgress, (v) => slideOpacityAtP(progressToP(v), 0));
  const op1 = useTransform(scrollYProgress, (v) => slideOpacityAtP(progressToP(v), 1));
  const op2 = useTransform(scrollYProgress, (v) => slideOpacityAtP(progressToP(v), 2));

  const slideOpacities = [op0, op1, op2];

  const ep0 = useTransform(scrollYProgress, (v) =>
    expandProgressForSlide(progressToP(v), 0),
  );
  const ep1 = useTransform(scrollYProgress, (v) =>
    expandProgressForSlide(progressToP(v), 1),
  );
  const ep2 = useTransform(scrollYProgress, (v) =>
    expandProgressForSlide(progressToP(v), 2),
  );
  const expandBySlide = [ep0, ep1, ep2];

  const chromeGate = useTransform(scrollYProgress, workChromeGate);

  /** Hints only while the timeline is in an expand beat (not hold / left-rail / tail) */
  const hintOpacity0 = useTransform(scrollYProgress, (v): number => {
    if (!carouselExpandMotionActive(v)) return 0;
    return expandProgressForSlide(progressToP(v), 0) < 0.88 ? 1 : 0;
  });
  const hintOpacity1 = useTransform(scrollYProgress, (v): number => {
    if (!carouselExpandMotionActive(v)) return 0;
    return expandProgressForSlide(progressToP(v), 1) < 0.88 ? 1 : 0;
  });
  const hintOpacity2 = useTransform(scrollYProgress, (v): number => {
    if (!carouselExpandMotionActive(v)) return 0;
    return expandProgressForSlide(progressToP(v), 2) < 0.88 ? 1 : 0;
  });
  const hintOpacities = [hintOpacity0, hintOpacity1, hintOpacity2];

  const copySkew = useTransform(scrollYProgress, (v) => {
    const p = progressToP(v);
    const t = (p - 0.5) / 2.5;
    return Math.sin(t * Math.PI) * -1.25;
  });
  const copyX = useTransform(scrollYProgress, (v) => {
    const p = progressToP(v);
    return Math.sin((p / 3) * Math.PI) * 6;
  });

  const leftRailOpacity = useTransform(scrollYProgress, leftRailOpacityFromV);
  const leftRailSkew = useTransform([copySkew, leftRailOpacity], ([s, o]) => Number(s) * Number(o));
  const leftRailX = useTransform([copyX, leftRailOpacity], ([x, o]) => Number(x) * Number(o));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = progressToP(v);
    setActiveSlide(activeIndexFromP(p));
    setInteract(v >= T_WORK_INTERACT);
    setLeftRailInteractive(leftRailOpacityFromV(v) > 0.12);
  });

  useLayoutEffect(() => {
    const v = scrollYProgress.get();
    const p = progressToP(v);
    setActiveSlide(activeIndexFromP(p));
    setInteract(v >= T_WORK_INTERACT);
    setLeftRailInteractive(leftRailOpacityFromV(v) > 0.12);
  }, [scrollYProgress]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[12] flex flex-col bg-black"
      style={{ opacity: sceneOpacity }}
    >
      <div className="absolute inset-0" aria-hidden>
        {SELECTED_PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            className="absolute inset-0"
            style={{
              opacity: slideOpacities[i],
              willChange: "opacity",
            }}
          >
            <ScrollExpandMedia
              expandProgress={expandBySlide[i]}
              chromeOpacity={chromeGate}
              hintOpacity={hintOpacities[i]}
              vividLead={i === 0}
              mediaSrc={project.image}
              mediaFallbackSrc={SELECTED_PROJECT_IMAGE_FALLBACKS[i]}
              bgImageSrc={project.image}
              title={project.title}
              date={PROJECT_TAGS[i]}
              scrollToExpand="Scroll to explore"
              textBlend={false}
              className="absolute inset-0"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className={`relative z-10 flex min-h-0 flex-1 flex-col justify-center px-6 py-10 md:px-12 lg:px-16 lg:py-12 ${
          interact && leftRailInteractive ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          opacity: leftRailOpacity,
          skewX: leftRailSkew,
          x: leftRailX,
          willChange: "transform, opacity",
        }}
      >
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 md:gap-10">
          <div className="flex min-w-0 max-w-xl flex-col">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium tracking-tight text-white md:mb-8">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/25 text-[10px]">
                ▶
              </span>
              <span>Selected Work</span>
            </div>

            <div className="mb-8 flex gap-3 md:mb-10">
              {SELECTED_PROJECTS.map((_, i) => {
                const active = activeSlide === i;
                return (
                  <div
                    key={i}
                    className="flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition-transform md:h-12 md:w-12 md:text-base"
                    style={{
                      borderColor: active ? "transparent" : "rgba(255,255,255,0.45)",
                      backgroundColor: active ? "#ffffff" : "transparent",
                      color: active ? "#000000" : "#ffffff",
                      transform: active ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            <div className="relative min-h-[9rem] md:min-h-[11rem]">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                Case study
              </p>
              <p className="max-w-md text-sm leading-relaxed text-white/90 drop-shadow-md md:text-base">
                {SELECTED_PROJECTS[activeSlide].description}
              </p>
              <div className="mt-8">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-sm bg-white px-7 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
