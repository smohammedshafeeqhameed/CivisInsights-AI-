'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ListChecks, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { predictServiceDemand } from '@/ai/flows/predict-service-demand';
import { Separator } from '../ui/separator';

const chartConfig = {
  predictedDemand: {
    label: 'Predicted',
    color: 'hsl(var(--chart-1))',
  },
  currentDemand: {
    label: 'Current',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface DemandData {
  service: string;
  currentDemand: number;
  predictedDemand: number;
}

export function DemandPrediction() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DemandData[] | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [problemAreas, setProblemAreas] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await predictServiceDemand({
          historicalData:
            'Past 6 months of service requests show a 15% increase in sanitation and a 5% decrease in parks & rec requests during winter.',
          currentIssueSummaries:
            'Recent issues include multiple reports of overflowing bins and requests for pothole repairs.',
          predictionHorizon: 'next month',
        });

        const predicted = JSON.parse(result.predictedDemand) as DemandData[];

        setData(predicted);
        setRecommendations(result.resourceAllocationRecommendations);
        setProblemAreas(result.potentialProblemAreas);
      } catch (e) {
        console.error('Failed to fetch demand prediction:', e);
        setError('Could not load AI-powered predictions.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Demand Prediction</CardTitle>
        <CardDescription>
          Predicted vs. current demand for city services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : error || !data ? (
          <div className="text-sm text-muted-foreground">{error}</div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data} margin={{ left: -20 }}>
              <XAxis
                dataKey="service"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="currentDemand"
                fill="var(--color-currentDemand)"
                radius={4}
              />
              <Bar
                dataKey="predictedDemand"
                fill="var(--color-predictedDemand)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 text-sm">
        {loading ? (
          <div className="w-full space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : !error && (
          <>
            {recommendations.length > 0 && (
              <div className="grid w-full gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  <ListChecks className="size-4 text-muted-foreground" />
                  <span>Resource Recommendations</span>
                </div>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {recommendations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <Separator />
            {problemAreas.length > 0 && (
              <div className="grid w-full gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  <AlertTriangle className="size-4 text-muted-foreground" />
                  <span>Potential Problem Areas</span>
                </div>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {problemAreas.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
