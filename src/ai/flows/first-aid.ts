'use server';
/**
 * @fileOverview An AI first-aid assistant.
 *
 * - firstAidAssistant - A function that provides first-aid guidance for a given situation, optionally with an image.
 * - FirstAidAssistantInput - The input type for the firstAidAssistant function.
 * - FirstAidAssistantOutput - The return type for the firstAidAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FirstAidAssistantInputSchema = z.object({
  situation: z.string().describe('The first-aid situation described by the user (e.g., "minor burn", "deep cut").'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FirstAidAssistantInput = z.infer<typeof FirstAidAssistantInputSchema>;

const FirstAidAssistantOutputSchema = z.object({
  guidance: z.array(z.object({
      step: z.number().describe("The step number in the process."),
      instruction: z.string().describe("The detailed instruction for this step."),
  })).describe("A step-by-step list of first-aid instructions."),
  severityAssessment: z.string().describe("The AI's assessment of the injury's severity and when to seek professional help."),
});
export type FirstAidAssistantOutput = z.infer<typeof FirstAidAssistantOutputSchema>;

export async function firstAidAssistant(input: FirstAidAssistantInput): Promise<FirstAidAssistantOutput> {
  return firstAidAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'firstAidAssistantPrompt',
  input: {schema: FirstAidAssistantInputSchema},
  output: {schema: FirstAidAssistantOutputSchema},
  prompt: `You are an AI First-Aid Assistant for Afya.Ai. Your role is to provide clear, calm, and accurate step-by-step first-aid instructions for common injuries.

You MUST start with a disclaimer: "IMPORTANT: This is not a substitute for professional medical advice. For any serious or life-threatening injuries, call emergency services immediately."

Analyze the situation and the provided image (if any) to give appropriate guidance.

IMPORTANT: You must respond in the same language as the user's situation description.

User's Situation: {{{situation}}}
{{#if photoDataUri}}
Image: {{media url=photoDataUri}}
{{/if}}

Provide a step-by-step guide and an assessment of the severity, advising when to see a doctor.
`,
});

const firstAidAssistantFlow = ai.defineFlow(
  {
    name: 'firstAidAssistantFlow',
    inputSchema: FirstAidAssistantInputSchema,
    outputSchema: FirstAidAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
