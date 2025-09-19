

import type { Task, TaskCategory, TaskFrequency, ResolutionStatus, AppRole, AuditToolCategory, AuditRecord, AuditStatus, StaffTrainingRecord, TrainingType, TrainingStatus, RecurrenceConfig, FacilityCertification, CertificationStatus, FacilityInstallation, InstallationStatus, InstallationFrequency, ResidentCareFlag, ChecklistItem, RecurringTask as RecurringTaskSeed, StaffResponsibilityMatrixEntry } from '@/types';
import { addDays, startOfDay, getDay, getDate, subDays, subMonths, addMonths, endOfMonth, subYears, isValid, parseISO, addYears, setHours, setMinutes } from 'date-fns';

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
    'Nurse',
    'Maintenance',
    'Wellness Nurse',
    'Housekeeping Supervisor',
    'QMAP Supervisor',
    'kitchen_supervisor_id', 
    'clinical_director_id',  
    'housekeeping_lead_id',
    'safety_officer_id',   
    'maintenance_id'       
];


const staffNamesByRole: Record<AppRole, string[]> = {
    'Director (Owner)': ['Alex Johnson (Director)'],
    'Assistant Director': ['Brenda Smith (Asst. Director)'],
    'Administrator Designee': ['Carlos Ray (Admin Designee)'],
    'Admin Assistant': ['Diana Prince (Admin Asst.)'],
    'Caregiver': [
        'Evan Wright (Caregiver/QMAP)',
        'Fiona Green (Caregiver/Cook)',
        'George Hill (Caregiver/Activities)',
        'Hannah Scott (Caregiver/Housekeeping Lead)',
        'Ian King (Caregiver/Night Shift)',
    ],
    'RN (External)': ['Jackie Nurse (RN Consultant)'],
    'Doctor (Consultant)': ['Dr. Evelyn Reed (MD Consultant)'],
    'Nurse': ['Wendy Bloom (Wellness Nurse)'], 
    'Maintenance': ['Mike Fixit (Maintenance Contractor)'],
    'Wellness Nurse': ['Wendy Bloom (Wellness Nurse)'],
    'Housekeeping Supervisor': ['Hannah Scott (Caregiver/Housekeeping Lead)'],
    'QMAP Supervisor': ['Evan Wright (Caregiver/QMAP)'], 
    'kitchen_supervisor_id': ['Fiona Green (Caregiver/Cook)'],
    'clinical_director_id': ['Alex Johnson (Director)'],
    'housekeeping_lead_id': ['Hannah Scott (Caregiver/Housekeeping Lead)'],
    'safety_officer_id': ['Carlos Ray (Admin Designee)'],
    'maintenance_id': ['Mike Fixit (Maintenance Contractor)'],
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
  { name: "Audit low stock / restock medication logs", category: 'Medication Management & ECP Audits', responsibleRole: ['Admin Assistant', 'Wellness Nurse'], frequency: 'Weekly', deliverables: "Reorder requests and stock checklists", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform ECP chart review audit for MAR accuracy and cross-check", category: 'Medication Management & ECP Audits', responsibleRole: 'Director (Owner)', frequency: 'Weekly', deliverables: "Audit checklist + notes", validator: null, complianceChapterTag: "Ch. 7.03" },
  { name: "Investigate and log medication errors", category: 'Medication Management & ECP Audits', responsibleRole: 'QMAP Supervisor', frequency: 'As Needed', deliverables: "Error investigation form", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Perform 2-person narcotics destruction & documentation", category: 'Medication Management & ECP Audits', responsibleRole: ['Director (Owner)', 'Wellness Nurse'], frequency: 'As Needed', deliverables: "Signed destruction sheet", validator: 'Administrator Designee', complianceChapterTag: "Ch. 7.03" },
  { name: "Maintain updated current med order list", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Weekly', deliverables: "Clean list per resident", validator: 'QMAP Supervisor', complianceChapterTag: "Ch. 7.03" },
  { name: "Conduct MAR audit (all residents)", category: 'Medication Management & ECP Audits', responsibleRole: 'Wellness Nurse', frequency: 'Weekly', deliverables: "Compliance sheet, notes, resolution tracking", validator: 'Director (Owner)', complianceChapterTag: "Ch. 7.03" },
  { name: "Update and store Resident Progress Reports", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Caregiver', 'Wellness Nurse'], frequency: 'Weekly', deliverables: "Weekly chart note", validator: 'Wellness Nurse' },
  { name: "Maintain updated Face Sheets", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Admin Assistant', frequency: 'Monthly', deliverables: "Printed or digital version", validator: 'Administrator Designee' },
  { name: "Record Treatment History: Past and ongoing", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Wellness Nurse', frequency: 'Monthly', deliverables: "Chronological summary", validator: 'Wellness Nurse' },
  { name: "Document and log fall incidents", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Caregiver', frequency: 'As Needed', deliverables: "Fall log and corrective action", validator: 'Wellness Nurse' },
  { name: "Record lift assist events", category: 'Resident Documentation & Clinical Care', responsibleRole: 'Caregiver', frequency: 'As Needed', deliverables: "Lift assist log", validator: 'Wellness Nurse' }, 
  { name: "Update Care Plan Reviews & Assessments", category: 'Resident Documentation & Clinical Care', responsibleRole: ['Wellness Nurse', 'Director (Owner)'], frequency: 'Quarterly', deliverables: "Updated digital care plan", validator: null, complianceChapterTag: "Ch. 2.15" },
  { name: "Conduct ECP error resolution review", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Administrator Designee', 'Director (Owner)'], frequency: 'Quarterly', deliverables: "List of resolved audit flags", validator: null, complianceChapterTag: "Ch. 2.15" },
  { name: "Perform QMAP passing rate audit", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'QMAP Supervisor', frequency: 'Monthly', deliverables: "Score sheet", validator: 'Director (Owner)', complianceChapterTag: "Ch. 9.11" },
  { name: "Audit medication disposal logs", category: 'Compliance & Survey Prep Tasks', responsibleRole: ['Wellness Nurse', 'Maintenance'], frequency: 'Monthly', deliverables: "Disposal documentation", validator: 'Administrator Designee', complianceChapterTag: "Ch. 7.03" },
  { name: "Post & verify Resident Rights, House Rules, Emergency Plan", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Admin Assistant', frequency: 'Monthly', deliverables: "Photos & checklist", validator: 'Administrator Designee', complianceChapterTag: "Ch. 24.1" },
  { name: "Prepare Survey Readiness Packet", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Administrator Designee', frequency: 'Quarterly', deliverables: "Binder or PDF", validator: 'Director (Owner)' },
  { name: "Track policy & procedure manual reviews", category: 'Compliance & Survey Prep Tasks', responsibleRole: 'Director (Owner)', frequency: 'Annually', deliverables: "Signed review sheet", validator: null },
  { name: "Log all resident smoking activity", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Housekeeping Supervisor', frequency: 'Daily', deliverables: "Time-stamped log in designated backyard area", validator: 'Administrator Designee' },
  { name: "Audit compliance with smoking safety in designated backyard smoking area", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Administrator Designee', frequency: 'Weekly', deliverables: "Violation log and supervision verification", validator: 'Director (Owner)' },
  { name: "Observe and document behavioral incidents", category: 'Smoking, Behavior, and Environment', responsibleRole: ['Caregiver', 'Wellness Nurse'], frequency: 'As Needed', deliverables: "Incident form", validator: 'Wellness Nurse' },
  { name: "Perform Resident Room Safety Compliance Check", category: 'Smoking, Behavior, and Environment', responsibleRole: 'Caregiver', frequency: 'Weekly', deliverables: "Room safety checklist", validator: 'Administrator Designee', complianceChapterTag: "Ch. 12.4" },
];

export const mockTasks: Task[] = specificTasksSeed.map((seed, i) => {
  const instanceStartDate = getRandomDate(new Date(2024, 9, 1), new Date(2025, 4, 13)); 
  const patternStartDate = new Date(instanceStartDate.getFullYear(), instanceStartDate.getMonth(), 1);

  const freqCycleDaysMap: Record<TaskFrequency, number> = {
    'Daily': 1, 'Weekly': 7, 'Monthly': 30, 'Quarterly': 90,
    'Mid Yearly': 182, 'Annually': 365, 'Bi-annually': 730, 'As Needed': 0
  };
  const cycleDays = freqCycleDaysMap[seed.frequency] || 0;
  let instanceEndDate: Date | null = cycleDays > 0 ? addDays(startOfDay(instanceStartDate), cycleDays -1) : (seed.frequency === 'As Needed' ? addDays(startOfDay(instanceStartDate), Math.floor(Math.random() * 7) + 1) : null);

  const status = getRandomElement(allResolutionStatuses);
  let assignedStaffMember: string;
  let assignedStaffMemberId: string = `staff_user_${(i % 9) + 1}`; 

  if (Array.isArray(seed.responsibleRole)) {
    const role1 = seed.responsibleRole[0];
    assignedStaffMember = getRandomElement(staffNamesByRole[role1] || allMockStaffNames);
  } else {
    assignedStaffMember = getRandomElement(staffNamesByRole[seed.responsibleRole] || allMockStaffNames);
  }
  
  const internalRoles = ['Director (Owner)', 'Assistant Director', 'Administrator Designee', 'Admin Assistant', 'Caregiver', 'Wellness Nurse', 'Housekeeping Supervisor', 'QMAP Supervisor'];
  const isInternal = Array.isArray(seed.responsibleRole) ? seed.responsibleRole.some(r => internalRoles.includes(r as AppRole)) : internalRoles.includes(seed.responsibleRole as AppRole);
  if (isInternal) {
      assignedStaffMemberId = `staff_user_${(i % allMockStaffNames.filter(name => !name.includes("External") && !name.includes("Consultant") && !name.includes("Contractor")).length) + 1}`;
  } else {
      assignedStaffMemberId = `ext_user_${i+1}`; 
  }


  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;
  if (status === 'Resolved' || status === 'Complete') {
    lastCompletedOn = cycleDays > 0 ? getRandomDate(addDays(instanceStartDate, -cycleDays), instanceStartDate) : getRandomDate(addDays(new Date(), -30), new Date());
    if (lastCompletedOn > instanceStartDate && isValid(instanceStartDate)) lastCompletedOn = instanceStartDate;
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
      { timestamp: (isValid(initialActivityTimestamp) && initialActivityTimestamp > new Date()) ? new Date() : initialActivityTimestamp, user: 'System', action: 'Task Instance Generated', details: 'Task instance created based on recurrence pattern.' },
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
  validator: typeof task.validator === 'string' ? task.validator : null,
  dueDate: (task.endDate || task.startDate),
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
  'General ALR Compliance',
  'Resident Records Management',
  'Resident Care Plans',
  'Resident Progress Notes',
  'Resident Admissions & Discharges',
  'Case Management Coordination',
  'Medication Administration Record',
];
export const allAuditStatuses: AuditStatus[] = [
    'Pending Review', 'In Progress', 'Action Required', 'Compliant', 'Non-Compliant',
    'Resolved', 'Up-to-date', 'Archived', 'Review Needed', 'Active',
    'Admission Pending', 'Admission Complete', 'Discharge Pending', 'Discharge Complete',
    'Active Engagement', 'Referral Made', 'Follow-up Scheduled',
    'Administered', 'Missed', 'Late',
];


export const mockAuditRecords: AuditRecord[] = Array.from({ length: 25 }, (_, i) => {
  const category = getRandomElement(allAuditCategories.filter(c => !['Resident Records Management', 'Resident Care Plans', 'Resident Progress Notes', 'Resident Admissions & Discharges', 'Case Management Coordination', 'Medication Administration Record'].includes(c)));
  const assignedRole = getRandomElement(allAppRoles);
  const status = getRandomElement(allAuditStatuses.filter(s => !['Up-to-date', 'Archived', 'Active', 'Review Needed', 'Admission Pending', 'Admission Complete', 'Discharge Pending', 'Discharge Complete', 'Active Engagement', 'Referral Made', 'Follow-up Scheduled', 'Administered', 'Missed', 'Late'].includes(s)));
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

export const mockFaceSheetAuditRecords: AuditRecord[] = [
  { id: 'fs_001', name: 'Abigail Adams - Face Sheet', category: 'Resident Records Management', assignedRole: 'Admin Assistant', lastCompletedDate: new Date(2025, 4, 1), status: 'Up-to-date', validator: 'Wellness Nurse', evidenceLink: 'https://example.com/fs_adams.pdf', createdAt: new Date(2024,10,1), updatedAt: new Date(2025,4,1) },
  { id: 'fs_002', name: 'Benjamin Franklin - Face Sheet', category: 'Resident Records Management', assignedRole: 'Admin Assistant', lastCompletedDate: new Date(2025, 3, 15), status: 'Up-to-date', validator: 'Wellness Nurse', createdAt: new Date(2024,9,15), updatedAt: new Date(2025,3,15) },
  { id: 'fs_003', name: 'Clara Barton - Face Sheet', category: 'Resident Records Management', assignedRole: 'Admin Assistant', lastCompletedDate: new Date(2025, 0, 10), status: 'Review Needed', notes: 'Needs annual review by June.', validator: 'Wellness Nurse', createdAt: new Date(2024,5,10), updatedAt: new Date(2025,0,10) },
  { id: 'fs_004', name: 'Daniel Boone - Face Sheet', category: 'Resident Records Management', assignedRole: 'Admin Assistant', status: 'Pending Review', notes: 'New resident, face sheet to be created.', validator: 'Wellness Nurse', createdAt: new Date(2025,4,10), updatedAt: new Date(2025,4,10) },
  { id: 'fs_005', name: 'Eleanor Roosevelt - Face Sheet', category: 'Resident Records Management', assignedRole: 'Admin Assistant', lastCompletedDate: new Date(2023, 11, 1), status: 'Archived', notes: 'Resident discharged.', validator: 'Administrator Designee', evidenceLink: 'https://example.com/fs_roosevelt_archived.pdf', createdAt: new Date(2023,1,1), updatedAt: new Date(2023,11,1) },
].map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate : parseISO(record.lastCompletedDate as unknown as string)) : null,
    createdAt: record.createdAt instanceof Date ? record.createdAt : parseISO(record.createdAt as unknown as string),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt : parseISO(record.updatedAt as unknown as string),
}));


export const mockCarePlanAuditRecords: AuditRecord[] = [
  { id: 'cp_001', name: 'George Washington - Care Plan Q2 Review', category: 'Resident Care Plans', assignedRole: 'Wellness Nurse', lastCompletedDate: new Date(2025, 3, 20), status: 'Active', validator: 'Director (Owner)', evidenceLink: 'https://example.com/cp_washington.pdf', chapterReferenceTag: 'Ch. 2.15', createdAt: new Date(2025,3,20), updatedAt: new Date(2025,3,20) },
  { id: 'cp_002', name: 'Harriet Tubman - Care Plan Initial', category: 'Resident Care Plans', assignedRole: 'Wellness Nurse', status: 'Active', notes: 'New admission, care plan established.', validator: 'Director (Owner)', createdAt: new Date(2025,4,5), updatedAt: new Date(2025,4,5) },
  { id: 'cp_003', name: 'Isaac Newton - Care Plan Annual Update', category: 'Resident Care Plans', assignedRole: 'Wellness Nurse', status: 'Review Needed', notes: 'Annual review scheduled for next week.', validator: 'Director (Owner)', createdAt: new Date(2024,5,1), updatedAt: new Date(2025,4,1) },
  { id: 'cp_004', name: 'Joan of Arc - Care Plan (Discharged)', category: 'Resident Care Plans', assignedRole: 'Wellness Nurse', lastCompletedDate: new Date(2024, 10, 1), status: 'Archived', notes: 'Resident moved to skilled nursing.', validator: 'Director (Owner)', createdAt: new Date(2024,1,15), updatedAt: new Date(2024,10,1) },
].map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate : parseISO(record.lastCompletedDate as unknown as string)) : null,
    createdAt: record.createdAt instanceof Date ? record.createdAt : parseISO(record.createdAt as unknown as string),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt : parseISO(record.updatedAt as unknown as string),
}));

export const mockProgressNoteAuditRecords: AuditRecord[] = [
  { id: 'pn_001', name: 'Abigail Adams - Weekly Note', category: 'Resident Progress Notes', assignedRole: 'Caregiver', lastCompletedDate: new Date(2025, 4, 10), status: 'Up-to-date', validator: 'Wellness Nurse', notes: 'Resident participated well in activities.', createdAt: new Date(2025,4,10), updatedAt: new Date(2025,4,10) },
  { id: 'pn_002', name: 'Benjamin Franklin - Monthly Summary', category: 'Resident Progress Notes', assignedRole: 'Wellness Nurse', lastCompletedDate: new Date(2025, 3, 30), status: 'Up-to-date', validator: 'Director (Owner)', evidenceLink: 'https://example.com/pn_franklin_apr.pdf', createdAt: new Date(2025,3,30), updatedAt: new Date(2025,3,30) },
  { id: 'pn_003', name: 'Clara Barton - Incident Note', category: 'Resident Progress Notes', assignedRole: 'Caregiver', status: 'Pending Review', notes: 'Minor fall, no injury. Doctor notified.', validator: 'Wellness Nurse', createdAt: new Date(2025,4,12), updatedAt: new Date(2025,4,12) },
].map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate : parseISO(record.lastCompletedDate as unknown as string)) : null,
    createdAt: record.createdAt instanceof Date ? record.createdAt : parseISO(record.createdAt as unknown as string),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt : parseISO(record.updatedAt as unknown as string),
}));

export const mockAdmissionDischargeRecords: AuditRecord[] = [
    { id: 'adm_001', name: 'Ken Adams - Admission Process', category: 'Resident Admissions & Discharges', assignedRole: 'Admin Assistant', lastCompletedDate: new Date(2025, 4, 10), status: 'Admission Complete', validator: 'Administrator Designee', notes: 'All paperwork signed, room ready.', evidenceLink: 'https://example.com/admission_kadams.pdf', createdAt: new Date(2025, 4, 8), updatedAt: new Date(2025, 4, 10) },
    { id: 'adm_002', name: 'Laura Palmer - Discharge Planning', category: 'Resident Admissions & Discharges', assignedRole: 'Wellness Nurse', status: 'Discharge Pending', notes: 'Discharge scheduled for 2025-05-20. Family notified.', validator: 'Director (Owner)', createdAt: new Date(2025, 4, 5), updatedAt: new Date(2025, 4, 12) },
    { id: 'adm_003', name: 'Michael Johnson - Admission Pending', category: 'Resident Admissions & Discharges', assignedRole: 'Admin Assistant', status: 'Admission Pending', notes: 'Awaiting final medical clearance.', validator: 'Administrator Designee', createdAt: new Date(2025, 4, 12), updatedAt: new Date(2025, 4, 12) },
    { id: 'adm_004', name: 'Sarah Connor - Discharged', category: 'Resident Admissions & Discharges', assignedRole: 'Wellness Nurse', lastCompletedDate: new Date(2025, 3, 15), status: 'Discharge Complete', validator: 'Director (Owner)', notes: 'Successfully discharged to home care.', evidenceLink: 'https://example.com/discharge_sconnor.pdf', createdAt: new Date(2025, 3, 1), updatedAt: new Date(2025, 3, 15) },
].map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate : parseISO(record.lastCompletedDate as unknown as string)) : null,
    createdAt: record.createdAt instanceof Date ? record.createdAt : parseISO(record.createdAt as unknown as string),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt : parseISO(record.updatedAt as unknown as string),
}));

