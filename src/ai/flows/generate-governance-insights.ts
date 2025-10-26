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
  keyInsight: z
    .string()
    .describe(
      'The single most important, concise insight discovered from the data.'
    ),
  recommendations: z
    .array(z.string())
    .describe(
      'A list of actionable recommendations for governance based on the insight.'
    ),
  dataPoints: z
    .array(z.string())
    .describe('A list of specific data points that support the insight.'),
});
export type GenerateGovernanceInsightsOutput = z.infer<
  typeof GenerateGovernanceInsightsOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateGovernanceInsightsPrompt',
  input: {schema: GenerateGovernanceInsightsInputSchema},
  output: {schema: GenerateGovernanceInsightsOutputSchema},
  prompt: `You are a policy advisor tasked with generating proactive insights and recommendations for governance.

  Analyze the provided citizen feedback summary and historical demand data to identify trends, patterns, and potential issues.
  Based on your analysis, provide a primary key insight, a list of supporting data points, and a list of actionable recommendations.

  Citizen Feedback Summary: {{{citizenFeedbackSummary}}}
  Historical Demand Data: {{{historicalDemandData}}}

  Provide your analysis in the structured format required by the output schema.
  - keyInsight: A concise, single sentence summarizing the core issue.
  - dataPoints: A list of 2-3 specific data points backing up your insight.
  - recommendations: A list of 2-3 concrete, actionable steps to address the issue.`,
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


export async function generateGovernanceInsights(
  input: GenerateGovernanceInsightsInput
): Promise<GenerateGovernanceInsightsOutput> {
  return generateGovernanceInsightsFlow(input);
}
