import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlowUp - Beauty at Your Doorstep",
  description:
    "Book professional beauty specialists who come to your home. Hair, nails, makeup, skincare, and more.",
  keywords: "beauty, home service, hair stylist, nail technician, makeup artist, booking",
  authors: [{ name: "GlowUp" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#d946a8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
