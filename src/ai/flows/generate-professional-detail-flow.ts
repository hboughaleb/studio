
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
            return "an insightful summary of their experience with analytics and reporting in executive search or related fields. Focus on quantifiable achievements or specific examples if possible from the context.";
        case "deiAndCulturalFitStatement":
            return "a thoughtful statement on their approach to Diversity, Equity, and Inclusion (DEI) and assessing cultural fit. It should be positive and reflect an understanding of modern best practices.";
        case "searchCompletionMetricsSummary":
            return "a concise summary of key metrics related to search completion, time-to-hire, candidate quality, or other relevant performance indicators in recruitment or executive search. Infer from experience if direct metrics are not stated.";
        default:
            return "a relevant professional summary for this section."
    }
}

const prompt = ai.definePrompt({
  name: 'generateProfessionalDetailPrompt',
  input: {schema: GenerateProfessionalDetailInputSchema},
  output: {schema: GenerateProfessionalDetailOutputSchema},
  prompt: `You are an expert CV and professional branding assistant.
Based on the provided CV context (profile, experience, skills), generate {{#if language}}in {{language}}{{else}}in English{{/if}} {{getPromptInstruction sectionType}}.
The output should be a single, well-written paragraph or a short, impactful statement suitable for a CV.
If current text is provided, you can choose to refine it, expand upon it, or generate a new version if that's more appropriate.

CV Context:
Profile: {{{cvContext.profile}}}
Experience:
{{#each cvContext.experience}}
- Title: {{{this.title}}} at {{{this.company}}}
  Description: {{{this.description}}}
{{/each}}
Skills: {{#join cvContext.skills ", "}}{{/join}}

{{#if currentText}}
Current text in the section (for reference or refinement):
{{{currentText}}}
{{/if}}

Generated text for "{{sectionType}}":
`,
});

// Register the helper with the Handlebars environment used by the prompt.
// Note: Genkit's prompt compilation will need to be aware of this helper.
// If direct helper registration isn't available in this Genkit version's prompt definition,
// this logic would need to be pre-calculated and passed in the input,
// or the prompt structure would need to use conditional blocks.
// For this example, I'm assuming a mechanism for helper registration or pre-processing.
// A more robust Genkit way for complex conditional text within prompt is to prepare it in the flow function.

const generateProfessionalDetailFlow = ai.defineFlow(
  {
    name: 'generateProfessionalDetailFlow',
    inputSchema: GenerateProfessionalDetailInputSchema,
    outputSchema: GenerateProfessionalDetailOutputSchema,
  },
  async ( input ) => {
    // Pre-calculate instruction for cleaner prompt.
    const instruction = getPromptInstruction(input.sectionType);
    const modifiedPrompt = `You are an expert CV and professional branding assistant.
Based on the provided CV context (profile, experience, skills), generate ${input.language ? `in ${input.language}` : 'in English'} ${instruction}.
The output should be a single, well-written paragraph or a short, impactful statement suitable for a CV.
If current text is provided, you can choose to refine it, expand upon it, or generate a new version if that's more appropriate.

CV Context:
Profile: ${input.cvContext.profile}
Experience:
${input.cvContext.experience.map(exp => `- Title: ${exp.title} at ${exp.company}\n  Description: ${exp.description}`).join('\n')}
Skills: ${input.cvContext.skills.join(", ")}

${input.currentText ? `Current text in the section (for reference or refinement):\n${input.currentText}` : ''}

Generated text for "${input.sectionType}":
`;

    const {output} = await ai.generate({
        prompt: modifiedPrompt, // Use the dynamically constructed prompt string
        output: {schema: GenerateProfessionalDetailOutputSchema}, // Ensure output schema is still enforced if ai.generate supports it this way
        // Or if definePrompt is more flexible, reconstruct prompt object dynamically.
        // For simplicity with current structure, we're calling ai.generate directly with a string prompt.
        // This means the output schema enforcement might rely on the text structure + LLM adherence.
        // A more robust way if direct helper registration fails is:
        // const specificPrompt = ai.definePrompt({..., prompt: modifiedPromptString, output: {schema: ...}})
        // const {output} = await specificPrompt(input);
    });

    // If ai.generate doesn't directly take output schema with string prompts or we need explicit parsing:
    if (typeof output === 'string') { // Assuming output might be raw string
        try {
            // Attempt to parse if model returns JSON string, or handle structured text
            // This part is tricky if model doesn't strictly adhere to JSON for simple string prompts.
            // For this case, expecting `generatedText` directly as string if prompt is simple.
            // The output schema on `ai.definePrompt` is the primary way this is enforced.
            // If we bypass `ai.definePrompt`'s direct call, we ensure the object structure here.
             const result = output as any; // Cast if necessary
             if (result.generatedText) {
                return result as GenerateProfessionalDetailOutput;
             }
             return { generatedText: result as string }; // Fallback if it's just a string
        } catch (e) {
            console.error("Error parsing AI output", e);
            throw new Error("AI output format error");
        }
    }
     if (!output || typeof output.generatedText !== 'string') {
      throw new Error('Invalid AI response format.');
    }

    return output as GenerateProfessionalDetailOutput;
  }
);

    