import { TherapistInterface } from '@/components/therapist-interface';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function TherapistPage() {
  return (
    <div className="flex h-full flex-col">
       <header className="border-b p-4 md:p-6">
        <h1 className="text-2xl font-bold">AI Therapist</h1>
         <p className="text-muted-foreground">
          A safe space to talk about your feelings.
        </p>
      </header>
       <div className="p-4 md:p-6">
         <Alert variant="destructive" className="bg-accent/20 border-accent/40 text-accent-foreground/80 [&>svg]:text-accent-foreground/80">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
                This AI is designed for supportive conversations and is not a substitute for professional medical advice or therapy. If you are in a crisis, please contact a qualified healthcare professional or use the resources on our Emergency Services page.
            </AlertDescription>
        </Alert>
       </div>
      <TherapistInterface />
    </div>
  );
}
