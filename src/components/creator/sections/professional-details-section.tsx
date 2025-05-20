
'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';
import type { CVData } from '@/types/cv';

// Reusable component for managing a list of string tags
const TagInputArray = ({ fieldName, label, placeholder }: { fieldName: keyof CVData, label: string, placeholder: string }) => {
  const { control, getValues, setValue } = useFormContext<CVData>();
  const [currentValue, setCurrentValue] = useState('');

  // Ensure the field is an array, even if it's initially undefined
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
        render={() => <FormMessage />} // For array-level messages if needed
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item, index) => (
            <Badge key={`${fieldName}-${index}`} variant="secondary" className="py-1 px-3 text-sm">
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


export function ProfessionalDetailsSection() {
  const { control } = useFormContext<CVData>();

  return (
    <div className="space-y-6 p-4 border rounded-md shadow-sm bg-card">
      <TagInputArray
        fieldName="toolsProficiency"
        label="Tools Proficiency"
        placeholder="e.g., Salesforce, Bullhorn, Tableau"
      />

      <FormField
        control={control}
        name="analyticsReportingSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Analytics & Reporting Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your experience with analytics and reporting in executive search..."
                className="min-h-[100px]"
                {...field}
                // Ensure value is string or empty string to avoid controlled/uncontrolled issue
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deiAndCulturalFitStatement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DEI & Cultural Fit Statement</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your approach to DEI and assessing cultural fit..."
                className="min-h-[100px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="searchCompletionMetricsSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search Completion Metrics Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Summarize key metrics related to search completion, time-to-hire, etc..."
                className="min-h-[100px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
