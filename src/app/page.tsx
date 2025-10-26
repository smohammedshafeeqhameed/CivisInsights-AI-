'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import DashboardPage from './dashboard/page';
import DashboardLayout from './dashboard/layout';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
