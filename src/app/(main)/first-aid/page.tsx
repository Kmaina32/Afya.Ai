'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { firstAidAssistant, type FirstAidAssistantOutput } from '@/ai/flows/first-aid';
import { textToSpeech } from '@/ai/flows/tts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Paperclip, X, Image as ImageIcon, Volume2, Info, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AudioPlayer } from '@/components/ui/audio-player';

const formSchema = z.object({
  situation: z.string().min(5, 'Please describe the situation in more detail.'),
});

export default function FirstAidPage() {
  const [result, setResult] = useState<FirstAidAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { situation: '' },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageData(dataUri);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handlePlayAudio = async (text: string) => {
    setIsPlaying(true);
    try {
      const { audioDataUri } = await textToSpeech({ text });
      setAudioDataUri(audioDataUri);
    } catch (error) {
      console.error(error);
      toast({
        title: "Audio Playback Error",
        description: "Failed to generate audio.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await firstAidAssistant({
        situation: values.situation,
        photoDataUri: imageData ?? undefined,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to get first-aid guidance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
       {audioDataUri && isPlaying && (
        <AudioPlayer 
          audioDataUri={audioDataUri} 
          onEnded={() => {
            setIsPlaying(false);
            setAudioDataUri(null);
          }} 
        />
      )}
      <header>
        <h1 className="text-3xl font-bold">First-Aid Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Get immediate guidance for common first-aid scenarios.
        </p>
      </header>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This AI is for informational purposes only. In case of a serious or life-threatening emergency, call your local emergency number immediately.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Describe the Situation</CardTitle>
          <CardDescription>
            Explain the injury (e.g., "deep cut on finger," "minor kitchen burn"). You can also upload a photo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What happened?</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="e.g., My child fell and scraped their knee..."
                        rows={3}
                        {...field}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label>Upload a Photo (Optional)</Label>
                {imagePreview ? (
                   <div className="relative w-40 h-40">
                    <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover" />
                    <Button
                      size="icon" variant="destructive"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="mr-2 h-4 w-4" />
                        Attach Image
                    </Button>
                )}
                 <input
                    type="file" ref={fileInputRef} onChange={handleImageChange}
                    className="hidden" accept="image/*"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get First-Aid Steps
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

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Severity Assessment</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                   {result.severityAssessment}
                </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
                {result.guidance.map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                            {step.step}
                        </div>
                        <div className="flex-grow">
                           <p>{step.instruction}</p>
                        </div>
                         <Button
                          size="icon" variant="ghost"
                          onClick={() => handlePlayAudio(step.instruction)}
                          disabled={isPlaying}
                          className="h-8 w-8"
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
