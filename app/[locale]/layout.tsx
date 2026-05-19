import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { auth } from "@/auth";
import { GlobalBentoBackground } from "@/components/shared/global-bento-background";
import { Providers } from "@/components/shared/providers";
import "./../globals.css";
import { Toaster } from "@/components/ui/sonner";
import '../../bones/registry'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const session = await auth();
  const { locale } = await params;
  const messages = await getMessages();


  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-gist-sans flex min-h-full flex-col bg-background dark:bg-foreground">
        <GlobalBentoBackground />
        <Toaster />

        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers session={session}>
            <div className="relative z-10 flex min-h-full flex-col">{children}</div>
          </Providers>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
