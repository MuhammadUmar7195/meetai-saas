import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet.AI - AI-Powered Meeting Platform",
  description: "Connect, collaborate, and innovate with AI-powered meetings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.className} antialiased`}
          >
            <Toaster position="top-right" />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
