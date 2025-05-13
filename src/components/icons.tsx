
import {
  HeartPulse,
  UtensilsCrossed,
  Flame,
  Briefcase,
  FileText,
  Users,
  ClipboardList,
  Sparkles,
  ListChecks,
  CircleDot,
  Loader2,
  CheckCircle2,
  Clock, // Replaced ClockWarning with Clock
  ShieldX,
  type LucideIcon,
  GanttChartSquare,
  FilePieChart,
  Settings2,
  Repeat
} from 'lucide-react';
import type { TaskCategory, TaskStatus, TaskFrequency } from '@/types';

export const TaskCategoryIcons: Record<TaskCategory, LucideIcon> = {
  'Health Protocols / Medications': HeartPulse,
  'Food Safety': UtensilsCrossed,
  'Fire Safety': Flame,
  'Office Admin': Briefcase,
  'Documentation & Compliance': FileText,
  'Personnel File & Staff Training': Users,
  'Postings & Required Notices': ClipboardList,
  'Environmental & Sanitation Checks': Sparkles,
  'Additional ALR-Required Tasks': ListChecks,
};

export const TaskStatusIcons: Record<TaskStatus, LucideIcon> = {
  Pending: CircleDot,
  'In Progress': Loader2,
  Completed: CheckCircle2,
  Overdue: Clock, // Replaced ClockWarning with Clock
  Blocked: ShieldX,
};

export const TaskFrequencyIcons: Record<TaskFrequency, LucideIcon> = {
  Daily: Repeat,
  Weekly: Repeat,
  Monthly: Repeat,
  Quarterly: Repeat,
  Annually: Repeat,
  'As Needed': Repeat,
};


export const SidebarIcons = {
  Dashboard: GanttChartSquare,
  AuditTool: Settings2, // Using Settings2 as a more generic "tool" icon
  StaffMatrix: Users, // Re-using Users icon for staff related matrix
  Reports: FilePieChart,
};

export const getTaskCategoryIcon = (category: TaskCategory) => {
  return TaskCategoryIcons[category] || ListChecks;
};

export const getTaskStatusIcon = (status: TaskStatus) => {
  const Icon = TaskStatusIcons[status] || CircleDot;
  const className = status === 'In Progress' ? 'animate-spin' : '';
  return <Icon className={className} />;
};

export const getTaskFrequencyIcon = (frequency: TaskFrequency) => {
  return TaskFrequencyIcons[frequency] || Repeat;
};
