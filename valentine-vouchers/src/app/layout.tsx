import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "RR's Valentine",
  description: "A gift of hearts and surprises for Rago - a collection of personalized vouchers to make this Valentine's Day unforgettable!",
   icons: {
    icon: [
      { url: '/logo/apple-icon.png' },
      { url: '/logo/apple-icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo/apple-icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo/apple-icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/logo/apple-icon.png' },
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
