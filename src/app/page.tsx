'use client';

import { CVUploadForm } from '@/components/cv-upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, BrainCircuit, Edit3, Palette } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary to-accent rounded-lg shadow-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            ResuAI: Craft Your Perfect CV with AI
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Effortlessly transform your existing CV into a modern, impactful, and multilingual resume.
            Upload your PDF and let our AI do the heavy lifting.
          </p>
        </div>
      </section>

      <section>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Upload Your CV</CardTitle>
            <CardDescription className="text-center">
              Drag and drop your CV in PDF format or click to select a file. Supports English and French.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CVUploadForm />
          </CardContent>
        </Card>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileUp size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">1. Upload PDF</h3>
              <p className="text-muted-foreground">Simply upload your current CV in PDF format.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BrainCircuit size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. AI Parsing</h3>
              <p className="text-muted-foreground">Our AI extracts and structures your CV data.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Edit3 size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Edit & Enhance</h3>
              <p className="text-muted-foreground">Review, edit, and optionally enhance descriptions with AI.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Palette size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">4. Choose Template</h3>
              <p className="text-muted-foreground">Select a professional template and export your new CV.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