export const mockCaseManagementRecords: AuditRecord[] = [
  { id: 'cm_001', name: 'Helping Hands Agency - Q2 Review', category: 'Case Management Coordination', assignedRole: 'Administrator Designee', lastCompletedDate: new Date(2025, 3, 25), status: 'Active Engagement', validator: 'Director (Owner)', notes: 'Quarterly review completed, no issues.', chapterReferenceTag: 'Ch. 2.15', createdAt: new Date(2025,3,25), updatedAt: new Date(2025,3,25) },
  { id: 'cm_002', name: 'Resident Alice B. - VA Benefits Application', category: 'Case Management Coordination', assignedRole: 'Admin Assistant', status: 'Referral Made', notes: 'Referral to VA specialist submitted.', validator: 'Administrator Designee', createdAt: new Date(2025,4,1), updatedAt: new Date(2025,4,1) },
  { id: 'cm_003', name: 'Community Support Services - Partnership Meeting', category: 'Case Management Coordination', assignedRole: 'Director (Owner)', status: 'Follow-up Scheduled', notes: 'Follow-up meeting scheduled for June 10th.', validator: null, createdAt: new Date(2025,4,10), updatedAt: new Date(2025,4,10) },
  { id: 'cm_004', name: 'Resident Charles D. - Home Health Coordination', category: 'Case Management Coordination', assignedRole: 'Wellness Nurse', lastCompletedDate: new Date(2025, 2, 15), status: 'Resolved', notes: 'Home health services successfully initiated.', evidenceLink: 'https://example.com/hh_charlesd.pdf', validator: 'Administrator Designee', createdAt: new Date(2025,1,20), updatedAt: new Date(2025,2,15) },
  { id: 'cm_005', name: 'Transitions Agency - Service Agreement', category: 'Case Management Coordination', assignedRole: 'Assistant Director', status: 'Action Required', notes: 'Service agreement needs legal review before signing.', validator: 'Director (Owner)', createdAt: new Date(2025,4,12), updatedAt: new Date(2025,4,12) },
].map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate : parseISO(record.lastCompletedDate as unknown as string)) : null,
    createdAt: record.createdAt instanceof Date ? record.createdAt : parseISO(record.createdAt as unknown as string),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt : parseISO(record.updatedAt as unknown as string),
}));


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
    const today = new Date(2025, 4, 13);

    if (!completionDate || !isValid(completionDate)) {
      status = 'Pending Documentation';
    } else {
      const hasExpiry = trainingType !== 'Orientation';
      if (hasExpiry) {
        expiryDate = addYears(completionDate, trainingType === 'TB Test' ? 1 : 2); 
        const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        if (daysUntilExpiry < 0) status = 'Overdue';
        else if (daysUntilExpiry <= 60) status = 'Expiring Soon'; 
        else status = 'Compliant';
      } else {
        status = 'Compliant';
      }
    }
    const staffRole = allAppRoles.find(role => staffNamesByRole[role]?.includes(staffName)) || 'Caregiver';
    const createdAt = completionDate && isValid(completionDate) ? subDays(completionDate, Math.floor(Math.random() * 30) + 1) : subDays(today, Math.floor(Math.random() * 90) + 1);
    const updatedAt = status === 'Compliant' && completionDate && isValid(completionDate) ? completionDate : today;


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

