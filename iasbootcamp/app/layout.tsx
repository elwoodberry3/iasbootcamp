import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The IAS Bootcamp — Become the one AI can't replace",
  description:
    "Free training: how to use AI and automation to become more valuable at work — no coding degree, no hype, just builds. From I Automate Shit.",
  openGraph: {
    title: "The IAS Bootcamp — Become the one AI can't replace",
    description:
      "Free, no-fluff training on using AI and automation to level up your career. Just builds.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
