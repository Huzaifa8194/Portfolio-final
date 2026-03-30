import type { Metadata } from "next";
import { StarsBackgroundDemo } from "@/components/animate-ui/components/backgrounds/stars-background-demo";

import { MyWorkGallery } from "@/components/experience/MyWorkGallery";
import { AnimatedHeaderMenu } from "@/components/ui/animated-header-menu";

export const metadata: Metadata = {
  title: "My Work — Huzaifa Imran",
  description:
    "Selected web work — portfolio gallery from What I've Built.",
};

export default function MyWorkPage() {
  return (
    <main className="relative isolate min-h-[100dvh] bg-black text-white overscroll-none">
      <StarsBackgroundDemo />
      <AnimatedHeaderMenu
        brand="Huzaifa Imran"
        className="absolute left-0 right-0 top-0 z-10 px-6 pt-6 md:px-10 md:pt-8"
      />
      <div className="relative z-10 pt-16 md:pt-20">
        <MyWorkGallery />
      </div>
    </main>
  );
}
