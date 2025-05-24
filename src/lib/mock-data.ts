
import type { Task, TaskCategory, TaskFrequency, ResolutionStatus, AppRole, AuditToolCategory, AuditRecord, AuditStatus, StaffTrainingRecord, TrainingType, TrainingStatus, RecurrenceConfig, FacilityCertification, CertificationStatus, FacilityInstallation, InstallationStatus, InstallationFrequency, ResidentCareFlag, ChecklistItem, StaffResponsibilityMatrixEntry, RecurringTaskSeed } from '@/types';
import { addDays, startOfDay, getDay, getDate, subDays, subMonths, addMonths, endOfMonth, subYears } from 'date-fns';

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

export const allAppRoles: AppRole[] = [
  'Director (Owner)',
  'Assistant Director',
  'Administrator Designee',
  'Admin Assistant',
  'Caregiver',
  'RN (External)',
  'Doctor (Consultant)',
  'Nurse', // Generic internal nurse if needed
  'Maintenance',
  'Wellness Nurse',
  'Housekeeping Supervisor',
  'QMAP Supervisor',
];


const staffNamesByRole: Record<AppRole, string[]> = {
    'Director (Owner)': ['Alex Johnson (Director)'],
    'Assistant Director': ['Brenda Smith (Asst. Director)'],
    'Administrator Designee': ['Carlos Ray (Admin Designee)'],
    'Admin Assistant': ['Diana Prince (Admin Asst.)'], // Part-time, also Caregiver support
    'Caregiver': [
        'Evan Wright (Caregiver/QMAP)',
        'Fiona Green (Caregiver/QMAP)',
        'George Hill (Caregiver/QMAP)',
        'Hannah Scott (Caregiver/QMAP)',
        'Ian King (Caregiver/QMAP)',
    ],
    'RN (External)': ['Nurse Jackie (RN Consultant)'],
    'Doctor (Consultant)': ['Dr. Who (MD Consultant)'],
    // Broader roles for tasks not assigned to the core 9
    'Nurse': ['General Nurse (Pool)'],
    'Maintenance': ['Maintenance Mike (Contractor)'],
    'Wellness Nurse': ['Wendy Bloom (Wellness Coord.)'], // Could be one of the specific roles or another person
    'Housekeeping Supervisor': ['Harry Clean (Housekeeping Lead)'], // Might be Admin Designee or a lead Caregiver
    'QMAP Supervisor': ['Carlos Ray (Admin Designee)'], // Often overlaps with Admin Designee or Director
    // Seed roles - map them to new roles or keep if used by old data
    'kitchen_supervisor_id': ['George Hill (Caregiver/QMAP)'], // Example mapping
    'clinical_director_id': ['Alex Johnson (Director)'],
    'housekeeping_lead_id': ['Harry Clean (Housekeeping Lead)'],
    'safety_officer_id': ['Carlos Ray (Admin Designee)'],
    'maintenance_id': ['Maintenance Mike (Contractor)'],
};

export const allMockStaffNames: string[] = Array.from(new Set(Object.values(staffNamesByRole).flat()));


const complianceChapterTagsPool = ["Ch. 2.15", "Ch. 7.03", "Ch. 14.31", "Ch. 9.11", "Ch. 22.01", "Ch. 14.3", "Ch. 24.1", "Ch. 12.4", "Ch. 24.3", "Ch. 12.6", null];

export const allCareFlags: ResidentCareFlag[] = [
  'wheelchair', 'walker', 'controlled_meds', 'hypertension', 'diabetes', 'dementia',
  'fall_risk_low', 'fall_risk_medium', 'fall_risk_high', 'elopement_risk_yes', 'elopement_risk_no'
];

const getRandomCareFlags = (): ResidentCareFlag[] => {
  const flags: ResidentCareFlag[] = [];
  if (Math.random() < 0.2) flags.push('wheelchair');
  else if (Math.random() < 0.2) flags.push('walker');

  if (Math.random() < 0.15) flags.push('controlled_meds');
  if (Math.random() < 0.3) flags.push('hypertension');
  if (Math.random() < 0.25) flags.push('diabetes');
  if (Math.random() < 0.2) flags.push('dementia');

  const fallRiskRoll = Math.random();
  if (fallRiskRoll < 0.1) flags.push('fall_risk_high');
  else if (fallRiskRoll < 0.25) flags.push('fall_risk_medium');
  else flags.push('fall_risk_low');

  if (Math.random() < 0.1) flags.push('elopement_risk_yes');
  else flags.push('elopement_risk_no');

  return Array.from(new Set(flags));
};


