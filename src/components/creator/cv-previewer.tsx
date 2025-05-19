
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCVData } from '@/contexts/CVDataContext';
import type { CVData, CVTemplate } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Eye, Printer } from 'lucide-react';

// Common styling for A4-like preview
const a4Style = "p-8 border rounded-md shadow-lg min-h-[842px] w-[595px] mx-auto";

// --- TRANSLATION HELPER ---
const translations = {
  en: {
    profileSummary: "Profile Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    candidateProfile: "Candidate Profile",
    contactUponRequest: "Contact information available upon request.",
    keyAchievementsProfile: "Key Achievements & Profile",
    professionalJourney: "Professional Journey",
    skillsSnapshot: "Skills Snapshot",
    educationCredentials: "Education & Credentials",
  },
  fr: {
    profileSummary: "Résumé du Profil",
    workExperience: "Expérience Professionnelle",
    education: "Formation",
    skills: "Compétences",
    languages: "Langues",
    candidateProfile: "Profil du Candidat",
    contactUponRequest: "Coordonnées disponibles sur demande.",
    keyAchievementsProfile: "Réalisations Clés & Profil",
    professionalJourney: "Parcours Professionnel",
    skillsSnapshot: "Aperçu des Compétences",
    educationCredentials: "Formation & Diplômes",
  },
};

const getTranslations = (lang?: string) => {
  if (lang === 'fr') return translations.fr;
  return translations.en; // Default to English
};


// --- TEMPLATE COMPONENTS ---

const ClassicTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-white text-black`}>
      {data.photo && (
        <div className="mb-4 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={120} height={120} className="rounded-full mx-auto shadow-md" data-ai-hint="professional portrait" />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-1 text-center">{data.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 text-center mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 text-center mb-4">{data.personalInfo.contactInfo.linkedin}</p>}
      
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.profileSummary}</h2>
      <p className="text-sm whitespace-pre-line">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.workExperience}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.education}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.skills}</h2>
      <p className="text-sm">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
          ))}
        </>
      )}
    </div>
  );
};

const PhotoRightTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-white text-black flex gap-6`}>
      <div className="flex-grow w-2/3">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
        <p className="text-sm text-gray-600 mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 mb-4">{data.personalInfo.contactInfo.linkedin}</p>}
      
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.profileSummary}</h2>
        <p className="text-sm whitespace-pre-line">{data.profile}</p>

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.workExperience}</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.education}</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
            <p className="text-xs text-gray-500">{edu.dates}</p>
            {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
          </div>
        ))}

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.skills}</h2>
        <p className="text-sm">{data.skills.join(', ')}</p>

        {data.languages && data.languages.length > 0 && (
          <>
            <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.languages}</h2>
            {data.languages.map((lang, index) => (
              <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
            ))}
          </>
        )}
      </div>
      {data.photo && (
        <div className="w-1/3 pl-6 border-l border-gray-200">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={150} height={150} className="rounded-lg shadow-md mb-4 mx-auto mt-2" data-ai-hint="professional portrait" />
        </div>
      )}
    </div>
  );
};

const AnonymizedTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-white text-black`}>
      <h1 className="text-3xl font-bold mb-1 text-center">{t.candidateProfile}</h1>
      <p className="text-sm text-gray-600 text-center mb-4">{t.contactUponRequest}</p>
      
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.profileSummary}</h2>
      <p className="text-sm whitespace-pre-line">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.workExperience}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.education}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.skills}</h2>
      <p className="text-sm">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
          ))}
        </>
      )}
    </div>
  );
};

const MarketingTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-white text-black border-2 border-accent`}>
      {data.photo && (
        <div className="mb-6 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={140} height={140} className="rounded-full mx-auto ring-4 ring-primary/50 p-1 shadow-xl" data-ai-hint="dynamic portrait"/>
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-1 text-center text-primary">{data.personalInfo.name}</h1>
      <p className="text-md text-accent text-center font-semibold mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-md text-blue-500 text-center mb-6 hover:underline">{data.personalInfo.contactInfo.linkedin}</p>}
      
      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent">{t.keyAchievementsProfile}</h2>
      <p className="text-md whitespace-pre-line italic">{data.profile}</p>

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent">{t.professionalJourney}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 p-3 bg-secondary/30 rounded-lg">
          <h3 className="text-lg font-bold text-primary">{exp.title}</h3>
          <p className="text-sm font-semibold text-accent-foreground/80">{exp.company} | {exp.dates}</p>
          <ul className="list-disc list-inside text-md whitespace-pre-line pl-4 mt-1">
          {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent">{t.skillsSnapshot}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
          {data.skills.map(skill => <span key={skill} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">{skill}</span>)}
      </div>

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent">{t.educationCredentials}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-lg font-semibold">{edu.degree}</h3>
          <p className="text-md text-gray-700">{edu.institution} ({edu.dates})</p>
          {edu.description && <p className="text-sm whitespace-pre-line text-gray-600">{edu.description}</p>}
        </div>
      ))}
      
      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-md">{lang.language}: <span className="font-semibold">{lang.proficiency}</span></p>
          ))}
        </>
      )}
    </div>
  );
};

const FinanceTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-gray-800 text-gray-100 dark`}>
      <style jsx global>{`
        .dark h1, .dark h2, .dark h3 { color: #E0F2F1; } /* Light Teal for headers */
        .dark p { color: #B2DFDB; } /* Lighter Teal for text */
        .dark .text-gray-500 { color: #80CBC4 !important; } /* Teal for dates etc */
        .dark .text-blue-600 { color: #4DB6AC !important; } /* Teal for links */
        .dark .border-gray-300 { border-color: #4DB6AC !important; } /* Teal for borders */
        .dark .text-primary { color: #80CBC4 !important; } /* Override primary for dark template */
      `}</style>
      {data.photo && (
        <div className="mb-4 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-full mx-auto border-2 border-teal-400" data-ai-hint="formal portrait"/>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-1 text-center">{data.personalInfo.name}</h1>
      <p className="text-sm text-center mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-center mb-4">{data.personalInfo.contactInfo.linkedin}</p>}
      
      <h2 className="text-xl font-semibold border-b-2 pb-1 mt-6 mb-2">{t.profileSummary}</h2>
      <p className="text-sm whitespace-pre-line">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 pb-1 mt-6 mb-2">{t.workExperience}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
          <p className="text-xs">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 pb-1 mt-6 mb-2">{t.education}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 pb-1 mt-6 mb-2">{t.skills}</h2>
      <p className="text-sm">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold border-b-2 pb-1 mt-6 mb-2">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm">{lang.language}: {lang.proficiency}</p>
          ))}
        </>
      )}
    </div>
  );
};


const templates: { id: CVTemplate; name: string; component: React.FC<{data: CVData}> }[] = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'photoRight', name: 'Photo Right', component: PhotoRightTemplate },
  { id: 'anonymized', name: 'Anonymized', component: AnonymizedTemplate },
  { id: 'marketing', name: 'Marketing', component: MarketingTemplate },
  { id: 'finance', name: 'Finance (Dark)', component: FinanceTemplate },
];


interface CVPreviewerProps {
  selectedTemplate: CVTemplate;
  setSelectedTemplate: Dispatch<SetStateAction<CVTemplate>>;
}

export function CVPreviewer({ selectedTemplate, setSelectedTemplate }: CVPreviewerProps) {
  const { cvData } = useCVData();

  const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.component;

  const handlePrint = () => {
    const printContents = document.getElementById('cv-preview-area')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      const originalStyles = document.body.style.cssText;
      document.body.innerHTML = `<div class="print-container">${printContents}</div>`;
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            transform: scale(1) !important; 
          }
          .print-container > div { 
             margin: 0 auto !important; 
             box-shadow: none !important; 
             border: none !important; 
          }
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      document.body.innerHTML = originalContents;
      document.body.style.cssText = originalStyles;
      document.head.removeChild(style);
    } else {
      window.print();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-muted/30 rounded-lg shadow-sm">
      <Card className="mb-4 shadow-none border-0 bg-transparent">
        <CardHeader className="p-2 md:p-4">
          <CardTitle className="text-xl md:text-2xl text-primary">CV Preview & Templates</CardTitle>
          <CardDescription>Select a template to preview your CV. Use "Print / Export to PDF" to save.</CardDescription>
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
        <div id="cv-preview-area">
            {cvData && CurrentTemplate ? (
              <div className="transform scale-[0.80] origin-top mx-auto" style={{ width: 'calc(595px * 0.80)' }}> 
                <CurrentTemplate data={cvData} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <Eye size={48} className="mb-4 text-primary" />
                <p className="text-lg">Your CV preview will appear here.</p>
                <p>Please ensure your CV data is loaded and select a template.</p>
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
