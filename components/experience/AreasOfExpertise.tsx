"use client";

import { motion } from "framer-motion";
import { FloatingPaths } from "@/components/ui/background-paths";
import { EXPERTISE_ITEMS, type ExpertiseItem } from "./expertise-data";

const iconMotionPresets: import("framer-motion").Target[] = [
  { y: [0, -5, 0], rotate: [0, -4, 4, 0], scale: [1, 1.05, 1] },
  { y: [0, -4, 0], rotate: [0, 6, -6, 0], scale: [1, 1.04, 1] },
  { x: [0, 3, -3, 0], y: [0, -2, 0], scale: [1, 1.08, 1] },
  { rotate: [0, 8, -8, 0], y: [0, -3, 0], scale: [1, 1.06, 1] },
  { y: [0, -4, 0], rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] },
];

function AnimatedExpertiseIcon({
  Icon,
  presetIndex,
}: {
  Icon: ExpertiseItem["Icon"];
  presetIndex: number;
}) {
  const preset = iconMotionPresets[presetIndex % iconMotionPresets.length];

  return (
    <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-md border border-white/30 bg-black/20">
      <motion.div
        animate={preset}
        transition={{
          duration: 2.8 + presetIndex * 0.15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: presetIndex * 0.12,
        }}
      >
        <Icon className="h-7 w-7 text-white" strokeWidth={1.35} aria-hidden />
      </motion.div>
    </div>
  );
}

export function AreasOfExpertise() {
  return (
    <section
      className="relative z-0 overflow-hidden border-t border-white/[0.06] bg-transparent px-6 py-20 md:px-10 md:py-28 lg:px-16"
      aria-labelledby="expertise-heading"
    >
      {/* Same path motif as hero doors + shared shader visible underneath */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <FloatingPaths position={1} svgClassName="text-white" />
        <FloatingPaths position={-1} svgClassName="text-white" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.h2
          id="expertise-heading"
          className="mb-14 text-4xl font-semibold tracking-tight text-white md:mb-20 md:text-5xl lg:text-[3.25rem]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Areas of Expertise.
        </motion.h2>

        <div className="border-t border-white/10">
          {EXPERTISE_ITEMS.map((item, i) => (
            <motion.article
              key={item.index}
              className="border-b border-white/10 py-10 md:flex md:items-start md:gap-10 md:py-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="mb-4 block font-mono text-base font-medium tabular-nums tracking-tight text-white/45 md:mb-0 md:w-20 md:shrink-0 md:pt-0.5 md:text-lg lg:text-xl lg:leading-none">
                {item.index}
              </span>

              <div className="min-w-0 flex-1 md:pr-8">
                <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 flex justify-end md:mt-0 md:shrink-0 md:justify-start">
                <AnimatedExpertiseIcon Icon={item.Icon} presetIndex={i} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
