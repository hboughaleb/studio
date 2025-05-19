import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CVDataProvider } from '@/contexts/CVDataContext';
import Link from 'next/link';
import { FileText } from 'lucide-react';

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
        <CVDataProvider>
          <div className="flex flex-col min-h-screen">
            <header className="bg-primary text-primary-foreground shadow-md">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <FileText size={28} />
                  <h1 className="text-2xl font-semibold tracking-tight">ResuAI</h1>
                </Link>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-muted text-muted-foreground py-6 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} ResuAI. All rights reserved.</p>
              <p className="mt-1">Powered by Firebase Genkit</p>
            </footer>
          </div>
          <Toaster />
        </CVDataProvider>
      </body>
    </html>
  );
}
