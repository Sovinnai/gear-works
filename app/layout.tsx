import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gear Works — Build Your Machine Shop",
  description: "Build a lasting machine-shop business. Invest in equipment, hire people, reverse-engineer gears, develop designs, and manufacture gearboxes.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
