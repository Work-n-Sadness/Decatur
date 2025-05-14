
import type { Task, TaskCategory, TaskFrequency, TaskStatus, Role, AuditCategory, AuditItem, StaffTrainingRecord, TrainingType, TrainingStatus } from '@/types';

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start: Date, end: Date): Date => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
};

const categories: TaskCategory[] = [
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
const frequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Mid Yearly', 'Annually', 'Bi-annually', 'As Needed'];
const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Overdue', 'Blocked'];
const roles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director', 'Wellness Nurse', 'Housekeeping Supervisor', 'QMAP Supervisor'];
const staffNames = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Davis', 'Frank Wilson', 'Grace Lee', 'Henry Miller', 'Ivy Garcia', 'Jack Robinson', 'Kate Young'];

const complianceChapters = ["Ch. 2.15", "Ch. 7.03", "Ch. 14.31", "Ch. 9.11", "Ch. 22.01", "Ch. 14.3", "Ch. 24.1", null, null, null];

interface PredefinedTaskSeed {
  name: string;
  category: TaskCategory;
  complianceChapterTag?: string;
  deliverables?: string;
}

const predefinedTaskSeeds: PredefinedTaskSeed[] = [
  // Health Protocols / Medications
  { name: "Track medication refills and disposals", category: 'Health Protocols / Medications', complianceChapterTag: "Ch. 7.03", deliverables: "Updated refill and disposal logs." },
  { name: "Log medication error incidents", category: 'Health Protocols / Medications', complianceChapterTag: "Ch. 7.03", deliverables: "Completed incident reports." },
  { name: "Perform daily ECP audit with MAR cross-checks", category: 'Health Protocols / Medications', complianceChapterTag: "Ch. 7.03", deliverables: "Signed ECP audit checklist." },
  { name: "Document 2-person narcotic destruction log", category: 'Health Protocols / Medications', complianceChapterTag: "Ch. 7.03", deliverables: "Completed narcotics destruction form." },
  { name: "Review Patient Medication Charts", category: 'Health Protocols / Medications', deliverables: "Chart review notes." },
  { name: "Update Medication Administration Record (MAR) logs", category: 'Health Protocols / Medications', deliverables: "Updated MARs." },
  { name: "Conduct weekly medication audit summaries", category: 'Health Protocols / Medications', deliverables: "Weekly audit summary report." },
  { name: "Maintain QMAP audit tracking sheets", category: 'Health Protocols / Medications', deliverables: "Updated QMAP tracking sheets." },

  // Food Safety
  { name: "Log hot water temperatures", category: 'Food Safety', complianceChapterTag: "Ch. 14.31", deliverables: "Temperature log sheet." },
  { name: "Confirm dishwasher temperature cycles", category: 'Food Safety', complianceChapterTag: "Ch. 14.31", deliverables: "Dishwasher cycle log." },
  { name: "Complete daily food safety checklist sign-off", category: 'Food Safety', complianceChapterTag: "Ch. 14.31", deliverables: "Signed daily checklist." },
  { name: "Record daily food storage temperatures", category: 'Food Safety', complianceChapterTag: "Ch. 14.31", deliverables: "Food storage temperature log." },
  { name: "Update Kitchen Sanitization Log", category: 'Food Safety', deliverables: "Sanitization log entries." },
  { name: "Capture food temperature logs/photos", category: 'Food Safety', deliverables: "Temperature logs and photographic evidence." },

  // Fire Safety
  { name: "Check emergency lighting & signage (CNFA)", category: 'Fire Safety', complianceChapterTag: "Ch. 14.3", deliverables: "Inspection checklist for lighting/signage." },
  { name: "Confirm facility fire exit map posting", category: 'Fire Safety', complianceChapterTag: "Ch. 14.3", deliverables: "Photo evidence of posted map." },
  { name: "Log monthly fire drills with staff signatures", category: 'Fire Safety', complianceChapterTag: "Ch. 14.3", deliverables: "Signed fire drill log." },
  { name: "Inspect Fire Extinguisher Status", category: 'Fire Safety', deliverables: "Extinguisher inspection tags/log." },
  { name: "Maintain Fire drill checklists", category: 'Fire Safety', deliverables: "Completed drill checklists." },

  // Office Admin
  { name: "Track grievance log follow-ups", category: 'Office Admin', complianceChapterTag: "Ch. 2.15", deliverables: "Updated grievance log with resolution status." },
  { name: "Process incident review workflow", category: 'Office Admin', complianceChapterTag: "Ch. 2.15", deliverables: "Incident review documentation." },
  { name: "Complete staff onboarding checklist (orientation, certs, competency)", category: 'Office Admin', deliverables: "Signed onboarding checklist." },
  { name: "Log Email/Fax/Voicemail response times", category: 'Office Admin', deliverables: "Response time log." },
  { name: "Process Resident Admission Forms", category: 'Office Admin', deliverables: "Completed admission packets." },

  // Documentation & Compliance
  { name: "Maintain current resident roster with room numbers", category: 'Documentation & Compliance', complianceChapterTag: "Ch. 22.01", deliverables: "Updated resident roster." },
  { name: "Update facility layout map (room labels, fire exits)", category: 'Documentation & Compliance', complianceChapterTag: "Ch. 14.3", deliverables: "Revised facility map." },
  { name: "Document lift assist and fall investigations", category: 'Documentation & Compliance', deliverables: "Lift assist/fall investigation reports." },
  { name: "Record quarterly evaluations of resident engagement program", category: 'Documentation & Compliance', deliverables: "Quarterly program evaluation reports." },
  { name: "Maintain ECP audit files", category: 'Documentation & Compliance', deliverables: "Organized ECP audit documentation." },
  { name: "Perform Resident file updates", category: 'Documentation & Compliance', deliverables: "Updated resident files." },
  { name: "Review Caregiver daily activity logs", category: 'Documentation & Compliance', deliverables: "Signed-off activity logs." },

  // Personnel File & Staff Training
  { name: "Audit staff file (job desc, TB, dementia, food handler)", category: 'Personnel File & Staff Training', complianceChapterTag: "Ch. 9.11", deliverables: "Staff file audit checklist." },
  { name: "Update QMAP certification log", category: 'Personnel File & Staff Training', complianceChapterTag: "Ch. 9.11", deliverables: "Updated QMAP certification records." },
  { name: "Conduct annual review of policy manuals (version control)", category: 'Personnel File & Staff Training', deliverables: "Evidence of policy manual review and version control." },
  { name: "Review Staff Training Records", category: 'Personnel File & Staff Training', deliverables: "Training record summaries." },
  { name: "Verify Staff training certificates", category: 'Personnel File & Staff Training', deliverables: "Copies of training certificates." },

  // Postings & Required Notices
  { name: "Verify Resident Rights posting", category: 'Postings & Required Notices', complianceChapterTag: "Ch. 24.1", deliverables: "Photo evidence of posted Resident Rights." },
  { name: "Verify House Rules posting", category: 'Postings & Required Notices', complianceChapterTag: "Ch. 24.1", deliverables: "Photo evidence of posted House Rules." },
  { name: "Verify Grievance Contacts & Procedure posting", category: 'Postings & Required Notices', complianceChapterTag: "Ch. 24.1", deliverables: "Photo evidence of posted Grievance info." },
  { name: "Verify Evacuation Plan with marked exits posting", category: 'Postings & Required Notices', complianceChapterTag: "Ch. 14.3", deliverables: "Photo evidence of posted Evacuation Plan." },
  { name: "Verify Weekly Menu and Laundry Schedule posting", category: 'Postings & Required Notices', deliverables: "Photo evidence of posted schedules." },
  { name: "Check Emergency Contact List posting", category: 'Postings & Required Notices', deliverables: "Photo evidence of posted Emergency Contacts." },

  // Environmental & Sanitation Safety
  { name: "Conduct pest control audit", category: 'Environmental & Sanitation Safety', deliverables: "Pest control service report/log." },
  { name: "Observe use of oxygen & PPE", category: 'Environmental & Sanitation Safety', deliverables: "Observation checklist for oxygen/PPE use." },
  { name: "Check availability of hazard data sheets and disinfectants", category: 'Environmental & Sanitation Safety', deliverables: "Inventory/checklist for SDS and disinfectants." },
  { name: "Perform tripping hazard and railing inspections", category: 'Environmental & Sanitation Safety', deliverables: "Safety inspection log for hazards/railings." },
  { name: "Inspect electrical safety (cord/space heater misuse)", category: 'Environmental & Sanitation Safety', deliverables: "Electrical safety checklist." },
  { name: "Verify Pest Control Measures", category: 'Environmental & Sanitation Safety', deliverables: "Pest control log verification." },
  { name: "Perform Resident Room Safety Compliance Check", category: 'Environmental & Sanitation Safety', deliverables: "Room safety checklist." },
  
  // Additional ALR-Required Tasks
  { name: "Quarterly Resident Council Meeting Documentation", category: 'Additional ALR-Required Tasks', deliverables: "Signed meeting minutes." },
  { name: "Annual Policy Review for ALR Compliance", category: 'Additional ALR-Required Tasks', deliverables: "Policy review sign-off sheet." },
  { name: "Verify Water Management Program Implementation", category: 'Additional ALR-Required Tasks', deliverables: "Water management log." },
];


export const mockTasks: Task[] = Array.from({ length: predefinedTaskSeeds.length * 2 }, (_, i) => { // Generate more tasks to ensure coverage and variety
  const seedIndex = i % predefinedTaskSeeds.length;
  const seedTask = predefinedTaskSeeds[seedIndex];
  
  const startDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 8, 1)); // Extended end date for generation
  const endDate = Math.random() > 0.3 ? new Date(startDate.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000) : null;
  const status = getRandomElement(statuses);
  const assignedStaff = getRandomElement(staffNames);
  const responsibleRole = getRandomElement(roles);
  const validatorRole = getRandomElement(roles.filter(r => r !== responsibleRole));
  
  const taskName = `${seedTask.name}${i >= predefinedTaskSeeds.length ? ' (Cycle 2)' : ''}`; // Add suffix for uniqueness if repeating seeds
  const hasEvidence = Math.random() > 0.6;

  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;
  let validatorApproval: string | null = null;

  if (status === 'Completed') {
    lastCompletedOn = endDate || new Date(startDate.getTime() + (Math.floor(Math.random() * 10) + 1) * 24 * 60 * 60 * 1000);
    if (lastCompletedOn > new Date()) lastCompletedOn = new Date(new Date().getTime() - Math.random() * 1000 * 3600 * 24 * 5);
    completedBy = assignedStaff;
    if (Math.random() > 0.4) {
      validatorApproval = `Approved by ${getRandomElement(staffNames.filter(s => s !== assignedStaff))}`;
    }
  }

  return {
    id: `task_${i + 1}`,
    name: taskName,
    category: seedTask.category,
    frequency: getRandomElement(frequencies),
    responsibleRole,
    status,
    progress: status === 'Completed' ? 100 : (status === 'In Progress' ? Math.floor(Math.random() * 80) + 10 : (status === 'Blocked' || status === 'Overdue' ? Math.floor(Math.random()*30) : 0)),
    assignedStaff,
    validator: validatorRole,
    startDate,
    endDate,
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    deliverables: seedTask.deliverables || `Completed and signed ${getRandomElement(['checklist', 'logbook', 'report', 'form'])} for ${seedTask.category}.`,
    notes: `Ensure all items are thoroughly checked. Last audit on ${new Date(startDate.getTime() - (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}. ${getRandomElement(['Follow up with maintenance.', 'Verify new staff understanding.', 'Report any discrepancies immediately.',''])}`,
    activities: [
      { timestamp: new Date(startDate.getTime() - (Math.floor(Math.random() * 5) + 1) * 24 * 60 * 60 * 1000), user: 'System', action: 'Task Auto-Generated', details: 'Task created based on schedule.' },
      ...(status !== 'Pending' ? [{ timestamp: startDate, user: assignedStaff, action: 'Task Started', details: 'Commenced work on task.' }] : []),
      ...(status === 'Completed' && lastCompletedOn ? [{ timestamp: lastCompletedOn, user: completedBy || assignedStaff, action: 'Task Completed', details: 'Task marked as complete.' }] : []),
      ...(status === 'Blocked' ? [{ timestamp: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), user: assignedStaff, action: 'Task Blocked', details: 'Issue preventing progress.' }] : []),
    ],
    evidenceLink: hasEvidence ? `https://docs.google.com/document/d/example${i+1}` : undefined,
    lastCompletedOn,
    completedBy,
    validatorApproval,
    complianceChapterTag: seedTask.complianceChapterTag || getRandomElement(complianceChapters) || undefined,
  };
});

