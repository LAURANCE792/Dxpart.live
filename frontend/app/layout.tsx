import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DXPart - Deriv Trading Platform',
  description: 'Advanced trading platform with analysis tools, live data, and trading bots'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-primary">
          {children}
        </main>
      </body>
    </html>
  );
}
