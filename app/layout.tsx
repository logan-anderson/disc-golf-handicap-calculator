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
  title: "Disc Golf Handicap Calculator",
  description: "Calculate your disc golf handicap based on your UDisc rating and course par rating.",
};

function Footer() {
  return (
    <footer className="border-t border-emerald-200 dark:border-emerald-800">
      <div className="flex flex-col items-center px-4 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
        <p className="mt-6 text-sm text-muted-foreground md:mt-0">
          © Copyright {new Date().getFullYear()}. All rights reserved. Made
          with ❤️ by{" "}
          <a
            href="https://logan.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-600 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Logan Anderson
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
