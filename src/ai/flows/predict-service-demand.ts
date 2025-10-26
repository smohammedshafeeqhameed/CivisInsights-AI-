'use server';

/**
 * @fileOverview Predicts future service demand based on historical issue data and summaries.
 *
 * - predictServiceDemand - A function that predicts future service demand.
 * - PredictServiceDemandInput - The input type for the predictServiceDemand function.
 * - PredictServiceDemandOutput - The return type for the predictServiceDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictServiceDemandInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical issue data, including dates, categories, and summaries.'
    ),
  currentIssueSummaries: z
    .string()
    .describe('Summaries of current citizen-reported issues.'),
  predictionHorizon: z
    .string()
    .describe(
      'The time horizon for the prediction (e.g., next week, next month).' // Clarified description
    ),
});
export type PredictServiceDemandInput = z.infer<
  typeof PredictServiceDemandInputSchema
>;

const PredictServiceDemandOutputSchema = z.object({
  predictedDemand: z
    .string()
    .describe(
      'Predicted service demand, including specific areas and types of services needed.'
    ),
  resourceAllocationRecommendations: z
    .string()
    .describe(
      'Recommendations for resource allocation based on predicted demand.'
    ),
  potentialProblemAreas: z
    .string()
    .describe(
      'Identification of potential problem areas based on analyzed data and summaries.'
    ),
});
export type PredictServiceDemandOutput = z.infer<
  typeof PredictServiceDemandOutputSchema
>;

export async function predictServiceDemand(
  input: PredictServiceDemandInput
): Promise<PredictServiceDemandOutput> {
  return predictServiceDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictServiceDemandPrompt',
  input: {schema: PredictServiceDemandInputSchema},
  output: {schema: PredictServiceDemandOutputSchema},
  prompt: `You are an AI city planner tasked with predicting future service demand and providing resource allocation recommendations.

Analyze the following historical issue data and current issue summaries to predict future service demand for the specified time horizon.

Historical Issue Data:
{{{historicalData}}}

Current Issue Summaries:
{{{currentIssueSummaries}}}

Prediction Horizon:
{{{predictionHorizon}}}

Based on your analysis, provide the following:

1.  Predicted Service Demand: Detail the anticipated service demand, including specific areas and types of services that will be needed.
2.  Resource Allocation Recommendations: Offer concrete recommendations for resource allocation to meet the predicted demand.
3.  Potential Problem Areas: Identify any potential problem areas or issues based on the analyzed data and summaries.

Format your output clearly and concisely.
`,
});

const predictServiceDemandFlow = ai.defineFlow(
  {
    name: 'predictServiceDemandFlow',
    inputSchema: PredictServiceDemandInputSchema,
    outputSchema: PredictServiceDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
