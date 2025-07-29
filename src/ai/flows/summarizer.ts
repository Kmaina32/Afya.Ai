'use server';

/**
 * @fileOverview An AI agent for summarizing health consultations.
 *
 * - consultationSummarizer - A function that summarizes a conversation.
 * - ConsultationSummarizerInput - The input type for the consultationSummarizer function.
 * - ConsultationSummarizerOutput - The return type for the consultationSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ConsultationSummarizerInputSchema = z.object({
  history: z.array(MessageSchema).describe('The chat conversation history.'),
});
export type ConsultationSummarizerInput = z.infer<typeof ConsultationSummarizerInputSchema>;

const ConsultationSummarizerOutputSchema = z.object({
  summary: z.string().describe("A summary of the key points from the consultation."),
  actionPlan: z.array(z.string()).describe("A list of recommended next steps for the user."),
});
export type ConsultationSummarizerOutput = z.infer<typeof ConsultationSummarizerOutputSchema>;

export async function consultationSummarizer(input: ConsultationSummarizerInput): Promise<ConsultationSummarizerOutput> {
  return consultationSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consultationSummarizerPrompt',
  input: {schema: ConsultationSummarizerInputSchema},
  output: {schema: ConsultationSummarizerOutputSchema},
  prompt: `You are a helpful medical assistant for Afya.Ai. Your job is to summarize a consultation between a user and an AI health chatbot.

Review the following conversation and extract the key information. Provide a concise summary of the user's issue and the chatbot's advice. Then, create a simple, actionable list of next steps for the user.

Conversation History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}
`,
});

const consultationSummarizerFlow = ai.defineFlow(
  {
    name: 'consultationSummarizerFlow',
    inputSchema: ConsultationSummarizerInputSchema,
    outputSchema: ConsultationSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
