import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AD PLUS Assistant",
  description: "Get instant information about services in Abu Dhabi with our AI-powered assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-gray-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
