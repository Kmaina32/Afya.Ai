
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      router.push('/chatbot');
    } catch (error: any) {
      toast({
        title: "Sign-up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const svgBackground = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <pattern id='p' width='20' height='20' patternUnits='userSpaceOnUse'>
          <g fill='hsl(var(--primary))' fill-opacity='0.1'>
            <path d='M10 0 L10 20 Z' stroke='hsl(var(--primary))' stroke-width='0.5'/>
            <path d='M0 10 L20 10 Z' stroke='hsl(var(--primary))' stroke-width='0.5'/>
          </g>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#p)'/>
    </svg>
  `;
  const encodedSvg = `data:image/svg+xml;base64,${Buffer.from(svgBackground).toString('base64')}`;

  return (
     <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} />
               {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/chatbot">Continue as Guest</Link>
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center relative">
         <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{backgroundImage: `url("${encodedSvg}")`}}
        ></div>
        <div className="relative z-10 text-center p-8">
           <Logo className="mx-auto size-24 text-primary" />
           <h1 className="text-4xl font-bold mt-4">Join Afya.Ai Today</h1>
           <p className="text-muted-foreground mt-2 text-lg">Start your journey to better health information.</p>
        </div>
      </div>
    </div>
  );
}
