
export type ResolutionStatus = 'Pending' | 'Resolved' | 'Escalated';

export type TaskCategory = 
  | 'Medication Management & ECP Audits'
  | 'Resident Documentation & Clinical Care'
  | 'Compliance & Survey Prep Tasks'
  | 'Smoking, Behavior, and Environment';

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'As Needed' | 'Annually' | 'Bi-annually' | 'Mid Yearly'; // Added Mid Yearly from filters

export type Role = 
  | 'Nurse' 
  | 'Caregiver' 
  | 'Admin' 
  | 'Maintenance' 
  | 'Director' 
  | 'Wellness Nurse' 
  | 'Housekeeping Supervisor' 
  | 'QMAP Supervisor'
  | 'Housekeeping / Aide'; // Added from prompt

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
  responsibleRole: Role | Role[]; 
  status: ResolutionStatus; 
  progress: number; 
  assignedStaff: string; 
  validator: Role | string | null; 
  startDate: Date; 
  endDate: Date | null; 
  time: string | null; 
  deliverables: string; 
  notes: string; 
  activities: ActivityLog[];
  evidenceLink?: string; 
  lastCompletedOn?: Date | null;
  completedBy?: string | null; 
  validatorApproval?: string | null; 
  complianceChapterTag?: string; 
}

// AuditItem and AuditCategory might be deprecated if /audit-tool page is removed.
// Keeping them for now in case parts are reused, but primary focus is Task.
export interface AuditCategory {
  id: string;
  name: TaskCategory | 'General Compliance' | string; // Making name flexible
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
