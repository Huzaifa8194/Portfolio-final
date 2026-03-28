"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface ScrollExpandMediaProps {
  expandProgress: MotionValue<number>;
  /** Multiplies center titles, tags, scroll hint — expansion imagery stays on its own opacity curve */
  chromeOpacity: MotionValue<number>;
  /** Optional override for the “Scroll to explore” line (combined with chromeOpacity in parent) */
  hintOpacity?: MotionValue<number>;
  mediaSrc: string;
  mediaFallbackSrc?: string;
  bgImageSrc: string;
  title: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Scroll-driven “expand media” (driven by `scrollYProgress` → `expandProgress` upstream).
 * No wheel/touch capture — respects the hero scroll-lock track.
 */
export default function ScrollExpandMedia({
  expandProgress,
  chromeOpacity,
  hintOpacity,
  mediaSrc,
  mediaFallbackSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
  className,
  contentClassName,
}: ScrollExpandMediaProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mediaSrcState, setMediaSrcState] = useState(mediaSrc);

  useEffect(() => {
    setMediaSrcState(mediaSrc);
  }, [mediaSrc]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /** Softer bg fade on expand — same treatment for every project slide */
  const bgOpacity = useTransform(expandProgress, (ep) => 1 - ep * 0.85);

  const mediaWidth = useTransform(expandProgress, (ep) => {
    const w = isMobile ? 650 : 1250;
    return 300 + ep * w;
  });
  const mediaHeight = useTransform(expandProgress, (ep) => {
    const h = isMobile ? 200 : 400;
    return 400 + ep * h;
  });
  const textTranslateX = useTransform(expandProgress, (ep) => {
    const x = isMobile ? 180 : 150;
    return ep * x;
  });

  const childrenOpacity = useTransform(expandProgress, (ep) => {
    if (ep < 0.75) return 0;
    if (ep >= 1) return 1;
    return (ep - 0.75) / 0.25;
  });

  const dateShiftX = useTransform(textTranslateX, (v) => `-${v}vw`);
  const hintShiftX = useTransform(textTranslateX, (v) => `${v}vw`);
  const titleFirstShiftX = useTransform(textTranslateX, (v) => `-${v}vw`);
  const titleRestShiftX = useTransform(textTranslateX, (v) => `${v}vw`);

  const hintLineOpacity = hintOpacity
    ? useTransform([hintOpacity, chromeOpacity], ([h, c]) => Number(h) * Number(c))
    : chromeOpacity;

  const titleChromeOpacity = chromeOpacity;

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      className={cn(
        "h-full min-h-0 overflow-x-hidden transition-colors duration-700 ease-in-out",
        className,
      )}
    >
      <section className="relative flex h-full min-h-0 flex-col items-center justify-start">
        <div className="relative flex h-full min-h-0 w-full flex-col items-center">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            style={{ opacity: bgOpacity }}
            aria-hidden
          >
            <div className="relative h-full w-full">
              <Image
                src={bgImageSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />
          </motion.div>

          <div className="relative z-10 flex h-full min-h-0 w-full max-w-[100vw] flex-1 flex-col items-center justify-center px-0">
            <div className="relative flex w-full flex-1 flex-col items-center justify-center py-8">
              <motion.div
                className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-none"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <Image
                    src={mediaSrcState}
                    alt={title || "Project"}
                    fill
                    sizes="(max-width: 768px) 95vw, 1280px"
                    className="object-cover"
                    onError={() => {
                      if (mediaFallbackSrc) setMediaSrcState(mediaFallbackSrc);
                    }}
                  />
                </div>

                <motion.div
                  className="relative z-10 mt-4 flex flex-col items-center text-center transition-none"
                  style={{ opacity: titleChromeOpacity }}
                >
                  {date ? (
                    <motion.p
                      className="text-lg text-sky-200/95 md:text-2xl"
                      style={{ x: dateShiftX }}
                    >
                      {date}
                    </motion.p>
                  ) : null}
                  {scrollToExpand ? (
                    <motion.p
                      className="text-center font-medium text-sky-200/90"
                      style={{ x: hintShiftX, opacity: hintLineOpacity }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  ) : null}
                </motion.div>
              </motion.div>

              <motion.div
                className={cn(
                  "relative z-10 flex w-full flex-col items-center justify-center gap-3 text-center transition-none md:gap-4",
                  textBlend ? "mix-blend-difference" : "mix-blend-normal",
                )}
                style={{ opacity: titleChromeOpacity }}
              >
                <motion.h2
                  className="max-w-[95vw] text-3xl font-bold text-white transition-none sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ x: titleFirstShiftX }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="max-w-[95vw] text-center text-3xl font-bold text-white transition-none sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ x: titleRestShiftX }}
                >
                  {restOfTitle}
                </motion.h2>
              </motion.div>
            </div>

            {children ? (
              <motion.div
                className={cn(
                  "flex w-full flex-col px-6 py-8 md:px-16 md:py-12 lg:py-16",
                  contentClassName,
                )}
                style={{ opacity: childrenOpacity }}
              >
                {children}
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
