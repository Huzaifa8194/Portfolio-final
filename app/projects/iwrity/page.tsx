import type { Metadata } from "next";

import { IwrityProjectView } from "@/components/projects/IwrityProjectView";

export const metadata: Metadata = {
  title: "iWrity — Project",
  description:
    "Community-driven reviews for self-published authors — point-based, Amazon-compliant growth.",
};

export default function IwrityProjectPage() {
  return <IwrityProjectView />;
}
