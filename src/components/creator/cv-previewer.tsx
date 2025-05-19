'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCVData } from '@/contexts/CVDataContext';
import type { CVTemplate } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Eye, Download, Printer } from 'lucide-react';

// Placeholder Template Components
const ClassicTemplate = ({ data }: { data: any }) => (
  <div className="p-8 border rounded-md bg-white text-black shadow-lg min-h-[842px] w-[595px] mx-auto"> {/* A4 size approx */}
    <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
    <p className="text-sm text-gray-600 mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
    {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 mb-4">{data.personalInfo.contactInfo.linkedin}</p>}
    
    {data.photo && <Image src={data.photo} alt="Profile" width={100} height={100} className="rounded-full mb-4" data-ai-hint="professional portrait" />}

    <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Profile Summary</h2>
    <p className="text-sm whitespace-pre-line">{data.profile}</p>

    <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Work Experience</h2>
    {data.experience.map((exp: any, index: number) => (
      <div key={index} className="mb-3">
        <h3 className="text-md font-semibold">{exp.title} at {exp.company}</h3>
        <p className="text-xs text-gray-500">{exp.dates}</p>
        <p className="text-sm whitespace-pre-line">{exp.description}</p>
      </div>
    ))}
     <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Education</h2>
    {data.education.map((edu: any, index: number) => (
      <div key={index} className="mb-3">
        <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
        <p className="text-xs text-gray-500">{edu.dates}</p>
        {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
      </div>
    ))}
    <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Skills</h2>
    <p className="text-sm">{data.skills.join(', ')}</p>

    {data.languages && data.languages.length > 0 && (
      <>
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Languages</h2>
        {data.languages.map((lang: any, index: number) => (
          <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
        ))}
      </>
    )}
  </div>
);

const PhotoRightTemplate = ({ data }: { data: any }) => (
  <div className="p-8 border rounded-md bg-white text-black shadow-lg min-h-[842px] w-[595px] mx-auto flex">
    <div className="flex-grow pr-4">
      <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
    {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 mb-4">{data.personalInfo.contactInfo.linkedin}</p>}
    
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Profile Summary</h2>
      <p className="text-sm whitespace-pre-line">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2">Work Experience</h2>
      {data.experience.map((exp: any, index: number) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{exp.title} at {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <p className="text-sm whitespace-pre-line">{exp.description}</p>
        </div>
      ))}
      {/* Add other sections similarly */}
    </div>
    {data.photo && (
      <div className="w-1/3 pl-4 border-l border-gray-200">
        <Image src={data.photo} alt="Profile" width={150} height={150} className="rounded-lg mb-4 mx-auto" data-ai-hint="professional portrait" />
      </div>
    )}
  </div>
);
// Add other template components similarly (Anonymized, Marketing, Finance)

const templates: { id: CVTemplate; name: string; component: React.FC<{data: any}> }[] = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'photoRight', name: 'Photo Right', component: PhotoRightTemplate },
  // Add more templates here
  { id: 'anonymized', name: 'Anonymized', component: (props) => <ClassicTemplate {...props} /> }, // Example, needs custom logic
  { id: 'marketing', name: 'Marketing', component: (props) => <ClassicTemplate {...props} /> }, // Example
  { id: 'finance', name: 'Finance (Dark)', component: (props) => <ClassicTemplate {...props} /> }, // Example
];


interface CVPreviewerProps {
  selectedTemplate: CVTemplate;
  setSelectedTemplate: Dispatch<SetStateAction<CVTemplate>>;
}

export function CVPreviewer({ selectedTemplate, setSelectedTemplate }: CVPreviewerProps) {
  const { cvData } = useCVData();

  const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.component;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col p-4 bg-muted/30 rounded-lg shadow-sm">
      <Card className="mb-4 shadow-none border-0 bg-transparent">
        <CardHeader className="p-2 md:p-4">
          <CardTitle className="text-xl md:text-2xl text-primary">CV Preview & Templates</CardTitle>
          <CardDescription>Select a template to preview your CV. Use browser's "Print to PDF" to export.</CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {templates.map(template => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? 'default' : 'outline'}
                onClick={() => setSelectedTemplate(template.id)}
                className="flex-grow sm:flex-grow-0"
              >
                {template.name}
              </Button>
            ))}
          </div>
           <Button onClick={handlePrint} variant="secondary" className="w-full">
            <Printer className="mr-2 h-4 w-4" /> Print / Export to PDF
          </Button>
        </CardContent>
      </Card>
      
      <ScrollArea className="flex-grow bg-background p-2 md:p-4 rounded-md shadow-inner">
        {cvData && CurrentTemplate ? (
          <div className="transform scale-[0.85] origin-top"> {/* Scale down for better fit */}
            <CurrentTemplate data={cvData} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Eye size={48} className="mb-2" />
            <p>Select a template to preview your CV.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
