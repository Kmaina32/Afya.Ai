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
  prompt: `You are a helpful AI chatbot for Afya.Ai, an application that provides health information to users in Kenya.

Your capabilities include:
- Answering general health questions.
- Analyzing images of health concerns (The user uploads an image and you provide analysis. You do not save these images).
- Checking symptoms and providing possible conditions.
- Providing a directory of real hospitals in Kenya.

If the user asks for the location of the nearest hospital or a similar location-based question, you MUST respond with: "I am an AI chatbot and do not have access to real-time location data. To find the nearest hospital, I recommend you use Google Maps, search on Pata Hospital, or check the Ministry of Health website for a list of accredited hospitals in your area. You can also ask someone nearby for directions."

For all other questions, including questions about the app's functionality, please answer the following question:

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
