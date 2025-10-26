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
import { stats } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Issues"
          value={stats.newIssues}
          icon={MessageSquareWarning}
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={Hourglass}
        />
        <StatCard
          title="Avg. Resolution Time"
          value={stats.avgResolutionTime}
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
