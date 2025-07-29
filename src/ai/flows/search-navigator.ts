'use server';
/**
 * @fileOverview An AI agent for navigating the app via search.
 *
 * - searchNavigator - A function that takes a search query and returns the most relevant app path.
 * - SearchNavigatorInput - The input type for the searchNavigator function.
 * - SearchNavigatorOutput - The return type for the searchNavigator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const validPaths = [
  '/chatbot',
  '/symptom-checker',
  '/therapist',
  '/nutritionist',
  '/first-aid',
  '/resources',
  '/directory',
  '/emergency',
  '/profile',
  '/admin',
  '/medication',
  '/lab-results',
];

const SearchNavigatorInputSchema = z.object({
  query: z.string().describe('The user\'s search query for navigating the app.'),
});
export type SearchNavigatorInput = z.infer<typeof SearchNavigatorInputSchema>;

const SearchNavigatorOutputSchema = z.object({
  path: z.enum(validPaths).describe('The most relevant path in the application based on the user\'s query.'),
});
export type SearchNavigatorOutput = z.infer<typeof SearchNavigatorOutputSchema>;

export async function searchNavigator(input: SearchNavigatorInput): Promise<SearchNavigatorOutput> {
  return searchNavigatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchNavigatorPrompt',
  input: {schema: SearchNavigatorInputSchema},
  output: {schema: SearchNavigatorOutputSchema},
  prompt: `You are a navigation assistant for the Afya.Ai mobile app. Your job is to determine the most relevant page for a user's search query.

  Analyze the user's query and choose the best path from the provided list.

  Available Pages and their purpose:
  - '/chatbot': General AI health chat, or if nothing else matches.
  - '/symptom-checker': Check symptoms to find possible conditions.
  - '/therapist': AI mental health support.
  - '/nutritionist': Get a meal plan.
  - '/first-aid': Immediate first-aid instructions.
  - '/resources': Health articles and information.
  - '/directory': Find hospitals and clinics.
  - '/emergency': Emergency service contact numbers.
  - '/profile': User's personal profile.
  - '/admin': Admin panel for managing alerts.
  - '/medication': Track and get reminders for medication.
  - '/lab-results': Analyze lab results, X-rays, and other scans.

  User Query: "{{{query}}}"

  Based on the query, select the most appropriate path. For example, if the user asks "analyze my xray", the best path is '/lab-results'. If they ask "remind me to take my pills", the best path is '/medication'.

  IMPORTANT: If the query is unclear or does not match any of the pages, you MUST return "/chatbot" as the default path.
  `,
});

const searchNavigatorFlow = ai.defineFlow(
  {
    name: 'searchNavigatorFlow',
    inputSchema: SearchNavigatorInputSchema,
    outputSchema: SearchNavigatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
