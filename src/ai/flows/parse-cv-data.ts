'use server';

/**
 * @fileOverview Parses CV data from an uploaded PDF using AI.
 *
 * - parseCvData - A function that handles the CV parsing process.
 * - ParseCvDataInput - The input type for the parseCvData function.
 * - ParseCvDataOutput - The return type for the parseCvData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseCvDataInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A CV PDF, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseCvDataInput = z.infer<typeof ParseCvDataInputSchema>;

const ParseCvDataOutputSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe('The full name of the person.'),
    contactInfo: z.object({
      email: z.string().describe('The email address of the person.'),
      phone: z.string().describe('The phone number of the person.'),
      linkedin: z.string().optional().describe('The LinkedIn profile URL of the person, if available.'),
    }).describe('Contact information of the person.'),
  }).describe('Personal information extracted from the CV.'),
  profile: z.string().describe('A brief professional profile or summary.'),
  experience: z.array(
    z.object({
      title: z.string().describe('The job title.'),
      company: z.string().describe('The name of the company.'),
      dates: z.string().describe('The start and end dates of the employment.'),
      description: z.string().describe('A description of the responsibilities and achievements in the role.'),
    })
  ).describe('Work experience details.'),
  education: z.array(
    z.object({
      institution: z.string().describe('The name of the educational institution.'),
      degree: z.string().describe('The degree obtained.'),
      dates: z.string().describe('The start and end dates of the education.'),
      description: z.string().optional().describe('A description of the studies and achievements.'),
    })
  ).describe('Education details.'),
  skills: z.array(z.string()).describe('A list of skills.'),
  languages: z.array(
    z.object({
      language: z.string().describe('The name of the language.'),
      proficiency: z.string().describe('The proficiency level in the language.'),
    })
  ).describe('A list of languages spoken and proficiency levels.'),
});
export type ParseCvDataOutput = z.infer<typeof ParseCvDataOutputSchema>;

export async function parseCvData(input: ParseCvDataInput): Promise<ParseCvDataOutput> {
  return parseCvDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCvDataPrompt',
  input: {schema: ParseCvDataInputSchema},
  output: {schema: ParseCvDataOutputSchema},
  prompt: `You are an expert CV parser. Your job is to extract structured data from a CV in PDF format.

  Analyze the following CV, provided as a data URI, and extract the following information:

  - Personal Information (name, contact information: email, phone, LinkedIn)
  - Profile (a brief professional summary)
  - Experience (job title, company, dates, description of responsibilities and achievements)
  - Education (institution, degree, dates, description)
  - Skills (list of skills)
  - Languages (language, proficiency)

  The CV may be in either English or French.  You must auto-detect the language.

  Return the data in JSON format, according to the schema provided.  The schema Zod descriptions describe how to populate the output fields.

  CV Data: {{media url=pdfDataUri}}
  `,
});

const parseCvDataFlow = ai.defineFlow(
  {
    name: 'parseCvDataFlow',
    inputSchema: ParseCvDataInputSchema,
    outputSchema: ParseCvDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

