
'use client';

import { SealOfMaharashtra } from '@/components/icons';

export function SplashScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up">
        <SealOfMaharashtra className="h-24 w-24 mx-auto mb-6 text-primary animate-pulse" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to
        </h1>
        <h2 className="mt-2 text-4xl font-extrabold text-primary sm:text-5xl">
          Government of Maharashtra
        </h2>
      </div>
    </div>
  );
}
