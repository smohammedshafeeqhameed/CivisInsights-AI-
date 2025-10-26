'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { SplashScreen } from '@/components/splash-screen';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; 
    }

    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  return <SplashScreen />;
}
