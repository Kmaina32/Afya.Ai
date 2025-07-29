'use server';
/**
 * @fileOverview An AI agent for analyzing medical scans and lab results.
 *
 * - scanAnalyzer - A function that provides an analysis of a medical image and text.
 * - ScanAnalyzerInput - The input type for the scanAnalyzer function.
 * - ScanAnalyzerOutput - The return type for the scanAnalyzer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medical scan or lab result, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().optional().describe('An optional question or context from the user about the scan/report.'),
});
export type ScanAnalyzerInput = z.infer<typeof ScanAnalyzerInputSchema>;

const FindingSchema = z.object({
    finding: z.string().describe("A key observation or finding from the scan/report."),
    explanation: z.string().describe("A simple, easy-to-understand explanation of the finding."),
});

const ScanAnalyzerOutputSchema = z.object({
  title: z.string().describe("A concise title for the analysis (e.g., 'Analysis of Chest X-Ray')."),
  keyFindings: z.array(FindingSchema).describe("A list of the most important findings from the analysis."),
  simplifiedSummary: z.string().describe("A summary of the overall findings in plain language for the user."),
  disclaimer: z.string().describe("A mandatory disclaimer about the AI analysis not being a substitute for professional medical advice."),
});
export type ScanAnalyzerOutput = z.infer<typeof ScanAnalyzerOutputSchema>;

export async function scanAnalyzer(input: ScanAnalyzerInput): Promise<ScanAnalyzerOutput> {
  return scanAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanAnalyzerPrompt',
  input: {schema: ScanAnalyzerInputSchema},
  output: {schema: ScanAnalyzerOutputSchema},
  prompt: `You are an expert AI radiologist and medical report analyst for Afya.Ai. Your role is to analyze medical images (like X-rays, MRIs, CT scans) and lab reports, and explain the findings in a way that is easy for a patient to understand.

You MUST ALWAYS start with the following disclaimer: "This AI analysis is for informational purposes only and is NOT a substitute for a professional diagnosis from a qualified radiologist or doctor. Please consult with your healthcare provider to discuss your results."

Based on the image and the user's query, perform the following steps:
1.  Identify the type of scan or report.
2.  Identify the key findings. For each finding, provide a simple explanation.
3.  Provide an overall summary of the findings in plain, non-technical language.
4.  Generate a concise title for your analysis.

IMPORTANT: You must provide the entire response (title, findings, summary, etc.) in the same language as the user's query. If there is no query, respond in English.

User's Query: {{{query}}}
Scan/Report Image: {{media url=photoDataUri}}

Generate your analysis now.
`,
});

const scanAnalyzerFlow = ai.defineFlow(
  {
    name: 'scanAnalyzerFlow',
    inputSchema: ScanAnalyzerInputSchema,
    outputSchema: ScanAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
