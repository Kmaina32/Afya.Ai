'use client';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useTranslation } from '@/hooks/use-translation';

export default function SymptomCheckerPage() {
  const { t } = useTranslation();
  return (
    <div className="p-4 md:p-6 space-y-6">
       <header>
        <h1 className="text-3xl font-bold">{t('symptom_checker')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('symptom_checker_description')}
        </p>
      </header>
      
      <Alert variant="destructive" className="bg-accent/20 border-accent/40 text-accent-foreground/80 [&>svg]:text-accent-foreground/80">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('disclaimer')}</AlertTitle>
        <AlertDescription>
         {t('symptom_checker_disclaimer')}
        </AlertDescription>
      </Alert>

      <SymptomCheckerForm />
    </div>
  );
}
