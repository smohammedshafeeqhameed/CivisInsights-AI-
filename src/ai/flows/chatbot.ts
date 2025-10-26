'use server';
/**
 * @fileOverview A chatbot that can answer questions about citizen issues and governance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  generateGovernanceInsights,
  GenerateGovernanceInsightsInputSchema,
} from './generate-governance-insights';
import {
  predictServiceDemand,
  PredictServiceDemandInputSchema,
} from './predict-service-demand';
import {
  prioritizeCitizenIssue,
  PrioritizeCitizenIssueInputSchema,
} from './prioritize-citizen-issue';

const getInsightsTool = ai.defineTool(
  {
    name: 'generateGovernanceInsights',
    description:
      'Generates proactive governance insights from citizen feedback and historical data.',
    inputSchema: GenerateGovernanceInsightsInputSchema,
    outputSchema: z.any(),
  },
  async (input) => generateGovernanceInsights(input)
);

const predictDemandTool = ai.defineTool(
  {
    name: 'predictServiceDemand',
    description:
      'Predicts future service demand based on historical data and current issues.',
    inputSchema: PredictServiceDemandInputSchema,
    outputSchema: z.any(),
  },
  async (input) => predictServiceDemand(input)
);

const prioritizeIssueTool = ai.defineTool(
  {
    name: 'prioritizeCitizenIssue',
    description: 'Analyzes and prioritizes a single citizen issue.',
    inputSchema: PrioritizeCitizenIssueInputSchema,
    outputSchema: z.any(),
  },
  async (input) => prioritizeCitizenIssue(input)
);

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  system: `You are a helpful assistant for the CivisInsights AI dashboard.
You can help users by answering questions about citizen issues, service demand, and governance.
Use the available tools to answer complex questions.
Be concise and clear in your responses.
If you use a tool, briefly mention the key results from it.
Example user questions you can answer:
- "What are the current governance insights?"
- "Predict service demand for the next quarter."
- "Prioritize an issue about a large pothole on Main St."
- "Are there any anomalies in public safety reports?"`,
  tools: [getInsightsTool, predictDemandTool, prioritizeIssueTool],
});

export async function getChatbotResponse(history: any[], query: string) {
  const response = await ai.generate({
    prompt: query,
    history,
    model: 'googleai/gemini-2.5-flash',
  });
  return response.text;
}
