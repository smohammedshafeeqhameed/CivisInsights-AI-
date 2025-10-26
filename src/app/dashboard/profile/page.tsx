'use client';

import Image from 'next/image';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>View and manage your profile details.</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <Avatar className="h-28 w-28 border-4 border-primary">
              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
              <AvatarFallback className="text-3xl">
                {user.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{user.displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex justify-center gap-2 md:justify-start">
                <Badge>Admin</Badge>
                <Badge variant="secondary">Maharashtra Gov</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Your recent activity within the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Assigned a new issue</p>
                <p className="text-sm text-muted-foreground">You were assigned issue CIV-003: "Overflowing public trash can..."</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Resolved an issue</p>
                <p className="text-sm text-muted-foreground">You marked issue CIV-005: "Early morning construction noise..." as resolved.</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            <Separator />
             <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-gray-400 mt-2" />
              <div>
                <p className="font-medium">Generated a report</p>
                <p className="text-sm text-muted-foreground">Generated "Monthly Sanitation Report - May 2024".</p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
