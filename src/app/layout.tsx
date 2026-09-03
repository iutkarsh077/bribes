import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "JanSeva | National Civic Integrity & Public Grievance Archive",
  description:
    "An independent, non-partisan public registry documenting unauthorized bribe demands, public duty failures, and civic extortion across India in compliance with whistleblower protections.",
  keywords: [
    "JanSeva",
    "Bribe Reporting India",
    "Anti-Corruption Registry",
    "Public Service Grievance",
    "Civic Transparency",
    "Whistleblower Protection",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
