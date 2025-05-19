'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Sparkles, Loader2 } from 'lucide-react';
import type { CVData } from '@/types/cv';
import { enhanceExperienceDescriptions } from '@/ai/flows/enhance-experience-descriptions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ExperienceSection() {
  const { control, getValues, setValue } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });
  const { toast } = useToast();
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const handleEnhanceDescription = async (index: number) => {
    setEnhancingIndex(index);
    const experienceEntry = getValues(`experience.${index}`);
    if (!experienceEntry || !experienceEntry.description) {
      toast({ title: "Missing Information", description: "Please provide a job title, company, and description.", variant: "destructive"});
      setEnhancingIndex(null);
      return;
    }
    
    // Assuming description is a string of bullet points, split by newline
    const originalBulletPoints = experienceEntry.description.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (originalBulletPoints.length === 0) {
      toast({ title: "No Description", description: "Please write some bullet points for the description.", variant: "destructive"});
      setEnhancingIndex(null);
      return;
    }

    try {
      const result = await enhanceExperienceDescriptions({
        jobTitle: experienceEntry.title,
        company: experienceEntry.company,
        originalDescription: originalBulletPoints,
      });
      setValue(`experience.${index}.description`, result.enhancedDescription.join('\n'), { shouldValidate: true, shouldDirty: true });
      toast({ title: "Description Enhanced!", description: "AI has improved your experience description." });
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast({ title: "Enhancement Failed", description: "Could not enhance description. Please try again.", variant: "destructive" });
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-md shadow-sm bg-card">
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border rounded-md space-y-3 relative bg-background/50">
          <FormField
            control={control}
            name={`experience.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`experience.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl><Input placeholder="e.g., Tech Solutions Inc." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`experience.${index}.dates`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dates</FormLabel>
                <FormControl><Input placeholder="e.g., Jan 2020 - Present" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`experience.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (use bullet points, one per line)</FormLabel>
                <FormControl><Textarea placeholder="- Developed new features...\n- Collaborated with team..." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleEnhanceDescription(index)}
              disabled={enhancingIndex === index}
            >
              {enhancingIndex === index ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Enhance with AI
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: '', company: '', dates: '', description: '' })}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}
