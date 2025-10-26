'use server';

/**
 * @fileOverview Analyzes a citizen-reported issue to assign a priority score and suggest the appropriate department.
 *
 * - prioritizeCitizenIssue - A function that analyzes and prioritizes a citizen issue.
 * - PrioritizeCitizenIssueInput - The input type for the prioritizeCitizenIssue function.
 * - PrioritizeCitizenIssueOutput - The return type for the prioritizeCitizenIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeCitizenIssueInputSchema = z.object({
  issueReport: z
    .string()
    .describe('The detailed report of the issue submitted by a citizen.'),
  issueCategory: z
    .string()
    .describe(
      'The current category of the reported issue (e.g., road maintenance, public safety, sanitation).'
    ),
});
export type PrioritizeCitizenIssueInput = z.infer<
  typeof PrioritizeCitizenIssueInputSchema
>;

const PrioritizeCitizenIssueOutputSchema = z.object({
  priorityScore: z
    .number()
    .describe(
      'A numerical score from 1 (lowest priority) to 100 (highest priority) based on urgency, impact, and safety implications.'
    ),
  suggestedDepartment: z
    .string()
    .describe(
      'The recommended city department to handle the issue (e.g., Sanitation, Public Safety, Road Maintenance, Parks & Rec).'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief, one-sentence explanation for the assigned priority score and department suggestion.'
    ),
});
export type PrioritizeCitizenIssueOutput = z.infer<
  typeof PrioritizeCitizenIssueOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'prioritizeCitizenIssuePrompt',
  input: {schema: PrioritizeCitizenIssueInputSchema},
  output: {schema: PrioritizeCitizenIssueOutputSchema},
  prompt: `You are an AI-powered triage officer for a city government. Your task is to analyze citizen issue reports and assign a priority score and the correct department.

  Analyze the following issue report and its category. Based on the content, determine its urgency, potential impact on public safety, and scale.
  
  - Assign a 'priorityScore' from 1 (very low) to 100 (critical emergency).
  - Determine the best 'suggestedDepartment' from: 'Sanitation', 'Public Safety', 'Road Maintenance', 'Parks & Rec', or 'Administration'.
  - Provide a concise 'reasoning' for your decision.

  Issue Category: {{{issueCategory}}}
  Issue Report: {{{issueReport}}}
  
  Provide your analysis in the structured format required by the output schema.`,
});

const prioritizeCitizenIssueFlow = ai.defineFlow(
  {
    name: 'prioritizeCitizenIssueFlow',
    inputSchema: PrioritizeCitizenIssueInputSchema,
    outputSchema: PrioritizeCitizenIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function prioritizeCitizenIssue(
  input: PrioritizeCitizenIssueInput
): Promise<PrioritizeCitizenIssueOutput> {
  return prioritizeCitizenIssueFlow(input);
}
