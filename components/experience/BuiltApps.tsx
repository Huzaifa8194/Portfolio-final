"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { APP_SLIDES } from "./built-apps-data";

const N = APP_SLIDES.length;

function Chevron({ className, flipped }: { className?: string; flipped?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function isLogicalSlideInView(
  logicalSlide: number,
  internalIndex: number,
  slidesPerView: number,
) {
  const first = mod(internalIndex, N);
  for (let k = 0; k < slidesPerView; k++) {
    if (mod(first + k, N) === logicalSlide) return true;
  }
  return false;
}

export function BuiltApps() {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);
  /** Index into tripled track; start in middle copy for infinite prev/next */
  const [internalIndex, setInternalIndex] = useState(N);
  const x = useMotionValue(0);

  const loopedSlides = useMemo(() => [...APP_SLIDES, ...APP_SLIDES, ...APP_SLIDES], []);
  /** Largest valid first-visible index into `loopedSlides` */
  const maxInternal = Math.max(0, 3 * N - slidesPerView);

  useEffect(() => {
    setInternalIndex((i) => Math.min(Math.max(i, 0), maxInternal));
  }, [maxInternal]);

  useLayoutEffect(() => {
    const mq5 = window.matchMedia("(min-width: 1280px)");
    const mq3 = window.matchMedia("(min-width: 900px)");
    const mq2 = window.matchMedia("(min-width: 640px)");
    const sync = () => {
      if (mq5.matches) setSlidesPerView(5);
      else if (mq3.matches) setSlidesPerView(3);
      else if (mq2.matches) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    sync();
    mq5.addEventListener("change", sync);
    mq3.addEventListener("change", sync);
    mq2.addEventListener("change", sync);
    return () => {
      mq5.removeEventListener("change", sync);
      mq3.removeEventListener("change", sync);
      mq2.removeEventListener("change", sync);
    };
  }, []);

  const measureViewport = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w > 0) setSlideWidth(w / slidesPerView);
  }, [slidesPerView]);

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

  const step = slideWidth;

  useEffect(() => {
    if (!step) return;
    const target = -internalIndex * step;
    const opts = reduceMotion
      ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
      : { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.85 };
    const ctrl = animate(x, target, {
      ...opts,
      onComplete: () => {
        setInternalIndex((prev) => {
          if (prev >= 2 * N) {
            const next = prev - N;
            x.set(-next * step);
            return next;
          }
          if (prev === 0) {
            const next = N;
            x.set(-next * step);
            return next;
          }
          return prev;
        });
      },
    });
    return () => ctrl.stop();
  }, [internalIndex, step, x, reduceMotion]);

  const goNext = useCallback(() => {
    if (!step) return;
    setInternalIndex((i) => {
      if (i >= maxInternal) {
        x.set(-N * step);
        return N;
      }
      return i + 1;
    });
  }, [maxInternal, step, x]);

  const goPrev = useCallback(() => {
    if (!step) return;
    setInternalIndex((i) => {
      if (i <= 0) {
        const jump = Math.max(0, 2 * N - slidesPerView);
        x.set(-jump * step);
        return jump;
      }
      return i - 1;
    });
  }, [slidesPerView, step, x]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (!step) return;
      const current = x.get();
      const projected = current + info.velocity.x * 0.12;
      let next = Math.round(-projected / step);
      next = Math.max(0, Math.min(maxInternal, next));
      setInternalIndex(next);
    },
    [maxInternal, step, x],
  );

  const goToLogicalSlide = useCallback((logical: number) => {
    setInternalIndex(logical + N);
  }, []);

  return (
    <section
      className="relative z-0 overflow-x-hidden border-t border-white/[0.06] bg-black px-6 pb-20 pt-12 md:px-10 md:pb-24 md:pt-14 lg:px-16"
      aria-labelledby="apps-built-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id="apps-built-heading"
            className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3rem]"
          >
            Apps I&apos;ve Built.
          </h2>
          <p className="mt-3 text-lg font-medium text-white/80 md:text-2xl md:font-normal">
            Crafted Mobile Experiences
          </p>
        </motion.div>
      </div>

      <div className="relative mt-12 w-screen max-w-[100vw] -translate-x-1/2 left-1/2 md:mt-16">
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/70 transition-colors hover:text-white md:left-6 lg:left-10"
          aria-label="Previous apps"
        >
          <Chevron className="h-8 w-8" flipped />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/80 transition-colors hover:text-white md:right-6 lg:right-10"
          aria-label="Next apps"
        >
          <Chevron className="h-8 w-8" />
        </button>

        <div ref={viewportRef} className="relative w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ x, gap: 0 }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={
              step ? { left: -(maxInternal * step), right: 0 } : undefined
            }
            dragElastic={0.06}
            onDragEnd={onDragEnd}
          >
            {loopedSlides.map((slide, i) => (
              <motion.div
                key={`${slide.src}-${i}`}
                className="relative shrink-0 select-none bg-black"
                style={{ width: slideWidth > 0 ? slideWidth : "100%" }}
                initial={false}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }
                }
                transition={{ type: "spring", stiffness: 360, damping: 26 }}
              >
                <div
                  className="relative w-full bg-neutral-950"
                  style={{ aspectRatio: "9 / 19" }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1280px) 20vw, (min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                    draggable={false}
                    priority={i === N}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[min(42%,320px)] bg-gradient-to-l from-black via-black/75 to-transparent"
            aria-hidden
          />
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap justify-center gap-2 md:mt-12">
        {APP_SLIDES.map((_, i) => {
          const inView = isLogicalSlideInView(i, internalIndex, slidesPerView);
          return (
            <button
              key={i}
              type="button"
              onClick={() => goToLogicalSlide(i)}
              className="group p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              aria-label={`Go to app ${i + 1}`}
              aria-current={inView ? "true" : undefined}
            >
              <motion.span
                className="block h-2 w-2 rounded-full bg-white/25 transition-colors group-hover:bg-white/45"
                animate={{
                  scale: inView ? 1.15 : 1,
                  backgroundColor: inView
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.28)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
