
import type { Task, TaskCategory, TaskFrequency, ResolutionStatus, Role, AuditCategory, AuditItem, StaffTrainingRecord, TrainingType, TrainingStatus } from '@/types';

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start: Date, end: Date): Date => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
};

export const allTaskCategories: TaskCategory[] = [
  'Medication Management & ECP Audits',
  'Resident Documentation & Clinical Care',
  'Compliance & Survey Prep Tasks',
  'Smoking, Behavior, and Environment',
];

export const allTaskFrequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'As Needed', 'Annually', 'Bi-annually', 'Mid Yearly'];
export const allResolutionStatuses: ResolutionStatus[] = ['Pending', 'Resolved', 'Escalated'];
export const allMockRoles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director', 'Wellness Nurse', 'Housekeeping Supervisor', 'QMAP Supervisor', 'Housekeeping / Aide'];

// Expanded list based on roles mentioned in task assignments
const staffNamesByRole: Record<Role, string[]> = {
    'Wellness Nurse': ['Alice Smith (Wellness Nurse)', 'Olivia Chen (Wellness Nurse)'],
    'QMAP Supervisor': ['Bob Johnson (QMAP Sup.)', 'Noah Martinez (QMAP Sup.)'],
    'Admin': ['Carol Williams (Admin)', 'Sophia Rodriguez (Admin)'],
    'Director': ['David Brown (Director)', 'Isabella Wilson (Director)'],
    'Nurse': ['Eve Davis (Nurse)', 'Grace Lee (Nurse)'], // Assuming Grace can also be a Nurse
    'Caregiver': ['Frank Wilson (Caregiver)', 'Michael Brown (Caregiver)'],
    'Housekeeping Supervisor': ['Grace Lee (Housekeeping Sup.)', 'Ava Davis (Housekeeping Sup.)'],
    'Maintenance': ['Henry Miller (Maintenance)', 'Ethan Miller (Maintenance)'],
    'Housekeeping / Aide': ['Zoe Clark (Aide)', 'Mia Lewis (Aide)'],
};

const allStaffNames: string[] = Object.values(staffNamesByRole).flat();

const complianceChapterTagsPool = ["Ch. 2.15", "Ch. 7.03", "Ch. 14.31", "Ch. 9.11", "Ch. 22.01", "Ch. 14.3", "Ch. 24.1", "Ch. 12.4", "Ch. 24.3", "Ch. 12.6", null];


interface SeedTask {
  name: string;
  category: TaskCategory;
  responsibleRole: Role | Role[];
  frequency: TaskFrequency;
  deliverables: string;
  validator?: Role | null;
  complianceChapterTag?: string | null;
}

