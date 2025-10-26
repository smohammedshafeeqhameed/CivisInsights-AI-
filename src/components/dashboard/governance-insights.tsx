import { Lightbulb } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { governanceInsight } from '@/lib/data';

export function GovernanceInsights() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="grid gap-1">
          <CardTitle>Proactive Governance Insights</CardTitle>
        </div>
        <Lightbulb className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{governanceInsight}</p>
      </CardContent>
    </Card>
  );
}
