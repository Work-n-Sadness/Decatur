
"use client";

import type { Task, Role } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTaskCategoryIcon, getResolutionStatusIcon, getTaskFrequencyIcon } from '@/components/icons';
import { CalendarDays, User, Users, CheckSquare, Tag, Paperclip, ExternalLink, BookOpen, Milestone } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onOpenDetails: (task: Task) => void;
  onOpenAttachEvidence: (task: Task) => void;
}

export default function TaskCard({ task, onOpenDetails, onOpenAttachEvidence }: TaskCardProps) {
  const CategoryIcon = getTaskCategoryIcon(task.category);
  const StatusIconWithClass = getResolutionStatusIcon(task.status);
  const FrequencyIcon = getTaskFrequencyIcon(task.frequency);
  
  const getStatusColorClass = (status: Task['status'], endDate: Date | null) => {
    if (status === 'Resolved') {
      return 'bg-green-500/20 text-green-700 border-green-500/50 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/30';
    }
    if (status === 'Escalated') {
      return 'bg-red-500/20 text-red-700 border-red-500/50 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30';
    }
    if (endDate) {
      const today = new Date();
      const daysLeft = differenceInDays(endDate, today);
      if (daysLeft < 0) {
        return 'bg-red-500/20 text-red-700 border-red-500/50 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30'; // Overdue
      } else if (daysLeft <= 3 && task.frequency === 'Daily') {
        return 'bg-orange-500/20 text-orange-700 border-orange-500/50 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/30'; // Due soon for daily
      } else if (daysLeft <= 7 && (task.frequency === 'Weekly' || task.frequency === 'Monthly')) {
         return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/30'; // Due soon for weekly/monthly
      }
    }
    // Default for Pending or other non-critical states
    return 'bg-blue-500/20 text-blue-700 border-blue-500/50 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30';
  };
  
  const displayResponsibleRole = (role: Role | Role[] | undefined) => {
    if (!role) return 'N/A';
    if (Array.isArray(role)) return role.join(' & ');
    return role;
  };

  const getOverdueRiskBadge = (task: Task) => {
    if (task.status === 'Resolved') return null;
    if (task.status === 'Escalated') return <Badge variant="destructive" className="text-xs">Escalated</Badge>;
    if (task.endDate) {
      const today = new Date();
      const daysLeft = differenceInDays(task.endDate, today);
      if (daysLeft < 0) return <Badge variant="destructive" className="text-xs">🔴 Overdue</Badge>;
      if (task.frequency === 'Daily' && daysLeft <=1) return <Badge variant="secondary" className="text-xs">🟠 Due Soon</Badge>;
      if (task.frequency === 'Weekly' && daysLeft <=2) return <Badge variant="secondary" className="text-xs">🟠 Due Soon</Badge>;
      if (task.frequency === 'Monthly' && daysLeft <=7) return <Badge variant="secondary" className="text-xs">🟡 Due Soon</Badge>;
    }
    return null;
  }


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CategoryIcon className="h-7 w-7 text-accent" />
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="outline" className={`flex items-center gap-1.5 text-xs px-2 py-1 ${getStatusColorClass(task.status, task.endDate)}`}>
              {StatusIconWithClass}
              {task.status}
            </Badge>
            {getOverdueRiskBadge(task)}
          </div>
        </div>
        <CardTitle className="text-base leading-tight font-semibold">{task.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          <Tag className="inline-block h-3 w-3 mr-1" /> {task.category}
        </CardDescription>
         <CardDescription className="text-xs text-muted-foreground pt-1 flex items-center">
          <FrequencyIcon className="inline-block h-3 w-3 mr-1.5" /> Frequency: {task.frequency}
        </CardDescription>
        {task.complianceChapterTag && (
          <CardDescription className="text-xs text-muted-foreground pt-1 flex items-center">
            <BookOpen className="inline-block h-3 w-3 mr-1.5" /> Compliance: {task.complianceChapterTag}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-2.5 text-xs">
        {task.status !== 'Resolved' && (
            <div className="text-muted-foreground">
                <Progress value={task.progress} className="w-full h-1.5" 
                aria-label={`Task progress ${task.progress}%`} />
                <p className="text-xs text-right mt-0.5">{task.progress}% complete</p>
            </div>
        )}
        
        <div className="space-y-1">
          {task.endDate && (
            <div className="flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <span className="font-medium mr-1">Due:</span> {format(new Date(task.endDate), 'MMM dd, yyyy')}
            </div>
          )}
           {task.lastCompletedOn && (
             <div className="flex items-center">
                <Milestone className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                <span className="font-medium mr-1">Resolved:</span> {format(new Date(task.lastCompletedOn), 'MMM dd, yyyy')} by {task.completedBy || 'N/A'}
             </div>
           )}
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
            <span className="font-medium mr-1">Role:</span> {displayResponsibleRole(task.responsibleRole)}
          </div>
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
            <span className="font-medium mr-1">Assigned:</span> {task.assignedStaff || 'N/A'}
          </div>
          {task.validator && (
            <div className="flex items-center">
                <CheckSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                <span className="font-medium mr-1">Validator:</span> {task.validator}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2 pt-3">
        <Button variant="default" size="sm" className="w-full" onClick={() => onOpenDetails(task)}>
          View Details
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => onOpenAttachEvidence(task)}>
                <Paperclip className="mr-2 h-4 w-4" /> {task.evidenceLink ? 'Edit Evidence' : 'Attach Evidence'}
            </Button>
            {task.evidenceLink && (
                <Button variant="ghost" size="sm" className="w-full text-accent hover:text-accent/90" asChild>
                    <a href={task.evidenceLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Evidence
                    </a>
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
