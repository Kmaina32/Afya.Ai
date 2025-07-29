
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pill, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const medicationSchema = z.object({
  name: z.string().min(2, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  frequency: z.string().min(1, 'Frequency is required.'),
  startDate: z.date({ required_error: 'Start date is required.' }),
});

type MedicationFormValues = z.infer<typeof medicationSchema>;

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function MedicationPage() {
  const [user, authLoading] = useAuthState(auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoadingMeds, setIsLoadingMeds] = useState(true);

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
    },
  });

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'medications'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const meds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Medication[];
        setMedications(meds);
        setIsLoadingMeds(false);
      }, (error) => {
        console.error("Error fetching medications:", error);
        toast({ title: 'Error', description: 'Could not fetch medications.', variant: 'destructive' });
        setIsLoadingMeds(false);
      });
      return () => unsubscribe();
    } else if (!authLoading) {
      setIsLoadingMeds(false);
    }
  }, [user, authLoading, toast]);

  const onSubmit = async (values: MedicationFormValues) => {
    if (!user) {
      toast({ title: 'Not signed in', description: 'You must be signed in to add medication.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'medications'), {
        ...values,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Medication Added', description: `${values.name} has been added to your list.` });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not save medication.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMedication = async (medId: string) => {
    try {
      await deleteDoc(doc(db, 'medications', medId));
      toast({ title: 'Medication Removed', description: 'The medication has been removed from your list.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not remove medication.', variant: 'destructive' });
    }
  };

  if (authLoading || isLoadingMeds) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-6 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be signed in to manage your medications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Medication Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Add your medications to get reminders and keep track of your schedule.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Add New Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input id="name" placeholder="e.g., Paracetamol" {...form.register('name')} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g., 500mg" {...form.register('dosage')} />
                {form.formState.errors.dosage && <p className="text-sm text-destructive">{form.formState.errors.dosage.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input id="frequency" placeholder="e.g., Twice a day" {...form.register('frequency')} />
                {form.formState.errors.frequency && <p className="text-sm text-destructive">{form.formState.errors.frequency.message}</p>}
              </div>
              <div className="space-y-2 flex flex-col">
                <Label>Start Date</Label>
                <Controller
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {form.formState.errors.startDate && <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add Medication
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
          <CardDescription>A list of your current medications.</CardDescription>
        </CardHeader>
        <CardContent>
          {medications.length > 0 ? (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-muted rounded-lg flex-wrap">
                  <div className="flex items-center gap-4">
                    <Pill className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} - {med.frequency}. Started on {format(new Date(med.startDate.seconds * 1000), 'PPP')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">You haven't added any medications yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
