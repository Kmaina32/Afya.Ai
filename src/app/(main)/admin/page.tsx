'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDocs, collection, addDoc, query, where, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Siren } from 'lucide-react';
import { outbreakAlertDrafter, type OutbreakAlertDrafterOutput } from '@/ai/flows/outbreak-alert';

const alertSchema = z.object({
  disease: z.string().min(2, 'Disease name is required.'),
  location: z.string().min(2, 'Location is required.'),
  symptoms: z.string().min(10, 'Please list some symptoms.'),
  preventativeMeasures: z.string().min(10, 'Please list some preventative measures.'),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export default function AdminPage() {
  const { user, isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedAlert, setGeneratedAlert] = useState<OutbreakAlertDrafterOutput | null>(null);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
  });

  const handleGenerateAlert = async (values: AlertFormValues) => {
    setIsGenerating(true);
    setGeneratedAlert(null);
    try {
      const result = await outbreakAlertDrafter(values);
      setGeneratedAlert(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Alert Generation Failed',
        description: 'Could not generate the alert using AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePublishAlert = async () => {
      if (!generatedAlert) return;
      setIsPublishing(true);
      try {
          // Check if an active alert already exists
          const q = query(collection(db, "alerts"), where("isActive", "==", true));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
             toast({
                title: "Active Alert Exists",
                description: "There is already an active alert. Please deactivate it before publishing a new one.",
                variant: "destructive"
            });
            setIsPublishing(false);
            return;
          }

          await addDoc(collection(db, "alerts"), {
            ...generatedAlert,
            isActive: true,
            createdAt: serverTimestamp(),
          });

          toast({
            title: "Alert Published",
            description: "The outbreak alert is now live in the app.",
          });
          setGeneratedAlert(null);
          form.reset();

      } catch (error) {
          console.error("Error publishing alert:", error);
          toast({
            title: "Publishing Failed",
            description: "Could not publish the alert. Please try again.",
            variant: "destructive"
          })
      } finally {
        setIsPublishing(false);
      }
  }

  if (isAdminLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Create and manage public health alerts.</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Outbreak Alert</CardTitle>
            <CardDescription>
              Fill in the details below. The AI will help draft a clear announcement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleGenerateAlert)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="disease">Disease</Label>
                <Input id="disease" {...form.register('disease')} placeholder="e.g., Cholera" />
                {form.formState.errors.disease && <p className="text-sm text-destructive">{form.formState.errors.disease.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register('location')} placeholder="e.g., Nairobi County" />
                 {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="symptoms">Key Symptoms (comma-separated)</Label>
                <Textarea id="symptoms" {...form.register('symptoms')} placeholder="e.g., watery diarrhea, vomiting, dehydration" />
                 {form.formState.errors.symptoms && <p className="text-sm text-destructive">{form.formState.errors.symptoms.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preventativeMeasures">Preventative Measures (comma-separated)</Label>
                <Textarea id="preventativeMeasures" {...form.register('preventativeMeasures')} placeholder="e.g., drink boiled water, wash hands with soap" />
                {form.formState.errors.preventativeMeasures && <p className="text-sm text-destructive">{form.formState.errors.preventativeMeasures.message}</p>}
              </div>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Alert with AI
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle>AI-Generated Preview</CardTitle>
                    <CardDescription>
                    Review the AI-generated content below before publishing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isGenerating && (
                        <div className="flex items-center justify-center h-40">
                             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {generatedAlert ? (
                        <div className="space-y-4">
                             <h3 className="text-xl font-semibold">{generatedAlert.title}</h3>
                             <p className="text-sm whitespace-pre-wrap">{generatedAlert.announcement}</p>
                             <Button onClick={handlePublishAlert} disabled={isPublishing} className="w-full">
                                {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish Alert
                             </Button>
                        </div>
                    ) : (
                        !isGenerating && (
                            <div className="text-center text-muted-foreground py-10">
                                <Siren className="mx-auto h-12 w-12" />
                                <p className="mt-4">The generated alert will appear here.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
