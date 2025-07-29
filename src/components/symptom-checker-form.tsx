'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { symptomChecker, type SymptomCheckerOutput } from '@/ai/flows/symptom-checker';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"


const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

export function SymptomCheckerForm() {
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await symptomChecker({ symptoms: values.symptoms });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to check symptoms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Symptoms</CardTitle>
          <CardDescription>
            List your symptoms below, separated by commas (e.g., headache, fever, cough).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., high fever, persistent headache, sore throat..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && result.possibleConditions && (
        <Card>
          <CardHeader>
            <CardTitle>Possible Conditions</CardTitle>
            <CardDescription>
              Based on the symptoms you provided, here are some possibilities. Please consult a doctor for a proper diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.possibleConditions.split(',').map((condition, index) => (
                <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                  {condition.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
