
'use client';

import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import type { CVData } from '@/types/cv';
import { generateProfessionalDetail, type GenerateProfessionalDetailInput, type SectionType } from '@/ai/flows/generate-professional-detail-flow';
import { useToast } from '@/hooks/use-toast';
import { useCVData } from '@/contexts/CVDataContext';


// Reusable component for managing a list of string tags
const TagInputArray = ({ fieldName, label, placeholder }: { fieldName: keyof CVData, label: string, placeholder: string }) => {
  const { control, getValues, setValue } = useFormContext<CVData>();
  const [currentValue, setCurrentValue] = useState('');

  const items = (getValues(fieldName) as string[] | undefined) || [];

  const handleAddItem = () => {
    if (currentValue.trim() && !items.includes(currentValue.trim())) {
      const updatedItems = [...items, currentValue.trim()];
      setValue(fieldName, updatedItems as any, { shouldValidate: true, shouldDirty: true });
      setCurrentValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const updatedItems = items.filter(item => item !== itemToRemove);
    setValue(fieldName, updatedItems as any, { shouldValidate: true, shouldDirty: true });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddItem();
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button type="button" onClick={handleAddItem} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <FormField
        control={control}
        name={fieldName}
        render={() => <FormMessage />}
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item, index) => (
            <Badge key={`${String(fieldName)}-${index}`} variant="secondary" className="py-1 px-3 text-sm">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remove ${item}`}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </FormItem>
  );
};

interface AiGenerateButtonProps {
  fieldName: keyof CVData;
  sectionType: SectionType;
  label: string;
}

const AiEnhancedTextarea = ({ fieldName, sectionType, label }: AiGenerateButtonProps) => {
  const { control, setValue, getValues } = useFormContext<CVData>();
  const { cvData } = useCVData();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const currentFieldValue = useWatch({ control, name: fieldName });

  const handleGenerate = async () => {
    if (!cvData) {
      toast({ title: "CV Data Missing", description: "Please ensure CV data is loaded.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const relevantCvData = {
        profile: cvData.profile,
        experience: cvData.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          description: exp.description,
        })),
        skills: cvData.skills,
      };

      const input: GenerateProfessionalDetailInput = {
        sectionType: sectionType,
        cvContext: relevantCvData,
        currentText: getValues(fieldName) as string || undefined,
        language: cvData.detectedLanguage || 'en',
      };
      const result = await generateProfessionalDetail(input);
      setValue(fieldName, result.generatedText as any, { shouldValidate: true, shouldDirty: true });
      toast({ title: "Content Generated!", description: `AI has generated content for ${label}.` });
    } catch (error) {
      console.error(`Error generating ${label}:`, error);
      toast({ title: "Generation Failed", description: `Could not generate content for ${label}.`, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
     <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>{label}</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mb-1"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder={`Enter or generate your ${label.toLowerCase()}...`}
                className="min-h-[100px]"
                {...field}
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
  )
}


export function ProfessionalDetailsSection() {
  return (
    <div className="space-y-6 p-4 border rounded-md shadow-sm bg-card">
      <TagInputArray
        fieldName="toolsProficiency"
        label="Tools Proficiency"
        placeholder="e.g., Salesforce, Bullhorn, Tableau"
      />

      <AiEnhancedTextarea
        fieldName="analyticsReportingSummary"
        sectionType="analyticsReportingSummary"
        label="Analytics & Reporting Summary"
      />
      
      <AiEnhancedTextarea
        fieldName="deiAndCulturalFitStatement"
        sectionType="deiAndCulturalFitStatement"
        label="DEI & Cultural Fit Statement"
      />
      
      <AiEnhancedTextarea
        fieldName="searchCompletionMetricsSummary"
        sectionType="searchCompletionMetricsSummary"
        label="Search Completion Metrics Summary"
      />
    </div>
  );
}

    