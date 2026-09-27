import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaneGuard — Make Your Windows Safer for Birds",
  description:
    "Assess potential bird-window collision factors, preview bird-friendly designs, and build a personalized window treatment plan.",
  openGraph: {
    title: "PaneGuard — Make Your Windows Safer for Birds",
    description:
      "Assess potential bird-window collision factors, preview bird-friendly designs, and build a personalized window treatment plan.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body>
    </html>
  );
}
