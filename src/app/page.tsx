'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SealOfMaharashtra } from '@/components/icons';
import { useIssues } from '@/hooks/use-issues';
import Link from 'next/link';

const formSchema = z.object({
  category: z.string({
    required_error: 'Please select a category.',
  }),
  report: z
    .string()
    .min(50, {
      message: 'Report must be at least 50 characters.',
    })
    .max(1000, {
      message: 'Report must not be longer than 1000 characters.',
    }),
});

export default function CitizenHomePage() {
  const { toast } = useToast();
  const { setIssues } = useIssues();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const newIssue = {
      id: `CIV-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      category: data.category,
      report: data.report,
      summary: data.report.substring(0, 50) + '...',
      status: 'New' as const,
    };

    setIssues((prevIssues) => [newIssue, ...prevIssues]);

    toast({
      title: 'Issue Submitted!',
      description: 'Thank you for your report. It has been sent to the relevant department.',
    });
    form.reset();
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50">
       <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SealOfMaharashtra className="size-8 text-primary" />
            <span className="font-bold">CivisInsights</span>
          </Link>
          <Button asChild>
            <Link href="/login">Official Login</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
             <div className="mb-8">
                <SealOfMaharashtra className="h-24 w-24 mx-auto text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Report an Issue
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Help us improve our community. Submit a report and we'll route it to the right department.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <div className="rounded-2xl border bg-white p-8 shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category for your issue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Road Maintenance">
                              Road Maintenance
                            </SelectItem>
                            <SelectItem value="Public Safety">
                              Public Safety
                            </SelectItem>
                            <SelectItem value="Sanitation">Sanitation</SelectItem>
                            <SelectItem value="Parks & Rec">Parks & Rec</SelectItem>
                            <SelectItem value="Noise Complaint">
                              Noise Complaint
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This helps us route your issue to the correct department.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="report"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Report</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the issue in detail..."
                            className="resize-y min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more detail you can provide, the better we can
                          assist.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Submit Report
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
