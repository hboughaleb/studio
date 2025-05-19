
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCVData } from '@/contexts/CVDataContext';
import type { CVData, CVTemplate } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Eye, Printer, Briefcase, Users, Globe, Lightbulb, Activity, Star, ShieldCheck, Bot, Landmark, FileText, MapPin, Cpu, Database, UsersRound, Trophy, BarChart3, Award, Handshake, FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Common styling for A4-like preview
const a4Style = "p-8 border rounded-md shadow-lg min-h-[1188px] w-[840px] mx-auto bg-white text-gray-900 font-sans"; // Increased size slightly for two-column

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
    techStack: "Technology Stack",
    toolsProficiency: "Tools Proficiency",
    kpisAndMetrics: "KPIs & Metrics",
    analyticsReporting: "Analytics & Reporting Snapshot",
    automatedProcesses: "Automated Processes Implemented",
    aiToolsUsed: "AI Tools Utilized",
    advisoryProjects: "Advisory Projects",
    boardExperience: "Boardroom Experience",
    geographicReach: "Geographic Reach",
    globalRoles: "Global Roles",
    localMissions: "Local Missions",
    deiAndCulturalFit: "DEI & Cultural Fit",
    techStacksHiredFor: "Tech Stacks Hired For",
    industryFocus: "Industry Focus",
    impactMetrics: "Impact Metrics",
    researchMethodologies: "Research Methodologies",
    mappingTools: "Mapping Tools",
    publicationsProjects: "Publications & Projects",
    performanceHighlights: "Performance Highlights",
    searchCompletionMetrics: "Search Completion Metrics",
    testimonials: "Testimonials",
    clientLogos: "Client Portfolio",
    serviceSuite: "Service Suite",
    typicalMandates: "Typical Mandates",
    portfolioImpact: "Portfolio Impact",
    contact: "Contact",
    // Proficiency levels
    native: "Native",
    fluent: "Fluent",
    conversational: "Conversational",
    basic: "Basic",
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
    techStack: "Stack Technologique",
    toolsProficiency: "Maîtrise des Outils",
    kpisAndMetrics: "Indicateurs Clés & Métriques",
    analyticsReporting: "Aperçu Analytique",
    automatedProcesses: "Processus Automatisés Mis en Œuvre",
    aiToolsUsed: "Outils d'IA Utilisés",
    advisoryProjects: "Projets de Conseil",
    boardExperience: "Expérience en Conseil d'Administration",
    geographicReach: "Portée Géographique",
    globalRoles: "Rôles Internationaux",
    localMissions: "Missions Locales",
    deiAndCulturalFit: "DEI & Adéquation Culturelle",
    techStacksHiredFor: "Stacks Techniques Recrutées",
    industryFocus: "Focus Industriel",
    impactMetrics: "Métriques d'Impact",
    researchMethodologies: "Méthodologies de Recherche",
    mappingTools: "Outils de Mapping",
    publicationsProjects: "Publications & Projets",
    performanceHighlights: "Faits Marquants de Performance",
    searchCompletionMetrics: "Métriques de Finalisation de Recherche",
    testimonials: "Témoignages",
    clientLogos: "Portefeuille Clients",
    serviceSuite: "Gamme de Services",
    typicalMandates: "Mandats Typiques",
    portfolioImpact: "Impact Portefeuille",
    contact: "Contact",
    // Proficiency levels
    native: "Natif / Maternelle",
    fluent: "Courant",
    conversational: "Conversationnel",
    basic: "Basique / Notions",
  },
};

type TranslationObject = typeof translations.en; // Define a type for one language's translations

const getTranslations = (lang?: string): TranslationObject => {
  if (lang === 'fr') return translations.fr;
  return translations.en; // Default to English
};

const getTranslatedProficiency = (proficiency: string, t: TranslationObject): string => {
  const key = proficiency.toLowerCase() as keyof TranslationObject;
  return t[key] || proficiency; // Fallback to original if no translation
};

const renderPlaceholder = (sectionName: string) => (
  <p className="text-sm text-gray-400 italic mt-1">
    {`Data for "${sectionName}" can be added via an extended CV editor.`}
  </p>
);

// --- TEMPLATE COMPONENTS ---

const ClassicTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style}`}>
      {data.photo && (
        <div className="mb-4 text-center cv-item-block">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={120} height={120} className="rounded-full mx-auto shadow-md object-cover" data-ai-hint="professional portrait" />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-1 text-center cv-item-block">{data.personalInfo.name}</h1>
      <p className="text-sm text-gray-600 text-center mb-1 cv-item-block">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 text-center mb-4 cv-item-block">{data.personalInfo.contactInfo.linkedin}</p>}
      
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.profileSummary}</h2>
      <p className="text-sm whitespace-pre-line cv-item-block">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.workExperience}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.education}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.skills}</h2>
      <p className="text-sm cv-item-block">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
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
        <h1 className="text-3xl font-bold mb-2 cv-item-block">{data.personalInfo.name}</h1>
        <p className="text-sm text-gray-600 mb-1 cv-item-block">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-600 mb-4 cv-item-block">{data.personalInfo.contactInfo.linkedin}</p>}
      
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.profileSummary}</h2>
        <p className="text-sm whitespace-pre-line cv-item-block">{data.profile}</p>

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.workExperience}</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-3 cv-item-block">
            <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.education}</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 cv-item-block">
            <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
            <p className="text-xs text-gray-500">{edu.dates}</p>
            {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
          </div>
        ))}

        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.skills}</h2>
        <p className="text-sm cv-item-block">{data.skills.join(', ')}</p>

        {data.languages && data.languages.length > 0 && (
          <>
            <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-primary cv-item-block">{t.languages}</h2>
            {data.languages.map((lang, index) => (
              <p key={index} className="text-sm cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
            ))}
          </>
        )}
      </div>
      {data.photo && (
        <div className="w-1/3 pl-6 border-l border-gray-200 cv-item-block">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={150} height={150} className="rounded-lg shadow-md mb-4 mx-auto mt-2 object-cover" data-ai-hint="professional portrait" />
        </div>
      )}
    </div>
  );
};

const AnonymizedConfidentialTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style}`}>
      <h1 className="text-3xl font-bold mb-1 text-center text-primary cv-item-block">{t.candidateProfile}</h1>
      <p className="text-sm text-gray-600 text-center mb-6 cv-item-block">{t.contactUponRequest}</p>
      
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-gray-700 cv-item-block">{t.profileSummary}</h2>
      <p className="text-sm whitespace-pre-line cv-item-block">{data.profile}</p>

      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-gray-700 cv-item-block">{t.workExperience}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3 cv-item-block">
          {/* Company name might be replaced by industry by user, template just displays it */}
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-gray-700 cv-item-block">{t.education}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-gray-700 cv-item-block">{t.skills}</h2>
      <p className="text-sm cv-item-block">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-6 mb-2 text-gray-700 cv-item-block">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};

const MarketingTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} border-2 border-accent bg-white text-gray-900`}>
      {data.photo && (
        <div className="mb-6 text-center cv-item-block">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={140} height={140} className="rounded-full mx-auto ring-4 ring-primary/50 p-1 shadow-xl object-cover" data-ai-hint="dynamic portrait"/>
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-1 text-center text-primary cv-item-block">{data.personalInfo.name}</h1>
      <p className="text-md text-accent text-center font-semibold mb-1 cv-item-block">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
      {data.personalInfo.contactInfo.linkedin && <p className="text-md text-blue-500 text-center mb-6 hover:underline cv-item-block">{data.personalInfo.contactInfo.linkedin}</p>}
      
      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent cv-item-block">{t.keyAchievementsProfile}</h2>
      <p className="text-md whitespace-pre-line italic cv-item-block">{data.profile}</p>

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent cv-item-block">{t.professionalJourney}</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 p-3 bg-secondary/30 rounded-lg cv-item-block">
          <h3 className="text-lg font-bold text-primary">{exp.title}</h3>
          <p className="text-sm font-semibold text-accent-foreground/80">{exp.company} | {exp.dates}</p>
          <ul className="list-disc list-inside text-md whitespace-pre-line pl-4 mt-1">
          {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent cv-item-block">{t.skillsSnapshot}</h2>
      <div className="flex flex-wrap gap-2 mb-4 cv-item-block">
          {data.skills.map((skill, index) => <span key={`${skill}-${index}`} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">{skill}</span>)}
      </div>

      <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent cv-item-block">{t.educationCredentials}</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-lg font-semibold">{edu.degree}</h3>
          <p className="text-md text-gray-700">{edu.institution} ({edu.dates})</p>
          {edu.description && <p className="text-sm whitespace-pre-line text-gray-600">{edu.description}</p>}
        </div>
      ))}
      
      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className="text-2xl font-bold border-b-4 border-primary pb-2 mt-8 mb-3 text-accent cv-item-block">{t.languages}</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="text-md cv-item-block">{lang.language}: <span className="font-semibold">{getTranslatedProficiency(lang.proficiency, t)}</span></p>
          ))}
        </>
      )}
    </div>
  );
};

const FinancePrivateEquityTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} font-serif bg-white text-gray-900`}>
      <div className="text-center mb-6 cv-item-block">
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-full mx-auto border-2 border-gray-700 object-cover mb-3" data-ai-hint="corporate headshot"/>
        )}
        <h1 className="text-3xl font-bold text-gray-800">{data.personalInfo.name}</h1>
        <p className="text-sm text-gray-600">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <p className="text-sm text-blue-700 hover:underline">{data.personalInfo.contactInfo.linkedin}</p>}
      </div>
      
      <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm whitespace-pre-line text-gray-700 mb-6 cv-item-block">{data.profile}</p>

      <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 relative pl-8 before:absolute before:left-3 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-300 cv-item-block">
           <div className="absolute left-0 top-1.5 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white text-xs">{index+1}</div>
          <h3 className="text-md font-semibold text-gray-800">{exp.title} <span className="font-normal text-gray-600">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500 mb-1">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 text-gray-700">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <SectionTitle title={t.portfolioImpact} icon={<Landmark className="inline-block mr-2"/>} className="cv-item-block" />
      {data.portfolioImpact && data.portfolioImpact.length > 0 ? (
         data.portfolioImpact.map((item, idx) => (
          <div key={idx} className="mb-2 text-sm text-gray-700 cv-item-block"><strong>{item.title}:</strong> {item.description}</div>
         ))
      ) : <div className="cv-item-block">{renderPlaceholder(t.portfolioImpact)}</div>}


      <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 text-gray-700 cv-item-block">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
          {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
        </div>
      ))}

      <SectionTitle title={t.skills} icon={<Cpu className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm text-gray-700 mb-6 cv-item-block">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} className="cv-item-block" />
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm text-gray-700 cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};

