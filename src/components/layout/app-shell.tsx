
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { FileText, ScanSearch, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/'); // Optional: redirect to home after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText size={28} />
            <h1 className="text-2xl font-semibold tracking-tight">ResuAI</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/creator" className="text-sm font-medium hover:underline">
              CV Creator
            </Link>
            <Link href="/analyzer" className="flex items-center gap-1 text-sm font-medium hover:underline">
              <ScanSearch size={18} /> Job Analyzer
            </Link>
            {!isLoading && user ? (
              <>
                <Link href="/profile" className="flex items-center gap-1 text-sm font-medium hover:underline">
                  <UserCircle size={18} /> Profile
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm font-medium hover:underline text-primary-foreground hover:bg-primary/80">
                  <LogOut size={18} className="mr-1" /> Logout
                </Button>
              </>
            ) : !isLoading ? (
              <>
                <Link href="/auth/login" className="text-sm font-medium hover:underline flex items-center gap-1">
                  <LogIn size={18} /> Login
                </Link>
                <Link href="/auth/register" className="text-sm font-medium hover:underline bg-accent text-accent-foreground px-3 py-1.5 rounded-md flex items-center gap-1">
                  <UserPlus size={18} /> Register
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-muted text-muted-foreground py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} ResuAI. All rights reserved.</p>
        <p className="mt-1">Powered by Firebase Genkit</p>
      </footer>
      <Toaster /> {/* Toaster is now here */}
    </div>
  );
}