export const mockAuditCategories: AuditCategory[] = categories.map((catName, index) => ({
  id: `auditcat_${index + 1}`,
  name: catName,
  items: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, j) => ({
    id: `audititem_${index + 1}_${j + 1}`,
    description: `${getRandomElement(['Verify', 'Ensure', 'Check for', 'Confirm'])} ${getRandomElement(['proper storage of medications', 'correct food temperatures', 'clear fire escape routes', 'accurate resident records', 'up-to-date staff certifications', 'visible emergency contact postings', 'cleanliness of common areas'])} for ${catName}.`,
    compliant: Math.random() > 0.2 ? (Math.random() > 0.15 ? true : false) : null,
    notes: Math.random() > 0.5 ? getRandomElement(['All clear.', 'Minor observation noted.', 'Requires follow-up.', 'Excellent condition.']) : '',
    evidence: Math.random() > 0.7 ? 'link/to/evidence.pdf' : undefined,
  })),
}));

export const mockStaffResponsibilityMatrix = roles.map(role => ({
  role,
  responsibilities: mockTasks
    .filter(task => task.responsibleRole === role)
    .slice(0, Math.floor(Math.random() * 3) + 2) 
    .map(task => ({ taskName: task.name, deliverables: task.deliverables, category: task.category })),
}));

