
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays, differenceInWeeks, format, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { CalendarIcon, HeartPulse, Loader2 } from 'lucide-react';
import { pregnancyData } from '@/lib/pregnancy-data';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const trackerSchema = z.object({
  lmp: z.date({ required_error: 'Please enter the first day of your last menstrual period.' }),
});

type TrackerFormValues = z.infer<typeof trackerSchema>;

export default function PregnancyTrackerPage() {
  const { t } = useTranslation();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  const form = useForm<TrackerFormValues>({
    resolver: zodResolver(trackerSchema),
  });

  const onSubmit = (values: TrackerFormValues) => {
    if (!isValid(values.lmp)) return;
    const estimatedDueDate = addDays(values.lmp, 280); // 40 weeks
    const week = differenceInWeeks(new Date(), values.lmp);
    
    setDueDate(estimatedDueDate);
    // Clamp the week between 1 and 42 for data lookup
    setCurrentWeek(Math.min(Math.max(week, 1), 42));
  };

  const weeklyInfo = currentWeek ? pregnancyData.find(w => w.week === currentWeek) : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{t('pregnancy_tracker')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('pregnancy_tracker_description')}
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('calculate_due_date')}</CardTitle>
          <CardDescription>{t('calculate_due_date_description')}</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="space-y-2">
                <Label>{t('lmp_date_label')}</Label>
                <Controller
                  control={form.control}
                  name="lmp"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full sm:w-[280px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>{t('pick_a_date')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date()} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.lmp && <p className="text-sm text-destructive">{form.formState.errors.lmp.message}</p>}
              </div>
              <Button type="submit">
                {t('calculate_button')}
              </Button>
           </form>
        </CardContent>
      </Card>

      {dueDate && currentWeek && weeklyInfo && (
        <Card>
            <CardHeader>
                <CardTitle>{t('your_pregnancy_progress')}</CardTitle>
                <CardDescription>
                    {t('estimated_due_date')}: <span className="font-bold text-primary">{format(dueDate, 'PPP')}</span>. {t('you_are_in_week')} {currentWeek}.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <Alert>
                        <HeartPulse className="h-4 w-4" />
                        <AlertTitle>{t('baby_development_week')} {weeklyInfo.week}</AlertTitle>
                        <AlertDescription>
                            {weeklyInfo.baby.description}
                        </AlertDescription>
                    </Alert>
                    <Alert>
                        <HeartPulse className="h-4 w-4" />
                        <AlertTitle>{t('your_body_week')} {weeklyInfo.week}</AlertTitle>
                        <AlertDescription>
                           {weeklyInfo.mother.description}
                        </AlertDescription>
                    </Alert>
                </div>
                <div className="relative aspect-square w-full max-w-sm mx-auto">
                    <Image
                        src={weeklyInfo.image}
                        alt={`Illustration for week ${weeklyInfo.week}`}
                        fill
                        className="object-contain rounded-lg"
                        data-ai-hint={weeklyInfo.hint}
                    />
                </div>
            </CardContent>
        </Card>
      )}

      {!dueDate && (
        <Card className="border-dashed">
            <CardContent className="p-10 text-center text-muted-foreground">
                <HeartPulse className="mx-auto h-12 w-12" />
                <p className="mt-4">{t('enter_date_to_see_progress')}</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
