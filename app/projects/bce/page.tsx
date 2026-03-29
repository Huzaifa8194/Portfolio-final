import type { Metadata } from "next";

import { BceProjectView } from "@/components/projects/BceProjectView";

export const metadata: Metadata = {
  title: "Best Car Events — Project",
  description:
    "Global automotive events search — performance, filters, scalable event data.",
};

export default function BceProjectPage() {
  return <BceProjectView />;
}
