'use server';
/**
 * @fileOverview Analyzes a CV against a job description to provide a match score and suggestions.
 *
 * - analyzeJobMatch - A function that handles the CV to Job Description analysis.
 * - AnalyzeJobMatchInput - The input type for the analyzeJobMatch function.
 * - AnalyzeJobMatchOutput - The return type for the analyzeJobMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CVData } from '@/types/cv'; // Assuming CVData structure for relevant parts

const CVDataRelevantPartsSchema = z.object({
  profile: z.string().describe('The professional profile summary from the CV.'),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      description: z.string().describe('Description of responsibilities and achievements for each role.'),
    })
  ).describe('Work experience from the CV.'),
  skills: z.array(z.string()).describe('A list of skills from the CV.'),
  detectedLanguage: z.string().optional().describe('The detected language of the CV (e.g., "en", "fr").'),
});

const AnalyzeJobMatchInputSchema = z.object({
  cvData: CVDataRelevantPartsSchema.describe('Relevant sections of the CV data for analysis.'),
  jobDescription: z.string().describe('The full text of the job description.'),
  language: z.string().optional().describe('The language for the analysis output (e.g., "en", "fr"). Defaults to CV language or English.'),
});
export type AnalyzeJobMatchInput = z.infer<typeof AnalyzeJobMatchInputSchema>;

const AnalyzeJobMatchOutputSchema = z.object({
  matchScore: z.number().min(0).max(100).describe('A percentage score indicating how well the CV matches the job description (0-100).'),
  matchingKeywords: z.array(z.string()).describe('Keywords from the job description that are present in the CV.'),
  missingKeywords: z.array(z.string()).describe('Important keywords from the job description that are missing from the CV.'),
  strengths: z.array(z.string()).describe('Specific aspects of the CV that strongly align with the job description.'),
  areasForImprovement: z.array(z.string()).describe('Specific suggestions on how to tailor the CV to better match the job description.'),
  summary: z.string().describe('A brief overall summary of the match and key recommendations.'),
});
export type AnalyzeJobMatchOutput = z.infer<typeof AnalyzeJobMatchOutputSchema>;

export async function analyzeJobMatch(input: AnalyzeJobMatchInput): Promise<AnalyzeJobMatchOutput> {
  return analyzeJobMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJobMatchPrompt',
  input: {schema: AnalyzeJobMatchInputSchema},
  output: {schema: AnalyzeJobMatchOutputSchema},
  prompt: `You are an expert HR professional and resume analyst.
Your task is to analyze the provided CV data against the given job description.
{{#if language}}
Provide your analysis in {{language}}.
{{else if cvData.detectedLanguage}}
Provide your analysis in the CV's detected language ({{cvData.detectedLanguage}}).
{{else}}
Provide your analysis in English.
{{/if}}

CV Data:
Profile Summary:
{{{cvData.profile}}}

Experience:
{{#each cvData.experience}}
- Title: {{{this.title}}} at {{{this.company}}}
  Description: {{{this.description}}}
{{/each}}

Skills: {{#join cvData.skills ", "}}{{/join}}

Job Description:
{{{jobDescription}}}

Based on this information, provide a detailed analysis including:
1.  A match score (0-100%).
2.  Keywords from the job description found in the CV.
3.  Important keywords from the job description missing from the CV.
4.  Specific strengths of the CV in relation to this job.
5.  Areas for improvement: specific, actionable advice on how to tailor the CV (e.g., "Highlight your experience with X by adding a bullet point under Y role focusing on Z achievement mentioned in the job description as 'requirement A'").
6.  A concise overall summary.

Focus on extracting relevant skills, experiences, and qualifications. Be objective and constructive.
Consider the language of the CV ({{cvData.detectedLanguage}}) and Job Description for keyword matching.
If the CV's language is different from the Job Description's language, note this as a potential point to address (e.g. by translating or tailoring the CV language).
The output should be structured according to the provided schema.
`,
});

const analyzeJobMatchFlow = ai.defineFlow(
  {
    name: 'analyzeJobMatchFlow',
    inputSchema: AnalyzeJobMatchInputSchema,
    outputSchema: AnalyzeJobMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
