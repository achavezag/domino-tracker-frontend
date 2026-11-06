import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import AppShell from './components/app-shell';
import ThemeScript from './components/theme-script';
import ThemeSystemSync from './components/theme-system-sync';
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SerwistProvider } from '@serwist/next/react';

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Domino",
  description: "Domino Tracker",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased h-screen overflow-hidden">
        <ThemeSystemSync />
        <SerwistProvider swUrl="/sw.js" disable={process.env.NODE_ENV !== "production"}>
          <QueryProvider>
            <TooltipProvider>
              <AppShell>{children}</AppShell>
              <Toaster position="bottom-right" richColors/>
            </TooltipProvider>
          </QueryProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
