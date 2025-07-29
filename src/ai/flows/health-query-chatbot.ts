'use server';

/**
 * @fileOverview AI chatbot for answering general health questions.
 *
 * - healthQueryChatbot - A function that processes user health queries and returns informative responses.
 * - HealthQueryChatbotInput - The input type for the healthQueryChatbot function.
 * - HealthQueryChatbotOutput - The return type for the healthQueryChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthQueryChatbotInputSchema = z.object({
  query: z.string().describe('The health-related question from the user.'),
});
export type HealthQueryChatbotInput = z.infer<typeof HealthQueryChatbotInputSchema>;

const HealthQueryChatbotOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
});
export type HealthQueryChatbotOutput = z.infer<typeof HealthQueryChatbotOutputSchema>;

export async function healthQueryChatbot(input: HealthQueryChatbotInput): Promise<HealthQueryChatbotOutput> {
  return healthQueryChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthQueryChatbotPrompt',
  input: {schema: HealthQueryChatbotInputSchema},
  output: {schema: HealthQueryChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot providing general health information to users in Kenya.

  Please answer the following health question:

  {{query}}`,
});

const healthQueryChatbotFlow = ai.defineFlow(
  {
    name: 'healthQueryChatbotFlow',
    inputSchema: HealthQueryChatbotInputSchema,
    outputSchema: HealthQueryChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
