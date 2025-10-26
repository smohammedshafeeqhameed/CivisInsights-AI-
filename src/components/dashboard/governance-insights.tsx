'use client';

import { Lightbulb } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { generateGovernanceInsights } from '@/ai/flows/generate-governance-insights';
import { Skeleton } from '@/components/ui/skeleton';

export function GovernanceInsights() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const result = await generateGovernanceInsights({
          citizenFeedbackSummary: 'Increased noise complaints around the new commercial complex. Repeated reports of illegal parking in the same area.',
          historicalDemandData: 'Spike in public safety calls by 30% in the commercial district over the last two months, coinciding with the complex opening.',
        });
        setInsight(result.insights);
      } catch (e) {
        console.error('Failed to generate governance insight:', e);
        setInsight(
          'Could not load AI-powered insights at this time. Please try again later.'
        );
      }
      setLoading(false);
    };
    fetchInsight();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle>Proactive Governance Insights</CardTitle>
        </div>
        <Lightbulb className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
