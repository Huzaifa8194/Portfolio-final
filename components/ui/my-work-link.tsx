"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/** Homepage CTA — shared between “What I’ve Built” and “Apps I’ve Built.” */
export function MyWorkLink() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="inline-flex"
      initial={false}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <Link
        href="/my-work"
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-white/90 bg-black px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-none transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </span>
        <span className="relative z-[1]">My Work</span>
        <span className="relative z-[1] inline-flex transition-transform duration-300 ease-out group-hover:translate-x-0.5">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}
