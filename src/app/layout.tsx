import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Preloader } from "@/components/layout/Preloader";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { InquiryProvider } from "@/context/InquiryContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nij Scientific",
  description: "Precision analytical balances and laboratory equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-deep-twilight-100 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <InquiryProvider>
            <Preloader />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <FooterWrapper />
            
            <WhatsAppButton />
            <Toaster position="top-center" richColors />
          </InquiryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
