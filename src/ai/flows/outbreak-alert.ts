'use server';
/**
 * @fileOverview An AI agent for drafting public health outbreak alerts.
 *
 * - outbreakAlertDrafter - A function that generates a public health announcement.
 * - OutbreakAlertDrafterInput - The input type for the outbreakAlertDrafter function.
 * - OutbreakAlertDrafterOutput - The return type for the outbreakAlertDrafter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutbreakAlertDrafterInputSchema = z.object({
  disease: z.string().describe('The name of the disease (e.g., "Cholera", "Measles").'),
  location: z.string().describe('The county or specific area affected.'),
  symptoms: z.string().describe('A comma-separated list of key symptoms to watch for.'),
  preventativeMeasures: z.string().describe('A comma-separated list of preventative measures.'),
});
export type OutbreakAlertDrafterInput = z.infer<typeof OutbreakAlertDrafterInputSchema>;

const OutbreakAlertDrafterOutputSchema = z.object({
  title: z.string().describe("A clear and concise title for the alert."),
  announcement: z.string().describe("The full public-friendly announcement text, including symptoms and prevention tips."),
});
export type OutbreakAlertDrafterOutput = z.infer<typeof OutbreakAlertDrafterOutputSchema>;

export async function outbreakAlertDrafter(input: OutbreakAlertDrafterInput): Promise<OutbreakAlertDrafterOutput> {
  return outbreakAlertDrafterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'outbreakAlertDrafterPrompt',
  input: {schema: OutbreakAlertDrafterInputSchema},
  output: {schema: OutbreakAlertDrafterOutputSchema},
  prompt: `You are a public health communications expert for Afya.Ai. Your task is to draft a clear, concise, and easy-to-understand public health alert based on the provided information.

The language should be simple and direct. The goal is to inform the public without causing panic.

Disease: {{{disease}}}
Location: {{{location}}}
Key Symptoms: {{{symptoms}}}
Preventative Measures: {{{preventativeMeasures}}}

Generate a title and a full announcement.
`,
});

const outbreakAlertDrafterFlow = ai.defineFlow(
  {
    name: 'outbreakAlertDrafterFlow',
    inputSchema: OutbreakAlertDrafterInputSchema,
    outputSchema: OutbreakAlertDrafterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
