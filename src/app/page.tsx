'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { SplashScreen } from '@/components/splash-screen';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // We want to wait until the user's auth status is fully determined.
    if (isUserLoading) {
      return; // Wait...
    }

    // Once the status is known, redirect accordingly.
    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // Show a splash/loading screen while the auth check is happening.
  return <SplashScreen />;
}
