import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FOTON-ACI Motors — Ownership Papers',
  description: 'Enterprise-grade vehicle ownership papers database and requisition system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
