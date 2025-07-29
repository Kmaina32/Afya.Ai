'use server';

/**
 * @fileOverview An AI nutritionist for generating Kenyan meal plans.
 *
 * - nutritionist - A function that creates a meal plan based on user goals.
 * - NutritionistInput - The input type for the nutritionist function.
 * - NutritionistOutput - The return type for the nutritionist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionistInputSchema = z.object({
  healthGoal: z.string().describe('The user\'s health goal (e.g., "weight loss", "muscle gain", "manage blood sugar").'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions (e.g., "vegetarian", "no nuts").'),
});
export type NutritionistInput = z.infer<typeof NutritionistInputSchema>;

const MealSchema = z.object({
  name: z.string().describe("The name of the meal."),
  description: z.string().describe("A brief description of the meal and why it's suitable."),
});

const DailyPlanSchema = z.object({
  day: z.string().describe("The day of the week (e.g., Monday)."),
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
});

const NutritionistOutputSchema = z.object({
  mealPlan: z.array(DailyPlanSchema).describe('A 7-day meal plan.'),
});
export type NutritionistOutput = z.infer<typeof NutritionistOutputSchema>;

export async function nutritionist(input: NutritionistInput): Promise<NutritionistOutput> {
  return nutritionistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nutritionistPrompt',
  input: {schema: NutritionistInputSchema},
  output: {schema: NutritionistOutputSchema},
  prompt: `You are an expert AI Nutritionist for Afya.Ai, specializing in Kenyan cuisine.

A user has requested a 7-day meal plan based on their health goals. Create a balanced, healthy, and culturally relevant meal plan using affordable and locally available Kenyan foods (e.g., sukuma wiki, githeri, ugali, omena, managu, terere, local fruits).

The plan should be structured for 7 days, with breakfast, lunch, and dinner for each day.

User's Health Goal: {{{healthGoal}}}
{{#if dietaryRestrictions}}
Dietary Restrictions: {{{dietaryRestrictions}}}
{{/if}}

Generate the 7-day meal plan now.
`,
});

const nutritionistFlow = ai.defineFlow(
  {
    name: 'nutritionistFlow',
    inputSchema: NutritionistInputSchema,
    outputSchema: NutritionistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
