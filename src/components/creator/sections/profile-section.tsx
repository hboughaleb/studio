'use client';

import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CVData } from '@/types/cv';

export function ProfileSection() {
  const { control } = useFormContext<CVData>();

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm bg-card">
      <FormField
        control={control}
        name="profile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Profile / Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write a brief summary of your professional background and career goals..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
