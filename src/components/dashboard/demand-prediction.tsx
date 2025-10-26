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
import { demandPrediction, resourceRecommendations } from '@/lib/data';

const chartConfig = {
  predicted_demand: {
    label: 'Predicted',
    color: 'hsl(var(--chart-1))',
  },
  current_demand: {
    label: 'Current',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function DemandPrediction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Demand Prediction</CardTitle>
        <CardDescription>
          Predicted vs. current demand for city services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={demandPrediction} margin={{ left: -20 }}>
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
              dataKey="current_demand"
              fill="var(--color-current_demand)"
              radius={4}
            />
            <Bar
              dataKey="predicted_demand"
              fill="var(--color-predicted_demand)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none">Recommendations</div>
        <div className="leading-none text-muted-foreground">
          {resourceRecommendations}
        </div>
      </CardFooter>
    </Card>
  );
}
