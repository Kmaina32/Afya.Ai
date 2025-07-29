
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, getDocs, deleteDoc, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Baby, Trash2, Calendar as CalendarIcon, Syringe, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { differenceInWeeks, format, addWeeks, isPast } from 'date-fns';
import { kenyanVaccinationSchedule, type Vaccine } from '@/lib/vaccination-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const childSchema = z.object({
  name: z.string().min(2, 'Child\'s name is required.'),
  dob: z.date({ required_error: 'Date of birth is required.' }),
});

type ChildFormValues = z.infer<typeof childSchema>;

type Child = {
  id: string;
  name: string;
  dob: { seconds: number; nanoseconds: number };
  completedVaccines?: Record<string, boolean>;
};

export default function VaccinationTrackerPage() {
  const [user, authLoading] = useAuthState(auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema),
  });

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'vaccination-tracker', user.uid, 'children'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const childList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Child[];
        setChildren(childList);
        if (childList.length > 0 && !selectedChild) {
            setSelectedChild(childList[0]);
        }
        setIsLoadingChildren(false);
      }, (error) => {
        console.error("Error fetching children:", error);
        toast({ title: 'Error', description: 'Could not fetch children profiles.', variant: 'destructive' });
        setIsLoadingChildren(false);
      });
      return () => unsubscribe();
    } else if (!authLoading) {
      setIsLoadingChildren(false);
    }
  }, [user, authLoading, toast, selectedChild]);

  const onSubmit = async (values: ChildFormValues) => {
    if (!user) {
      toast({ title: 'Not signed in', description: 'You must be signed in to add a child.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'vaccination-tracker', user.uid, 'children'), {
        ...values,
      });
      toast({ title: 'Child Added', description: `${values.name} has been added.` });
      form.reset();
      setSelectedChild({ id: docRef.id, ...values, dob: { seconds: values.dob.getTime() / 1000, nanoseconds: 0 } });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not add child.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteChild = async (childId: string) => {
     if (!user) return;
    try {
      await deleteDoc(doc(db, 'vaccination-tracker', user.uid, 'children', childId));
      toast({ title: 'Child Removed', description: 'The profile has been removed.' });
      setSelectedChild(null);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not remove child profile.', variant: 'destructive' });
    }
  };

  const handleVaccineToggle = async (vaccineName: string, dose: string, isChecked: boolean) => {
    if (!user || !selectedChild) return;
    const vaccineKey = `${vaccineName}-${dose}`.replace(/\s+/g, '-');
    try {
        const childRef = doc(db, 'vaccination-tracker', user.uid, 'children', selectedChild.id);
        await updateDoc(childRef, {
            [`completedVaccines.${vaccineKey}`]: isChecked
        });
        toast({
            title: `Vaccine Status Updated`,
            description: `${vaccineName} (${dose}) marked as ${isChecked ? 'complete' : 'incomplete'}.`
        });
    } catch (error) {
         console.error(error);
         toast({ title: 'Error', description: 'Could not update vaccine status.', variant: 'destructive' });
    }
  };

  const getVaccineStatus = (dob: Date, vaccine: Vaccine, completed: Record<string, boolean> = {}) => {
      const vaccineKey = `${vaccine.name}-${vaccine.dose}`.replace(/\s+/g, '-');
      if (completed[vaccineKey]) {
          return { label: 'Completed', icon: CheckCircle2, color: 'text-green-500' };
      }
      const dueDate = addWeeks(dob, vaccine.ageInWeeks);
      if (isPast(dueDate)) {
           return { label: `Overdue (Due on ${format(dueDate, 'PPP')})`, icon: AlertCircle, color: 'text-destructive' };
      }
      return { label: `Upcoming (Due on ${format(dueDate, 'PPP')})`, icon: Clock, color: 'text-yellow-500' };
  }

  const childsDob = useMemo(() => {
    if (selectedChild) {
      return new Date(selectedChild.dob.seconds * 1000);
    }
    return null;
  }, [selectedChild]);

  if (authLoading) {
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
            <CardDescription>You need to be signed in to track vaccinations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><a href="/signin">Sign In</a></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Child Vaccination Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Keep track of your child's immunization schedule based on KEPI guidelines.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Child Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingChildren ? <Loader2 className="animate-spin" /> : (
                        <div className="space-y-2">
                           {children.map(child => (
                            <Button key={child.id} variant={selectedChild?.id === child.id ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setSelectedChild(child)}>
                                <Baby className="mr-2 h-4 w-4"/> {child.name}
                            </Button>
                           ))}
                           {children.length === 0 && <p className="text-sm text-muted-foreground text-center">No children added yet.</p>}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Add a New Child</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Child's Name</Label>
                        <Input id="name" placeholder="e.g., Jane Doe" {...form.register('name')} />
                        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                    </div>
                     <div className="space-y-2 flex flex-col">
                        <Label>Date of Birth</Label>
                        <Controller
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date() || date < new Date("2010-01-01")}/>
                                </PopoverContent>
                            </Popover>
                        )} />
                         {form.formState.errors.dob && <p className="text-sm text-destructive">{form.formState.errors.dob.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Add Child
                    </Button>
                </form>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
          {selectedChild && childsDob ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{selectedChild.name}'s Schedule</span>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete {selectedChild.name}'s profile and vaccination record. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteChild(selectedChild.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardTitle>
                <CardDescription>
                  Date of Birth: {format(childsDob, 'PPP')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {kenyanVaccinationSchedule.map((vaccine, index) => {
                        const status = getVaccineStatus(childsDob, vaccine, selectedChild.completedVaccines);
                        const vaccineKey = `${vaccine.name}-${vaccine.dose}`.replace(/\s+/g, '-');
                        return (
                            <AccordionItem value={`item-${index}`} key={vaccineKey}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                        <status.icon className={cn("h-5 w-5", status.color)} />
                                        <span className="font-semibold">{vaccine.name}</span>
                                        <span className="text-sm text-muted-foreground">({vaccine.dose})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pl-6 space-y-3">
                                        <p className="text-muted-foreground">{vaccine.description}</p>
                                        <p className="text-sm font-medium">Status: <span className={status.color}>{status.label}</span></p>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Checkbox 
                                                id={vaccineKey}
                                                checked={!!selectedChild.completedVaccines?.[vaccineKey]}
                                                onCheckedChange={(checked) => handleVaccineToggle(vaccine.name, vaccine.dose, !!checked)}
                                            />
                                            <label
                                                htmlFor={vaccineKey}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Mark as complete
                                            </label>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-96 border-dashed">
                <div className="text-center text-muted-foreground">
                    <Baby className="mx-auto h-12 w-12" />
                    <p className="mt-4">
                        {children.length > 0 ? "Select a child to view their schedule." : "Add a child to get started."}
                    </p>
                </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
