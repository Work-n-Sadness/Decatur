
export type ResolutionStatus = 'Pending' | 'Resolved' | 'Escalated'; // New status type

export type TaskCategory = 
  | 'Medication Management & ECP Audits'
  | 'Resident Documentation & Clinical Care'
  | 'Compliance & Survey Prep Tasks'
  | 'Smoking, Behavior, and Environment';

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'As Needed' | 'Annually' | 'Bi-annually'; // Bi-annually added for consistency
export type Role = 
  | 'Nurse' 
  | 'Caregiver' 
  | 'Admin' 
  | 'Maintenance' 
  | 'Director' 
  | 'Wellness Nurse' 
  | 'Housekeeping Supervisor' 
  | 'QMAP Supervisor';

export interface ActivityLog {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface Task {
  id: string;
  name: string; // Was taskActivity in user prompt, mapped to name
  category: TaskCategory;
  frequency: TaskFrequency;
  responsibleRole: Role | Role[]; // Can be a single role or multiple
  status: ResolutionStatus; // Changed from TaskStatus to ResolutionStatus
  progress: number; // 0-100, may be less relevant with new statuses, but keeping for now
  assignedStaff: string; // Specific staff member(s) assigned
  validator: Role | string | null; // Secondary reviewer role or name
  startDate: Date; // When the task cycle begins or was initiated
  endDate: Date | null; // Due date for the current cycle
  time: string | null; // e.g., "10:00 AM"
  deliverables: string; // Expected evidence or file
  notes: string; // General notes
  activities: ActivityLog[];
  evidenceLink?: string; // Google Drive or local file URL
  lastCompletedOn?: Date | null;
  completedBy?: string | null; // Staff name who completed it
  validatorApproval?: string | null; // Name/ID of staff who approved, or approval notes
  complianceChapterTag?: string; // e.g., "Ch. 14.31"
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
