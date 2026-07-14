import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surety Bond Platform',
  description: 'Customer, underwriter and admin portal for surety bond processing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