const specificTasksSeed: SeedTask[] = [
  // Category: Medication Management & ECP Audits
  { name: "Review and reconcile all new Med Orders in ECP", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Daily', deliverables: "Verified MAR entries and scanned orders", validator: 'Director', complianceChapterTag: "Ch. 7.03" },
  { name: "Flag and resolve discontinued meds in ECP", category: 'Medication Management & ECP Audits', responsibleRole: 'QMAP Supervisor', frequency: 'Daily', deliverables: "Discontinued log and removal confirmation", validator: 'Wellness Nurse', complianceChapterTag: "Ch. 7.03" },
  { name: "Audit low stock / restock medication logs", category: 'Medication Management & ECP Audits', responsibleRole: ['Admin', 'Nurse'], frequency: 'Weekly', deliverables: "Reorder requests and stock checklists", validator: 'Director', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform ECP chart review audit for MAR accuracy and cross-check", category: 'Medication Management & ECP Audits', responsibleRole: 'Director', frequency: 'Weekly', deliverables: "Audit checklist + notes", validator: null, complianceChapterTag: "Ch. 7.03" },
  { name: "Investigate and log medication errors", category: 'Medication Management & ECP Audits', responsibleRole: 'QMAP Supervisor', frequency: 'As Needed', deliverables: "Error investigation form", validator: 'Director', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform 2-person narcotics destruction & documentation", category: 'Medication Management & ECP Audits', responsibleRole: ['Director', 'Nurse'], frequency: 'As Needed', deliverables: "Signed destruction sheet", validator: 'Admin', complianceChapterTag: "Ch. 7.03" },
  { name: "Maintain updated current med order list", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Weekly', deliverables: "Clean list per resident", validator: 'QMAP Supervisor', complianceChapterTag: "Ch. 7.03" },
  { name: "Conduct MAR audit (all residents)", category: 'Medication Management & ECP Audits', responsibleRole: 'Nurse', frequency: 'Weekly', deliverables: "Compliance sheet, notes, resolution tracking", validator: 'Director', complianceChapterTag: "Ch. 7.03" },

  // Category: Resident Documentation & Clinical Care
  { name: "Update and store Resident Progress Reports", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Caregiver', 'Nurse'], frequency: 'Weekly', deliverables: "Weekly chart note", validator: 'Wellness Nurse' },
  { name: "Maintain updated Face Sheets", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Admin', frequency: 'Monthly', deliverables: "Printed or digital version", validator: 'Director' },
  { name: "Record Treatment History: Past and ongoing", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Nurse', frequency: 'Monthly', deliverables: "Chronological summary", validator: 'Wellness Nurse' },
  { name: "Document and log fall incidents", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Caregiver', frequency: 'As Needed', deliverables: "Fall log and corrective action", validator: 'Nurse' },
  { name: "Record lift assist events", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Housekeeping / Aide', frequency: 'As Needed', deliverables: "Lift assist log", validator: 'Caregiver' },
  { name: "Update Care Plan Reviews & Assessments", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Nurse', 'Director'], frequency: 'Quarterly', deliverables: "Updated digital care plan", validator: null },

  // Category: Compliance & Survey Prep Tasks
  { name: "Conduct ECP error resolution review", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Admin', 'Director'], frequency: 'Quarterly', deliverables: "List of resolved audit flags", validator: null, complianceChapterTag: "Ch. 2.15" },
  { name: "Perform QMAP passing rate audit", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'QMAP Supervisor', frequency: 'Monthly', deliverables: "Score sheet", validator: 'Director', complianceChapterTag: "Ch. 9.11" },
  { name: "Audit medication disposal logs", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Nurse', 'Maintenance'], frequency: 'Monthly', deliverables: "Disposal documentation", validator: 'Admin', complianceChapterTag: "Ch. 7.03" },
  { name: "Post & verify Resident Rights, House Rules, Emergency Plan", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Admin', frequency: 'Monthly', deliverables: "Photos & checklist", validator: 'Director', complianceChapterTag: "Ch. 24.1" },
  { name: "Prepare Survey Readiness Packet", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Admin', frequency: 'Quarterly', deliverables: "Binder or PDF", validator: 'Director' },
  { name: "Track policy & procedure manual reviews", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Director', frequency: 'Annually', deliverables: "Signed review sheet", validator: null },

  // Category: Smoking, Behavior, and Environment
  { name: "Log all resident smoking activity", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Housekeeping Supervisor', frequency: 'Daily', deliverables: "Time-stamped log", validator: 'Admin' },
  { name: "Audit compliance with smoking safety", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Admin', frequency: 'Weekly', deliverables: "Violation log", validator: 'Director' },
  { name: "Observe and document behavioral incidents", category: 'Smoking, Behavior, and Environment', responsibleRole: ['Caregiver', 'Nurse'], frequency: 'As Needed', deliverables: "Incident form", validator: 'Wellness Nurse' },
];

export const mockTasks: Task[] = specificTasksSeed.map((seed, i) => {
  const startDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
  const freqCycleDays = {
    'Daily': 1, 'Weekly': 7, 'Monthly': 30, 'Quarterly': 90, 'Mid Yearly': 182, 'Annually': 365, 'Bi-annually': 730, 'As Needed': 0
  };
  const cycleDays = freqCycleDays[seed.frequency] || 0;
  const endDate = cycleDays > 0 ? new Date(startDate.getTime() + (cycleDays * 24 * 60 * 60 * 1000)) : null;
  
  const status = getRandomElement(allResolutionStatuses);
  
  let assignedStaffMember: string;
  if (Array.isArray(seed.responsibleRole)) {
    // If multiple roles, pick a staff member from the first role in the array for assignment
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole[0]] || allStaffNames);
  } else {
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole] || allStaffNames);
  }

  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;

  if (status === 'Resolved') {
    lastCompletedOn = cycleDays > 0 
        ? getRandomDate(new Date(startDate.getTime() - cycleDays * 24 * 60 * 60 * 1000), startDate) 
        : getRandomDate(new Date(new Date().getTime() - 30 * 24*60*60*1000), new Date()); // For 'As Needed' tasks
    completedBy = assignedStaffMember;
  }
  
  const initialActivityTimestamp = new Date(startDate.getTime() - (Math.floor(Math.random() * 5) + 1) * 24 * 60 * 60 * 1000);

  return {
    id: `task_${i + 1}`,
    name: seed.name,
    category: seed.category,
    frequency: seed.frequency,
    responsibleRole: seed.responsibleRole,
    deliverables: seed.deliverables,
    validator: seed.validator || null,
    assignedStaff: assignedStaffMember,
    status,
    startDate,
    endDate,
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    progress: status === 'Resolved' ? 100 : (status === 'Pending' ? 0 : (status === 'Escalated' ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 80) + 10)),
    notes: `Task initialized. Last review was on ${new Date(startDate.getTime() - (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}. ${getRandomElement(['Ensure proper documentation.', 'Follow up with validator.', 'Report any deviations.',''])}`,
    activities: [
      { timestamp: initialActivityTimestamp > new Date() ? new Date() : initialActivityTimestamp, user: 'System', action: 'Task Generated', details: 'Task created based on compliance schedule.' },
      ...(status !== 'Pending' && startDate < new Date() ? [{ timestamp: startDate, user: assignedStaffMember, action: 'Task Actioned', details: `Task status set to ${status}.` }] : []),
      ...(status === 'Resolved' && lastCompletedOn ? [{ timestamp: lastCompletedOn, user: completedBy || assignedStaffMember, action: 'Task Resolved', details: 'Task marked as resolved.' }] : []),
    ],
    evidenceLink: Math.random() > 0.6 ? `https://docs.google.com/document/d/example_evidence_${i+1}` : undefined,
    lastCompletedOn,
    completedBy,
    validatorApproval: status === 'Resolved' && seed.validator && Math.random() > 0.4 ? `Approved by ${getRandomElement(allStaffNames.filter(s => s !== completedBy))}` : null,
    complianceChapterTag: seed.complianceChapterTag || getRandomElement(complianceChapterTagsPool.filter(Boolean) as string[]) || undefined,
  };
});


// Keeping existing mock data structures for other pages
const originalCategoriesForAudit: string[] = [
  'Health Protocols / Medications',
  'Food Safety',
  'Fire Safety',
  'Office Admin',
  'Documentation & Compliance',
  'Personnel File & Staff Training',
  'Postings & Required Notices',
  'Environmental & Sanitation Safety', 
  'Additional ALR-Required Tasks'
];
export const mockAuditCategories: AuditCategory[] = originalCategoriesForAudit.map((catName, index) => ({
  id: `auditcat_${index + 1}`,
  name: catName as TaskCategory | string, 
  items: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, j) => ({
    id: `audititem_${index + 1}_${j + 1}`,
    description: `${getRandomElement(['Verify', 'Ensure', 'Check for', 'Confirm'])} ${getRandomElement(['item A', 'procedure B', 'log C', 'documentation D'])} for ${catName}.`,
    compliant: Math.random() > 0.2 ? (Math.random() > 0.15 ? true : false) : null,
    notes: Math.random() > 0.5 ? getRandomElement(['All clear.', 'Minor observation.', 'Requires follow-up.']) : '',
    evidence: Math.random() > 0.7 ? 'link/to/evidence.pdf' : undefined,
  })),
}));

export const mockStaffResponsibilityMatrix = allMockRoles.map(role => ({
  role,
  responsibilities: mockTasks
    .filter(task => task.responsibleRole === role || (Array.isArray(task.responsibleRole) && task.responsibleRole.includes(role)))
    .slice(0, Math.floor(Math.random() * 3) + 2) 
    .map(task => ({ taskName: task.name, deliverables: task.deliverables, category: task.category })),
}));


// Mock Data for Staff Training Dashboard
export const allTrainingTypes: TrainingType[] = ['QMAP Training', 'TB Test', 'CPR Certification', 'Orientation'];
export const allTrainingStatuses: TrainingStatus[] = ['Compliant', 'Expiring Soon', 'Overdue', 'Pending Documentation'];

const generateTrainingDates = (): { completionDate?: Date | null, expiryDate?: Date | null, status: TrainingStatus } => {
  const today = new Date();
  const completionDate = Math.random() > 0.1 ? getRandomDate(new Date(today.getFullYear() - 2, 0, 1), today) : null;
  let expiryDate: Date | null = null;
  let status: TrainingStatus;

  if (!completionDate) {
    status = 'Pending Documentation';
  } else {
    const hasExpiry = Math.random() > 0.3; 
    if (hasExpiry) {
      expiryDate = new Date(completionDate.getFullYear() + getRandomElement([1, 2]), completionDate.getMonth(), completionDate.getDate());
      const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (daysUntilExpiry < 0) {
        status = 'Overdue';
      } else if (daysUntilExpiry <= 30) {
        status = 'Expiring Soon';
      } else {
        status = 'Compliant';
      }
    } else { 
      status = 'Compliant'; 
    }
  }
  return { completionDate, expiryDate, status };
};

const staffForTrainingRawNames = ['Olivia Chen', 'Michael Brown', 'Sophia Rodriguez', 'Ethan Miller', 'Isabella Wilson', 'Liam Garcia', 'Ava Davis', 'Noah Martinez'];


export const mockStaffTrainingData: StaffTrainingRecord[] = staffForTrainingRawNames.flatMap((staffName, staffIndex) => 
  allTrainingTypes.map((trainingType, trainingTypeIndex) => {
    const { completionDate, expiryDate, status } = generateTrainingDates();
    const assignedRole = allMockRoles[staffIndex % allMockRoles.length]; // Assign roles cyclically from the main list
    const staffMemberFullName = `${staffName} (${assignedRole})`; // Use full name with role for display if needed elsewhere
    
    return {
      id: `training_${staffIndex + 1}_${trainingTypeIndex + 1}`,
      staffMemberName: staffMemberFullName, // Store with role for consistency with other staff name usage
      staffRole: assignedRole,
      trainingType,
      completionDate,
      expiryDate,
      status: expiryDate ? status : (completionDate ? 'Compliant' : 'Pending Documentation'),
      documentationLink: Math.random() > 0.5 ? `https://docs.google.com/document/d/training_cert_${staffIndex+1}_${trainingTypeIndex+1}` : undefined,
      notes: Math.random() > 0.7 ? getRandomElement(['Attended refresher course.', 'Submitted via email.', 'To be updated next week.']) : undefined,
    };
  })
);
export const allMockStaffNames = allStaffNames; // Use the comprehensive list
export const allMockComplianceChapters = Array.from(new Set(mockTasks.map(t => t.complianceChapterTag).filter(Boolean).concat(complianceChapterTagsPool.filter(Boolean) as string[]))) as string[];
