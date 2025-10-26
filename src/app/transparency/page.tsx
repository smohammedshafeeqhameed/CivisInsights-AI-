
'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
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
import { Badge } from '@/components/ui/badge';
import { useIssues } from '@/hooks/use-issues';
import { SealOfMaharashtra } from '@/components/icons';
import { StatCard } from '@/components/dashboard/stat-card';
import { CheckCircle2, MessageSquareWarning } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    "InProgress": { label: "In Progress", color: "hsl(var(--chart-3))" },
    Resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];


export default function TransparencyPage() {
    const { issues } = useIssues();

    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length;


    const issuesByCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const issuesByCategoryData = Object.keys(issuesByCategory).map((category) => ({
      name: category,
      value: issuesByCategory[category],
    }));

    const resolutionStatusData = issues.reduce((acc, issue) => {
        const statusKey = issue.status.replace(' ', '');
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const resolutionStatusChartData = Object.keys(resolutionStatusData).map(key => ({name: key, value: resolutionStatusData[key]}));


  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SealOfMaharashtra className="size-8 text-primary" />
            <span className="font-bold">CivisInsights</span>
          </Link>
           <div className="flex items-center gap-4">
             <Button variant="ghost" asChild>
                <Link href="/transparency">Transparency</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Official Login</Link>
            </Button>
          </div>
        </div>
      </header>
        <main className="flex-1">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-8">
                        <SealOfMaharashtra className="h-24 w-24 mx-auto text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Transparency Dashboard
                    </h1>
                    <p className="mt-6 text-lg text-slate-600">
                    Public insights into citizen-reported issues and government performance.
                    </p>
                </div>
            </div>

             <div className="container mx-auto px-4 pb-12 md:pb-24">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                    title="Total Issues Submitted"
                    value={totalIssues}
                    icon={MessageSquareWarning}
                    />
                    <StatCard
                    title="Issues Resolved"
                    value={resolvedIssues}
                    icon={CheckCircle2}
                    />
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0}%
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Most Reported Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                 {issuesByCategoryData.length > 0 ? issuesByCategoryData.sort((a,b) => b.value - a.value)[0].name : 'N/A'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
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
                    </Card>
                </div>
             </div>
        </main>
    </div>
  );
}

