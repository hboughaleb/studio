'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCVData } from '@/contexts/CVDataContext';
import { CVEditor } from '@/components/creator/cv-editor';
import { CVPreviewer } from '@/components/creator/cv-previewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Divide } from 'lucide-react';
import type { CVTemplate } from '@/types/cv';
import { Toaster } from '@/components/ui/toaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function CreatorPage() {
  const { cvData, isLoading: contextLoading, error: contextError } = useCVData();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('classic');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!contextLoading && !cvData && !contextError) {
      // If there's no data and no error being loaded, redirect to home
      // This might happen if user directly navigates to /creator
      // router.replace('/');
    }
  }, [cvData, contextLoading, contextError, router]);


  if (!isClient || contextLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium">Loading CV data...</p>
        </div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Error Loading CV Data</h2>
        <p className="text-destructive-foreground mb-6">{contextError}</p>
        <Button onClick={() => router.push('/')} variant="destructive">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Upload
        </Button>
      </div>
    );
  }
  
  if (!cvData) {
     return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-4">
        <h2 className="text-2xl font-semibold text-foreground mb-4">No CV Data Found</h2>
        <p className="text-muted-foreground mb-6">
          It seems no CV data was loaded. Please upload your CV first.
        </p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Upload CV
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-var(--header-height,150px))] flex flex-col">
       <style jsx global>{`
        :root {
          --header-height: 150px; /* Approximate header/footer height */
        }
      `}</style>
      <ResizablePanelGroup direction="horizontal" className="flex-grow border rounded-lg shadow-inner bg-card">
        <ResizablePanel defaultSize={45} minSize={30}>
          <ScrollArea className="h-full p-1 md:p-2">
            <CVEditor />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <ScrollArea className="h-full p-1 md:p-2">
            <CVPreviewer selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
    </div>
  );
}
