import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ochota na Uśmiech - Warszawskie Centrum Chirurgii Ósemek",
  description: "Specjalistyczne usuwanie ósemek w Warszawie. Ochota i Ursynów.",
  icons: {
    icon: "/favicon.ico?v=1", // v=1 wymusza odświeżenie ikony
    apple: "/favicon.ico?v=1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}