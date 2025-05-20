
'use server';
/**
 * @fileOverview Generates text for specific professional detail sections of a CV.
 *
 * - generateProfessionalDetail - A function that handles the generation.
 * - GenerateProfessionalDetailInput - The input type for the function.
 * - GenerateProfessionalDetailOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CVDataContextSchema = z.object({
  profile: z.string().describe('The professional profile summary from the CV.'),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      description: z.string().describe('Description of responsibilities and achievements for each role.'),
    })
  ).describe('Work experience from the CV.'),
  skills: z.array(z.string()).describe('A list of skills from the CV.'),
});

const SectionTypeSchema = z.enum([
    "analyticsReportingSummary", 
    "deiAndCulturalFitStatement", 
    "searchCompletionMetricsSummary"
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

const GenerateProfessionalDetailInputSchema = z.object({
  sectionType: SectionTypeSchema.describe('The type of professional detail section to generate text for.'),
  cvContext: CVDataContextSchema.describe('Relevant context from the CV (profile, experience, skills).'),
  currentText: z.string().optional().describe('Existing text in the section, if any, to potentially refine or build upon.'),
  language: z.string().optional().describe('The language for the generated output (e.g., "en", "fr"). Defaults to English if not specified.'),
});
export type GenerateProfessionalDetailInput = z.infer<typeof GenerateProfessionalDetailInputSchema>;

const GenerateProfessionalDetailOutputSchema = z.object({
  generatedText: z.string().describe('The AI-generated text for the specified professional detail section.'),
});
export type GenerateProfessionalDetailOutput = z.infer<typeof GenerateProfessionalDetailOutputSchema>;

export async function generateProfessionalDetail(input: GenerateProfessionalDetailInput): Promise<GenerateProfessionalDetailOutput> {
  return generateProfessionalDetailFlow(input);
}

const getPromptInstruction = (sectionType: SectionType) => {
    switch (sectionType) {
        case "analyticsReportingSummary":
            return "an insightful summary of their experience with analytics and reporting, drawing specifics from their roles, companies, and any mentioned achievements in the provided CV context (such as in executive search or related fields). Focus on quantifiable achievements or specific examples if possible.";
        case "deiAndCulturalFitStatement":
            return "a thoughtful statement on their approach to Diversity, Equity, and Inclusion (DEI) and assessing cultural fit, reflecting insights that might be inferred from their professional background, roles, and companies as detailed in the CV. It should be positive and align with modern best practices.";
        case "searchCompletionMetricsSummary":
            return "a concise summary of key metrics related to search completion, time-to-hire, candidate quality, or other relevant performance indicators based on their described roles, company contexts, and overall experience (e.g., in recruitment or executive search). Infer from experience if direct metrics are not explicitly stated.";
        default:
            return "a relevant professional summary for this section, grounded in the provided CV details."
    }
}

const generateProfessionalDetailFlow = ai.defineFlow(
  {
    name: 'generateProfessionalDetailFlow',
    inputSchema: GenerateProfessionalDetailInputSchema,
    outputSchema: GenerateProfessionalDetailOutputSchema,
  },
  async ( input ) => {
    const instruction = getPromptInstruction(input.sectionType);
    const modifiedPrompt = `You are an expert CV and professional branding assistant.
Your primary task is to generate text for a specific section of a CV.
The generated text MUST be based **solely and extensively** on the provided CV context, which includes:
- Professional Profile/Summary: ${input.cvContext.profile}
- Work Experience:
${input.cvContext.experience.map(exp => `  - Role: ${exp.title} at ${exp.company}. Description: ${exp.description}`).join('\n')}
- Skills: ${input.cvContext.skills.join(", ")}

Generate the content ${input.language ? `in ${input.language}` : 'in English'}. The specific instruction for this section ("${input.sectionType}") is: "${instruction}".
The output should be a single, well-written paragraph or a short, impactful statement suitable for a CV.
If current text is provided for the section (Current Text: "${input.currentText || 'None'}"), you can choose to refine it, expand upon it, or generate a new version if that's more appropriate, ensuring it aligns with the CV context.

Ensure the generated text strictly adheres to the details (jobs, companies, responsibilities, skills) found in the CV context. Infer industry and relevant experience from this data.

Generated text for "${input.sectionType}":
`;

    const {output} = await ai.generate({
        prompt: modifiedPrompt,
        output: {schema: GenerateProfessionalDetailOutputSchema},
        // Consider adding safetySettings if needed, though usually not an issue for CV content
    });

    if (!output || typeof output.generatedText !== 'string') {
      const errorMsg = 'Invalid AI response format or empty output received.';
      console.error(errorMsg, output);
      // Attempt to provide a fallback or re-throw a more specific error
      // For now, if output is just a string (unexpected but possible if schema parsing failed silently)
      if(typeof output === 'string' && output.trim() !== '') {
        return { generatedText: output as string };
      }
      // If output is an object but doesn't have generatedText
      if(output && typeof (output as any).generatedText === 'undefined'){
         // Check if the model might have returned the text directly due to misinterpreting the schema instruction
         const anyOutput = output as any;
         const keys = Object.keys(anyOutput);
         if(keys.length === 1 && typeof anyOutput[keys[0]] === 'string'){
            return { generatedText: anyOutput[keys[0]] as string };
         }
      }
      throw new Error(errorMsg);
    }

    return output as GenerateProfessionalDetailOutput;
  }
);
