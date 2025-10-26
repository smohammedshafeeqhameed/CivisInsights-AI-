import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { IssuesProvider } from '@/hooks/use-issues';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'CivisInsights AI',
  description: 'AI-powered governance and citizen issue analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-sans", inter.variable)}>
        <IssuesProvider>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
        </IssuesProvider>
        <Toaster />
      </body>
    </html>
  );
}
