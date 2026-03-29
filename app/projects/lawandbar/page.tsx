import type { Metadata } from "next";

import { LawAndBarProjectView } from "@/components/projects/LawAndBarProjectView";

export const metadata: Metadata = {
  title: "Law & Bar Academy — Project",
  description:
    "E-learning marketplace for legal professionals — Next.js, AWS S3, secure payments.",
};

export default function LawAndBarProjectPage() {
  return <LawAndBarProjectView />;
}
