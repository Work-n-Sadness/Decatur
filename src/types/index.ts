
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Blocked';
export type TaskCategory = 
  | 'Health Protocols / Medications' 
  | 'Food Safety' 
  | 'Fire Safety' 
  | 'Office Admin' 
  | 'Documentation & Compliance' 
  | 'Personnel File & Staff Training' 
  | 'Postings & Required Notices' 
  | 'Environmental & Sanitation Checks' 
  | 'Additional ALR-Required Tasks';
export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Mid Yearly' | 'Annually' | 'Bi-annually' | 'As Needed';
export type Role = 'Nurse' | 'Caregiver' | 'Admin' | 'Maintenance' | 'Director';

export interface ActivityLog {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  responsibleRole: Role;
  status: TaskStatus;
  progress: number; // 0-100
  assignedStaff: string;
  validator: Role;
  startDate: Date;
  endDate: Date | null;
  time: string | null; // e.g., "10:00 AM"
  deliverables: string;
  notes: string;
  activities: ActivityLog[];
}

export interface AuditCategory {
  id: string;
  name: TaskCategory | 'General Compliance';
  items: AuditItem[];
}

export interface AuditItem {
  id: string;
  description: string;
  compliant: boolean | null; // null for not yet audited
  notes: string;
  evidence?: string; // Path or link to evidence
}

