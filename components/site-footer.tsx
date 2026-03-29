"use client";

import { Footer } from "@/components/ui/modem-animated-footer";
import { Linkedin, NotepadTextDashed } from "lucide-react";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/muhammad-huzaifa-imran-340991293/";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "My work", href: "/my-work" },
  { label: "Rivera Travels", href: "/projects/rivera" },
  { label: "Mayvn", href: "/projects/mayvn" },
  { label: "iWrity", href: "/projects/iwrity" },
  { label: "Best Car Events", href: "/projects/bce" },
  { label: "Oracle Grupo", href: "/projects/oracle" },
  { label: "Nordic Relocators", href: "/projects/sr" },
  { label: "Law & Bar Academy", href: "/projects/lawandbar" },
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
      brandIcon={
        <NotepadTextDashed className="text-background h-8 w-8 drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
      }
    />
  );
}
