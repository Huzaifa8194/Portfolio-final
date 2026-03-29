"use client";

import dynamic from "next/dynamic";

const PaperShaderBackdrop = dynamic(() => import("@/components/ui/background-paper-shaders"), {
  ssr: false,
  loading: () => null,
});

/**
 * WebGL shader layer. Place inside a `relative` parent so `absolute inset-0` fills that section only.
 */
export function HeroExpertiseBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden" aria-hidden>
      <PaperShaderBackdrop />
    </div>
  );
}
