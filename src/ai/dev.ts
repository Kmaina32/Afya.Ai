import { config } from 'dotenv';
config();

import '@/ai/flows/health-query-chatbot.ts';
import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/image-diagnosis.ts';
import '@/ai/flows/tts.ts';
import '@/ai/flows/ai-therapist.ts';
import '@/ai/flows/nutritionist.ts';
import '@/ai/flows/summarizer.ts';
import '@/ai/flows/first-aid.ts';
import '@/ai/flows/outbreak-alert.ts';
import '@/ai/flows/search-navigator.ts';
