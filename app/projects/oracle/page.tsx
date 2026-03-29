import type { Metadata } from "next";

import { OracleGrupoProjectView } from "@/components/projects/OracleGrupoProjectView";

export const metadata: Metadata = {
  title: "Oracle Grupo — Project",
  description:
    "Crypto mining rental platform — dashboards, performance analytics, transparency.",
};

export default function OracleProjectPage() {
  return <OracleGrupoProjectView />;
}
