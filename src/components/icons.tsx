
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
  CircleDot, // Pending
  Loader2, 
  CheckCircle2, // Resolved
  AlertTriangle, // Escalated
  ShieldX, 
  type LucideIcon,
  GanttChartSquare, // Dashboard
  FilePieChart, // Reports
  Settings2, 
  Repeat, // Frequency
  CalendarClock, // Frequency
  Pill, // Medication Management
  FileHeart, // Resident Documentation
  ShieldCheck, // Compliance & Survey Prep
  Wind, // Environment / Smoking
  ClipboardCheck, // Compliance Summary
  UsersRound, // Staff Training
  Clock, // Used for ClockWarning replacement
} from 'lucide-react';
import type { TaskCategory, ResolutionStatus, TaskFrequency } from '@/types';

export const TaskCategoryIcons: Record<TaskCategory, LucideIcon> = {
  'Medication Management & ECP Audits': Pill,
  'Resident Documentation & Clinical Care': FileHeart,
  'Compliance & Survey Prep Tasks': ShieldCheck,
  'Smoking, Behavior, and Environment': Wind,
};

export const ResolutionStatusIcons: Record<ResolutionStatus, LucideIcon> = {
  Pending: CircleDot,
  Resolved: CheckCircle2,
  Escalated: AlertTriangle,
};

export const TaskFrequencyIcons: Record<TaskFrequency, LucideIcon> = {
  Daily: Repeat,
  Weekly: CalendarClock, 
  Monthly: CalendarClock,
  Quarterly: CalendarClock,
  'Mid Yearly': CalendarClock,
  Annually: CalendarClock,
  'Bi-annually': CalendarClock,
  'As Needed': Sparkles, // Changed 'As Needed' icon
};


export const SidebarIcons = {
  Dashboard: GanttChartSquare,
  AuditTool: Settings2, 
  StaffMatrix: Users, 
  Reports: FilePieChart,
  ComplianceSummary: ClipboardCheck,
  StaffTraining: UsersRound,
};

export const getTaskCategoryIcon = (category: TaskCategory): LucideIcon => {
  return TaskCategoryIcons[category] || ListChecks; // Fallback icon
};

export const getResolutionStatusIcon = (status: ResolutionStatus): JSX.Element => {
  const Icon = ResolutionStatusIcons[status] || CircleDot; // Fallback icon
  return <Icon />;
};

export const getTaskFrequencyIcon = (frequency: TaskFrequency): LucideIcon => {
  return TaskFrequencyIcons[frequency] || Repeat;
};
