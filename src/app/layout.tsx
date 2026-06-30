import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Native OS",
  description: "A local-first solo-builder workspace for shaping ideas into GitHub-ready projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
