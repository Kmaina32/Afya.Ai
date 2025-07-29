
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { scanAnalyzer, type ScanAnalyzerOutput } from '@/ai/flows/scan-analyzer';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Paperclip, X, FileScan, Microscope, Info, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  query: z.string().optional(),
});

export default function LabResultsPage() {
  const [result, setResult] = useState<ScanAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!imageData) {
       toast({
        title: "No Image Selected",
        description: "Please upload an image of your scan or lab result.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const response = await scanAnalyzer({
        query: values.query,
        photoDataUri: imageData,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Lab & Scan Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Upload an image of your lab result, X-Ray, or MRI to get an AI-powered analysis.
        </p>
      </header>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>For Informational Purposes Only</AlertTitle>
        <AlertDescription>
          This AI analysis is NOT a substitute for professional medical advice. Always consult a qualified healthcare provider with your results.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your File</CardTitle>
            <CardDescription>
              Select an image of your report or scan. Add any specific questions you have.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="space-y-2">
                  <Label>1. Upload Scan/Report Image*</Label>
                  {imagePreview ? (
                    <div className="relative w-full aspect-video">
                      <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-contain border" />
                      <Button
                        size="icon" variant="destructive"
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          <Microscope className="mx-auto h-12 w-12 text-gray-400" />
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                              Click to upload an image
                          </span>
                      </button>
                  )}
                  <input
                      type="file" ref={fileInputRef} onChange={handleImageChange}
                      className="hidden" accept="image/png, image/jpeg, image/webp"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Add a question (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., What does 'opacity in the lower lobe' mean? Are these blood sugar levels normal?"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading || !imageData}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Now
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                    <CardDescription>
                    The AI-generated analysis will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-60">
                             <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                             <p className="mt-4 text-muted-foreground">Analyzing, this may take a moment...</p>
                        </div>
                    )}
                    {result ? (
                        <div className="space-y-6">
                             <Alert variant="destructive">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Disclaimer</AlertTitle>
                                <AlertDescription>
                                  {result.disclaimer}
                                </AlertDescription>
                            </Alert>
                            <div>
                                <h3 className="text-xl font-semibold">{result.title}</h3>
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold text-primary">Key Findings</h4>
                              {result.keyFindings.map((finding, index) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                    <p className="font-bold">{finding.finding}</p>
                                    <p className="text-sm text-muted-foreground">{finding.explanation}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary">Simplified Summary</h4>
                                <p className="text-sm text-muted-foreground">{result.simplifiedSummary}</p>
                            </div>
                        </div>
                    ) : (
                        !isLoading && (
                            <div className="text-center text-muted-foreground py-10">
                                <FileScan className="mx-auto h-12 w-12" />
                                <p className="mt-4">Your analysis will appear here.</p>
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
