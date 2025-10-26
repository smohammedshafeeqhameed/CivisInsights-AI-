'use client';

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from '@/components/ui/chart';
import { issues } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const issuesByCategory = issues.reduce((acc, issue) => {
  acc[issue.category] = (acc[issue.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const issuesByCategoryData = Object.keys(issuesByCategory).map((category) => ({
  name: category,
  value: issuesByCategory[category],
}));

const resolutionStatusData = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

const resolutionStatusChartData = Object.keys(resolutionStatusData).map(key => ({name: key, value: resolutionStatusData[key]}));

const weeklyTrendsData = [
  { date: 'Mon', new: 10, resolved: 8 },
  { date: 'Tue', new: 15, resolved: 12 },
  { date: 'Wed', new: 8, resolved: 10 },
  { date: 'Thu', new: 20, resolved: 18 },
  { date: 'Fri', new: 12, resolved: 14 },
  { date: 'Sat', new: 5, resolved: 6 },
  { date: 'Sun', new: 3, resolved: 4 },
];

const pieChartConfig = {
  value: { label: "Issues" },
  'Road Maintenance': { label: 'Road Maintenance', color: "hsl(var(--chart-1))" },
  'Public Safety': { label: 'Public Safety', color: "hsl(var(--chart-2))" },
  'Sanitation': { label: 'Sanitation', color: "hsl(var(--chart-3))" },
  'Parks & Rec': { label: 'Parks & Rec', color: "hsl(var(--chart-4))" },
  'Noise Complaint': { label: 'Noise Complaint', color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

const barChartConfig = {
    value: { label: "Count" },
    New: { label: "New", color: "hsl(var(--chart-4))" },
    "In Progress": { label: "In Progress", color: "hsl(var(--chart-3))" },
    Resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const lineChartConfig = {
  new: { label: 'New Issues', color: 'hsl(var(--chart-1))' },
  resolved: { label: 'Resolved Issues', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
            <CardHeader>
            <CardTitle>Weekly Issue Trends</CardTitle>
            <CardDescription>New vs. Resolved issues over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={lineChartConfig} className="min-h-[300px] w-full">
                <LineChart data={weeklyTrendsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="var(--color-new)" />
                <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" />
                </LineChart>
            </ChartContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Issue Resolution Status</CardTitle>
            <CardDescription>A breakdown of all issues by their current status.</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[300px] w-full">
              <BarChart data={resolutionStatusChartData} layout="vertical" margin={{ left: 10 }}>
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} className="text-xs"/>
                <XAxis type="number" hide />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="value" layout="vertical" radius={5}>
                    {resolutionStatusChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name.replace(' ','')})`} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <CardDescription>Distribution of citizen issues across different categories.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                    <Pie data={issuesByCategoryData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                        {issuesByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                </PieChart>
                </ChartContainer>
            </CardContent>
             <CardContent className="mt-4 flex flex-col gap-2 text-sm">
                <Separator />
                <div className="flex items-center justify-between">
                    <span className='font-medium'>Most Reported</span>
                    <Badge variant="destructive">{issuesByCategoryData.sort((a,b) => b.value - a.value)[0].name}</Badge>
                </div>
            </CardContent>
        </Card>

        <Card className='xl:col-span-2'>
            <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Average resolution time by department.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <div>
                        <div className='flex justify-between mb-1'>
                            <span className='text-sm font-medium text-muted-foreground'>Sanitation</span>
                            <span className='text-sm font-medium'>1.8 days</span>
                        </div>
                        <div className='h-2 bg-muted rounded-full'>
                            <div className='h-2 bg-green-500 rounded-full' style={{width: '70%'}}></div>
                        </div>
                    </div>
                     <div>
                        <div className='flex justify-between mb-1'>
                            <span className='text-sm font-medium text-muted-foreground'>Road Maintenance</span>
                            <span className='text-sm font-medium'>3.2 days</span>
                        </div>
                        <div className='h-2 bg-muted rounded-full'>
                            <div className='h-2 bg-yellow-500 rounded-full' style={{width: '50%'}}></div>
                        </div>
                    </div>
                     <div>
                        <div className='flex justify-between mb-1'>
                            <span className='text-sm font-medium text-muted-foreground'>Public Safety</span>
                            <span className='text-sm font-medium'>4.5 days</span>
                        </div>
                        <div className='h-2 bg-muted rounded-full'>
                            <div className='h-2 bg-red-500 rounded-full' style={{width: '35%'}}></div>
                        </div>
                    </div>
                     <div>
                        <div className='flex justify-between mb-1'>
                            <span className='text-sm font-medium text-muted-foreground'>Parks & Rec</span>
                            <span className='text-sm font-medium'>2.1 days</span>
                        </div>
                        <div className='h-2 bg-muted rounded-full'>
                            <div className='h-2 bg-green-500 rounded-full' style={{width: '65%'}}></div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
