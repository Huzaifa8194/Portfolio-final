"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { cn } from "@/lib/utils";

export interface ZoomParallaxImage {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Up to 7 images — index 0 is treated as a desktop site screenshot (wide frame). */
  images: ZoomParallaxImage[];
}

/** Longer scroll track so scrollYProgress reliably reaches ~1 and the zoom can finish. */
const SCROLL_SECTION_VH = 520;

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /**
   * Hero: stronger zoom (smaller start) → 1 at end (still viewport-bounded by CSS).
   * Slightly front-loaded so the main shot reads “done” before the very last pixels of scroll.
   */
  const scaleHero = useTransform(scrollYProgress, [0, 0.78, 1], [0.28, 1, 1]);

  /** Decorative layers: zoom a bit, then disappear so only the hero remains at the end */
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 2.1]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 2.2]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 2.35]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 2.65]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const opacityDecor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.62, 0.88, 1],
    [1, 0.92, 0.55, 0.12, 0],
  );

  return (
    <div
      ref={container}
      className="relative"
      style={{ height: `${SCROLL_SECTION_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const isHeroScreenshot = index === 0;
          const scale = isHeroScreenshot ? scaleHero : scales[index % scales.length];

          return (
            <motion.div
              key={`${src}-${index}`}
              style={
                isHeroScreenshot
                  ? { scale, transformOrigin: "center center", zIndex: 30 }
                  : {
                      scale,
                      opacity: opacityDecor,
                      transformOrigin: "center center",
                      zIndex: index,
                    }
              }
              className={`pointer-events-none absolute top-0 flex h-full w-full items-center justify-center ${
                index === 1
                  ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]"
                  : ""
              } ${index === 2 ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]" : ""} ${
                index === 3
                  ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]"
                  : ""
              } ${index === 4 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]" : ""} ${
                index === 5
                  ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]"
                  : ""
              } ${index === 6 ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]" : ""} `}
            >
              <div
                className={cn(
                  "relative overflow-hidden shadow-2xl",
                  isHeroScreenshot
                    ? "w-[min(96vw,1200px)] max-h-[min(82vh,900px)] aspect-[16/10] rounded-md bg-neutral-950 ring-1 ring-white/10"
                    : "h-[25vh] w-[25vw] rounded-sm",
                )}
              >
                <Image
                  src={src}
                  alt={alt ?? `Parallax image ${index + 1}`}
                  fill
                  className={cn(
                    isHeroScreenshot ? "object-contain object-top" : "object-cover",
                  )}
                  sizes={
                    isHeroScreenshot
                      ? "(max-width: 768px) 96vw, 1200px"
                      : "(max-width: 768px) 90vw, 25vw"
                  }
                  draggable={false}
                  priority={index === 0}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
