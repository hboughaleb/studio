'use server';
/**
 * @fileOverview Enhances professional experience descriptions using AI to improve clarity and impact.
 *
 * - enhanceExperienceDescriptions - A function that enhances experience descriptions.
 * - EnhanceExperienceDescriptionsInput - The input type for the enhanceExperienceDescriptions function.
 * - EnhanceExperienceDescriptionsOutput - The return type for the enhanceExperienceDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceExperienceDescriptionsInputSchema = z.object({
  jobTitle: z.string().describe('The job title of the experience.'),
  company: z.string().describe('The company where the experience took place.'),
  originalDescription: z.array(z.string()).describe('The original bullet points describing the experience.'),
});
export type EnhanceExperienceDescriptionsInput = z.infer<typeof EnhanceExperienceDescriptionsInputSchema>;

const EnhanceExperienceDescriptionsOutputSchema = z.object({
  enhancedDescription: z.array(z.string()).describe('The enhanced bullet points describing the experience.'),
});
export type EnhanceExperienceDescriptionsOutput = z.infer<typeof EnhanceExperienceDescriptionsOutputSchema>;

export async function enhanceExperienceDescriptions(input: EnhanceExperienceDescriptionsInput): Promise<EnhanceExperienceDescriptionsOutput> {
  return enhanceExperienceDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceExperienceDescriptionsPrompt',
  input: {schema: EnhanceExperienceDescriptionsInputSchema},
  output: {schema: EnhanceExperienceDescriptionsOutputSchema},
  prompt: `You are a resume expert. You will rewrite the following bullet points to be more clear and impactful, incorporating the job title and company.

Job Title: {{{jobTitle}}}
Company: {{{company}}}
Original Description:
{{#each originalDescription}} - {{{this}}}\n{{/each}}

Enhanced Description:`, 
});

const enhanceExperienceDescriptionsFlow = ai.defineFlow(
  {
    name: 'enhanceExperienceDescriptionsFlow',
    inputSchema: EnhanceExperienceDescriptionsInputSchema,
    outputSchema: EnhanceExperienceDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
