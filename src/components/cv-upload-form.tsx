'use client';

import type { ChangeEvent, DragEvent } from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCVData } from '@/contexts/CVDataContext';
import { parseCvData, type ParseCvDataInput } from '@/ai/flows/parse-cv-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CVUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // For visual feedback, not actual upload
  const { setCvData, setIsLoading, setError: setContextError, isLoading } = useCVData();
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadProgress(0); // Reset progress
      setContextError(null);
    }
  };

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (event.dataTransfer.files[0].type === "application/pdf") {
        setFile(event.dataTransfer.files[0]);
        setUploadProgress(0);
        setContextError(null);
      } else {
        setContextError("Invalid file type. Please upload a PDF.");
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  }, [setContextError, toast]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      setContextError("Please select a file to upload.");
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setContextError(null);
    setUploadProgress(30); // Simulate upload progress

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Pdf = reader.result as string;
        setUploadProgress(60); // Simulate processing start

        const input: ParseCvDataInput = { pdfDataUri: base64Pdf };
        const parsedData = await parseCvData(input);
        
        setUploadProgress(100); // Parsing complete
        
        setCvData({ ...parsedData, fileName: file.name, photo: undefined });

        toast({
          title: "CV Parsed Successfully!",
          description: "Your CV data has been extracted. You can now edit and preview it.",
        });
        router.push('/creator');
      };
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      }
    } catch (err) {
      console.error("Error parsing CV:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during parsing.";
      setContextError(`Error parsing CV: ${errorMessage}`);
      toast({
        title: "Parsing Failed",
        description: `Could not parse the CV. ${errorMessage}`,
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
      >
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="cv-upload"
        />
        <label htmlFor="cv-upload" className="cursor-pointer">
          <UploadCloud size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-semibold text-foreground">
            {file ? 'File selected:' : 'Drag & drop PDF here, or click to select'}
          </p>
          {file && <p className="text-sm text-muted-foreground mt-1">{file.name}</p>}
          {!file && <p className="text-sm text-muted-foreground mt-1">Max file size: 10MB</p>}
        </label>
      </div>

      {file && uploadProgress > 0 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
      
      {isLoading && (
        <div className="flex items-center justify-center text-primary">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing your CV... This may take a moment.
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!file || isLoading} className="w-full text-lg py-6">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Parsing...
          </>
        ) : file ? (
          <>
            <FileCheck className="mr-2 h-5 w-5" />
            Parse Selected CV
          </>
        ) : (
          'Upload & Parse CV'
        )}
      </Button>
    </div>
  );
}
