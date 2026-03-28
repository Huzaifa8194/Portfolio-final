"use client";

import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { HERO_STORY_STEP_TARGETS } from "@/components/experience/hero-scroll-timeline";

function stepIndexAtOrBelow(v: number, targets: readonly number[]): number {
  for (let i = 0; i < targets.length; i++) {
    if (targets[i] > v + 1e-6) return Math.max(0, i - 1);
  }
  return targets.length - 1;
}

const STEP_DURATION_S = 1.05;
const STEP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useHeroStoryProgress(
  trackRef: React.RefObject<HTMLElement | null>,
): MotionValue<number> {
  const storyProgress = useMotionValue(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const targets = HERO_STORY_STEP_TARGETS;

    const tryStep = (delta: number) => {
      if (animatingRef.current) return false;

      const v = storyProgress.get();
      const i = stepIndexAtOrBelow(v, targets);
      const next =
        delta > 0 ? Math.min(i + 1, targets.length - 1) : Math.max(i - 1, 0);
      if (next === i) return false;

      animatingRef.current = true;
      animate(storyProgress, targets[next], {
        duration: STEP_DURATION_S,
        ease: STEP_EASE,
        onComplete: () => {
          animatingRef.current = false;
        },
      });
      return true;
    };

    const heroInView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.98 && r.bottom > window.innerHeight * 0.02;
    };

    const onWheel = (e: WheelEvent) => {
      if (!heroInView()) return;

      const v = storyProgress.get();
      const down = e.deltaY > 0;
      const up = e.deltaY < 0;

      if (down && v >= 1 - 1e-5) return;
      if (up && v <= 1e-5) return;

      if (down && v < 1 - 1e-5) {
        e.preventDefault();
        tryStep(1);
        return;
      }
      if (up && v > 1e-5) {
        e.preventDefault();
        tryStep(-1);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!heroInView()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        const v = storyProgress.get();
        if (v >= 1 - 1e-5) return;
        e.preventDefault();
        tryStep(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const v = storyProgress.get();
        if (v <= 1e-5) return;
        e.preventDefault();
        tryStep(-1);
      }
    };

    let touchY0 = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY0 = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!heroInView()) return;
      const dy = touchY0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 56) return;
      const v = storyProgress.get();
      if (dy > 0 && v < 1 - 1e-5) tryStep(1);
      else if (dy < 0 && v > 1e-5) tryStep(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [storyProgress]);

  return storyProgress;
}
