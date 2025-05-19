
import type { ParseCvDataOutput } from '@/ai/flows/parse-cv-data';

export interface CVData extends ParseCvDataOutput {
  photo?: string; // Data URI for the photo
  fileName?: string; // Original file name of the uploaded CV
  detectedLanguage?: string; // e.g., "en", "fr"
  // Placeholder for potential future structured data for new templates
  techStack?: string[];
  advisoryProjects?: Array<{ title: string; description: string }>;
  boardExperience?: string;
  geographicReach?: string[]; // For tags or list
  techStacksHiredFor?: string[];
  industryFocus?: string[];
  researchMethodologies?: string[];
  mappingTools?: string[];
  publicationsProjects?: Array<{ title: string; description: string }>;
  keyMetrics?: Array<{ metric: string; value: string | number; visual?: 'progress' | 'text' }>; // For performance template
  testimonials?: Array<{ quote: string; author: string }>;
  clientBrands?: string[];
  serviceSuite?: string[];
  typicalMandates?: string[];
  portfolioImpact?: Array<{ title: string; description: string }>;
  aiToolsUsed?: string[];
  automatedProcessesImplemented?: Array<{ title: string; description: string; toolsUsed: string[] }>;
}

export type CVTemplate =
  | 'classic'
  | 'photoRight'
  | 'anonymizedConfidential' // Updated
  | 'marketing'
  | 'financePrivateEquity' // Updated
  | 'dataDrivenExecutive'
  | 'automationSpecialist'
  | 'leadershipAdvisory'
  | 'internationalHeadhunter'
  | 'techStartupsFocus'
  | 'searchResearcherAnalyst'
  | 'performanceOptimizedConsultant'
  | 'classicBoutiqueSearch';


export interface CVContextType {
  cvData: CVData | null;
  setCvData: (data: CVData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  parsedCvData: ParseCvDataOutput | null;
  setParsedCvData: (data: ParseCvDataOutput | null) => void;
}

// Helper function to create an empty CVData object
export const createEmptyCvData = (): CVData => ({
  personalInfo: {
    name: '',
    contactInfo: {
      email: '',
      phone: '',
      linkedin: '',
    },
  },
  profile: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  photo: undefined,
  fileName: undefined,
  detectedLanguage: 'en', // Default to English
  // Initialize new optional fields
  techStack: [],
  advisoryProjects: [],
  boardExperience: '',
  geographicReach: [],
  techStacksHiredFor: [],
  industryFocus: [],
  researchMethodologies: [],
  mappingTools: [],
  publicationsProjects: [],
  keyMetrics: [],
  testimonials: [],
  clientBrands: [],
  serviceSuite: [],
  typicalMandates: [],
  portfolioImpact: [],
  aiToolsUsed: [],
  automatedProcessesImplemented: [],
});

