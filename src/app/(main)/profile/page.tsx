
'use client';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { User } from 'firebase/auth';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  dob: z.date().optional(),
  location: z.string().optional(),
  nextOfKin: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(auth.currentUser);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
      nextOfKin: '',
      phone: '',
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        getDoc(profileRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            form.reset({
              name: data.name || currentUser.displayName || '',
              dob: data.dob ? data.dob.toDate() : undefined,
              location: data.location || '',
              nextOfKin: data.nextOfKin || '',
              phone: data.phone || currentUser.phoneNumber || '',
            });
          } else {
             form.reset({
              name: currentUser.displayName || '',
              dob: undefined,
              location: '',
              nextOfKin: '',
              phone: currentUser.phoneNumber || '',
            });
          }
        }).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [form]);
  
  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can use a reverse geocoding API here to get a user-friendly address
          // For now, we'll just store the coordinates.
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          form.setValue('location', locationString);
           toast({
            title: "Location Captured",
            description: `Your location has been set to: ${locationString}`,
          });
        },
        (error) => {
           toast({
            title: "Location Error",
            description: `Could not get your location: ${error.message}`,
            variant: "destructive",
          });
        }
      );
    } else {
       toast({
        title: "Location Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
         toast({
            title: "Not Signed In",
            description: "You must be signed in to update your profile.",
            variant: "destructive",
        });
        return;
    };

    setIsLoading(true);
    
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, values, { merge: true });
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
       toast({
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
     return (
        <div className="p-4 md:p-6 flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="p-4 md:p-6 flex items-center justify-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>
                        You must be signed in to view and edit your profile.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information.
        </p>
      </header>
       <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>
            This information helps us personalize your experience. It will be kept private and secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} placeholder="Your full name" />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            
            <div className="grid gap-2">
                <Label>Date of Birth</Label>
                 <Controller
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full sm:w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
               <div className="flex items-center gap-2">
                  <Input id="location" {...form.register('location')} placeholder="e.g., Nairobi, Kenya" />
                  <Button type="button" variant="outline" size="icon" onClick={handleLocationRequest}>
                    <MapPin className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" {...form.register('phone')} type="tel" placeholder="+254 712 345 678" />
            </div>

             <div className="grid gap-2">
              <Label htmlFor="nextOfKin">Next of Kin (Optional)</Label>
              <Input id="nextOfKin" {...form.register('nextOfKin')} placeholder="Name and phone number" />
            </div>

            <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
              {(isLoading || form.formState.isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
       </Card>
    </div>
  );
}
