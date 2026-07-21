import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/providers/global-providers";
import { GoogleTagManager } from "@next/third-parties/google";

import localFont from "next/font/local";
import { GTM_ID } from "@/constants/base";
import { GTMInitializer } from "@/components/analytics/gtmInit";
import { Analytics } from "@vercel/analytics/react";
import Pixel from "@/components/Pixel";

const BebasNeue = localFont({
  src: "../../public/fonts/BebasNeue-Regular.ttf", // or use a Google Font variant
  variable: "--font-heading",
});

const InterFont = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevate Your Ping | Table Tennis Training Reinvented",
  description:
    "Master your table tennis skills with Elevate Your Ping — structured drills, expert coaching, and AI-powered insights to help you level up faster.",
  keywords: [
    "table tennis training",
    "ping pong drills",
    "table tennis coaching",
    "elevate your ping",
    "ping pong footwork",
    "online sports training",
    "AI sports analysis",
  ],
  icons: {
    icon: "/favicon/web-app-manifest-192x192.png",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/icon0.svg",
  },
  openGraph: {
    title: "Elevate Your Ping | Table Tennis Training Reinvented",
    description:
      "Train smarter, not harder. Explore drills, tips, and coaching designed to elevate your table tennis game.",
    url: "https://elevateyourping.com",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://elevateyourping.com/og-image.jpg", // TODO: replace with your real image path
        width: 1200,
        height: 630,
        alt: "Elevate Your Ping - Table Tennis Training Platform",
      },
    ],
    type: "website",
  },
  // TODO: add all social media
  twitter: {
    card: "summary_large_image",
    title: "Elevate Your Ping",
    description:
      "Level up your table tennis skills with structured training, expert coaching, and video analysis tools.",
    images: ["https://elevateyourping.com/og-image.jpg"], // same as above
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId={GTM_ID} />
      <body
        suppressHydrationWarning
        className={`${InterFont.variable} ${BebasNeue.variable} antialiased`}>
        <GTMInitializer />
        <Analytics />
        <Pixel />
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
