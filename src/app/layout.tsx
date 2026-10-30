import type { Metadata } from "next";
import "./globals.css";

/**
 * No `next/font/google` here on purpose.
 *
 * The site's display face (Instrument Serif) is loaded at runtime by the
 * `@import` at the top of globals.css. The five Google fonts that used to be
 * pulled in through `next/font/google` were never referenced by any component
 * and only added build-time network fetches, which made `next build` fail on
 * Vercel with `An error occurred in next/font`. The `--font-geist-sans` /
 * `--font-geist-mono` tokens are now plain system stacks in globals.css.
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
