"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  className?: string;
}

export function Footer({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  className,
}: FooterProps) {
  return (
    <section className={cn("relative mt-0 w-full overflow-hidden", className)}>
      <footer className="bg-background relative mt-20 border-t">
        <div className="relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-between p-4 py-10 sm:min-h-[26rem] md:min-h-[30rem]">
          <div className="mb-12 flex w-full flex-col sm:mb-20 md:mb-0">
            <div className="flex w-full flex-col items-center">
              <div className="flex flex-1 flex-col items-center space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-3xl font-bold">
                    {brandName}
                  </span>
                </div>
                <p className="text-muted-foreground w-full max-w-sm px-4 text-center font-semibold sm:w-96 sm:px-0">
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="mb-8 mt-3 flex gap-4">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="h-6 w-6 duration-300 hover:scale-110">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="text-muted-foreground flex max-w-full flex-wrap justify-center gap-4 px-4 text-sm font-medium">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      className="hover:text-foreground duration-300 hover:font-semibold"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-center gap-2 px-4 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-1 md:px-0">
            <p className="text-muted-foreground text-center text-base md:text-left">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <Link
                  href={creatorUrl}
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground text-base transition-colors duration-300 hover:font-medium"
                  rel="noopener noreferrer"
                >
                  Crafted by {creatorName}
                </Link>
              </nav>
            )}
          </div>
        </div>

        <div
          className="from-foreground/20 via-foreground/10 text-transparent pointer-events-none absolute bottom-16 left-1/2 max-w-[95vw] -translate-x-1/2 select-none bg-gradient-to-b to-transparent bg-clip-text px-4 text-center font-extrabold leading-none tracking-tighter md:bottom-12"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
          }}
        >
          {brandName.toUpperCase()}
        </div>
      </footer>
    </section>
  );
}
