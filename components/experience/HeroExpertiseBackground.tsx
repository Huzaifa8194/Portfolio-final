"use client";

import dynamic from "next/dynamic";

const PaperShaderBackdrop = dynamic(() => import("@/components/ui/background-paper-shaders"), {
  ssr: false,
  loading: () => null,
});

/**
 * Single scroll-height backdrop for the hero + Areas of Expertise block so the shader reads as one
 * continuous layer (not split per section).
 */
export function HeroExpertiseBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <PaperShaderBackdrop />
    </div>
  );
}
