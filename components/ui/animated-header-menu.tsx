"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "My work", href: "/my-work" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-5 w-6">
      <motion.span
        className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-white"
        style={{ originX: "50%" }}
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
      <motion.span
        className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-white"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-white"
        style={{ originX: "50%" }}
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
    </span>
  );
}

export function AnimatedHeaderMenu({
  brand,
  className,
}: {
  brand?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const activeHref = useMemo(() => {
    if (pathname === "/") return "/";
    return NAV_ITEMS.find((n) => n.href === pathname)?.href ?? pathname;
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "relative z-[60] flex items-center justify-between",
        className,
      )}
    >
      {brand ? (
        <span className="text-sm font-medium tracking-tight text-white md:text-base">
          {brand}
        </span>
      ) : (
        <span className="text-sm font-medium tracking-tight text-white md:text-base">
          Menu
        </span>
      )}

      {/* Desktop links */}
      <nav className="hidden items-center gap-6 md:flex">
        {NAV_ITEMS.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative text-sm font-medium tracking-tight text-white/80 transition-colors hover:text-white md:text-base",
                isActive ? "text-white" : undefined,
              )}
            >
              <span className="relative inline-block">
                {item.label}
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-[2px] origin-left rounded-full bg-white"
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center justify-center rounded-md px-2 py-1 text-white/90 transition-opacity hover:opacity-80 md:hidden"
      >
        <HamburgerIcon open={open} />
        <span className="sr-only">Open menu</span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              key="panel"
              id={panelId}
              role="dialog"
              aria-modal="true"
              initial={
                reduceMotion ? { y: 0, opacity: 0 } : { y: -12, opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={
                reduceMotion ? { y: 0, opacity: 0 } : { y: -12, opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="fixed left-0 right-0 top-0 z-[81] pt-4"
            >
              <div className="mx-auto w-full max-w-[520px] px-6">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 shadow-[0_30px_100px_-40px_rgba(255,255,255,0.18)] backdrop-blur">
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm font-medium tracking-tight text-white">
                      {brand ?? "Menu"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md p-2 text-white/80 transition hover:bg-white/5 hover:text-white"
                      aria-label="Close menu"
                    >
                      <span className="text-lg leading-none">×</span>
                    </button>
                  </div>

                  <nav className="flex flex-col gap-2 px-2 pb-5">
                    {NAV_ITEMS.map((item, i) => {
                      const isActive = activeHref === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-white/90 transition-colors hover:bg-white/5 hover:text-white",
                              isActive ? "bg-white/5 text-white" : undefined,
                            )}
                          >
                            <span>{item.label}</span>
                            <span aria-hidden className="text-white/60">
                              →
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

