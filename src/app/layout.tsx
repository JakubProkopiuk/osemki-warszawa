import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Ósemki Ursynów | Szybka kwalifikacja bólu ósemki',
  description:
    'Lokalna kwalifikacja problemów z ósemkami na Ursynowie. Sprawdź, czy sensowna jest konsultacja chirurgiczna, RTG lub pilniejszy kontakt telefoniczny.',
  verification: {
    google: '_vO5_sjty4HV81TiSXbD7Tuu5opYlFzhJimN4ZnF1Ks',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
