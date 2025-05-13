
"use client";

import type { Task } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTaskCategoryIcon, getTaskStatusIcon, getTaskFrequencyIcon } from '@/components/icons';
import { CalendarDays, User, CheckSquare, Tag, Paperclip, ExternalLink, Repeat, BookOpen } from 'lucide-react'; // Added BookOpen
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onOpenDetails: (task: Task) => void;
  onOpenAttachEvidence: (task: Task) => void;
}

export default function TaskCard({ task, onOpenDetails, onOpenAttachEvidence }: TaskCardProps) {
  const CategoryIcon = getTaskCategoryIcon(task.category);
  const StatusIconWithClass = getTaskStatusIcon(task.status);
  const FrequencyIcon = getTaskFrequencyIcon(task.frequency);
  
  const getStatusColor = (status: Task['status'], frequency: Task['frequency'], endDate: Task['endDate']) => {
    let baseColorClass = '';
    switch (status) {
      case 'Completed': baseColorClass = 'bg-green-500/20 text-green-700 border-green-500/50 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/30'; break;
      case 'In Progress': baseColorClass = 'bg-blue-500/20 text-blue-700 border-blue-500/50 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30'; break;
      case 'Overdue': baseColorClass = 'bg-red-500/20 text-red-700 border-red-500/50 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30'; break;
      case 'Blocked': baseColorClass = 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/30'; break;
      case 'Pending': baseColorClass = 'bg-gray-500/20 text-gray-700 border-gray-500/50 dark:text-gray-400 dark:bg-gray-500/10 dark:border-gray-500/30'; break;
      default: baseColorClass = 'bg-secondary text-secondary-foreground border-border';
    }

    // Additional logic for overdue risk based on frequency
    if (status !== 'Completed' && endDate) {
      const now = new Date();
      const dueDate = new Date(endDate);
      const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

      let riskThreshold = 7; // Default for monthly or less frequent
      if (frequency === 'Daily') riskThreshold = 0; // Due today or past
      if (frequency === 'Weekly') riskThreshold = 1; // Due in 1 day or past

      if (diffDays < 0) { // Already overdue
         baseColorClass = 'bg-red-600/30 text-red-800 border-red-600/60 dark:text-red-300 dark:bg-red-600/20 dark:border-red-600/40 font-bold';
      } else if (diffDays <= riskThreshold) {
        // Nearing deadline, could be orange or yellow
        baseColorClass = 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/30';
      }
    }
    return baseColorClass;
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CategoryIcon className="h-7 w-7 text-accent" />
          <Badge variant="outline" className={`flex items-center gap-1.5 ${getStatusColor(task.status, task.frequency, task.endDate)}`}>
            {StatusIconWithClass}
            {task.status}
             {task.status === 'Overdue' && (task.frequency === 'Daily' || task.frequency === 'Weekly') && <span className="font-semibold ml-1"> ({task.frequency})</span>}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{task.name}</CardTitle>
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
      <CardContent className="flex-grow space-y-3">
        <div className="text-sm text-muted-foreground">
          <Progress value={task.progress} className="w-full h-2" 
            aria-label={`Task progress ${task.progress}%`} />
          <p className="text-xs text-right mt-1">{task.progress}% complete</p>
        </div>
        <div className="text-xs space-y-1.5">
          <div className="flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <span className="font-medium mr-1">Due:</span> {task.endDate ? format(new Date(task.endDate), 'MMM dd, yyyy') : 'N/A'}
          </div>
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <span className="font-medium mr-1">Assigned:</span> {task.assignedStaff} ({task.responsibleRole})
          </div>
          <div className="flex items-center">
            <CheckSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <span className="font-medium mr-1">Validator:</span> {task.validator} (Role)
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2">
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

