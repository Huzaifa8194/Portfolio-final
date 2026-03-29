import type { Metadata } from "next";

import { SrProjectView } from "@/components/projects/SrProjectView";

export const metadata: Metadata = {
  title: "Nordic Relocators — Project",
  description:
    "Multilingual immigration and relocation platform — React, Laravel, case management.",
};

export default function SrProjectPage() {
  return <SrProjectView />;
}
