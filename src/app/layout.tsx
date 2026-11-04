import type { Metadata } from "next";
import "./globals.css";

/**
 * Both typefaces are self-hosted in /public/fonts and declared with @font-face
 * at the top of globals.css. No `next/font/google`: the build makes no network
 * fetch, and a page load makes no third-party request.
 *
 * The preload links below are the reason the faces are not stuck in the
 * `loading` state on a cold visit. They are declared before the stylesheet is
 * even parsed, so the two woff2 files download in parallel with the CSS
 * instead of after it, which is what turned a ~4s first paint of EL PACRE into
 * a ~200ms one.
 */

export const metadata: Metadata = {
  title: "Fletcher Alderton",
  description: "Fletcher Alderton's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/ELPACRE-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/LayGrotesk-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
