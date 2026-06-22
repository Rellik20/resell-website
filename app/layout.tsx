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
  title: "ReSell Marketplace",
  description:
    "ReSell Marketplace is a local resale app for listing items, browsing nearby finds, and messaging buyers or sellers directly.",
  metadataBase: new URL("https://resellmarketplace.app"),
  icons: {
    icon: "/resell-logo.png",
    shortcut: "/resell-logo.png",
    apple: "/resell-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
