
'use client';

import {
  MessageSquareWarning,
  CheckCircle2,
  Hourglass,
  Clock,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentIssues } from '@/components/dashboard/recent-issues';
import { DemandPrediction } from '@/components/dashboard/demand-prediction';
import { GovernanceInsights } from '@/components/dashboard/governance-insights';
import { issues } from '@/lib/data';

export default function DashboardPage() {
  const newIssues = issues.filter((issue) => issue.status === 'New').length;
  const resolvedToday = issues.filter(
    (issue) => issue.status === 'Resolved'
  ).length;
  const pendingReview = issues.filter(
    (issue) => issue.status === 'In Progress'
  ).length;
  const avgResolutionTime = '2.1 days'; // Static for now

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Issues"
          value={newIssues}
          icon={MessageSquareWarning}
        />
        <StatCard
          title="Resolved Issues"
          value={resolvedToday}
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Review"
          value={pendingReview}
          icon={Hourglass}
        />
        <StatCard
          title="Avg. Resolution Time"
          value={avgResolutionTime}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentIssues />
        </div>
        <div className="flex flex-col gap-8">
          <DemandPrediction />
          <GovernanceInsights />
        </div>
      </div>
    </div>
  );
}
