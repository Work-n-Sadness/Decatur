
"use client";

import React, { useMemo } from 'react';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getResolutionStatusIcon, getTaskCategoryIcon } from '@/components/icons';
import { ClipboardCheck, ArrowRight } from 'lucide-react';
import { isToday, startOfDay, format } from 'date-fns';
import Link from 'next/link';

interface TaskProgressProps {
  tasks: Task[];
}

export default function TaskProgress({ tasks }: TaskProgressProps) {

  const todaysTasks = useMemo(() => {
    const today = startOfDay(new Date());
    return tasks
      .filter(task => task.endDate && isToday(startOfDay(new Date(task.endDate))))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  const completedCount = useMemo(() => 
    todaysTasks.filter(t => t.status === 'Resolved' || t.status === 'Complete').length,
    [todaysTasks]
  );
  
  const pendingCount = todaysTasks.length - completedCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-accent" />
          Today's Task Progress
        </CardTitle>
        <CardDescription>
          {completedCount} completed, {pendingCount} pending of {todaysTasks.length} total tasks due today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todaysTasks.length > 0 ? (
          <ScrollArea className="h-64 pr-4">
            <div className="space-y-3">
              {todaysTasks.map(task => {
                const CategoryIcon = getTaskCategoryIcon(task.category);
                const StatusIcon = getResolutionStatusIcon(task.status);
                const isCompleted = task.status === 'Resolved' || task.status === 'Complete';

                return (
                  <div key={task.id} className={`p-3 rounded-lg flex items-center gap-4 transition-colors ${isCompleted ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                    <CategoryIcon className={`h-6 w-6 shrink-0 ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div className="flex-grow">
                      <p className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.name}</p>
                      <p className="text-xs text-muted-foreground">{task.assignedStaff}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {StatusIcon}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold">All Clear!</p>
            <p className="text-muted-foreground">No tasks scheduled for today.</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
            <Button variant="outline" asChild>
                <Link href="/checklists">
                    Go to Checklist Manager <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
