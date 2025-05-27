
export type ResolutionStatus = 'Pending' | 'Resolved' | 'Escalated' | 'Complete' | 'Flagged'; // Added Complete, Flagged

export type TaskCategory =
  | 'Medication Management & ECP Audits'
  | 'Resident Documentation & Clinical Care'
  | 'Compliance & Survey Prep Tasks'
  | 'Smoking, Behavior, and Environment'
  | 'Facility Operations & Services';

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'As Needed' | 'Annually' | 'Bi-annually' | 'Mid Yearly';

// Updated to reflect more specific roles from the operational model
export type AppRole =
  | 'Director (Owner)'
  | 'Assistant Director'
  | 'Administrator Designee'
  | 'Admin Assistant'
  | 'Caregiver' // Handles QMAP, Housekeeping, ADLs, Meals
  | 'RN (External)'
  | 'Doctor (Consultant)'
  // Keeping some original broader roles for flexibility or if they map to specific tasks
  | 'Nurse' // Could be an internal LPN/RN not the external one
  | 'Maintenance'
  | 'Wellness Nurse'
  | 'Housekeeping Supervisor'
  | 'QMAP Supervisor'
  | 'kitchen_supervisor_id'
  | 'clinical_director_id'
  | 'housekeeping_lead_id'
  | 'safety_officer_id'
  | 'maintenance_id';


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

export type ResidentCareFlag =
  | 'wheelchair'
  | 'walker'
  | 'controlled_meds'
  | 'hypertension'
  | 'diabetes'
  | 'dementia'
  | 'fall_risk_low'
  | 'fall_risk_medium'
  | 'fall_risk_high'
  | 'elopement_risk_yes'
  | 'elopement_risk_no';


export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  responsibleRole: AppRole | AppRole[];
  status: ResolutionStatus;
  progress: number;
  assignedStaff: string; // Display name/role
  assignedStaffId?: string; // Actual user ID
  validator: AppRole | string | null;
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
  residentCareFlags?: ResidentCareFlag[];
  conditionNotes?: string;
  hipaaProtectedNotes?: string;
}

export type AuditToolCategory =
  | 'Health Protocols / Medications'
  | 'Food Safety'
  | 'Fire Safety'
  | 'Office Admin'
  | 'Documentation & Compliance'
  | 'Personnel File & Staff Training'
  | 'Postings & Required Notices'
  | 'Environmental & Sanitation Safety'
  | 'General ALR Compliance'
  | 'Resident Records Management'; // Added for Face Sheets

// Simplified status for audit records for now, can be expanded
export type AuditStatus = 'Pending Review' | 'In Progress' | 'Action Required' | 'Compliant' | 'Non-Compliant' | 'Resolved' | 'Up-to-date' | 'Archived';


export interface AuditRecord {
  id: string;
  name: string; // For Face Sheets, this could be "Resident Name - Face Sheet"
  category: AuditToolCategory;
  assignedRole: AppRole | AppRole[]; // Staff responsible for maintaining/reviewing the face sheet
  validator?: AppRole | string | null; // e.g., Nurse or Admin for validation
  lastCompletedDate?: Date | null; // Could be "Last Reviewed Date" or "Last Updated Date"
  status: AuditStatus; // e.g., 'Up-to-date', 'Review Needed', 'Archived'
  evidenceLink?: string; // Link to the digital face sheet document
  chapterReferenceTag?: string; // e.g., if there are specific regulatory tags for face sheets
  notes?: string; // Any relevant notes
  createdAt: Date;
  updatedAt: Date;
}


export type TrainingType = 'QMAP Training' | 'TB Test' | 'CPR Certification' | 'Orientation';
export type TrainingStatus = 'Compliant' | 'Expiring Soon' | 'Overdue' | 'Pending Documentation';

export interface StaffTrainingRecord {
  id: string;
  staffMemberName: string;
  staffRole: AppRole;
  trainingType: TrainingType;
  completionDate?: Date | null;
  expiryDate?: Date | null;
  status: TrainingStatus;
  documentationLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringTaskSeed {
  id: string;
  taskName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recurrenceDays?: string[]; // For weekly tasks, e.g., ["Monday", "Wednesday"]
  recurrenceDayOfMonth?: number; // For monthly tasks
  assignedStaff: string; // Role or specific user ID
  validator?: string; // Role or specific user ID
  autoGenerateChecklist: boolean;
  category?: string;
  startDateForHistory?: string; // YYYY-MM-DD format
  generateHistory?: boolean;
}


export interface ChecklistItem {
  id: string;
  taskName: string;
  assignedStaff: string;
  assignedStaffId?: string;
  validator?: string | null;
  dueDate: Date; // Firestore Timestamp on backend, JS Date on client
  status: Extract<ResolutionStatus, 'Pending' | 'Complete' | 'Flagged'>;
  createdAt: Date; // Firestore Timestamp on backend, JS Date on client
  statusUpdatedAt?: Date | null; // Firestore Timestamp on backend, JS Date on client
  taskId: string;
  notes?: string;
  evidenceLink?: string;
  lastCompletedOn?: Date | null; // Firestore Timestamp on backend, JS Date on client
  completedBy?: string | null;
  category?: string;
  backfilled?: boolean;
}


export type CertificationStatus = 'Active' | 'Expired' | 'Due Soon';
export type InstallationStatus = 'Operational' | 'Needs Repair' | 'Out of Service';
export type InstallationFrequency = 'Monthly' | 'Quarterly' | 'Annually' | 'Semi-Annually' | 'Daily Check' | 'Monthly Test, Semi-Annual Service';


export interface FacilityCertification {
  id: string;
  certificationName: string;
  certifyingAgency: string;
  issueDate: Date;
  expirationDate: Date;
  status: CertificationStatus;
  certificateUpload?: string; // URL to the uploaded certificate
  lastReviewedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilityInstallation {
  id: string;
  installationName: string;
  category: 'Fire Safety' | 'HVAC' | 'Water Systems' | 'Electrical' | 'Accessibility' | 'Sanitation' | 'Gas Systems' | 'Air Quality' | 'General Safety';
  location?: string;
  lastInspectionDate?: Date | null;
  nextInspectionDue?: Date | null;
  inspectionFrequency?: InstallationFrequency;
  serviceVendor?: string;
  status: InstallationStatus;
  uploadInspectionLog?: string; // URL to the uploaded inspection log
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffResponsibilityMatrixEntry {
  role: AppRole;
  responsibilities: {
    taskName: string;
    deliverables: string;
    category: TaskCategory;
  }[];
}

    