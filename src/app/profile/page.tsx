
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserCircle2 className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">User Profile</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg font-semibold">{user.displayName || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-sm text-muted-foreground">{user.uid}</p>
          </div>
           <Button onClick={() => router.push('/')} className="w-full mt-4">Go to Homepage</Button>
        </CardContent>
      </Card>
    </div>
  );
}
