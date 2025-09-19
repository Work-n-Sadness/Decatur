
"use client";

import React, { useMemo } from 'react';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { isToday, isThisWeek, startOfDay } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

interface ComplianceScorecardProps {
  tasks: Task[];
}

const getCompletionPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) return 100;
  const completedTasks = tasks.filter(task => task.status === 'Resolved' || task.status === 'Complete');
  return Math.round((completedTasks.length / tasks.length) * 100);
};

const getProgressColorClass = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ComplianceScorecard({ tasks }: ComplianceScorecardProps) {
  const today = startOfDay(new Date());

  const todaysTasks = useMemo(() => 
    tasks.filter(task => task.endDate && isToday(startOfDay(new Date(task.endDate)))),
    [tasks]
  );
  
  const thisWeeksTasks = useMemo(() => 
    tasks.filter(task => task.endDate && isThisWeek(startOfDay(new Date(task.endDate)), { weekStartsOn: 1 })),
    [tasks]
  );

  const todayCompletion = useMemo(() => getCompletionPercentage(todaysTasks), [todaysTasks]);
  const weekCompletion = useMemo(() => getCompletionPercentage(thisWeeksTasks), [thisWeeksTasks]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-accent" />
          Compliance Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium">Tasks Completed Today</h3>
            <span className={`text-lg font-bold ${getProgressColorClass(todayCompletion).replace('bg-', 'text-')}`}>
              {todayCompletion}%
            </span>
          </div>
          <Progress value={todayCompletion} className="h-3" indicatorClassName={getProgressColorClass(todayCompletion)} />
          <p className="text-xs text-muted-foreground mt-1">
            {todaysTasks.filter(t => t.status === 'Resolved' || t.status === 'Complete').length} of {todaysTasks.length} tasks due today completed.
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium">Tasks Completed This Week</h3>
            <span className={`text-lg font-bold ${getProgressColorClass(weekCompletion).replace('bg-', 'text-')}`}>
              {weekCompletion}%
            </span>
          </div>
          <Progress value={weekCompletion} className="h-3" indicatorClassName={getProgressColorClass(weekCompletion)} />
          <p className="text-xs text-muted-foreground mt-1">
             {thisWeeksTasks.filter(t => t.status === 'Resolved' || t.status === 'Complete').length} of {thisWeeksTasks.length} tasks due this week completed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
