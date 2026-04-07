import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ochota na Uśmiech - Warszawskie Centrum Chirurgii Ósemek",
  description: "Specjalistyczne usuwanie ósemek w Warszawie. Bezboleśnie i profesjonalnie w dwóch lokalizacjach: Ochota i Ursynów.",
  icons: {
    icon: "/favicon.ico?v=5",
    shortcut: "/favicon.ico?v=5",
    apple: "/favicon.ico?v=5",
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