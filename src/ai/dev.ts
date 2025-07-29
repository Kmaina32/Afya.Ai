import { config } from 'dotenv';
config();

import '@/ai/flows/health-query-chatbot.ts';
import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/image-diagnosis.ts';
import '@/ai/flows/tts.ts';
