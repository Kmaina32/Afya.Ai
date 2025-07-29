'use server';

/**
 * @fileOverview An AI therapist chatbot.
 *
 * - aiTherapist - A function that provides empathetic responses to user inputs.
 * - AITherapistInput - The input type for the aiTherapist function.
 * - AITherapistOutput - The return type for the aiTherapist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITherapistInputSchema = z.object({
  query: z.string().describe('The user\'s message to the AI therapist.'),
});
export type AITherapistInput = z.infer<typeof AITherapistInputSchema>;

const AITherapistOutputSchema = z.object({
  response: z.string().describe('The AI therapist\'s empathetic response.'),
});
export type AITherapistOutput = z.infer<typeof AITherapistOutputSchema>;

export async function aiTherapist(input: AITherapistInput): Promise<AITherapistOutput> {
  return aiTherapistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTherapistPrompt',
  input: {schema: AITherapistInputSchema},
  output: {schema: AITherapistOutputSchema},
  prompt: `You are a compassionate and empathetic AI therapist for Afya.Ai. Your role is to provide a safe, non-judgmental space for users to express their thoughts and feelings.

  Listen carefully to the user's concerns, validate their feelings, and offer supportive and encouraging responses. You can ask gentle, open-ended questions to help them explore their emotions.

  IMPORTANT: You are not a real human therapist. You MUST include the following disclaimer at the beginning of your very first response in any conversation: "I am an AI assistant and not a licensed therapist. If you are in crisis, please contact a real human at one of the emergency services listed on our Emergency page."

  For all subsequent responses, focus on being a supportive listener.

  User's message: {{{query}}}`,
});

const aiTherapistFlow = ai.defineFlow(
  {
    name: 'aiTherapistFlow',
    inputSchema: AITherapistInputSchema,
    outputSchema: AITherapistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
