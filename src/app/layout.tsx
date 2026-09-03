import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CE399TD7TE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CE399TD7TE');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
