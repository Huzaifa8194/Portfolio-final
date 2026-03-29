"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Matches Tailwind: w-[min(94vw,1200px)] aspect-[16/10] — used to compute end zoom that fits the viewport. */
function computeHeroFitScale() {
  if (typeof window === "undefined") return 1.12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w0 = Math.min(vw * 0.94, 1200);
  const h0 = w0 * (10 / 16);
  /** Small inset so the final frame isn’t flush against the bezel */
  const pad = 0.97;
  const sx = (vw * pad) / w0;
  const sy = (vh * pad) / h0;
  return Math.max(1, Math.min(sx, sy));
}

export interface ZoomParallaxImage {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Up to 7 images — index 0 is treated as a desktop site screenshot (wide frame). */
  images: ZoomParallaxImage[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const [heroEndScale, setHeroEndScale] = useState(1.12);

  useLayoutEffect(() => {
    const update = () => setHeroEndScale(computeHeroFitScale());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /** Hero (screenshot): ends exactly “contain”-fit to the viewport — not 4× like the decorative layers. */
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, heroEndScale]);

  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [heroScale, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const isHeroScreenshot = index === 0;

          return (
            <motion.div
              key={`${src}-${index}`}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${
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
                    ? "w-[min(94vw,1200px)] aspect-[16/10] rounded-md bg-neutral-950 ring-1 ring-white/10"
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
                      ? "(max-width: 768px) 94vw, 1200px"
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
