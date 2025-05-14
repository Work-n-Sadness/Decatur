
import type { Task, TaskCategory, TaskFrequency, ResolutionStatus, Role, AuditCategory, AuditItem, StaffTrainingRecord, TrainingType, TrainingStatus, RecurrenceConfig, FacilityCertification, CertificationStatus, FacilityInstallation, InstallationStatus, InstallationFrequency } from '@/types';
import { addDays, startOfDay, getDay, getDate, subDays, subMonths, addMonths, endOfMonth } from 'date-fns';

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
  'Facility Operations & Services',
];

export const allTaskFrequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'As Needed', 'Annually', 'Bi-annually', 'Mid Yearly'];
export const allResolutionStatuses: ResolutionStatus[] = ['Pending', 'Resolved', 'Escalated', 'Complete', 'Flagged'];
export const allMockRoles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director', 'Wellness Nurse', 'Housekeeping Supervisor', 'QMAP Supervisor', 'Housekeeping / Aide'];

const staffNamesByRole: Record<Role, string[]> = {
    'Wellness Nurse': ['Alice Smith (Wellness Nurse)', 'Olivia Chen (Wellness Nurse)'],
    'QMAP Supervisor': ['Bob Johnson (QMAP Sup.)', 'Noah Martinez (QMAP Sup.)'],
    'Admin': ['Carol Williams (Admin)', 'Sophia Rodriguez (Admin)'],
    'Director': ['David Brown (Director)', 'Isabella Wilson (Director)'],
    'Nurse': ['Eve Davis (Nurse)', 'Grace Lee (Nurse)'],
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
  { name: "Perform Resident Room Safety Compliance Check", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Housekeeping Supervisor', frequency: 'Weekly', deliverables: "Room safety checklist", validator: 'Admin', complianceChapterTag: "Ch. 12.4" },
];

export const mockTasks: Task[] = specificTasksSeed.map((seed, i) => {
  const instanceStartDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
  const patternStartDate = new Date(instanceStartDate.getFullYear(), instanceStartDate.getMonth(), 1); // Example pattern start

  const freqCycleDaysMap: Record<TaskFrequency, number> = {
    'Daily': 1, 'Weekly': 7, 'Monthly': 30, 'Quarterly': 90,
    'Mid Yearly': 182, 'Annually': 365, 'Bi-annually': 730, 'As Needed': 0 // 'As Needed' has no fixed cycle
  };
  const cycleDays = freqCycleDaysMap[seed.frequency] || 0;

  // endDate for the instance (due date)
  let instanceEndDate: Date | null = null;
  if (cycleDays > 0) {
    instanceEndDate = addDays(startOfDay(instanceStartDate), cycleDays -1); // Task due by end of cycle
  } else if (seed.frequency === 'As Needed') {
    instanceEndDate = addDays(startOfDay(instanceStartDate), Math.floor(Math.random() * 7) + 1); // 'As Needed' might have a loose due date
  }


  const status = getRandomElement(allResolutionStatuses);

  let assignedStaffMember: string;
  if (Array.isArray(seed.responsibleRole)) {
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole[0]] || allStaffNames);
  } else {
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole] || allStaffNames);
  }

  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;

  if (status === 'Resolved') {
    lastCompletedOn = cycleDays > 0
        ? getRandomDate(addDays(instanceStartDate, -cycleDays), instanceStartDate)
        : getRandomDate(addDays(new Date(), -30), new Date());
    completedBy = assignedStaffMember;
  }

  const initialActivityTimestamp = addDays(instanceStartDate, -(Math.floor(Math.random() * 5) + 1));

  const recurrenceConfig: RecurrenceConfig = {
    frequency: seed.frequency,
    patternStartDate: patternStartDate,
    interval: 1, // Default interval
  };

  if (seed.frequency === 'Weekly') {
    recurrenceConfig.recurrenceDaysOfWeek = [getDay(instanceStartDate)]; // Assume it recurs on the same day of the week as this instance's start
  } else if (seed.frequency === 'Monthly') {
    recurrenceConfig.recurrenceDayOfMonth = getDate(instanceStartDate); // Assume it recurs on the same day of the month
  }


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
    startDate: instanceStartDate, // This instance's start/due window
    endDate: instanceEndDate,   // This instance's due date
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    progress: status === 'Resolved' ? 100 : (status === 'Pending' ? 0 : (status === 'Escalated' ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 80) + 10)),
    notes: `Task instance for ${instanceStartDate.toLocaleDateString()}. ${getRandomElement(['Ensure proper documentation.', 'Follow up with validator.', 'Report any deviations.',''])}`,
    activities: [
      { timestamp: initialActivityTimestamp > new Date() ? new Date() : initialActivityTimestamp, user: 'System', action: 'Task Instance Generated', details: 'Task instance created based on recurrence pattern.' },
      ...(status !== 'Pending' && instanceStartDate < new Date() ? [{ timestamp: instanceStartDate, user: assignedStaffMember, action: 'Task Actioned', details: `Task status set to ${status}.` }] : []),
      ...(status === 'Resolved' && lastCompletedOn ? [{ timestamp: lastCompletedOn, user: completedBy || assignedStaffMember, action: 'Task Resolved', details: 'Task marked as resolved.' }] : []),
    ],
    evidenceLink: Math.random() > 0.6 ? `https://docs.google.com/document/d/example_evidence_${i+1}` : undefined,
    lastCompletedOn,
    completedBy,
    validatorApproval: status === 'Resolved' && seed.validator && Math.random() > 0.4 ? `Approved by ${getRandomElement(allStaffNames.filter(s => s !== completedBy))}` : null,
    complianceChapterTag: seed.complianceChapterTag || getRandomElement(complianceChapterTagsPool.filter(Boolean) as string[]) || undefined,
    recurrenceConfig: recurrenceConfig,
  };
});


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
    const assignedRole = allMockRoles[staffIndex % allMockRoles.length];
    const staffMemberFullName = `${staffName} (${assignedRole})`;

    return {
      id: `training_${staffIndex + 1}_${trainingTypeIndex + 1}`,
      staffMemberName: staffMemberFullName,
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
export const allMockStaffNames = allStaffNames;
export const allMockComplianceChapters = Array.from(new Set(mockTasks.map(t => t.complianceChapterTag).filter(Boolean).concat(complianceChapterTagsPool.filter(Boolean) as string[]))) as string[];

export const amenities: string[] = [
  "In-house doctor visit",
  "On-call physician or Registered Nurse",
  "Home cooked meals",
  "Bathing, grooming, dressing, hygiene assistance",
  "Laundry, housekeeping, linen services",
  "Daily activities, games, movie days",
  "Transportation and appointment assistance",
  "Respite services",
  "Medication administration & monitoring",
  "Hair & nail care on call",
  "State-licensed facility",
  "Private & semi-private rooms",
  "Wheelchair accessible",
  "Fire sprinkler system"
];


// Mock Data for Facility Certifications
const certificationStatuses: CertificationStatus[] = ['Active', 'Expired', 'Due Soon'];
const mockCertifyingAgencies = ['State Health Dept.', 'City Fire Marshal', 'CDPHE', 'EPA', 'County Public Health', 'Boiler Safety Division', 'HVAC Licensing Board'];
const now = new Date();

export const mockCertifications: FacilityCertification[] = [
  { id: 'cert1', certificationName: 'State Assisted Living License', certifyingAgency: 'State Health Dept.', issueDate: new Date(2023, 0, 15), expirationDate: new Date(2025, 0, 14), status: 'Active', certificateUpload: 'https://example.com/license.pdf', lastReviewedBy: 'Admin', notes: 'Annual renewal completed.', createdAt: subMonths(now, 6), updatedAt: subMonths(now, 1) },
  { id: 'cert2', certificationName: 'Fire Department Inspection Report', certifyingAgency: 'City Fire Marshal', issueDate: new Date(2024, 5, 10), expirationDate: new Date(2025, 5, 9), status: 'Due Soon', lastReviewedBy: 'Director', createdAt: subMonths(now, 3), updatedAt: subMonths(now, 0) },
  { id: 'cert3', certificationName: 'CDPHE Certification', certifyingAgency: 'CDPHE', issueDate: new Date(2022, 8, 1), expirationDate: new Date(2024, 7, 31), status: 'Expired', certificateUpload: 'https://example.com/cdphe.pdf', lastReviewedBy: 'Admin', notes: 'Renewal application pending.', createdAt: subMonths(now, 12), updatedAt: subMonths(now, 2) },
  { id: 'cert4', certificationName: 'Kitchen/Public Health Inspection', certifyingAgency: 'County Public Health', issueDate: new Date(2024, 2, 20), expirationDate: new Date(2025, 2, 19), status: 'Active', createdAt: subMonths(now, 4), updatedAt: subMonths(now, 1) },
  { id: 'cert5', certificationName: 'Boiler Inspection Certificate', certifyingAgency: 'Boiler Safety Division', issueDate: new Date(2023, 10, 5), expirationDate: new Date(2024, 10, 4), status: 'Active', certificateUpload: 'https://example.com/boiler.pdf', createdAt: subMonths(now, 8), updatedAt: subMonths(now, 3) },
  { id: 'cert6', certificationName: 'HVAC Compliance Document', certifyingAgency: 'HVAC Licensing Board', issueDate: new Date(2024, 0, 30), expirationDate: new Date(2026, 0, 29), status: 'Active', createdAt: subMonths(now, 5), updatedAt: subMonths(now, 0) },
  { id: 'cert7', certificationName: 'Building Occupancy Permit', certifyingAgency: 'City Planning Dept.', issueDate: new Date(2010, 6, 1), expirationDate: addMonths(new Date(2010, 6, 1), 600), status: 'Active', notes: 'Long-term permit.', createdAt: subMonths(now, 24), updatedAt: subMonths(now, 12) },
];

// Mock Data for Facility Installations
const installationStatuses: InstallationStatus[] = ['Operational', 'Needs Repair', 'Out of Service'];
const installationCategories: FacilityInstallation['category'][] = ['Fire Safety', 'HVAC', 'Water Systems', 'Electrical', 'Accessibility', 'Sanitation', 'Gas Systems', 'Air Quality', 'General Safety'];
const installationFrequencies: InstallationFrequency[] = ['Annually', 'Semi-Annually', 'Quarterly', 'Monthly Test, Semi-Annual Service', 'Daily Check'];


export const mockInstallations: FacilityInstallation[] = [
  { id: 'inst1', installationName: 'Main Fire Alarm Panel', category: 'Fire Safety', location: 'Lobby', lastInspectionDate: new Date(2024, 3, 10), nextInspectionDue: new Date(2025, 3, 10), inspectionFrequency: 'Annually', serviceVendor: 'SafeGuard Systems', status: 'Operational', uploadInspectionLog: 'https://example.com/firealarm.pdf', createdAt: subMonths(now, 7), updatedAt: subMonths(now, 1) },
  { id: 'inst2', installationName: 'Sprinkler System - Zone A', category: 'Fire Safety', location: 'North Wing', lastInspectionDate: new Date(2024, 0, 15), nextInspectionDue: new Date(2024, 6, 15), inspectionFrequency: 'Semi-Annually', serviceVendor: 'AquaSafe Sprinklers', status: 'Operational', createdAt: subMonths(now, 9), updatedAt: subMonths(now, 2) },
  { id: 'inst3', installationName: 'Central HVAC Unit 1', category: 'HVAC', location: 'Roof', lastInspectionDate: new Date(2023, 11, 5), nextInspectionDue: new Date(2024, 5, 5), inspectionFrequency: 'Quarterly', serviceVendor: 'CoolAir Inc.', status: 'Needs Repair', notes: 'Filter change overdue, slight noise.', createdAt: subMonths(now, 10), updatedAt: subMonths(now, 0) },
  { id: 'inst4', installationName: 'Main Water Heater', category: 'Water Systems', location: 'Utility Room', lastInspectionDate: new Date(2024, 1, 20), nextInspectionDue: new Date(2025, 1, 20), inspectionFrequency: 'Annually', serviceVendor: 'ProPlumb', status: 'Operational', createdAt: subMonths(now, 6), updatedAt: subMonths(now, 3) },
  { id: 'inst5', installationName: 'Backup Generator', category: 'Electrical', location: 'Exterior Shed', lastInspectionDate: new Date(2024, 4, 1), nextInspectionDue: new Date(2024, 10, 1), inspectionFrequency: 'Monthly Test, Semi-Annual Service', serviceVendor: 'PowerGen Solutions', status: 'Operational', uploadInspectionLog: 'https://example.com/generator.pdf', createdAt: subMonths(now, 5), updatedAt: subMonths(now, 0) },
  { id: 'inst6', installationName: 'Fire Extinguisher - Lobby', category: 'Fire Safety', location: 'Lobby Near Entrance', lastInspectionDate: new Date(2024, 2, 5), nextInspectionDue: new Date(2025, 2, 5), inspectionFrequency: 'Annually', serviceVendor: 'In-house Maintenance', status: 'Operational', createdAt: subMonths(now, 8), updatedAt: subMonths(now, 1) },
  { id: 'inst7', installationName: 'Sanitation Station - Dining Hall', category: 'Sanitation', location: 'Dining Hall Entrance', lastInspectionDate: null, nextInspectionDue: null, inspectionFrequency: 'Daily Check', serviceVendor: 'In-house Staff', status: 'Operational', notes: 'Refilled daily.', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 0) },
  { id: 'inst8', installationName: 'Kitchen Gas Range', category: 'Gas Systems', location: 'Kitchen', lastInspectionDate: new Date(2023, 9, 15), nextInspectionDue: new Date(2024, 9, 15), inspectionFrequency: 'Annually', serviceVendor: 'GasSafe Co.', status: 'Operational', createdAt: subMonths(now, 11), updatedAt: subMonths(now, 4)},
  { id: 'inst9', installationName: 'Air Purifier Unit - Common Area', category: 'Air Quality', location: 'Main Common Area', lastInspectionDate: new Date(2024, 4, 10), nextInspectionDue: addMonths(new Date(2024, 4, 10), 3), inspectionFrequency: 'Quarterly', serviceVendor: 'In-house Maintenance', status: 'Operational', createdAt: subMonths(now, 4), updatedAt: subMonths(now, 0)},
];
