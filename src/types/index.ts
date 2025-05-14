

export type ResolutionStatus = 'Pending' | 'Resolved' | 'Escalated' | 'Complete' | 'Flagged'; // Added Complete, Flagged

export type TaskCategory = 
  | 'Medication Management & ECP Audits'
  | 'Resident Documentation & Clinical Care'
  | 'Compliance & Survey Prep Tasks'
  | 'Smoking, Behavior, and Environment'
  | 'Facility Operations & Services';

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
  | 'Housekeeping / Aide'
  | 'kitchen_supervisor_id' // From seed
  | 'clinical_director_id' // From seed
  | 'housekeeping_lead_id' // From seed
  | 'safety_officer_id' // From seed
  | 'maintenance_id'; // From seed


export interface ActivityLog {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface RecurrenceConfig {
  frequency: TaskFrequency;
  recurrenceDaysOfWeek?: number[]; 
  recurrenceDayOfMonth?: number | 'first' | 'last' | 'firstWeekday' | 'lastWeekday';
  patternStartDate: Date;
  patternEndDate?: Date | null;
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
  recurrenceConfig?: RecurrenceConfig;
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

// For Firebase Cloud Function and Checklist UI
export interface RecurringTask {
  id: string; // Firestore document ID
  taskName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recurrenceDays?: string[]; // For weekly, e.g., ["Monday", "Friday"]
  recurrenceDayOfMonth?: number; // For monthly
  assignedStaff: string; 
  validator?: string; 
  autoGenerateChecklist: boolean;
  category?: string; 
  startDateForHistory?: string; // YYYY-MM-DD for client-side backfill simulation
  generateHistory?: boolean; // Flag for client-side backfill simulation
}

export interface ChecklistItem {
  id: string; // Firestore document ID
  taskName: string;
  assignedStaff: string;
  validator?: string | null;
  dueDate: firebase.firestore.Timestamp | Date; // Changed from string to Timestamp or Date
  status: Extract<ResolutionStatus, 'Pending' | 'Complete' | 'Flagged'>; 
  createdAt: firebase.firestore.Timestamp | Date; 
  statusUpdatedAt?: firebase.firestore.Timestamp | Date | null;
  taskId: string; 
  notes?: string;
  evidenceLink?: string;
  lastCompletedOn?: firebase.firestore.Timestamp | Date | null;
  completedBy?: string | null;
  category?: string;
  backfilled?: boolean;
}

// Firebase namespace for Timestamp if needed elsewhere
// import type firebase from 'firebase/compat/app'; // For Timestamp type if using compat
// Or 
import type { Timestamp } from "firebase/firestore"; 