const now = new Date(2025, 4, 13);
export const mockCertifications: FacilityCertification[] = [
  { id: 'cert1', certificationName: 'State Assisted Living License', certifyingAgency: 'State Health Dept.', issueDate: new Date(2024, 0, 15), expirationDate: new Date(2026, 0, 14), status: 'Active', certificateUpload: 'https://example.com/license.pdf', lastReviewedBy: 'Alex Johnson (Director)', notes: 'Annual renewal completed.', createdAt: subMonths(now, 16), updatedAt: subMonths(now, 4) },
  { id: 'cert2', certificationName: 'Fire Department Inspection Report', certifyingAgency: 'City Fire Marshal', issueDate: new Date(2024, 11, 10), expirationDate: new Date(2025, 11, 9), status: 'Active', lastReviewedBy: 'Alex Johnson (Director)', createdAt: subMonths(now, 5), updatedAt: subMonths(now, 0) },
  { id: 'cert3', certificationName: 'CDPHE Certification', certifyingAgency: 'CDPHE', issueDate: new Date(2023, 8, 1), expirationDate: new Date(2025, 5, 1), status: 'Due Soon', certificateUpload: 'https://example.com/cdphe.pdf', lastReviewedBy: 'Diana Prince (Admin Asst.)', notes: 'Renewal application due soon.', createdAt: subMonths(now, 20), updatedAt: subMonths(now, 1) },
  { id: 'cert4', certificationName: 'Kitchen/Public Health Inspection', certifyingAgency: 'County Public Health', issueDate: new Date(2025, 2, 20), expirationDate: new Date(2026, 2, 19), status: 'Active', createdAt: subMonths(now, 2), updatedAt: subMonths(now, 1) },
  { id: 'cert5', certificationName: 'Boiler Inspection Certificate', certifyingAgency: 'Boiler Safety Division', issueDate: new Date(2024, 10, 5), expirationDate: new Date(2025, 10, 4), status: 'Active', certificateUpload: 'https://example.com/boiler.pdf', createdAt: subMonths(now, 6), updatedAt: subMonths(now, 3) },
  { id: 'cert6', certificationName: 'HVAC Compliance Document', certifyingAgency: 'HVAC Licensing Board', issueDate: new Date(2025, 0, 30), expirationDate: new Date(2027, 0, 29), status: 'Active', createdAt: subMonths(now, 4), updatedAt: subMonths(now, 0) },
  { id: 'cert7', certificationName: 'Building Occupancy Permit', certifyingAgency: 'City Planning Dept.', issueDate: new Date(2020, 6, 1), expirationDate: addYears(new Date(2020, 6, 1), 10), status: 'Active', notes: 'Long-term permit.', createdAt: subYears(now, 5), updatedAt: subYears(now, 1) },
  { id: 'cert8', certificationName: 'EPA Environmental Compliance', certifyingAgency: 'EPA', issueDate: new Date(2024, 7, 1), expirationDate: new Date(2025, 4, 10), status: 'Expired', notes: 'Expired 3 days ago. URGENT.', createdAt: subMonths(now, 9), updatedAt: subMonths(now, 0)},
].map(cert => ({
    ...cert,
    issueDate: cert.issueDate instanceof Date ? cert.issueDate : parseISO(cert.issueDate as unknown as string),
    expirationDate: cert.expirationDate instanceof Date ? cert.expirationDate : parseISO(cert.expirationDate as unknown as string),
    createdAt: cert.createdAt instanceof Date ? cert.createdAt : parseISO(cert.createdAt as unknown as string),
    updatedAt: cert.updatedAt instanceof Date ? cert.updatedAt : parseISO(cert.updatedAt as unknown as string),
}));


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
].map(install => ({
    ...install,
    lastInspectionDate: install.lastInspectionDate ? (install.lastInspectionDate instanceof Date ? install.lastInspectionDate : parseISO(install.lastInspectionDate as unknown as string)) : null,
    nextInspectionDue: install.nextInspectionDue ? (install.nextInspectionDue instanceof Date ? install.nextInspectionDue : parseISO(install.nextInspectionDue as unknown as string)) : null,
    createdAt: install.createdAt instanceof Date ? install.createdAt : parseISO(install.createdAt as unknown as string),
    updatedAt: install.updatedAt instanceof Date ? install.updatedAt : parseISO(install.updatedAt as unknown as string),
}));


