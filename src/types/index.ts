
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
export type Role = 'Nurse' | 'Caregiver' | 'Admin' | 'Maintenance' | 'Director' | 'Wellness Nurse' | 'Housekeeping Supervisor' | 'QMAP Supervisor';

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
  validator: Role; // The role responsible for validation
  startDate: Date;
  endDate: Date | null;
  time: string | null; // e.g., "10:00 AM"
  deliverables: string;
  notes: string;
  activities: ActivityLog[];
  evidenceLink?: string; // Link to evidence document/file
  lastCompletedOn?: Date | null;
  completedBy?: string | null; // Staff name who completed it
  validatorApproval?: string | null; // Name/ID of staff who approved, or approval notes
  complianceChapterTag?: string; // e.g., "Ch. 14.31"
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

// Types for Staff Training Dashboard
export type TrainingType = 'QMAP Training' | 'TB Test' | 'CPR Certification' | 'Orientation';
export type TrainingStatus = 'Compliant' | 'Expiring Soon' | 'Overdue' | 'Pending Documentation';

export interface StaffTrainingRecord {
  id: string;
  staffMemberName: string;
  staffRole: Role;
  trainingType: TrainingType;
  completionDate?: Date | null;
  expiryDate?: Date | null;
  status: TrainingStatus;
  documentationLink?: string; // Link to certificate or record
  notes?: string;
}

