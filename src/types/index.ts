
export type ResolutionStatus = 'Pending' | 'Resolved' | 'Escalated';

export type TaskCategory = 
  | 'Medication Management & ECP Audits'
  | 'Resident Documentation & Clinical Care'
  | 'Compliance & Survey Prep Tasks'
  | 'Smoking, Behavior, and Environment'
  | 'Facility Operations & Services'; // Added from sidebar update

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'As Needed' | 'Annually' | 'Bi-annually' | 'Mid Yearly';

export type Role = 
  | 'Nurse' 
  | 'Caregiver' 
  | 'Admin' 
  | 'Maintenance' 
  | 'Director' 
  | 'Wellness Nurse' 
  | 'Housekeeping Supervisor' 
  | 'QMAP Supervisor'
  | 'Housekeeping / Aide';

export interface ActivityLog {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface RecurrenceConfig {
  frequency: TaskFrequency;
  // For weekly recurrence, specify days. E.g., [1, 3, 5] for Mon, Wed, Fri (0=Sun, 6=Sat)
  recurrenceDaysOfWeek?: number[]; 
  // For monthly recurrence, specify day of month or rule
  recurrenceDayOfMonth?: number | 'first' | 'last' | 'firstWeekday' | 'lastWeekday';
  // The date from which this recurrence pattern starts.
  patternStartDate: Date;
  // Optional: if the recurrence has a specific end date
  patternEndDate?: Date | null;
  // Interval for frequency, e.g., every 2 weeks (frequency: 'Weekly', interval: 2)
  interval?: number; 
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
  startDate: Date; // Represents the start of the due window for THIS instance
  endDate: Date | null; // Represents the end of the due window (due date) for THIS instance
  time: string | null; 
  deliverables: string; 
  notes: string; 
  activities: ActivityLog[];
  evidenceLink?: string; 
  lastCompletedOn?: Date | null; // Last completion date for THIS instance/cycle
  completedBy?: string | null; 
  validatorApproval?: string | null; 
  complianceChapterTag?: string;
  recurrenceConfig?: RecurrenceConfig; // Configuration for how this task recurs
}

export interface AuditCategory {
  id: string;
  name: TaskCategory | 'General Compliance' | string; 
  items: AuditItem[];
}

export interface AuditItem {
  id: string;
  description: string;
  compliant: boolean | null; 
  notes: string;
  evidence?: string; 
}

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
  documentationLink?: string; 
  notes?: string;
}

