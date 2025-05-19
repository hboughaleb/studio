'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';
import type { CVData } from '@/types/cv';

export function SkillsSection() {
  const { control, getValues, setValue } = useFormContext<CVData>();
  // We manage skills as an array of strings.
  // react-hook-form's useFieldArray is more for objects, so we'll manage skills slightly differently.
  const [currentSkill, setCurrentSkill] = useState('');

  // Get current skills from form state
  const skills = getValues('skills') || [];

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const updatedSkills = [...skills, currentSkill.trim()];
      setValue('skills', updatedSkills, { shouldValidate: true, shouldDirty: true });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setValue('skills', updatedSkills, { shouldValidate: true, shouldDirty: true });
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if inside a form
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm bg-card">
      <FormItem>
        <FormLabel>Skills</FormLabel>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., JavaScript, Python"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddSkill} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </div>
         <FormMessage>{(control as any)._formState.errors.skills?.message}</FormMessage>
      </FormItem>
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="py-1 px-3 text-sm">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remove ${skill}`}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
