import type { Metadata } from "next";

import { MayvnProjectView } from "@/components/projects/MayvnProjectView";

export const metadata: Metadata = {
  title: "Mayvn — Project",
  description:
    "Productivity and well-being — task management, mobile-first, intuitive ecosystem.",
};

export default function MayvnProjectPage() {
  return <MayvnProjectView />;
}
