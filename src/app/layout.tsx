
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// Toaster has been moved to AppShell as it uses client-side hooks
import { CVDataProvider } from '@/contexts/CVDataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/app-shell'; // New import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ResuAI: Craft Your Perfect CV with AI',
  description: 'Upload, parse, edit, and design your CV with AI assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CVDataProvider>
            <AppShell>{children}</AppShell>
          </CVDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
