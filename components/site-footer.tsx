"use client";

import { Footer } from "@/components/ui/modem-animated-footer";
import { Linkedin } from "lucide-react";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/muhammad-huzaifa-imran-340991293/";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "My work", href: "/my-work" },
];

export function SiteFooter() {
  return (
    <Footer
      brandName="Huzaifa Imran"
      brandDescription="Portfolio — visionary design bridging cultures through innovative systems."
      socialLinks={[
        {
          icon: <Linkedin className="h-6 w-6" />,
          href: LINKEDIN_URL,
          label: "LinkedIn",
        },
      ]}
      navLinks={navLinks}
    />
  );
}
