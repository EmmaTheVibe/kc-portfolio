import type { Metadata, Viewport } from "next";
import { themeScript } from "@/lib/themeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mark Egede — Desk OS",
  description: "A portfolio that thinks it's a computer.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
