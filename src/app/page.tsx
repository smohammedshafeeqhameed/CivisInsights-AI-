'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { useUser } from '@/firebase';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      if (isUserLoading) {
        // Wait until user status is resolved
        return;
      }
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [showSplash, user, isUserLoading, router]);

  return <SplashScreen />;
}
