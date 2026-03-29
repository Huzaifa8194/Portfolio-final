"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  T_DOORS_END,
  T_INTRO_OPACITY,
  T_INTRO_ROTATE,
  T_INTRO_SCALE,
  T_INTRO_Y,
  T_WORK_SCENE_OPACITY,
} from "@/components/experience/hero-scroll-timeline";
import { SelectedWork } from "@/components/experience/SelectedWork";
import { NextSectionContent } from "@/components/hero/NextSectionContent";
import { FloatingPaths } from "@/components/ui/background-paths";

const BIO =
  "I am a visionary designer who bridges cultures through his innovative design philosophy and scaleable systems.";

/**
 * Scroll-locked hero: sticky viewport ≈100vh while you scroll this much EXTRA past it.
 * Larger budget = more physical scroll for the same 0→1 progress (clearer phase separation).
 */
const SCROLL_BUDGET_VH = 1320;
/** Total track = one viewport + scroll budget while pinned */
const SCROLL_TRACK_VH = 100 + SCROLL_BUDGET_VH;

function DoorPathsBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <FloatingPaths position={1} svgClassName="text-white" />
      <FloatingPaths position={-1} svgClassName="text-white" />
    </div>
  );
}

function LightRayLayer({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <div className="light-ray-blob absolute -right-[20%] -top-[25%] h-[85%] w-[90%] rounded-full blur-[100px]" />
      <div className="light-ray-streak absolute -right-[10%] top-[5%] h-[120%] w-[55%] rotate-[25deg] blur-3xl opacity-40" />
      <div className="light-ray-sweep" />
    </div>
  );
}

function DoorPanel({
  children,
  className,
  y,
  rotateZ,
  zIndex,
  showPathsBackdrop,
  showLightRay,
}: {
  children: React.ReactNode;
  className?: string;
  y: MotionValue<string>;
  rotateZ?: MotionValue<number>;
  zIndex: MotionValue<number>;
  /** Lower door only: animated paths (upper stays plain black). */
  showPathsBackdrop?: boolean;
  showLightRay?: boolean;
}) {
  return (
    <motion.div
      style={{ y, rotateZ, zIndex, willChange: "transform" }}
      className={`absolute left-0 right-0 flex flex-col overflow-hidden bg-[#000000] ${className ?? ""}`}
    >
      {showPathsBackdrop ? <DoorPathsBackdrop /> : null}
      {showLightRay ? <LightRayLayer /> : null}
      <div className="relative z-[1] flex h-full min-h-0 flex-1 flex-col">{children}</div>
    </motion.div>
  );
}

export function HomeExperience() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  const topY = useTransform(scrollYProgress, [0, T_DOORS_END], ["0svh", "-50.5svh"]);
  const bottomY = useTransform(scrollYProgress, [0, T_DOORS_END], ["0svh", "50.5svh"]);
  const topSkew = useTransform(scrollYProgress, [0, T_DOORS_END], [0, -2.5]);
  const bottomSkew = useTransform(scrollYProgress, [0, T_DOORS_END], [0, 2.5]);

  const introOpacity = useTransform(scrollYProgress, [...T_INTRO_OPACITY], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [...T_INTRO_Y], [52, 14, 0, -6]);
  const introScale = useTransform(scrollYProgress, [...T_INTRO_SCALE], [0.88, 0.97, 1, 1]);
  const introRotate = useTransform(scrollYProgress, [...T_INTRO_ROTATE], [-2, 0]);

  const workSceneOpacity = useTransform(scrollYProgress, [...T_WORK_SCENE_OPACITY], [0, 1, 1]);

  /** Above Selected Work while closed; drop below it after door phase so projects stay visible even if y/svh glitches */
  const doorZIndex = useTransform(scrollYProgress, [0, T_DOORS_END], [20, 2]);

  const progressBarX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progressBarScaleY = useTransform(scrollYProgress, [0, 0.26, 0.65, 1], [1, 1.35, 1.2, 1]);

  const introVisibility = useTransform(introOpacity, (o) =>
    o < 0.02 ? "hidden" : "visible",
  );

  return (
    <div
      ref={trackRef}
      className="relative w-full [overflow-anchor:none]"
      style={{ height: `${SCROLL_TRACK_VH}vh`, minHeight: `${SCROLL_TRACK_VH}vh` }}
    >
      <div className="sticky top-0 h-[100svh] min-h-[100svh] w-full overflow-hidden">
        <div className="relative h-full min-h-0 w-full bg-transparent">
          <SelectedWork scrollYProgress={scrollYProgress} sceneOpacity={workSceneOpacity} />

          <motion.div
            className="pointer-events-none absolute inset-0 z-[14] flex flex-col items-center justify-center px-6 py-24"
            style={{
              opacity: introOpacity,
              visibility: introVisibility,
              y: introY,
              scale: introScale,
              rotate: introRotate,
              willChange: "transform, opacity",
            }}
          >
            <NextSectionContent />
          </motion.div>

          <DoorPanel
            className="top-0 h-1/2"
            y={topY}
            rotateZ={topSkew}
            zIndex={doorZIndex}
          >
            <header className="flex shrink-0 items-center justify-between px-6 pt-8 md:px-10 md:pt-10">
              <span className="text-sm font-medium tracking-tight text-white md:text-base">
                Huzaifa Imran
              </span>
              <button
                type="button"
                className="text-sm font-medium tracking-tight text-white transition-opacity hover:opacity-70 md:text-base"
              >
                Menu
              </button>
            </header>
            <div className="flex min-h-0 flex-1 items-end justify-center px-6 pb-0 md:px-10">
              <h1 className="text-[clamp(3rem,14vw,10rem)] font-semibold leading-[0.82] tracking-[-0.04em] text-white">
                Huzaifa
              </h1>
            </div>
          </DoorPanel>

          <DoorPanel
            className="bottom-0 h-1/2"
            y={bottomY}
            rotateZ={bottomSkew}
            zIndex={doorZIndex}
            showPathsBackdrop
          >
            <div className="flex min-h-0 flex-1 items-start justify-center px-6 pt-0 md:px-10">
              <h1 className="text-[clamp(3rem,14vw,10rem)] font-semibold leading-[0.82] tracking-[-0.04em] text-white">
                Imran
              </h1>
            </div>
            <footer className="shrink-0 px-6 pb-8 md:px-10 md:pb-10">
              <div className="mb-6 max-w-xl mx-auto text-center text-xs leading-relaxed text-white/80 md:text-sm">
                {BIO}
              </div>
              <div className="flex items-end justify-between gap-4 text-xs font-medium text-white md:text-sm">
                <a
                  className="transition-opacity hover:opacity-70"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="transition-opacity hover:opacity-70"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </footer>
          </DoorPanel>

          <div
            className="pointer-events-none absolute bottom-8 left-0 right-0 z-[25] flex flex-col items-center gap-1"
            aria-hidden
          >
            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-white/30 via-white to-white/70"
                style={{ scaleX: progressBarX, scaleY: progressBarScaleY }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
