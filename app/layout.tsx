import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huzaifa Imran",
  description:
    "Portfolio — visionary design bridging cultures through innovative systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full antialiased`}>
      <body
        className="relative min-h-full flex flex-col bg-black font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
