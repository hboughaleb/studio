
import type { ParseCvDataOutput } from '@/ai/flows/parse-cv-data';

export interface CVData extends ParseCvDataOutput {
  photo?: string; // Data URI for the photo
  fileName?: string; // Original file name of the uploaded CV
  detectedLanguage?: string; // e.g., "en", "fr"
}

export type CVTemplate =
  | 'classic'
  | 'photoRight'
  | 'anonymized'
  | 'marketing'
  | 'finance';

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
});
