'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
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
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await predictServiceDemand({
          historicalData: 'Past 6 months of service requests show a 15% increase in sanitation and a 5% decrease in parks & rec requests during winter.',
          currentIssueSummaries: 'Recent issues include multiple reports of overflowing bins and requests for pothole repairs.',
          predictionHorizon: 'next month',
        });
        
        // A real implementation would parse the string response into structured data.
        // For this demo, we'll create some plausible data based on the response.
        const predicted = JSON.parse(result.predictedDemand) as DemandData[];

        setData(predicted);
        setRecommendations(result.resourceAllocationRecommendations);
      } catch (e) {
        console.error('Failed to fetch demand prediction:', e);
        // setData(demandPrediction); // Fallback to mock data on error
        setRecommendations('Could not load AI-powered recommendations.');
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
        {loading || !data ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: -20 }}
            >
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none">Recommendations</div>
        {loading ? (
            <Skeleton className="h-8 w-full" />
        ) : (
            <div className="leading-none text-muted-foreground">
                {recommendations}
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
