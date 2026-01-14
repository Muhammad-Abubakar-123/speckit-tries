import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "doit - Goal Tracking App",
  description: "A simple, beautiful goal tracking application to organize and achieve your objectives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#F8F8F8" />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {children}
        </div>
      </body>
    </html>
  );
}