interface SeedTask {
  name: string;
  category: TaskCategory;
  responsibleRole: AppRole | AppRole[];
  frequency: TaskFrequency;
  deliverables: string;
  validator?: AppRole | null;
  complianceChapterTag?: string | null;
}

const specificTasksSeed: SeedTask[] = [
  { name: "Review and reconcile all new Med Orders in ECP", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Daily', deliverables: "Verified MAR entries and scanned orders", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Flag and resolve discontinued meds in ECP", category: 'Medication Management & ECP Audits', responsibleRole: 'QMAP Supervisor', frequency: 'Daily', deliverables: "Discontinued log and removal confirmation", validator: 'Wellness Nurse', complianceChapterTag: "Ch. 7.03" },
  { name: "Audit low stock / restock medication logs", category: 'Medication Management & ECP Audits', responsibleRole: ['Admin Assistant', 'Nurse'], frequency: 'Weekly', deliverables: "Reorder requests and stock checklists", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform ECP chart review audit for MAR accuracy and cross-check", category: 'Medication Management & ECP Audits', responsibleRole: 'Director (Owner)', frequency: 'Weekly', deliverables: "Audit checklist + notes", validator: null, complianceChapterTag: "Ch. 7.03" },
  { name: "Investigate and log medication errors", category: 'Medication Management & ECP Audits', responsibleRole: 'QMAP Supervisor', frequency: 'As Needed', deliverables: "Error investigation form", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform 2-person narcotics destruction & documentation", category: 'Medication Management & ECP Audits', responsibleRole: ['Director (Owner)', 'Nurse'], frequency: 'As Needed', deliverables: "Signed destruction sheet", validator: 'Administrator Designee', complianceChapterTag: "Ch. 7.03" },
  { name: "Maintain updated current med order list", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Weekly', deliverables: "Clean list per resident", validator: 'QMAP Supervisor', complianceChapterTag: "Ch. 7.03" },
  { name: "Conduct MAR audit (all residents)", category: 'Medication Management & ECP Audits', responsibleRole: 'Nurse', frequency: 'Weekly', deliverables: "Compliance sheet, notes, resolution tracking", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Update and store Resident Progress Reports", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Caregiver', 'Nurse'], frequency: 'Weekly', deliverables: "Weekly chart note", validator: 'Wellness Nurse' },
  { name: "Maintain updated Face Sheets", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Admin Assistant', frequency: 'Monthly', deliverables: "Printed or digital version", validator: 'Administrator Designee' },
  { name: "Record Treatment History: Past and ongoing", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Nurse', frequency: 'Monthly', deliverables: "Chronological summary", validator: 'Wellness Nurse' },
  { name: "Document and log fall incidents", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Caregiver', frequency: 'As Needed', deliverables: "Fall log and corrective action", validator: 'Nurse' },
  { name: "Record lift assist events", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Caregiver', frequency: 'As Needed', deliverables: "Lift assist log", validator: 'Nurse' },
  { name: "Update Care Plan Reviews & Assessments", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Nurse', 'Director (Owner)'], frequency: 'Quarterly', deliverables: "Updated digital care plan", validator: null },
  { name: "Conduct ECP error resolution review", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Administrator Designee', 'Director (Owner)'], frequency: 'Quarterly', deliverables: "List of resolved audit flags", validator: null, complianceChapterTag: "Ch. 2.15" },
  { name: "Perform QMAP passing rate audit", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'QMAP Supervisor', frequency: 'Monthly', deliverables: "Score sheet", validator: 'Director (Owner)', complianceChapterTag: "Ch. 9.11" },
  { name: "Audit medication disposal logs", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Nurse', 'Maintenance'], frequency: 'Monthly', deliverables: "Disposal documentation", validator: 'Administrator Designee', complianceChapterTag: "Ch. 7.03" },
  { name: "Post & verify Resident Rights, House Rules, Emergency Plan", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Admin Assistant', frequency: 'Monthly', deliverables: "Photos & checklist", validator: 'Administrator Designee', complianceChapterTag: "Ch. 24.1" },
  { name: "Prepare Survey Readiness Packet", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Administrator Designee', frequency: 'Quarterly', deliverables: "Binder or PDF", validator: 'Director (Owner)' },
  { name: "Track policy & procedure manual reviews", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Director (Owner)', frequency: 'Annually', deliverables: "Signed review sheet", validator: null },
  { name: "Log all resident smoking activity", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Caregiver', frequency: 'Daily', deliverables: "Time-stamped log", validator: 'Administrator Designee' },
  { name: "Audit compliance with smoking safety in designated backyard area", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Administrator Designee', frequency: 'Weekly', deliverables: "Violation log and supervision verification", validator: 'Director (Owner)' },
  { name: "Observe and document behavioral incidents", category: 'Smoking, Behavior, and Environment', responsibleRole: ['Caregiver', 'Nurse'], frequency: 'As Needed', deliverables: "Incident form", validator: 'Wellness Nurse' },
  { name: "Perform Resident Room Safety Compliance Check", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Caregiver', frequency: 'Weekly', deliverables: "Room safety checklist", validator: 'Administrator Designee', complianceChapterTag: "Ch. 12.4" },
];

export const mockTasks: Task[] = specificTasksSeed.map((seed, i) => {
  const instanceStartDate = getRandomDate(new Date(2024, 9, 1), new Date(2025, 4, 13)); // Q4 2024 to May 2025
  const patternStartDate = new Date(instanceStartDate.getFullYear(), instanceStartDate.getMonth(), 1);

  const freqCycleDaysMap: Record<TaskFrequency, number> = {
    'Daily': 1, 'Weekly': 7, 'Monthly': 30, 'Quarterly': 90,
    'Mid Yearly': 182, 'Annually': 365, 'Bi-annually': 730, 'As Needed': 0
  };
  const cycleDays = freqCycleDaysMap[seed.frequency] || 0;
  let instanceEndDate: Date | null = cycleDays > 0 ? addDays(startOfDay(instanceStartDate), cycleDays -1) : (seed.frequency === 'As Needed' ? addDays(startOfDay(instanceStartDate), Math.floor(Math.random() * 7) + 1) : null);

  const status = getRandomElement(allResolutionStatuses);
  let assignedStaffMember: string;
  let assignedStaffMemberId: string = `staff_user_${i % 9 + 1}`; // Mock 9 staff IDs

  if (Array.isArray(seed.responsibleRole)) {
    const role1 = seed.responsibleRole[0];
    assignedStaffMember = getRandomElement(staffNamesByRole[role1] || allMockStaffNames);
  } else {
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole] || allMockStaffNames);
  }

  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;
  if (status === 'Resolved' || status === 'Complete') {
    lastCompletedOn = cycleDays > 0 ? getRandomDate(addDays(instanceStartDate, -cycleDays), instanceStartDate) : getRandomDate(addDays(new Date(), -30), new Date());
    if (lastCompletedOn > instanceStartDate) lastCompletedOn = instanceStartDate; // Ensure it's not after start
    completedBy = assignedStaffMember;
  }

  const initialActivityTimestamp = subDays(instanceStartDate, Math.floor(Math.random() * 5) + 1);

  const recurrenceConfig: RecurrenceConfig = {
    frequency: seed.frequency, patternStartDate, interval: 1,
    ...(seed.frequency === 'Weekly' && { recurrenceDaysOfWeek: [getDay(instanceStartDate)] }),
    ...(seed.frequency === 'Monthly' && { recurrenceDayOfMonth: getDate(instanceStartDate) }),
  };

  const careFlags = getRandomCareFlags();
  const hasHipaaNotes = Math.random() < 0.1;

  return {
    id: `task_${i + 1}`,
    name: seed.name, category: seed.category, frequency: seed.frequency,
    responsibleRole: seed.responsibleRole, validator: seed.validator || null,
    assignedStaff: assignedStaffMember, assignedStaffId: assignedStaffMemberId,
    status,
    startDate: instanceStartDate, endDate: instanceEndDate,
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    progress: status === 'Resolved' || status === 'Complete' ? 100 : (status === 'Pending' ? 0 : (status === 'Escalated' ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 80) + 10)),
    deliverables: seed.deliverables,
    notes: `Task instance for ${instanceStartDate.toLocaleDateString()}. ${getRandomElement(['Ensure proper documentation.', 'Follow up with validator.', 'Report any deviations.',''])}`,
    activities: [
      { timestamp: initialActivityTimestamp > new Date() ? new Date() : initialActivityTimestamp, user: 'System', action: 'Task Instance Generated', details: 'Task instance created based on recurrence pattern.' },
      ...(status !== 'Pending' && instanceStartDate < new Date() ? [{ timestamp: instanceStartDate, user: assignedStaffMember, action: 'Task Actioned', details: `Task status set to ${status}.` }] : []),
      ...((status === 'Resolved' || status === 'Complete') && lastCompletedOn ? [{ timestamp: lastCompletedOn, user: completedBy || assignedStaffMember, action: 'Task Resolved/Completed', details: `Task marked as ${status}.` }] : []),
    ],
    evidenceLink: Math.random() > 0.6 ? `https://example.com/evidence_${i+1}.pdf` : undefined,
    lastCompletedOn, completedBy,
    validatorApproval: (status === 'Resolved' || status === 'Complete') && seed.validator && Math.random() > 0.4 ? `Approved by ${getRandomElement(allMockStaffNames.filter(s => s !== completedBy))}` : null,
    complianceChapterTag: seed.complianceChapterTag || getRandomElement(complianceChapterTagsPool.filter(Boolean) as string[]) || undefined,
    recurrenceConfig, residentCareFlags: careFlags,
    conditionNotes: Math.random() < 0.3 ? `Resident has noted conditions related to ${careFlags.join(', ')}.` : undefined,
    hipaaProtectedNotes: hasHipaaNotes ? `[HIPAA Protected] Detailed clinical notes for ${assignedStaffMember}.` : undefined,
  };
});

export const mockChecklistItems: ChecklistItem[] = mockTasks.map(task => ({
  id: `chk_${task.id}`,
  taskName: task.name,
  assignedStaff: task.assignedStaff,
  assignedStaffId: task.assignedStaffId,
  validator: typeof task.validator === 'string' ? task.validator : null, // Handle AppRole type for validator
  dueDate: task.endDate || task.startDate, // Use endDate if available, else startDate
  status: task.status === 'Complete' || task.status === 'Resolved' ? 'Complete' : (task.status === 'Flagged' ? 'Flagged' : 'Pending'),
  createdAt: task.startDate,
  statusUpdatedAt: task.lastCompletedOn || task.activities.slice(-1)[0]?.timestamp || task.startDate,
  taskId: task.id,
  notes: task.notes,
  evidenceLink: task.evidenceLink,
  lastCompletedOn: task.lastCompletedOn,
  completedBy: task.completedBy,
  category: task.category,
  backfilled: Math.random() < 0.5,
}));


export const allAuditCategories: AuditToolCategory[] = [
  'Health Protocols / Medications',
  'Food Safety',
  'Fire Safety',
  'Office Admin',
  'Documentation & Compliance',
  'Personnel File & Staff Training',
  'Postings & Required Notices',
  'Environmental & Sanitation Safety',
  'General ALR Compliance'
];
export const allAuditStatuses: AuditStatus[] = ['Pending Review', 'In Progress', 'Action Required', 'Compliant', 'Non-Compliant', 'Resolved'];


export const mockAuditRecords: AuditRecord[] = Array.from({ length: 25 }, (_, i) => {
  const category = getRandomElement(allAuditCategories);
  const assignedRole = getRandomElement(allAppRoles);
  const status = getRandomElement(allAuditStatuses);
  const lastCompleted = status === 'Compliant' || status === 'Resolved' ? getRandomDate(subMonths(new Date(), 6), new Date()) : undefined;
  const createdAt = getRandomDate(subYears(new Date(), 1), new Date());
  const updatedAt = lastCompleted || createdAt;

  return {
    id: `audit_${i + 1}`,
    name: `${category} Audit - Item ${i + 1}`,
    category,
    assignedRole,
    validator: getRandomElement(allAppRoles.filter(r => r !== assignedRole && (r === 'Director (Owner)' || r === 'Administrator Designee'))),
    lastCompletedDate: lastCompleted,
    status,
    evidenceLink: Math.random() > 0.6 ? `https://example.com/audit_evidence_${i+1}.pdf` : undefined,
    chapterReferenceTag: getRandomElement(complianceChapterTagsPool.filter(Boolean) as string[]) || undefined,
    notes: status === 'Action Required' || status === 'Non-Compliant' ? `Follow up required for item ${i+1}. Specific issue: ${getRandomElement(['Documentation missing', 'Procedure not followed', 'Equipment out of spec'])}.` : (Math.random() > 0.5 ? 'All good.' : undefined),
    createdAt,
    updatedAt,
  };
});


export const mockStaffResponsibilityMatrix: StaffResponsibilityMatrixEntry[] = allAppRoles.map(role => ({
  role,
  responsibilities: specificTasksSeed
    .filter(task => task.responsibleRole === role || (Array.isArray(task.responsibleRole) && task.responsibleRole.includes(role)))
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map(task => ({ taskName: task.name, deliverables: task.deliverables, category: task.category })),
})).filter(entry => entry.responsibilities.length > 0);


export const allTrainingTypes: TrainingType[] = ['QMAP Training', 'TB Test', 'CPR Certification', 'Orientation'];
export const allTrainingStatuses: TrainingStatus[] = ['Compliant', 'Expiring Soon', 'Overdue', 'Pending Documentation'];

export const mockStaffTrainingData: StaffTrainingRecord[] = allMockStaffNames.flatMap((staffName, staffIndex) =>
  allTrainingTypes.map((trainingType, trainingTypeIndex) => {
    const completionDate = Math.random() > 0.1 ? getRandomDate(new Date(2022, 0, 1), new Date(2025, 4, 1)) : null;
    let expiryDate: Date | null = null;
    let status: TrainingStatus;
    const today = new Date(2025, 4, 13); // Static "today" for consistency

    if (!completionDate) {
      status = 'Pending Documentation';
    } else {
      const hasExpiry = trainingType !== 'Orientation'; // Orientation typically doesn't expire
      if (hasExpiry) {
        expiryDate = addYears(completionDate, trainingType === 'TB Test' ? 1 : 2); // TB Test 1 year, others 2 years
        const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        if (daysUntilExpiry < 0) status = 'Overdue';
        else if (daysUntilExpiry <= 60) status = 'Expiring Soon'; // 60 days warning
        else status = 'Compliant';
      } else {
        status = 'Compliant';
      }
    }
    const staffRole = allAppRoles.find(role => staffNamesByRole[role]?.includes(staffName)) || 'Caregiver';
    const createdAt = completionDate ? subDays(completionDate, Math.floor(Math.random() * 30) + 1) : subDays(today, Math.floor(Math.random() * 90) + 1);
    const updatedAt = status === 'Compliant' && completionDate ? completionDate : today;


    return {
      id: `training_${staffName.replace(/[^a-zA-Z0-9]/g, '')}_${trainingTypeIndex + 1}`,
      staffMemberName: staffName,
      staffRole, trainingType, completionDate, expiryDate, status,
      documentationLink: Math.random() > 0.5 ? `https://example.com/certs/${staffName.split(' ')[0]}_${trainingType.replace(' ', '')}.pdf` : undefined,
      notes: Math.random() > 0.7 ? getRandomElement(['Attended refresher course.', 'Submitted via email.', 'To be updated next week.']) : undefined,
      createdAt,
      updatedAt,
    };
  })
);

export const allMockComplianceChapters = Array.from(new Set(mockTasks.map(t => t.complianceChapterTag).filter(Boolean).concat(complianceChapterTagsPool.filter(Boolean) as string[]))) as string[];

export const amenities: string[] = [
  "In-house doctor visit", "On-call physician or Registered Nurse", "Home cooked meals",
  "Bathing, grooming, dressing, hygiene assistance", "Laundry, housekeeping, linen services",
  "Daily activities, games, movie days", "Transportation and appointment assistance",
  "Respite services", "Medication administration & monitoring", "Hair & nail care on call",
  "State-licensed facility", "Private & semi-private rooms", "Wheelchair accessible",
  "Fire sprinkler system"
];

const now = new Date(2025, 4, 13); // Static "today" for consistency
export const mockCertifications: FacilityCertification[] = [
  { id: 'cert1', certificationName: 'State Assisted Living License', certifyingAgency: 'State Health Dept.', issueDate: new Date(2024, 0, 15), expirationDate: new Date(2026, 0, 14), status: 'Active', certificateUpload: 'https://example.com/license.pdf', lastReviewedBy: 'Alex Johnson (Director)', notes: 'Annual renewal completed.', createdAt: subMonths(now, 16), updatedAt: subMonths(now, 4) },
  { id: 'cert2', certificationName: 'Fire Department Inspection Report', certifyingAgency: 'City Fire Marshal', issueDate: new Date(2024, 11, 10), expirationDate: new Date(2025, 11, 9), status: 'Active', lastReviewedBy: 'Alex Johnson (Director)', createdAt: subMonths(now, 5), updatedAt: subMonths(now, 0) },
  { id: 'cert3', certificationName: 'CDPHE Certification', certifyingAgency: 'CDPHE', issueDate: new Date(2023, 8, 1), expirationDate: new Date(2025, 5, 1), status: 'Due Soon', certificateUpload: 'https://example.com/cdphe.pdf', lastReviewedBy: 'Diana Prince (Admin Asst.)', notes: 'Renewal application due soon.', createdAt: subMonths(now, 20), updatedAt: subMonths(now, 1) },
  { id: 'cert4', certificationName: 'Kitchen/Public Health Inspection', certifyingAgency: 'County Public Health', issueDate: new Date(2025, 2, 20), expirationDate: new Date(2026, 2, 19), status: 'Active', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 1) },
  { id: 'cert5', certificationName: 'Boiler Inspection Certificate', certifyingAgency: 'Boiler Safety Division', issueDate: new Date(2024, 10, 5), expirationDate: new Date(2025, 10, 4), status: 'Active', certificateUpload: 'https://example.com/boiler.pdf', createdAt: subMonths(now, 6), updatedAt: subMonths(now, 3) },
  { id: 'cert6', certificationName: 'HVAC Compliance Document', certifyingAgency: 'HVAC Licensing Board', issueDate: new Date(2025, 0, 30), expirationDate: new Date(2027, 0, 29), status: 'Active', createdAt: subMonths(now, 4), updatedAt: subMonths(now, 0) },
  { id: 'cert7', certificationName: 'Building Occupancy Permit', certifyingAgency: 'City Planning Dept.', issueDate: new Date(2020, 6, 1), expirationDate: addYears(new Date(2020, 6, 1), 10), status: 'Active', notes: 'Long-term permit.', createdAt: subYears(now, 5), updatedAt: subYears(now, 1) },
  { id: 'cert8', certificationName: 'EPA Environmental Compliance', certifyingAgency: 'EPA', issueDate: new Date(2024, 7, 1), expirationDate: new Date(2025, 4, 10), status: 'Expired', notes: 'Expired 3 days ago. URGENT.', createdAt: subMonths(now, 9), updatedAt: subMonths(now, 0)},
];

export const mockInstallations: FacilityInstallation[] = [
  { id: 'inst1', installationName: 'Main Fire Alarm Panel', category: 'Fire Safety', location: 'Lobby', lastInspectionDate: new Date(2025, 3, 10), nextInspectionDue: new Date(2026, 3, 10), inspectionFrequency: 'Annually', serviceVendor: 'SafeGuard Systems', status: 'Operational', uploadInspectionLog: 'https://example.com/firealarm.pdf', createdAt: subMonths(now, 1), updatedAt: subMonths(now, 0) },
  { id: 'inst2', installationName: 'Sprinkler System - Zone A', category: 'Fire Safety', location: 'North Wing', lastInspectionDate: new Date(2025, 0, 15), nextInspectionDue: new Date(2025, 6, 15), inspectionFrequency: 'Semi-Annually', serviceVendor: 'AquaSafe Sprinklers', status: 'Operational', createdAt: subMonths(now, 4), updatedAt: subMonths(now, 1) },
  { id: 'inst3', installationName: 'Central HVAC Unit 1', category: 'HVAC', location: 'Roof', lastInspectionDate: new Date(2024, 11, 5), nextInspectionDue: new Date(2025, 5, 5), inspectionFrequency: 'Quarterly', serviceVendor: 'CoolAir Inc.', status: 'Needs Repair', notes: 'Filter change due, slight noise.', createdAt: subMonths(now, 6), updatedAt: subMonths(now, 0) },
  { id: 'inst4', installationName: 'Main Water Heater', category: 'Water Systems', location: 'Utility Room', lastInspectionDate: new Date(2025, 1, 20), nextInspectionDue: new Date(2026, 1, 20), inspectionFrequency: 'Annually', serviceVendor: 'ProPlumb', status: 'Operational', createdAt: subMonths(now, 3), updatedAt: subMonths(now, 1) },
  { id: 'inst5', installationName: 'Backup Generator', category: 'Electrical', location: 'Exterior Shed', lastInspectionDate: new Date(2025, 4, 1), nextInspectionDue: new Date(2025, 10, 1), inspectionFrequency: 'Monthly Test, Semi-Annual Service', serviceVendor: 'PowerGen Solutions', status: 'Operational', uploadInspectionLog: 'https://example.com/generator.pdf', createdAt: subMonths(now, 0), updatedAt: subMonths(now, 0) },
  { id: 'inst6', installationName: 'Fire Extinguisher - Lobby', category: 'Fire Safety', location: 'Lobby Near Entrance', lastInspectionDate: new Date(2025, 2, 5), nextInspectionDue: new Date(2026, 2, 5), inspectionFrequency: 'Annually', serviceVendor: 'In-house Maintenance', status: 'Operational', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 1) },
  { id: 'inst7', installationName: 'Sanitation Station - Dining Hall', category: 'Sanitation', location: 'Dining Hall Entrance', lastInspectionDate: new Date(2025,4,12), nextInspectionDue: new Date(2025,4,13), inspectionFrequency: 'Daily Check', serviceVendor: 'In-house Staff', status: 'Operational', notes: 'Refilled daily.', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 0) },
  { id: 'inst8', installationName: 'Kitchen Gas Range', category: 'Gas Systems', location: 'Kitchen', lastInspectionDate: new Date(2024, 9, 15), nextInspectionDue: new Date(2025, 9, 15), inspectionFrequency: 'Annually', serviceVendor: 'GasSafe Co.', status: 'Operational', createdAt: subMonths(now, 7), updatedAt: subMonths(now, 4)},
  { id: 'inst9', installationName: 'Air Purifier Unit - Common Area', category: 'Air Quality', location: 'Main Common Area', lastInspectionDate: new Date(2025, 4, 10), nextInspectionDue: addMonths(new Date(2025, 4, 10), 3), inspectionFrequency: 'Quarterly', serviceVendor: 'In-house Maintenance', status: 'Operational', createdAt: subMonths(now, 0), updatedAt: subMonths(now, 0)},
  { id: 'inst10', installationName: 'Wheelchair Ramp - Main Entrance', category: 'Accessibility', location: 'Main Entrance', lastInspectionDate: new Date(2025, 2, 1), nextInspectionDue: new Date(2026, 2, 1), inspectionFrequency: 'Annually', serviceVendor: 'Facility Maintenance Team', status: 'Operational', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 1)},
];

export const recurringTasksSeedData: RecurringTaskSeed[] = [
  {
    id: 'rec_task_1',
    taskName: "Weekly Refrigerator Temp Check",
    frequency: "weekly",
    recurrenceDays: ["Monday"],
    assignedStaff: "Caregiver", // Now maps to AppRole
    validator: "Administrator Designee", // Maps to AppRole
    autoGenerateChecklist: true,
    category: "Food Safety",
    startDateForHistory: "2024-10-01",
    generateHistory: true
  },
  {
    id: 'rec_task_2',
    taskName: "Daily Medication Administration Audit",
    frequency: "daily",
    assignedStaff: "QMAP Supervisor",
    validator: "Wellness Nurse",
    autoGenerateChecklist: true,
    category: "Medication Management & ECP Audits",
    startDateForHistory: "2024-10-01",
    generateHistory: true
  },
  {
    id: 'rec_task_3',
    taskName: "Weekly Shower Water Temp Monitoring",
    frequency: "weekly",
    recurrenceDays: ["Wednesday"],
    assignedStaff: "Housekeeping Supervisor",
    validator: "Administrator Designee",
    autoGenerateChecklist: true,
    category: "Environmental & Sanitation Safety",
    startDateForHistory: "2024-10-01",
    generateHistory: true
  },
  {
    id: 'rec_task_4',
    taskName: "Monthly Fire Extinguisher Check",
    frequency: "monthly",
    recurrenceDayOfMonth: 1,
    assignedStaff: "Maintenance",
    validator: "Administrator Designee",
    autoGenerateChecklist: true,
    category: "Fire Safety",
    startDateForHistory: "2024-10-01",
    generateHistory: true
  }
];
