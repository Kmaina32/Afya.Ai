'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nutritionist, type NutritionistOutput } from '@/ai/flows/nutritionist';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  healthGoal: z.string().min(5, 'Please describe your health goal.'),
  dietaryRestrictions: z.string().optional(),
});

export default function NutritionistPage() {
  const [result, setResult] = useState<NutritionistOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      healthGoal: '',
      dietaryRestrictions: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await nutritionist(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to generate a meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">AI Nutritionist</h1>
        <p className="text-muted-foreground mt-1">
          Get a personalized 7-day meal plan based on local Kenyan foods.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>
            Tell us about your goals and we'll create a plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="healthGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your primary health goal?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lose weight, manage diabetes, eat healthier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any dietary restrictions or preferences? (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vegetarian, no dairy, allergic to nuts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Meal Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
       {isLoading && (
         <div className="flex items-center justify-center p-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      )}

      {result && result.mealPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Your 7-Day Meal Plan</CardTitle>
            <CardDescription>
              Here is a sample meal plan. Remember to drink plenty of water throughout the day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.mealPlan.map((dayPlan) => (
                <AccordionItem value={dayPlan.day} key={dayPlan.day}>
                  <AccordionTrigger className="text-lg font-semibold">{dayPlan.day}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-primary">Breakfast</h4>
                        <p className="font-bold">{dayPlan.breakfast.name}</p>
                        <p className="text-sm text-muted-foreground">{dayPlan.breakfast.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">Lunch</h4>
                        <p className="font-bold">{dayPlan.lunch.name}</p>
                        <p className="text-sm text-muted-foreground">{dayPlan.lunch.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">Dinner</h4>
                         <p className="font-bold">{dayPlan.dinner.name}</p>
                        <p className="text-sm text-muted-foreground">{dayPlan.dinner.description}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      {!isLoading && !result && (
        <Card className="border-dashed">
             <CardContent className="p-10 text-center text-muted-foreground">
                <Leaf className="mx-auto h-12 w-12" />
                <p className="mt-4">Your generated meal plan will appear here.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