export const recurringTasksSeedData: RecurringTaskSeed[] = [
  {
    id: 'rec_task_1',
    taskName: "Weekly Refrigerator Temp Check",
    frequency: "weekly",
    recurrenceDays: ["Monday"],
    assignedStaff: "Caregiver",
    validator: "Administrator Designee",
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

const residentNames = [
  "Abigail Adams", "Benjamin Franklin", "Clara Barton", "Daniel Boone", "Eleanor Roosevelt", 
  "George Washington", "Harriet Tubman", "Isaac Newton", "Joan of Arc", "Ken Adams", "Laura Palmer",
  "Michael Johnson", "Sarah Connor"
];

const medications = [
  { name: "Lisinopril", dosage: "20mg", route: "Oral" },
  { name: "Metformin", dosage: "500mg", route: "Oral" },
  { name: "Amlodipine", dosage: "10mg", route: "Oral" },
  { name: "Simvastatin", dosage: "40mg", route: "Oral" },
  { name: "Insulin Glargine", dosage: "10 units", route: "Subcutaneous" },
  { name: "Warfarin", dosage: "5mg", route: "Oral" },
  { name: "Albuterol", dosage: "2 puffs", route: "Inhalation" },
];

export const mockMarRecords: AuditRecord[] = Array.from({ length: 30 }, (_, i) => {
    const resident = getRandomElement(residentNames);
    const med = getRandomElement(medications);
    const qmap = getRandomElement(staffNamesByRole['QMAP Supervisor'] || staffNamesByRole['Caregiver']);

    const scheduledTime = setMinutes(setHours(subDays(now, i % 5), getRandomElement([8, 12, 18, 22])), 0);
    const administrationRoll = Math.random();
    let status: AuditStatus;
    let actualTime: Date;

    if (administrationRoll < 0.8) { // 80% administered on time
        status = 'Administered';
        actualTime = setMinutes(scheduledTime, getRandomElement([0, 1, -1, 2, -2]));
    } else if (administrationRoll < 0.9) { // 10% administered late
        status = 'Late';
        actualTime = setMinutes(scheduledTime, getRandomElement([35, 40, 55]));
    } else { // 10% missed
        status = 'Missed';
        actualTime = scheduledTime; // For missed, actual time is the scheduled time
    }

    return {
        id: `mar_${i + 1}`,
        name: `${resident} - ${med.name}`,
        category: 'Medication Administration Record',
        assignedRole: 'QMAP Supervisor', // The role responsible for giving the med
        validator: 'Wellness Nurse',
        lastCompletedDate: status !== 'Missed' ? actualTime : null, // Actual admin time
        status: status,
        notes: `Dosage: ${med.dosage}, Route: ${med.route}. Scheduled: ${scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        createdAt: scheduledTime,
        updatedAt: actualTime,
        chapterReferenceTag: 'Ch. 7.03',
    };
});


const allMockAuditCollections = [
  mockAuditRecords, 
  mockFaceSheetAuditRecords, 
  mockCarePlanAuditRecords, 
  mockProgressNoteAuditRecords, 
  mockAdmissionDischargeRecords,
  mockCaseManagementRecords,
  mockCertifications, 
  mockInstallations,
  mockMarRecords,
];

allMockAuditCollections.forEach(collection => {
  collection.forEach((record: any) => { 
    if (record.lastCompletedDate && typeof record.lastCompletedDate === 'string') {
      const parsed = parseISO(record.lastCompletedDate);
      if (isValid(parsed)) record.lastCompletedDate = parsed; else record.lastCompletedDate = null;
    }
    if (record.createdAt && typeof record.createdAt === 'string') {
      const parsed = parseISO(record.createdAt);
      if (isValid(parsed)) record.createdAt = parsed; else record.createdAt = new Date(0); // Fallback
    }
    if (record.updatedAt && typeof record.updatedAt === 'string') {
      const parsed = parseISO(record.updatedAt);
      if (isValid(parsed)) record.updatedAt = parsed; else record.updatedAt = new Date(0); // Fallback
    }
    if ('issueDate' in record && record.issueDate && typeof record.issueDate === 'string') {
      const parsed = parseISO(record.issueDate);
      if (isValid(parsed)) (record as FacilityCertification).issueDate = parsed; else (record as FacilityCertification).issueDate = new Date(0);
    }
    if ('expirationDate' in record && record.expirationDate && typeof record.expirationDate === 'string') {
       const parsed = parseISO(record.expirationDate);
       if (isValid(parsed)) (record as FacilityCertification).expirationDate = parsed; else (record as FacilityCertification).expirationDate = new Date(0);
    }
    if ('lastInspectionDate' in record && record.lastInspectionDate && typeof record.lastInspectionDate === 'string') {
      const parsed = parseISO(record.lastInspectionDate);
      if (isValid(parsed)) (record as FacilityInstallation).lastInspectionDate = parsed; else (record as FacilityInstallation).lastInspectionDate = null;
    }
    if ('nextInspectionDue' in record && record.nextInspectionDue && typeof record.nextInspectionDue === 'string') {
      const parsed = parseISO(record.nextInspectionDue);
      if (isValid(parsed)) (record as FacilityInstallation).nextInspectionDue = parsed; else (record as FacilityInstallation).nextInspectionDue = null;
    }
  });
});

mockTasks.forEach(task => {
    if (task.startDate && typeof task.startDate === 'string') {
        const parsed = parseISO(task.startDate);
        if (isValid(parsed)) task.startDate = parsed; else task.startDate = new Date(0);
    }
    if (task.endDate && typeof task.endDate === 'string') {
        const parsed = parseISO(task.endDate);
        if (isValid(parsed)) task.endDate = parsed; else task.endDate = null;
    }
    if (task.lastCompletedOn && typeof task.lastCompletedOn === 'string') {
        const parsed = parseISO(task.lastCompletedOn);
        if (isValid(parsed)) task.lastCompletedOn = parsed; else task.lastCompletedOn = null;
    }
    task.activities.forEach(act => {
        if (act.timestamp && typeof act.timestamp === 'string') {
            const parsed = parseISO(act.timestamp);
            if (isValid(parsed)) act.timestamp = parsed; else act.timestamp = new Date(0);
        }
    });
    if (task.recurrenceConfig?.patternStartDate && typeof task.recurrenceConfig.patternStartDate === 'string') {
        const parsed = parseISO(task.recurrenceConfig.patternStartDate);
        if (isValid(parsed)) task.recurrenceConfig.patternStartDate = parsed; else task.recurrenceConfig.patternStartDate = new Date(0);
    }
    if (task.recurrenceConfig?.patternEndDate && typeof task.recurrenceConfig.patternEndDate === 'string') {
         const parsed = parseISO(task.recurrenceConfig.patternEndDate);
         if (isValid(parsed)) task.recurrenceConfig.patternEndDate = parsed; else task.recurrenceConfig.patternEndDate = null;
    }
});

mockChecklistItems.forEach(item => {
    if (item.dueDate && typeof item.dueDate === 'string') {
        const parsed = parseISO(item.dueDate);
        if (isValid(parsed)) item.dueDate = parsed; else item.dueDate = new Date(0);
    }
    if (item.createdAt && typeof item.createdAt === 'string') {
        const parsed = parseISO(item.createdAt);
        if (isValid(parsed)) item.createdAt = parsed; else item.createdAt = new Date(0);
    }
    if (item.statusUpdatedAt && typeof item.statusUpdatedAt === 'string') {
        const parsed = parseISO(item.statusUpdatedAt);
        if (isValid(parsed)) item.statusUpdatedAt = parsed; else item.statusUpdatedAt = null;
    }
    if (item.lastCompletedOn && typeof item.lastCompletedOn === 'string') {
        const parsed = parseISO(item.lastCompletedOn);
        if (isValid(parsed)) item.lastCompletedOn = parsed; else item.lastCompletedOn = null;
    }
});
