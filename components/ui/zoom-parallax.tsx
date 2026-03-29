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

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

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
                    ? "w-[min(94vw,1200px)] max-h-[min(52vh,680px)] aspect-[16/10] rounded-md bg-neutral-950 ring-1 ring-white/10"
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
