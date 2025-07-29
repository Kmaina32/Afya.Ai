'use server';
/**
 * @fileOverview An AI agent for diagnosing health conditions from images.
 *
 * - imageDiagnosis - A function that handles the image-based diagnosis process.
 * - ImageDiagnosisInput - The input type for the imageDiagnosis function.
 * - ImageDiagnosisOutput - The return type for the imageDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a health concern, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The user\'s question about the image.'),
});
export type ImageDiagnosisInput = z.infer<typeof ImageDiagnosisInputSchema>;

const ImageDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe("The AI's analysis of the health concern in the image."),
});
export type ImageDiagnosisOutput = z.infer<typeof ImageDiagnosisOutputSchema>;

export async function imageDiagnosis(input: ImageDiagnosisInput): Promise<ImageDiagnosisOutput> {
  return imageDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageDiagnosisPrompt',
  input: {schema: ImageDiagnosisInputSchema},
  output: {schema: ImageDiagnosisOutputSchema},
  prompt: `You are an expert medical diagnostician. A user has uploaded an image of a health concern and has a question.

Analyze the image and the user's question to provide a possible diagnosis.

IMPORTANT: You must include a disclaimer that you are not a real doctor and the user should consult a real healthcare professional.

IMPORTANT: You must respond in the same language as the user's question.

User Question: {{{question}}}
Image: {{media url=photoDataUri}}`,
});

const imageDiagnosisFlow = ai.defineFlow(
  {
    name: 'imageDiagnosisFlow',
    inputSchema: ImageDiagnosisInputSchema,
    outputSchema: ImageDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
