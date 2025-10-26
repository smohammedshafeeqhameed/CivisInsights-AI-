
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { type Issue } from '@/lib/data';
import {
  summarizeCitizenIssue,
  type SummarizeCitizenIssueOutput,
} from '@/ai/flows/summarize-citizen-issue';
import { Lightbulb, ListChecks, Activity } from 'lucide-react';

interface IssueDetailsDialogProps {
  issue: Issue | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusVariant = {
  New: 'destructive',
  'In Progress': 'secondary',
  Resolved: 'default',
} as const;

export function IssueDetailsDialog({
  issue,
  isOpen,
  onOpenChange,
}: IssueDetailsDialogProps) {
  const [summary, setSummary] = useState<SummarizeCitizenIssueOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && issue) {
      const fetchSummary = async () => {
        setLoading(true);
        setError('');
        setSummary(null);
        try {
          const result = await summarizeCitizenIssue({
            issueReport: issue.report,
            issueCategory: issue.category,
          });
          setSummary(result);
        } catch (e) {
          console.error('Failed to get AI summary:', e);
          setError('Could not load AI-powered analysis.');
        }
        setLoading(false);
      };
      fetchSummary();
    }
  }, [isOpen, issue]);

  if (!issue) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Issue Details: <span className="font-mono text-primary">{issue.id}</span>
          </DialogTitle>
          <DialogDescription>
            A detailed view of the citizen-reported issue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Category</h4>
                    <p className='text-muted-foreground'>{issue.category}</p>
                </div>
                 <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Status</h4>
                    <Badge variant={statusVariant[issue.status]} className='capitalize'>{issue.status}</Badge>
                </div>
            </div>
            <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Full Report</h4>
                <p className='text-muted-foreground text-sm italic'>"{issue.report}"</p>
            </div>
          
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lightbulb className='text-primary size-5'/> AI Analysis</h3>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className='space-y-2'>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                         <div className='space-y-2'>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>
                ) : error ? (
                    <p className='text-sm text-destructive'>{error}</p>
                ) : summary && (
                    <div className="space-y-6">
                        <p className='text-base font-medium bg-accent/50 p-4 rounded-lg border-l-4 border-accent-foreground text-accent-foreground'>{summary.summary}</p>
                        
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <ListChecks className="size-4" />
                                <span>Key Details</span>
                            </h4>
                            <ul className="list-disc space-y-1 pl-5 text-sm">
                                {summary.keyDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>

                         <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Activity className="size-4" />
                                <span>Suggested Action</span>
                            </h4>
                            <p className='text-sm'>{summary.suggestedAction}</p>
                        </div>
                    </div>
                )}
            </div>

        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Assign Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
