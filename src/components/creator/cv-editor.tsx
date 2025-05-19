
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVData } from '@/contexts/CVDataContext';
import type { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { PersonalInfoSection } from './sections/personal-info-section';
import { ProfileSection } from './sections/profile-section';
import { ExperienceSection } from './sections/experience-section';
import { EducationSection } from './sections/education-section';
import { SkillsSection } from './sections/skills-section';
import { LanguagesSection } from './sections/languages-section';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

// Define Zod schema based on ParseCvDataOutput and CVData
const ContactInfoSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  linkedin: z.string().url({ message: "Invalid LinkedIn URL" }).optional().or(z.literal('')),
});

const PersonalInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  contactInfo: ContactInfoSchema,
});

const ExperienceSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  dates: z.string().min(1, { message: "Dates are required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const EducationSchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  dates: z.string().min(1, { message: "Dates are required" }),
  description: z.string().optional(),
});

const LanguageSchema = z.object({
  language: z.string().min(1, { message: "Language is required" }),
  proficiency: z.string().min(1, { message: "Proficiency is required" }),
});

const CVFormSchema = z.object({
  personalInfo: PersonalInfoSchema,
  profile: z.string().min(1, { message: "Profile summary is required" }),
  experience: z.array(ExperienceSchema).min(1, { message: "At least one experience entry is required" }),
  education: z.array(EducationSchema).min(1, { message: "At least one education entry is required" }),
  skills: z.array(z.string().min(1, { message: "Skill cannot be empty" })).min(1, { message: "At least one skill is required" }),
  languages: z.array(LanguageSchema).optional(),
  photo: z.string().optional(),
  fileName: z.string().optional(),
  detectedLanguage: z.string().optional(), // Ensure detectedLanguage is part of the form schema
});


export function CVEditor() {
  const { cvData, setCvData, parsedCvData } = useCVData();
  const { toast } = useToast();

  const methods = useForm<CVData>({
    resolver: zodResolver(CVFormSchema),
    defaultValues: cvData || undefined, // Initialize with cvData
  });
  
  useEffect(() => {
    // Reset form when cvData changes (e.g., after initial parsing or external updates)
    if (cvData) {
      // Make sure to reset with the full CVData structure, including detectedLanguage
      methods.reset(cvData);
    }
  }, [cvData, methods, parsedCvData]);


  const onSubmit = (data: CVData) => {
    setCvData(data); // Update context with new data
    toast({
      title: "CV Updated",
      description: "Your changes have been saved and the preview is updated.",
    });
  };
  
  // Watch for form changes and auto-submit (update context)
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (type === 'change') { // only on user input
        // Check if form is valid before updating context
        // This provides real-time preview updates
        methods.trigger().then(isValid => {
          // Ensure `value` contains all fields, including `detectedLanguage`
          const currentFullData = methods.getValues();
          if (isValid) {
            setCvData(currentFullData as CVData);
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, setCvData]);


  if (!cvData) {
    return <div className="p-4 text-center">Loading editor... If this persists, try re-uploading your CV.</div>;
  }
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-primary border-b pb-2">Edit Your CV</h2>
        <Accordion type="multiple" defaultValue={['personalInfo', 'profile', 'experience', 'education', 'skills', 'languages']} className="w-full">
          <AccordionItem value="personalInfo">
            <AccordionTrigger className="text-lg font-medium">Personal Information</AccordionTrigger>
            <AccordionContent>
              <PersonalInfoSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="profile">
            <AccordionTrigger className="text-lg font-medium">Profile Summary</AccordionTrigger>
            <AccordionContent>
              <ProfileSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-medium">Work Experience</AccordionTrigger>
            <AccordionContent>
              <ExperienceSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-medium">Education</AccordionTrigger>
            <AccordionContent>
              <EducationSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-medium">Skills</AccordionTrigger>
            <AccordionContent>
              <SkillsSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="languages">
            <AccordionTrigger className="text-lg font-medium">Languages</AccordionTrigger>
            <AccordionContent>
              <LanguagesSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" className="w-full mt-8" size="lg">
          <Save className="mr-2 h-5 w-5" />
          Save & Update Preview
        </Button>
        {methods.formState.errors && Object.keys(methods.formState.errors).length > 0 && (
          <div className="text-destructive text-sm mt-2">
            Please correct the errors in the form.
          </div>
        )}
      </form>
    </FormProvider>
  );
}
