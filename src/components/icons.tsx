
import {
  HeartPulse, // Existing, can be reused or remapped
  UtensilsCrossed, // Existing
  Flame, // Existing
  Briefcase, // Existing
  FileText, // Existing
  Users, // Existing
  ClipboardList, // Existing
  Sparkles, // Existing
  ListChecks, // Existing
  CircleDot, // Pending
  Loader2, // Could be 'In Progress' if that status returns
  CheckCircle2, // Resolved
  AlertTriangle, // Escalated
  ShieldX, // Blocked (if status returns)
  type LucideIcon,
  GanttChartSquare, // Dashboard
  FilePieChart, // Reports
  Settings2, // AuditTool (if page remains)
  Repeat, // Frequency
  CalendarClock, // Frequency
  Pill, // Medication Management
  FileHeart, // Resident Documentation
  ShieldCheck, // Compliance & Survey Prep
  Wind, // Environment / Smoking
  ClipboardCheck, // Compliance Summary
  UsersRound, // Staff Training
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
  'Mid Yearly': CalendarClock, // Keep if this frequency is used
  Annually: CalendarClock,
  'Bi-annually': CalendarClock, // Keep if this frequency is used
  'As Needed': Repeat,
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
  // Add animation if needed, e.g. for a hypothetical "In Progress" like state
  // const className = status === 'In Progress' ? 'animate-spin' : ''; 
  return <Icon />;
};

export const getTaskFrequencyIcon = (frequency: TaskFrequency): LucideIcon => {
  return TaskFrequencyIcons[frequency] || Repeat;
};
