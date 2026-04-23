import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalBentoBackground } from "@/components/shared/global-bento-background";
import { Providers } from "@/components/shared/providers";
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
  title: "Allocate Platform",
  description: "Plan, assign, and track work in one collaborative dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col bg-background dark:bg-foreground font-gist-sans">
        <GlobalBentoBackground />
        <Providers>
          <div className="relative z-10 flex min-h-full flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
