
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'indigo';
}

const variantClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    indigo: 'from-indigo-500 to-indigo-600',
}

export function StatCard({ title, value, icon: Icon, variant = 'blue' }: StatCardProps) {
  return (
    <Card className={cn(
        "relative overflow-hidden border-0 text-white shadow-lg",
        "bg-gradient-to-br",
        variantClasses[variant]
    )}>
        <Icon className="absolute -right-4 -bottom-4 h-24 w-24 text-white/20" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-white/80" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
