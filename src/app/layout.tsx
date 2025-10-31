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

const pageDescription =
  "A personal knowledge base capturing product craft, design systems, and collaborative playbooks.";

export const metadata: Metadata = {
  title: "CZ TECH - Software Engineer & Tech Instructor",
  description: pageDescription,
  openGraph: {
    title: "CZ TECH",
    description: pageDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CZ TECH",
    description: pageDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
