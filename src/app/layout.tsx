import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Yadav | Portfolio",
  description: "Premium developer portfolio of Aditya Yadav, Computer Engineering student and Java Developer.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorFollower } from "../components/CursorFollower";
import IntroWrapper from "@/components/IntroWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
                  originalWarn.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${geistMono.variable} font-sans antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <IntroWrapper />
          <CursorFollower />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
