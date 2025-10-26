
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SealOfMaharashtra } from '@/components/icons';
import { useIssues } from '@/hooks/use-issues';
import Link from 'next/link';
import { SplashScreen } from '@/components/splash-screen';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const formSchema = z.object({
  category: z.string({
    required_error: 'Please select a category.',
  }),
  report: z
    .string()
    .min(50, {
      message: 'Report must be at least 50 characters.',
    })
    .max(1000, {
      message: 'Report must not be longer than 1000 characters.',
    }),
});

const provider = new GoogleAuthProvider();

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48" className="size-6">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691c-1.566 3.169-2.306 6.753-2.306 10.309s.74 7.14 2.306 10.309l-5.657 5.657C.82 36.886 0 31.428 0 26s.82-10.886 2.649-15.309l5.657 4z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-5.657-5.657c-1.556 1.018-3.469 1.657-5.752 1.657c-4.971 0-9.282-3.34-10.74-7.961l-5.657 5.657C8.423 39.042 15.799 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l5.657 5.657C40.083 34.62 44 28.666 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function CitizenHomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const { toast } = useToast();
  const { setIssues } = useIssues();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const updateUserProfile = (user: User) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    const { displayName, email, photoURL } = user;
    
    const nameParts = displayName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userData = {
      id: user.uid,
      googleId: user.providerData.find(p => p.providerId === 'google.com')?.uid || user.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      profilePicture: photoURL,
      displayName: displayName,
      role: 'public', // Assign 'public' role for citizen login
    };
    
    setDoc(userRef, userData, { merge: true }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'write',
            requestResourceData: userData
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }

  const handleSignIn = async () => {
    if (auth) {
      try {
        const result = await signInWithPopup(auth, provider);
        updateUserProfile(result.user);
        toast({ title: 'Successfully signed in!' });
      } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
          console.error('Error signing in with Google:', error);
          toast({ variant: 'destructive', title: 'Sign-in failed', description: 'Could not sign in with Google. Please try again.' });
        }
      }
    }
  };

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const newIssue = {
      id: `CIV-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      category: data.category,
      report: data.report,
      summary: data.report.substring(0, 50) + '...',
      status: 'New' as const,
      image: imagePreview,
    };

    setIssues((prevIssues) => [newIssue, ...prevIssues]);

    toast({
      title: 'Issue Submitted!',
      description: 'Thank you for your report. It has been sent to the relevant department.',
    });
    form.reset();
    setImageFile(null);
    setImagePreview(null);
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50">
       <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SealOfMaharashtra className="size-8 text-primary" />
            <span className="font-bold">CivisInsights</span>
          </Link>
          <div className="flex items-center gap-4">
            {isUserLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200"></div>
            ) : user ? (
              <Button variant="outline" onClick={handleLogout}>Log Out</Button>
            ) : (
              <Button onClick={handleSignIn}>Citizen Login</Button>
            )}
            <Button asChild>
              <Link href="/login">Official Login</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
             <div className="mb-8">
                <SealOfMaharashtra className="h-24 w-24 mx-auto text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Report an Issue
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Help us improve our community. Submit a report and we'll route it to the right department.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
             {isUserLoading ? (
               <div className="flex justify-center items-center h-40">
                 <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
               </div>
             ) : user ? (
              <div className="rounded-2xl border bg-white p-8 shadow-lg">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category for your issue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Road Maintenance">
                                Road Maintenance
                              </SelectItem>
                              <SelectItem value="Public Safety">
                                Public Safety
                              </SelectItem>
                              <SelectItem value="Sanitation">Sanitation</SelectItem>
                              <SelectItem value="Parks & Rec">Parks & Rec</SelectItem>
                              <SelectItem value="Noise Complaint">
                                Noise Complaint
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us route your issue to the correct department.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="report"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Report</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe the issue in detail..."
                              className="resize-y min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The more detail you can provide, the better we can
                            assist.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormItem>
                      <FormLabel>Upload Image (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className='cursor-pointer'
                        />
                      </FormControl>
                      <FormDescription>
                        A picture is worth a thousand words.
                      </FormDescription>
                       {imagePreview && (
                        <div className="mt-4">
                           <Image
                            src={imagePreview}
                            alt="Image preview"
                            width={200}
                            height={200}
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                    </FormItem>
                    <Button type="submit" className="w-full" size="lg">
                      Submit Report
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="text-center mt-8">
                <p className="mb-4 text-lg text-muted-foreground">Please sign in to report an issue.</p>
                <Button size="lg" onClick={handleSignIn}>
                  <GoogleIcon />
                  Sign in with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
