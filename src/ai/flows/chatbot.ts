'use server';
/**
 * @fileOverview A chatbot that can answer questions about citizen issues and governance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateGovernanceInsights } from './generate-governance-insights';
import { predictServiceDemand } from './predict-service-demand';
import { prioritizeCitizenIssue } from './prioritize-citizen-issue';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';
import { ChatbotResponse } from '@/components/dashboard/chatbot';

const getInsightsTool = ai.defineTool(
  {
    name: 'generateGovernanceInsights',
    description:
      'Generates proactive governance insights from citizen feedback and historical data.',
    inputSchema: z.object({
      citizenFeedbackSummary: z
        .string()
        .describe('A summary of citizen feedback on various issues.'),
      historicalDemandData: z
        .string()
        .describe('Historical data on service demand.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => generateGovernanceInsights(input)
);

const predictDemandTool = ai.defineTool(
  {
    name: 'predictServiceDemand',
    description:
      'Predicts future service demand based on historical data and current issues.',
    inputSchema: z.object({
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
          'The time horizon for the prediction (e.g., next week, next month).'
        ),
    }),
    outputSchema: z.any(),
  },
  async (input) => predictServiceDemand(input)
);

const prioritizeIssueTool = ai.defineTool(
  {
    name: 'prioritizeCitizenIssue',
    description: 'Analyzes and prioritizes a single citizen issue.',
    inputSchema: z.object({
      issueReport: z
        .string()
        .describe('The detailed report of the issue submitted by a citizen.'),
      issueCategory: z
        .string()
        .describe(
          'The current category of the reported issue (e.g., road maintenance, public safety, sanitation).'
        ),
    }),
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

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
  {
    name: 'textToSpeech',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (text) => {
    if (!text) return '';
    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

      if (!media) return '';

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);
      return 'data:audio/wav;base64,' + wavBase64;
    } catch (e) {
      console.error('Error in TTS flow:', e);
      return '';
    }
  }
);


export async function getChatbotResponse(history: any[], query: string): Promise<ChatbotResponse> {
  const response = await ai.generate({
    prompt: query,
    history,
    model: 'googleai/gemini-2.5-flash',
  });

  const text = response.text;
  const audio = await ttsFlow(text);

  return { text, audio };
}
