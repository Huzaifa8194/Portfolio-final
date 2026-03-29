import type { Metadata } from "next";

import { RiveraProjectView } from "@/components/projects/RiveraProjectView";

export const metadata: Metadata = {
  title: "Rivera Travels — Project",
  description:
    "Travel planning and booking — destinations, packages, responsive UI, performance.",
};

export default function RiveraProjectPage() {
  return <RiveraProjectView />;
}
