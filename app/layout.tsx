import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const handwritingFont = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sreeram × Niyaa · Christmas vacation trip',
  description: 'A private shared travel savings journal for Sreeram and Niyaa saving for their Christmas vacation trip 2026.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sreeram × Niyaa',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0A0D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${handwritingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0D] text-[#F6F4EE]">
        {children}
      </body>
    </html>
  );
}