const SectionTitle = ({ title, icon, className }: { title: string; icon?: React.ReactNode, className?: string }) => (
  <h2 className={`text-xl font-semibold border-b-2 border-gray-300 pb-1 mt-8 mb-3 text-gray-700 flex items-center ${className}`}>
    {icon} {title}
  </h2>
);


const DataDrivenExecutiveTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} grid grid-cols-3 gap-x-6 bg-white text-gray-900`}>
      <div className="col-span-1 border-r pr-6 border-gray-200 cv-item-block"> {/* Left Column */}
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={150} height={150} className="rounded-full mx-auto shadow-md object-cover mb-4" data-ai-hint="professional portrait" />
        )}
        <h1 className="text-2xl font-bold text-center text-primary">{data.personalInfo.name}</h1>
        <div className="text-sm text-gray-600 text-center mt-1">
          <p>{data.personalInfo.contactInfo.email}</p>
          <p>{data.personalInfo.contactInfo.phone}</p>
          {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-blue-600 hover:underline block">LinkedIn</a>}
        </div>
        
        <SectionTitle title={t.skillsSnapshot} icon={<Star className="inline-block mr-2"/>} className="mt-6 text-lg" />
        {data.skills.map(skill => <Badge key={skill} variant="secondary" className="mr-1 mb-1">{skill}</Badge>)}
        
        <SectionTitle title={t.toolsProficiency} icon={<Cpu className="inline-block mr-2"/>} className="mt-4 text-lg" />
        {/* Assuming tools are part of skills or a new field */}
        <p className="text-sm text-gray-500">e.g., Salesforce, LinkedIn Recruiter, Tableau, ATS (Bullhorn)</p>
        {renderPlaceholder(t.toolsProficiency)}

        <SectionTitle title={t.techStack} icon={<Database className="inline-block mr-2"/>} className="mt-4 text-lg" />
        {data.techStack && data.techStack.length > 0 ? data.techStack.map(tech => <Badge key={tech} variant="outline" className="mr-1 mb-1">{tech}</Badge>) : renderPlaceholder(t.techStack)}
        
        <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} className="mt-4 text-lg" />
        {data.languages && data.languages.map(lang => <p key={lang.language} className="text-sm">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>)}
      </div>

      <div className="col-span-2"> {/* Right Column */}
        <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="mt-0 cv-item-block" />
        <p className="text-sm whitespace-pre-line cv-item-block">{data.profile}</p>

        <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4 cv-item-block">
            <h3 className="text-md font-semibold">{exp.title} at {exp.company}</h3>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <p className="text-sm whitespace-pre-line mt-1 italic text-primary">KPIs: {renderPlaceholder("KPIs from description")}</p>
            <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 mt-1">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}

        <SectionTitle title={t.analyticsReporting} icon={<BarChart3 className="inline-block mr-2"/>} className="cv-item-block" />
        <div className="cv-item-block">{renderPlaceholder(t.analyticsReporting)}</div>

        <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 cv-item-block">
            <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
            <p className="text-xs text-gray-500">{edu.dates}</p>
            {edu.description && <p className="text-sm whitespace-pre-line">{edu.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const AutomationSpecialistTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} flex bg-white text-gray-900`}>
      <div className="w-1/4 bg-accent text-accent-foreground p-6 rounded-l-md cv-item-block"> {/* Dark Sidebar */}
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-full mx-auto shadow-md object-cover mb-4 border-2 border-white" data-ai-hint="modern portrait" />
        )}
        <h1 className="text-xl font-bold text-center">{data.personalInfo.name}</h1>
        <div className="text-xs text-center mt-1 mb-4">
          <p>{data.personalInfo.contactInfo.email}</p>
          <p>{data.personalInfo.contactInfo.phone}</p>
          {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="hover:underline block">LinkedIn</a>}
        </div>
        
        <h3 className="font-semibold text-sm mt-6 mb-2 border-b border-accent-foreground/50 pb-1">{t.aiToolsUsed}</h3>
        {data.aiToolsUsed && data.aiToolsUsed.length > 0 ? 
            data.aiToolsUsed.map(tool => <Badge key={tool} variant="secondary" className="mr-1 mb-1 bg-primary/20 text-primary-foreground">{tool}</Badge>) 
          : <>
              <Badge variant="secondary" className="mr-1 mb-1 bg-primary/20 text-primary-foreground">SeekOut</Badge>
              <Badge variant="secondary" className="mr-1 mb-1 bg-primary/20 text-primary-foreground">Loxo</Badge>
              <Badge variant="secondary" className="mr-1 mb-1 bg-primary/20 text-primary-foreground">Talentis</Badge>
              {renderPlaceholder(t.aiToolsUsed)}
            </>
        }
        
        <h3 className="font-semibold text-sm mt-4 mb-2 border-b border-accent-foreground/50 pb-1">{t.skills}</h3>
        {data.skills.slice(0,5).map(skill => <p key={skill} className="text-xs mb-0.5">{skill}</p>)}

         <h3 className="font-semibold text-sm mt-4 mb-2 border-b border-accent-foreground/50 pb-1">{t.languages}</h3>
        {data.languages && data.languages.map(lang => <p key={lang.language} className="text-xs">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>)}
      </div>

      <div className="w-3/4 p-6"> {/* Main Content */}
        <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="mt-0 cv-item-block" />
        <p className="text-sm whitespace-pre-line cv-item-block">{data.profile}</p>

        <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4 cv-item-block">
            <h3 className="text-md font-semibold flex items-center">
              <Bot size={18} className="mr-2 text-primary"/> {exp.title} at {exp.company}
            </h3>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <p className="text-sm whitespace-pre-line mt-1 italic text-primary">Efficiency Gains: {renderPlaceholder("Efficiency Gains from description")}</p>
            <ul className="list-none text-sm whitespace-pre-line pl-0 mt-1">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i} className="flex items-start"><ShieldCheck size={14} className="mr-2 mt-1 text-green-500 shrink-0"/>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
        
        <SectionTitle title={t.automatedProcesses} icon={<FolderKanban className="inline-block mr-2"/>} className="cv-item-block" />
        {data.automatedProcessesImplemented && data.automatedProcessesImplemented.length > 0 ? (
          data.automatedProcessesImplemented.map((process, idx) => (
            <div key={idx} className="mb-2 text-sm cv-item-block">
              <strong>{process.title}:</strong> {process.description}
              {process.toolsUsed && process.toolsUsed.length > 0 && <p className="text-xs text-gray-500">Tools: {process.toolsUsed.join(', ')}</p>}
            </div>
          ))
        ) : <div className="cv-item-block">{renderPlaceholder(t.automatedProcesses)}</div>}

        <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 cv-item-block">
            <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
            <p className="text-xs text-gray-500">{edu.dates}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadershipAdvisoryTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} font-serif bg-white text-gray-900`}>
      <div className="flex justify-between items-start mb-6 cv-item-block">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{data.personalInfo.name}</h1>
          <p className="text-sm text-gray-600">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
          {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-sm text-blue-700 hover:underline">LinkedIn</a>}
        </div>
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-md object-cover shadow-md" data-ai-hint="executive portrait" />
        )}
      </div>
      
      <div className="text-center my-8 cv-item-block">
        <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="text-center border-none text-2xl" />
        <p className="text-md whitespace-pre-line text-gray-700 max-w-2xl mx-auto">{data.profile}</p>
      </div>

      <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 cv-item-block">
          <h3 className="text-lg font-semibold text-gray-800">{exp.title} at {exp.company}</h3>
          <p className="text-sm text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-md whitespace-pre-line pl-4 text-gray-700">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      
      <SectionTitle title={t.advisoryProjects} icon={<Handshake className="inline-block mr-2"/>} className="cv-item-block" />
       {data.advisoryProjects && data.advisoryProjects.length > 0 ? (
          data.advisoryProjects.map((project, idx) => (
            <div key={idx} className="mb-2 text-sm cv-item-block"><strong>{project.title}:</strong> {project.description}</div>
          ))
        ) : <div className="cv-item-block">{renderPlaceholder(t.advisoryProjects)}</div>}


      <SectionTitle title={t.boardExperience} icon={<UsersRound className="inline-block mr-2"/>} className="cv-item-block" />
      {data.boardExperience ? <p className="text-sm text-gray-700 cv-item-block">{data.boardExperience}</p> : <div className="cv-item-block">{renderPlaceholder(t.boardExperience)}</div>}

      <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 text-gray-700 cv-item-block">
          <h3 className="text-lg font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-sm text-gray-500">{edu.dates}</p>
        </div>
      ))}

      <SectionTitle title={t.skills} icon={<Cpu className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-md text-gray-700 mb-6 cv-item-block">{data.skills.join(' • ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} className="cv-item-block" />
          {data.languages.map((lang, index) => (
            <p key={index} className="text-md text-gray-700 cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};

const InternationalHeadhunterTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  // Helper for flag icons (simple text based)
  const langToFlag = (langName: string) => {
    if (langName.toLowerCase().includes("english")) return "🇬🇧/🇺🇸";
    if (langName.toLowerCase().includes("french")) return "🇫🇷";
    if (langName.toLowerCase().includes("german")) return "🇩🇪";
    if (langName.toLowerCase().includes("spanish")) return "🇪🇸";
    return "";
  };

  return (
    <div className={`${a4Style} bg-white text-gray-900`}>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-primary cv-item-block">
        <div>
          <h1 className="text-3xl font-bold text-primary">{data.personalInfo.name}</h1>
          <p className="text-sm text-gray-600">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
          {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-sm text-blue-600 hover:underline">LinkedIn</a>}
        </div>
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={100} height={100} className="rounded-full object-cover shadow-lg border-2 border-primary" data-ai-hint="global professional" />
        )}
      </div>
      
      <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm whitespace-pre-line mb-6 cv-item-block">{data.profile}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 cv-item-block">
        <div>
          <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} />
          {data.languages && data.languages.map((lang, index) => (
            <p key={index} className="text-sm">{langToFlag(lang.language)} {lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </div>
        <div>
          <SectionTitle title={t.geographicReach} icon={<MapPin className="inline-block mr-2"/>} />
          {data.geographicReach && data.geographicReach.length > 0 ? 
            data.geographicReach.map(region => <Badge key={region} variant="outline" className="mr-1 mb-1">{region}</Badge>)
            : renderPlaceholder(t.geographicReach)
          }
           <p className="text-xs text-gray-400 mt-1">e.g., EMEA, APAC, North America</p>
        </div>
      </div>
      
      <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
      {/* User can differentiate Global vs Local in description. Template shows all. */}
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 p-3 border rounded-md hover:shadow-sm cv-item-block">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal text-gray-600">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 mt-1">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      
      <SectionTitle title={t.deiAndCulturalFit} icon={<Users className="inline-block mr-2"/>} className="cv-item-block" />
      <div className="cv-item-block">{renderPlaceholder(t.deiAndCulturalFit + " (mention in Profile or Experience)")}</div>


      <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
        </div>
      ))}

      <SectionTitle title={t.skills} icon={<Cpu className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm mb-6 cv-item-block">{data.skills.join(', ')}</p>
    </div>
  );
};

const TechStartupsFocusTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  const sectionHeaderStyle = "text-2xl font-bold text-white bg-primary p-2 rounded-t-md mt-8 mb-0 flex items-center cv-item-block";
  const sectionContentStyle = "p-4 border border-t-0 border-primary rounded-b-md mb-4 cv-item-block";

  return (
    <div className={`${a4Style} bg-white text-gray-900`}>
      <div className="text-center mb-8 cv-item-block">
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={120} height={120} className="rounded-full mx-auto ring-4 ring-accent p-1 object-cover" data-ai-hint="dynamic portrait" />
        )}
        <h1 className="text-4xl font-extrabold mt-4 text-accent">{data.personalInfo.name}</h1>
        <p className="text-md text-gray-600">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-md text-blue-600 hover:underline">LinkedIn</a>}
      </div>
      
      <h2 className={sectionHeaderStyle}><FileText size={24} className="mr-2"/>{t.profileSummary}</h2>
      <div className={sectionContentStyle}>
        <p className="text-sm whitespace-pre-line">{data.profile}</p>
      </div>

      <h2 className={sectionHeaderStyle}><Briefcase size={24} className="mr-2"/>{t.workExperience}</h2>
      <div className={sectionContentStyle}>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4 last:mb-0 cv-item-block">
            <h3 className="text-md font-semibold text-primary">{exp.title} <span className="font-normal text-gray-700">at</span> {exp.company}</h3>
            <p className="text-xs text-gray-500">{exp.dates}</p>
            <p className="text-xs mt-1 text-accent">Impact: {renderPlaceholder("Fundraising/Growth from description")}</p>
            <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 mt-1">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </div>
      
      <h2 className={sectionHeaderStyle}><Cpu size={24} className="mr-2"/>{t.techStacksHiredFor}</h2>
      <div className={sectionContentStyle}>
        {data.techStacksHiredFor && data.techStacksHiredFor.length > 0 ? 
          data.techStacksHiredFor.map(stack => <Badge key={stack} className="mr-1 mb-1 bg-accent text-accent-foreground">{stack}</Badge>)
          : renderPlaceholder(t.techStacksHiredFor)
        }
      </div>

      <h2 className={sectionHeaderStyle}><Lightbulb size={24} className="mr-2"/>{t.industryFocus}</h2>
      <div className={sectionContentStyle}>
         {data.industryFocus && data.industryFocus.length > 0 ? 
            data.industryFocus.map(focus => <Badge key={focus} variant="secondary" className="mr-1 mb-1">{focus}</Badge>)
          : <>
              <Badge variant="secondary" className="mr-1 mb-1">SaaS</Badge>
              <Badge variant="secondary" className="mr-1 mb-1">FinTech</Badge>
              <Badge variant="secondary" className="mr-1 mb-1">DeepTech</Badge>
              {renderPlaceholder(t.industryFocus)}
            </>
         }
      </div>

      <h2 className={sectionHeaderStyle}><Award size={24} className="mr-2"/>{t.education}</h2>
      <div className={sectionContentStyle}>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 last:mb-0 cv-item-block">
            <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
            <p className="text-xs text-gray-500">{edu.dates}</p>
          </div>
        ))}
      </div>

      <h2 className={sectionHeaderStyle}><Star size={24} className="mr-2"/>{t.skills}</h2>
      <div className={sectionContentStyle}>
        <p className="text-sm">{data.skills.join(', ')}</p>
      </div>

      {data.languages && data.languages.length > 0 && (
        <>
          <h2 className={sectionHeaderStyle}><Globe size={24} className="mr-2"/>{t.languages}</h2>
          <div className={sectionContentStyle}>
            {data.languages.map((lang, index) => (
              <p key={index} className="text-sm cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SearchResearcherAnalystTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  const smallTextStyle = "text-xs"; // For higher info density
  const tightSpacingStyle = "mb-2"; // Tighter spacing for sections

  return (
    <div className={`${a4Style} ${smallTextStyle} bg-white text-gray-900`}>
      {data.photo && (
        <div className="mb-3 text-center cv-item-block">
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={80} height={80} className="rounded-full mx-auto shadow-sm object-cover" data-ai-hint="focused headshot" />
        </div>
      )}
      <h1 className="text-2xl font-semibold text-center mb-0.5 cv-item-block">{data.personalInfo.name}</h1>
      <p className={`${smallTextStyle} text-gray-500 text-center ${tightSpacingStyle} cv-item-block`}>{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}
        {data.personalInfo.contactInfo.linkedin && <span className="block">{data.personalInfo.contactInfo.linkedin}</span>}
      </p>
      
      <SectionTitle title={t.profileSummary} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      <p className={`${smallTextStyle} whitespace-pre-line ${tightSpacingStyle} cv-item-block`}>{data.profile}</p>

      <SectionTitle title={t.researchMethodologies} icon={<Lightbulb className="inline-block mr-1"/>} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      {data.researchMethodologies && data.researchMethodologies.length > 0 ? 
        <ul className={`list-disc list-inside ${smallTextStyle} pl-3 ${tightSpacingStyle} cv-item-block`}>
          {data.researchMethodologies.map((method, idx) => <li key={idx}>{method}</li>)}
        </ul>
      : <div className="cv-item-block">{renderPlaceholder(t.researchMethodologies)}</div>}

      <SectionTitle title={t.mappingTools} icon={<MapPin className="inline-block mr-1"/>} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
       {data.mappingTools && data.mappingTools.length > 0 ? 
        <p className={`${smallTextStyle} ${tightSpacingStyle} cv-item-block`}>{data.mappingTools.join(', ')}</p>
      : <div className="cv-item-block">{renderPlaceholder(t.mappingTools)}</div>}

      <SectionTitle title={t.workExperience} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      {data.experience.map((exp, index) => (
        <div key={index} className={`${tightSpacingStyle} cv-item-block`}>
          <h3 className="text-sm font-medium">{exp.title} at {exp.company}</h3>
          <p className="text-xs text-gray-400">{exp.dates}</p>
          <ul className={`list-disc list-inside ${smallTextStyle} whitespace-pre-line pl-3`}>
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      
      <SectionTitle title={t.publicationsProjects} icon={<FileText className="inline-block mr-1"/>} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      {data.publicationsProjects && data.publicationsProjects.length > 0 ? (
        data.publicationsProjects.map((item, idx) => (
          <div key={idx} className={`${smallTextStyle} ${tightSpacingStyle} cv-item-block`}><strong>{item.title}:</strong> {item.description}</div>
        ))
      ) : <div className="cv-item-block">{renderPlaceholder(t.publicationsProjects)}</div>}

      <SectionTitle title={t.education} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      {data.education.map((edu, index) => (
        <div key={index} className={`${tightSpacingStyle} cv-item-block`}>
          <h3 className="text-sm font-medium">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-400">{edu.dates}</p>
          {edu.description && <p className={`${smallTextStyle} whitespace-pre-line`}>{edu.description}</p>}
        </div>
      ))}

      <SectionTitle title={t.skills} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
      <p className={`${smallTextStyle} ${tightSpacingStyle} cv-item-block`}>{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <SectionTitle title={t.languages} className={`mt-3 ${tightSpacingStyle} text-lg cv-item-block`} />
          {data.languages.map((lang, index) => (
            <p key={index} className={`${smallTextStyle} cv-item-block`}>{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};

const PerformanceOptimizedConsultantTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} bg-white text-gray-900`}>
      <div className="text-center mb-6 pb-4 border-b-2 border-primary cv-item-block">
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={120} height={120} className="rounded-full mx-auto shadow-lg object-cover mb-3 border-2 border-primary" data-ai-hint="results-oriented portrait" />
        )}
        <h1 className="text-3xl font-bold text-primary">{data.personalInfo.name}</h1>
        <p className="text-sm text-gray-600">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-sm text-blue-600 hover:underline">LinkedIn Profile</a>}
      </div>

      <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm whitespace-pre-line mb-6 cv-item-block">{data.profile}</p>

      <SectionTitle title={t.performanceHighlights} icon={<Trophy className="inline-block mr-2"/>} className="cv-item-block" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 cv-item-block">
        {data.keyMetrics && data.keyMetrics.length > 0 ? data.keyMetrics.map((km, idx) => (
          <div key={idx} className="p-3 border rounded-md bg-gray-50 cv-item-block">
            <p className="font-semibold text-primary">{km.metric}</p>
            {km.visual === 'progress' && typeof km.value === 'number' ? (
              <Progress value={km.value} className="h-3 my-1" />
            ) : (
              <p className="text-2xl font-bold text-accent">{km.value.toString()}</p>
            )}
          </div>
        )) : (
          <>
          <div className="p-3 border rounded-md bg-gray-50 cv-item-block">{renderPlaceholder("Time-to-Hire Metric")} <Progress value={75} className="h-3 my-1" /></div>
          <div className="p-3 border rounded-md bg-gray-50 cv-item-block">{renderPlaceholder("Retention Rate Metric")} <p className="text-2xl font-bold text-accent">95%</p></div>
          </>
        )}
      </div>
       <p className="text-xs text-gray-400 text-center mb-6 cv-item-block">KPIs per mission are detailed within work experience.</p>


      <SectionTitle title={t.workExperience} icon={<Briefcase className="inline-block mr-2"/>} className="cv-item-block" />
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 cv-item-block">
          <h3 className="text-md font-semibold">{exp.title} <span className="font-normal text-gray-600">at</span> {exp.company}</h3>
          <p className="text-xs text-gray-500">{exp.dates}</p>
          <p className="text-xs mt-1 text-green-600">Key KPIs: {renderPlaceholder("Time-to-hire, retention, etc. from description")}</p>
          <ul className="list-disc list-inside text-sm whitespace-pre-line pl-4 mt-1">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}
      
      <SectionTitle title={t.searchCompletionMetrics} icon={<Activity className="inline-block mr-2"/>} className="cv-item-block" />
      <div className="cv-item-block">{renderPlaceholder(t.searchCompletionMetrics)}</div>


      <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="cv-item-block" />
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 cv-item-block">
          <h3 className="text-md font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-xs text-gray-500">{edu.dates}</p>
        </div>
      ))}

      <SectionTitle title={t.skills} icon={<Cpu className="inline-block mr-2"/>} className="cv-item-block" />
      <p className="text-sm mb-6 cv-item-block">{data.skills.join(', ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} className="cv-item-block" />
          {data.languages.map((lang, index) => (
            <p key={index} className="text-sm cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};

const ClassicBoutiqueSearchTemplate = ({ data }: { data: CVData }) => {
  const t = getTranslations(data.detectedLanguage);
  return (
    <div className={`${a4Style} font-serif bg-white text-gray-900`}>
      <div className="text-center mb-8 cv-item-block">
        {data.photo && (
          <Image src={data.photo} alt={data.personalInfo.name || "Profile"} width={110} height={110} className="rounded-full mx-auto shadow-md object-cover border-2 border-gray-300 p-0.5" data-ai-hint="elegant portrait" />
        )}
        <h1 className="text-4xl font-bold text-gray-700 mt-3">{data.personalInfo.name}</h1>
        <p className="text-md text-gray-500">{data.personalInfo.contactInfo.email} | {data.personalInfo.contactInfo.phone}</p>
        {data.personalInfo.contactInfo.linkedin && <a href={data.personalInfo.contactInfo.linkedin} className="text-md text-blue-700 hover:underline">LinkedIn Profile</a>}
      </div>

      <SectionTitle title={t.profileSummary} icon={<FileText className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      <p className="text-md whitespace-pre-line text-gray-600 mb-6 cv-item-block">{data.profile}</p>
      
      <SectionTitle title={t.serviceSuite} icon={<Briefcase className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      {data.serviceSuite && data.serviceSuite.length > 0 ? (
        <ul className="list-disc list-inside text-md text-gray-600 pl-4 mb-6 cv-item-block">
            {data.serviceSuite.map((service, idx) => <li key={idx}>{service}</li>)}
        </ul>
      ) : <div className="cv-item-block">{renderPlaceholder(t.serviceSuite + " (e.g., Retained Search, Board Advisory, Assessment)")}</div>}


      <SectionTitle title={t.workExperience} icon={<Activity className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 cv-item-block">
          <h3 className="text-lg font-semibold text-gray-700">{exp.title} at {exp.company}</h3>
          <p className="text-sm text-gray-500">{exp.dates}</p>
          <ul className="list-disc list-inside text-md whitespace-pre-line pl-4 text-gray-600">
            {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim().replace(/^- /, '')}</li>)}
          </ul>
        </div>
      ))}

      <SectionTitle title={t.typicalMandates} icon={<FolderKanban className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      {data.typicalMandates && data.typicalMandates.length > 0 ? (
        <ul className="list-disc list-inside text-md text-gray-600 pl-4 mb-6 cv-item-block">
            {data.typicalMandates.map((mandate, idx) => <li key={idx}>{mandate}</li>)}
        </ul>
      ) : <div className="cv-item-block">{renderPlaceholder(t.typicalMandates)}</div>}
      
      <SectionTitle title={t.testimonials} icon={<Star className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      {data.testimonials && data.testimonials.length > 0 ? (
        data.testimonials.map((testimonial, idx) => (
          <blockquote key={idx} className="italic text-md text-gray-600 border-l-4 border-gray-300 pl-4 mb-3 cv-item-block">
            "{testimonial.quote}" <cite className="block not-italic text-sm text-gray-500">- {testimonial.author}</cite>
          </blockquote>
        ))
      ) : <div className="cv-item-block">{renderPlaceholder(t.testimonials)}</div>}


      <SectionTitle title={t.education} icon={<Award className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3 text-gray-600 cv-item-block">
          <h3 className="text-lg font-semibold">{edu.degree} - {edu.institution}</h3>
          <p className="text-sm text-gray-500">{edu.dates}</p>
        </div>
      ))}

      <SectionTitle title={t.skills} icon={<Cpu className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
      <p className="text-md text-gray-600 mb-6 cv-item-block">{data.skills.join(' • ')}</p>

      {data.languages && data.languages.length > 0 && (
        <>
          <SectionTitle title={t.languages} icon={<Globe className="inline-block mr-2"/>} className="text-gray-700 cv-item-block" />
          {data.languages.map((lang, index) => (
            <p key={index} className="text-md text-gray-600 cv-item-block">{lang.language}: {getTranslatedProficiency(lang.proficiency, t)}</p>
          ))}
        </>
      )}
    </div>
  );
};


const templates: { id: CVTemplate; name: string; component: React.FC<{data: CVData}> }[] = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'photoRight', name: 'Photo Right', component: PhotoRightTemplate },
  { id: 'marketing', name: 'Marketing', component: MarketingTemplate },
  { id: 'anonymizedConfidential', name: 'Anonymized', component: AnonymizedConfidentialTemplate },
  { id: 'financePrivateEquity', name: 'Finance/PE', component: FinancePrivateEquityTemplate },
  { id: 'dataDrivenExecutive', name: 'Data-Driven Exec.', component: DataDrivenExecutiveTemplate },
  { id: 'automationSpecialist', name: 'Automation Spec.', component: AutomationSpecialistTemplate },
  { id: 'leadershipAdvisory', name: 'Leadership/Advisory', component: LeadershipAdvisoryTemplate },
  { id: 'internationalHeadhunter', name: 'Intl. Headhunter', component: InternationalHeadhunterTemplate },
  { id: 'techStartupsFocus', name: 'Tech/Startups', component: TechStartupsFocusTemplate },
  { id: 'searchResearcherAnalyst', name: 'Researcher/Analyst', component: SearchResearcherAnalystTemplate },
  { id: 'performanceOptimizedConsultant', name: 'Performance Opt.', component: PerformanceOptimizedConsultantTemplate },
  { id: 'classicBoutiqueSearch', name: 'Classic Boutique', component: ClassicBoutiqueSearchTemplate },
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
    
    if (printContents) {
      const printWindow = window.open('', '_blank', 'height=800,width=1000');
      if (!printWindow) {
        alert("Please allow popups for this website to print the CV.");
        return;
      }

      printWindow.document.write('<html><head><title>Print CV</title>');
      
      // Attempt to copy all styles
      Array.from(document.styleSheets).forEach(styleSheet => {
        try {
          const cssRules = styleSheet.cssRules ? Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('\n') : '';
          if (cssRules) {
            const styleElement = printWindow.document.createElement('style');
            styleElement.appendChild(printWindow.document.createTextNode(cssRules));
            printWindow.document.head.appendChild(styleElement);
          }
        } catch (e) {
          // Some stylesheets (e.g., cross-origin) might not be accessible
          if (styleSheet.href) {
            const linkElement = printWindow.document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.type = styleSheet.type;
            linkElement.href = styleSheet.href;
            printWindow.document.head.appendChild(linkElement);
          }
        }
      });
      
      // Add specific print styles to ensure only the CV is printed correctly
       const printSpecificStyle = printWindow.document.createElement('style');
       printSpecificStyle.innerHTML = `
         @media print {
           body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
           .print-container { width: 100% !important; margin: 0 !important; padding: 0 !important; transform: scale(1) !important; box-shadow: none !important; border: none !important; }
           .print-container > div { /* The A4 styled div */
             margin: 0 auto !important; 
             box-shadow: none !important; 
             border: none !important;
           }
           .cv-item-block {
             page-break-inside: avoid !important;
           }
           .bg-white { background-color: #fff !important; }
           .text-gray-900 { color: #1a202c !important; } 
           /* Add other explicit color classes if needed */
         }
       `;
       printWindow.document.head.appendChild(printSpecificStyle);
      
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<div class="print-container">${printContents}</div>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // printWindow.close(); // Consider user experience before auto-closing
      }, 500); // Delay to ensure styles are applied

    } else {
      alert("Could not find CV content to print.");
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
                className="flex-grow sm:flex-grow-0 text-xs sm:text-sm"
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
              // Adjusted scale and width for larger preview, original 595px for A4 width, 840px now for preview.
              <div className="transform scale-[0.70] origin-top mx-auto" style={{ width: 'calc(840px / 0.70 * 0.70)' }}> 
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

