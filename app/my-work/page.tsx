import type { Metadata } from "next";

import { MyWorkGallery } from "@/components/experience/MyWorkGallery";

export const metadata: Metadata = {
  title: "My Work — Huzaifa Imran",
  description:
    "Selected web work — portfolio gallery from What I've Built.",
};

export default function MyWorkPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <MyWorkGallery />
    </main>
  );
}
