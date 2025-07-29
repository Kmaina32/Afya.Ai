import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function SymptomCheckerPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
       <header>
        <h1 className="text-3xl font-bold">Symptom Checker</h1>
        <p className="text-muted-foreground mt-1">
          Enter your symptoms to get a list of possible conditions.
        </p>
      </header>
      
      <Alert variant="destructive" className="bg-accent/20 border-accent/40 text-accent-foreground/80 [&>svg]:text-accent-foreground/80">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </AlertDescription>
      </Alert>

      <SymptomCheckerForm />
    </div>
  );
}
