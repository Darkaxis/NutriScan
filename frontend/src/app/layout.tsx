import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'NutriScan — Food Intelligence & Nutrition Database',
  description:
    'A minimal, transparent packaged food database. Explore verified ingredients, allergens, and clinical nutrition facts across Europe.',
  keywords: ['nutrition', 'open food facts', 'nutriscore', 'ingredients', 'allergens', 'food intelligence'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAFAFA] text-zinc-900 min-h-screen flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
