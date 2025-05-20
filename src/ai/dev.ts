import { config } from 'dotenv';
config();

import '@/ai/flows/parse-cv-data.ts';
import '@/ai/flows/enhance-experience-descriptions.ts';
import '@/ai/flows/analyze-job-match-flow.ts'; // Added new flow
