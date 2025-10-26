'use server';

/**
 * @fileOverview Generates proactive insights and recommendations for governance based on analyzed citizen feedback.
 *
 * - generateGovernanceInsights - A function that generates governance insights.
 * - GenerateGovernanceInsightsInput - The input type for the generateGovernanceInsights function.
 * - GenerateGovernanceInsightsOutput - The return type for the generateGovernanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGovernanceInsightsInputSchema = z.object({
  citizenFeedbackSummary: z
    .string()
    .describe('A summary of citizen feedback on various issues.'),
  historicalDemandData: z
    .string()
    .describe('Historical data on service demand.'),
});
export type GenerateGovernanceInsightsInput = z.infer<
  typeof GenerateGovernanceInsightsInputSchema
>;

const GenerateGovernanceInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Proactive insights and recommendations for governance based on the analyzed citizen feedback and predicted trends.'
    ),
});
export type GenerateGovernanceInsightsOutput = z.infer<
  typeof GenerateGovernanceInsightsOutputSchema
>;

export async function generateGovernanceInsights(
  input: GenerateGovernanceInsightsInput
): Promise<GenerateGovernanceInsightsOutput> {
  return generateGovernanceInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGovernanceInsightsPrompt',
  input: {schema: GenerateGovernanceInsightsInputSchema},
  output: {schema: GenerateGovernanceInsightsOutputSchema},
  prompt: `You are a policy advisor tasked with generating proactive insights and recommendations for governance.

  Analyze the provided citizen feedback summary and historical demand data to identify trends, patterns, and potential issues.
  Based on your analysis, provide actionable insights and recommendations that can inform policy development and improve public services.

  Citizen Feedback Summary: {{{citizenFeedbackSummary}}}
  Historical Demand Data: {{{historicalDemandData}}}

  Provide your insights and recommendations in a clear and concise manner.
  Remember to format your output according to the output schema.`,
});

const generateGovernanceInsightsFlow = ai.defineFlow(
  {
    name: 'generateGovernanceInsightsFlow',
    inputSchema: GenerateGovernanceInsightsInputSchema,
    outputSchema: GenerateGovernanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
