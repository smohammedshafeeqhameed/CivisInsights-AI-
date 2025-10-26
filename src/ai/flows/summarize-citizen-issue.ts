
'use server';

/**
 * @fileOverview Summarizes citizen-reported issues using AI to extract key details.
 *
 * - summarizeCitizenIssue - A function that summarizes citizen-reported issues.
 * - SummarizeCitizenIssueInput - The input type for the summarizeCitizenIssue function.
 * - SummarizeCitizenIssueOutput - The return type for the summarizeCitizenIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCitizenIssueInputSchema = z.object({
  issueReport: z
    .string()
    .describe('The detailed report of the issue submitted by a citizen.'),
  issueCategory: z
    .string()
    .describe(
      'The category of the reported issue (e.g., road maintenance, public safety, sanitation).'
    ),
});

export type SummarizeCitizenIssueInput = z.infer<
  typeof SummarizeCitizenIssueInputSchema
>;

const SummarizeCitizenIssueOutputSchema = z.object({
  summary: z.string().describe('A concise, one-sentence summary of the citizen-reported issue.'),
  keyDetails: z
    .array(z.string())
    .describe('A list of 2-3 bullet points extracting the most critical details from the issue report (e.g., specific locations, times, items).'),
  suggestedAction: z
    .string()
    .describe('A brief, actionable suggestion for the next step to resolve the issue.'),
});

export type SummarizeCitizenIssueOutput = z.infer<
  typeof SummarizeCitizenIssueOutputSchema
>;

export async function summarizeCitizenIssue(
  input: SummarizeCitizenIssueInput
): Promise<SummarizeCitizenIssueOutput> {
  return summarizeCitizenIssueFlow(input);
}

const summarizeCitizenIssuePrompt = ai.definePrompt({
  name: 'summarizeCitizenIssuePrompt',
  input: {schema: SummarizeCitizenIssueInputSchema},
  output: {schema: SummarizeCitizenIssueOutputSchema},
  prompt: `You are a city official tasked with summarizing citizen-reported issues. Your goal is to provide a concise summary, extract key details, and suggest a course of action. Analyze the report and provide the output in the required structured format.

  Issue Category: {{{issueCategory}}}
  Issue Report: {{{issueReport}}}
  
  Generate a one-sentence summary, a list of 2-3 key details, and a brief suggested action.`,
});

const summarizeCitizenIssueFlow = ai.defineFlow(
  {
    name: 'summarizeCitizenIssueFlow',
    inputSchema: SummarizeCitizenIssueInputSchema,
    outputSchema: SummarizeCitizenIssueOutputSchema,
  },
  async input => {
    const {output} = await summarizeCitizenIssuePrompt(input);
    return output!;
  }
);
