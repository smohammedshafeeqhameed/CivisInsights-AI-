'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useUser, useFirestore } from '@/firebase';
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
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const updateUserProfile = async (user: User) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    const { displayName, email, photoURL } = user;
    
    // Deconstruct name into first and last
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
    };
    // Use setDoc with merge to create or update the user document.
    await setDoc(userRef, userData, { merge: true });
  }

  const handleSignIn = async () => {
    if (auth) {
      try {
        const result = await signInWithPopup(auth, provider);
        await updateUserProfile(result.user);
        router.push('/dashboard');
      } catch (error: any) {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-card p-8 shadow-lg rounded-3xl sm:p-10 text-center">
            <div className="mx-auto mb-6">
                <SealOfMaharashtra className="h-24 w-24 mx-auto text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to
            </h1>
            <h2 className="mt-2 text-4xl font-extrabold text-primary sm:text-5xl">
              Government of Maharashtra
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Sign in to access the CivisInsights AI dashboard.
            </p>
            <div className="mt-10">
                <Button
                    onClick={handleSignIn}
                    className="w-full text-lg"
                    size="lg"
                >
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
