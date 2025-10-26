'use client';

import { Lightbulb, CheckCircle, BarChart } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { generateGovernanceInsights } from '@/ai/flows/generate-governance-insights';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface InsightData {
  keyInsight: string;
  recommendations: string[];
  dataPoints: string[];
}

export function GovernanceInsights() {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await generateGovernanceInsights({
          citizenFeedbackSummary:
            'Increased noise complaints around the new commercial complex. Repeated reports of illegal parking in the same area.',
          historicalDemandData:
            'Spike in public safety calls by 30% in the commercial district over the last two months, coinciding with the complex opening.',
        });
        setInsight(result);
      } catch (e) {
        console.error('Failed to generate governance insight:', e);
        setError(
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
        <CardTitle>Proactive Governance Insights</CardTitle>
        <Lightbulb className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : error || !insight ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">
              {insight.keyInsight}
            </p>

            <Separator />

            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle className="size-4" />
                <span>Recommendations</span>
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {insight.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <BarChart className="size-4" />
                <span>Supporting Data</span>
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {insight.dataPoints.map((dp, index) => (
                  <li key={index}>{dp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
