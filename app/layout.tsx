import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { GlobalBentoBackground } from "@/components/shared/global-bento-background";
import { Providers } from "@/components/shared/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import '../bones/registry'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-gist-sans flex min-h-full flex-col bg-background dark:bg-foreground">
        <GlobalBentoBackground />
        <Toaster />
        <Providers session={session}>
          <div className="relative z-10 flex min-h-full flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
