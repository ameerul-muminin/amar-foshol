import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "আমার ফসল | Amar Foshol - Smart Farming for Bangladesh",
  description: "স্মার্ট আবহাওয়া সতর্কতা এবং কৃষি পরামর্শের মাধ্যমে বাংলাদেশের কৃষকদের ফসল রক্ষা করুন। Helping Bangladeshi farmers reduce post-harvest food losses through smart weather alerts and actionable guidance.",
  keywords: ["আমার ফসল", "Amar Foshol", "Bangladesh farming", "crop management", "weather alerts", "কৃষি", "ফসল", "আবহাওয়া"],
  authors: [{ name: "Team SteveJobs" }],
  creator: "Team SteveJobs - EDU HackFest 2025",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "আমার ফসল | Amar Foshol",
    description: "Smart farming solution for Bangladeshi farmers - Weather alerts, crop tracking, and AI-powered guidance.",
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "আমার ফসল | Amar Foshol",
    description: "Smart farming solution for Bangladeshi farmers",
  },
};
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="আমার ফসল" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="bottom-center"
          richColors
          expand={true}
          duration={8000}
          closeButton
          toastOptions={{
            style: {
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
