import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-citizen-issue.ts';
import '@/ai/flows/predict-service-demand.ts';
import '@/ai/flows/generate-governance-insights.ts';
import '@/ai/flows/prioritize-citizen-issue.ts';
