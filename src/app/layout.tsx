import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhanvi & Eshlok – Wedding",
  description:
    "Bhanvi and Eshlok invite you to grace them with your presence and blessings in their wedding celebrations across Bhopal and Ayodhya this November.",
  keywords: [
    "Bhanvi and Eshlok wedding",
    "B&E wedding",
    "MeantToB.E.",
    "Bhopal wedding",
    "Ayodhya wedding",
    "Indian wedding 2025",
    "destination wedding",
    "wedding RSVP",
    "wedding invite",
    "Bhanvi Shukla",
    "Eshlok",
  ],
  openGraph: {
    title: "Bhanvi & Eshlok – Wedding",
    description:
      "Join us as we celebrate the union of Bhanvi and Eshlok in Bhopal & Ayodhya. RSVP to be part of our story.",
    url: "https://be4.life",
    siteName: "Bhanvi & Eshlok Wedding",
    images: [
      {
        url: "https://be4.life/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bhanvi & Eshlok Wedding Invitation",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhanvi & Eshlok – Wedding",
    description:
      "Bhanvi and Eshlok invite you to their wedding celebrations in Bhopal & Ayodhya. RSVP now.",
    images: ["https://be4.life/og-image.png"],
    creator: "@meantToBE", // if you want a playful handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#C76E47", // Terracotta tone — matches bride's theme palette
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="his">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
