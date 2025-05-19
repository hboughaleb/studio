
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
const a4Style = "p-8 border rounded-md shadow-lg min-h-[842px] w-[595px] mx-auto bg-white text-gray-900";

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
    <div className={`${a4Style}`}>
      {data.photo && (
        <div className="mb-4 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={120} height={120} className="rounded-full mx-auto shadow-md object-cover" data-ai-hint="professional portrait" />
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
    <div className={`${a4Style} flex gap-6`}>
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
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={150} height={150} className="rounded-lg shadow-md mb-4 mx-auto mt-2 object-cover" data-ai-hint="professional portrait" />
        </div>
      )}
    </div>
  );
};

const AnonymizedTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style}`}>
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
    <div className={`${a4Style} border-2 border-accent`}>
      {data.photo && (
        <div className="mb-6 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={140} height={140} className="rounded-full mx-auto ring-4 ring-primary/50 p-1 shadow-xl object-cover" data-ai-hint="dynamic portrait"/>
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
  // text-primary, text-gray-600, text-blue-600, border-gray-300 are used for specific elements.
  // These will now render based on their default Tailwind definitions on a white background.
  return (
    <div className={`${a4Style}`}>
      {data.photo && (
        <div className="mb-4 text-center">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-full mx-auto border-2 border-primary object-cover" data-ai-hint="formal portrait"/>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-1 text-center text-primary">{data.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 text-center mb-1">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 text-center mb-4 hover:underline">{data.personalInfo.contactInfo.linkedin}</p>}
      
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


const templates: { id: CVTemplate; name: string; component: React.FC<{data: CVData}> }[] = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'photoRight', name: 'Photo Right', component: PhotoRightTemplate },
  { id: 'anonymized', name: 'Anonymized', component: AnonymizedTemplate },
  { id: 'marketing', name: 'Marketing', component: MarketingTemplate },
  { id: 'finance', name: 'Finance', component: FinanceTemplate }, // Renamed from Finance (Dark)
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
      const originalBodyStyles = document.body.className;
      const originalBodyInlineStyles = document.body.style.cssText;
      
      // Store original styles from head to reapply them later
      const originalHeadStyles = Array.from(document.head.getElementsByTagName('style')).map(s => s.innerHTML);
      const originalHeadLinks = Array.from(document.head.getElementsByTagName('link')).map(l => l.outerHTML);


      document.body.innerHTML = `<div class="print-container">${printContents}</div>`;
      document.body.className = ''; // Clear body classes for print
      document.body.style.cssText = ''; // Clear inline body styles for print
      
      // Remove existing style tags to avoid conflicts, except for print-specific ones we add
      Array.from(document.head.getElementsByTagName('style')).forEach(s => s.remove());
      Array.from(document.head.getElementsByTagName('link')).filter(l => l.rel === 'stylesheet').forEach(l => l.remove());


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
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container > div { /* The A4 styled div */
             margin: 0 auto !important; 
             box-shadow: none !important; 
             border: none !important;
             transform: scale(1) !important; /* Ensure no scaling from previewer is printed */
          }
           /* Re-apply essential global styles if needed, or ensure CV templates are self-contained */
          body { font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif; }
          /* Add any other essential base styles from globals.css if they are stripped and needed */
          .bg-white { background-color: #fff !important; }
          .text-gray-900 { color: #1a202c !important; } 
          /* Add more specific styles from your templates if they don't print correctly */
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      // Restore original content and styles
      document.body.innerHTML = originalContents;
      document.body.className = originalBodyStyles;
      document.body.style.cssText = originalBodyInlineStyles;
      
      // Remove our print style
      document.head.removeChild(style);

      // Restore original styles in head
      originalHeadStyles.forEach(sContent => {
        const restoredStyle = document.createElement('style');
        restoredStyle.innerHTML = sContent;
        document.head.appendChild(restoredStyle);
      });
      originalHeadLinks.forEach(lHTML => {
         const tempDiv = document.createElement('div');
         tempDiv.innerHTML = lHTML;
         if (tempDiv.firstChild) {
            document.head.appendChild(tempDiv.firstChild);
         }
      });


    } else {
      // Fallback if printContents is not found
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
              // The scaling is applied here for preview purposes. The print function attempts to undo this.
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

