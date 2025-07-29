// SymptomChecker flow
'use server';
/**
 * @fileOverview An AI symptom checker.
 *
 * - symptomChecker - A function that processes user-reported symptoms and provides a list of possible conditions.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('A comma-separated list of symptoms reported by the user.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  possibleConditions: z
    .string() // Changed from array to string
    .describe('A list of possible medical conditions based on the symptoms.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI symptom checker designed to provide a list of possible medical conditions based on user-reported symptoms.

  The user will provide a comma-separated list of symptoms. You should provide a comma-separated list of possible conditions that could be causing these symptoms. Ensure the list is concise and relevant.

  Symptoms: {{{symptoms}}}
  Possible Conditions:`, // Adjusted prompt to request comma-separated conditions
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