// Mock Data for Staff Training Dashboard
const trainingTypes: TrainingType[] = ['QMAP Training', 'TB Test', 'CPR Certification', 'Orientation'];
const trainingStatuses: TrainingStatus[] = ['Compliant', 'Expiring Soon', 'Overdue', 'Pending Documentation'];

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

export const mockStaffTrainingData: StaffTrainingRecord[] = staffNames.flatMap((staffName, staffIndex) => 
  trainingTypes.map((trainingType, trainingTypeIndex) => {
    const { completionDate, expiryDate, status } = generateTrainingDates();
    const staffRole = roles[staffIndex % roles.length]; 
    return {
      id: `training_${staffIndex + 1}_${trainingTypeIndex + 1}`,
      staffMemberName: staffName,
      staffRole,
      trainingType,
      completionDate,
      expiryDate,
      status: expiryDate ? status : (completionDate ? 'Compliant' : 'Pending Documentation'),
      documentationLink: Math.random() > 0.5 ? `https://docs.google.com/document/d/training_cert_${staffIndex+1}_${trainingTypeIndex+1}` : undefined,
      notes: Math.random() > 0.7 ? getRandomElement(['Attended refresher course.', 'Submitted via email.', 'To be updated next week.']) : undefined,
    };
  })
);

export const allMockRoles = roles;
export const allMockComplianceChapters = Array.from(new Set(mockTasks.map(t => t.complianceChapterTag).filter(Boolean).concat(complianceChapters.filter(Boolean) as string[]))) as string[];
export const allMockStaffNames = staffNames;
export const allTrainingTypes = trainingTypes;
export const allTrainingStatuses = trainingStatuses;
export const allTaskCategories = categories;
