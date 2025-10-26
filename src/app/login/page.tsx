'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { SealOfMaharashtra } from '@/components/icons';

const provider = new GoogleAuthProvider();

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-6">
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


export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    if (auth) {
      try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
      } catch (error: any) {
        // This specific error code means the user closed the popup.
        // It's a normal user action, so we can safely ignore it.
        if (error.code !== 'auth/popup-closed-by-user') {
          console.error('Error signing in with Google:', error);
        }
      }
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
            <SealOfMaharashtra className="h-24 w-24 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to
            </h1>
            <h2 className="mt-2 text-4xl font-extrabold text-primary sm:text-5xl">
              Government of Maharashtra
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sign in to access the CivisInsights AI dashboard.
            </p>
        </div>
        <Button
            onClick={handleSignIn}
            className="w-full"
            variant="outline"
        >
            <GoogleIcon />
            <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
}
