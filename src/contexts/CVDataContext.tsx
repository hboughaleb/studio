'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import type { CVContextType, CVData, ParseCvDataOutput } from '@/types/cv';
import { createEmptyCvData } from '@/types/cv';

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVDataProvider({ children }: { children: ReactNode }) {
  const [cvData, setCvDataState] = useState<CVData | null>(null);
  const [parsedCvData, setParsedCvDataState] = useState<ParseCvDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCvData = (data: CVData | null) => {
    setCvDataState(data);
    if (data) {
      // also update parsedCvData if full cvData is set
      const { photo, fileName, ...parsed } = data;
      setParsedCvDataState(parsed);
    } else {
      setParsedCvDataState(null);
    }
  };
  
  const setParsedCvData = (data: ParseCvDataOutput | null) => {
    setParsedCvDataState(data);
    if (data) {
      setCvDataState(prevCvData => ({
        ...(prevCvData || createEmptyCvData()), // ensure prevCvData is not null
        ...data,
        // keep photo and fileName if they exist
        photo: prevCvData?.photo || undefined,
        fileName: prevCvData?.fileName || undefined,
      }));
    } else {
      setCvDataState(null);
    }
  };


  const contextValue = useMemo(() => ({
    cvData,
    setCvData,
    isLoading,
    setIsLoading,
    error,
    setError,
    parsedCvData,
    setParsedCvData,
  }), [cvData, isLoading, error, parsedCvData]);

  return <CVContext.Provider value={contextValue}>{children}</CVContext.Provider>;
}

export function useCVData(): CVContextType {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVData must be used within a CVDataProvider');
  }
  return context;
}
