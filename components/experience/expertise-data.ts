import type { LucideIcon } from "lucide-react";
import { Cloud, Code2, LayoutTemplate, Monitor, Smartphone } from "lucide-react";

export type ExpertiseItem = {
  index: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const EXPERTISE_ITEMS: ExpertiseItem[] = [
  {
    index: "001",
    title: "Website Design",
    description:
      "Designing intuitive, responsive websites focused on clarity and conversion.",
    Icon: Monitor,
  },
  {
    index: "002",
    title: "App Design",
    description:
      "Creating engaging and user-friendly interfaces for mobile & desktop applications.",
    Icon: Smartphone,
  },
  {
    index: "003",
    title: "Cloud Engineering",
    description:
      "Architecting scalable, secure cloud infrastructure and automated deployments for resilient, global-ready products.",
    Icon: Cloud,
  },
  {
    index: "004",
    title: "Next.JS",
    description:
      "Building fast, SEO-friendly surfaces with the App Router, server components, and edge-ready performance patterns.",
    Icon: Code2,
  },
  {
    index: "005",
    title: "Frontend",
    description:
      "Crafting polished interfaces with modern CSS, motion, and component systems that feel instant and intentional.",
    Icon: LayoutTemplate,
  },
];
