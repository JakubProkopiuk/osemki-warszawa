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

// TUTAJ DODAŁEM TWÓJ KOD WERYFIKACYJNY GOOGLE
export const metadata: Metadata = {
  title: 'Usuwanie Ósemek Warszawa | Ochota na Uśmiech',
  description: 'Profesjonalne i bezbolesne usuwanie zębów mądrości w Warszawie. Najnowocześniejsza chirurgia stomatologiczna.',
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
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}