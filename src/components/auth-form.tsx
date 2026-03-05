'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, useFirestore, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });

  const handleAuthAction = (action: 'signIn' | 'signUp') => {
    setIsLoading(true);
    const { email, password, displayName } = form.getValues();
    const onError = () => setIsLoading(false);

    if (action === 'signIn') {
      initiateEmailSignIn(auth, email, password, onError);
    } else { // signUp
      if (!displayName || displayName.length < 2) {
        form.setError('displayName', { type: 'manual', message: 'Name must be at least 2 characters.' });
        setIsLoading(false);
        return;
      }
      initiateEmailSignUp(firestore, auth, email, password, displayName, onError);
    }
    // On success, AuthGate will redirect, so we don't need to set loading to false here.
  };

  const handleAnonymousSignIn = () => {
    setIsLoading(true);
    initiateAnonymousSignIn(firestore, auth, () => setIsLoading(false));
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login or Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to login or create an account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe (for sign up)" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => form.handleSubmit(() => handleAuthAction('signIn'))()} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <Button onClick={() => form.handleSubmit(() => handleAuthAction('signUp'))()} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={handleAnonymousSignIn} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In Anonymously
        </Button>
      </CardContent>
    </Card>
  );
}
