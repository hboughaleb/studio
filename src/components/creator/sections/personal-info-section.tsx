'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhotoUpload } from './photo-upload';
import type { CVData } from '@/types/cv';

export function PersonalInfoSection() {
  const { control } = useFormContext<CVData>();

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm bg-card">
      <FormField
        control={control}
        name="personalInfo.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Jane Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="personalInfo.contactInfo.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="personalInfo.contactInfo.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g., +1 555-123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="personalInfo.contactInfo.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., https://linkedin.com/in/janedoe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="photo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <FormControl>
              <PhotoUpload 
                value={field.value} 
                onChange={(dataUri) => field.onChange(dataUri)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
