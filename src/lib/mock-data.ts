
import type { Task, TaskCategory, TaskFrequency, TaskStatus, Role, AuditCategory, AuditItem, StaffTrainingRecord, TrainingType, TrainingStatus } from '@/types';

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start: Date, end: Date): Date => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
};

const categories: TaskCategory[] = [
  'Health Protocols / Medications', 'Food Safety', 'Fire Safety', 'Office Admin',
  'Documentation & Compliance', 'Personnel File & Staff Training',
  'Postings & Required Notices', 'Environmental & Sanitation Checks', 'Additional ALR-Required Tasks'
];
const frequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Mid Yearly', 'Annually', 'Bi-annually', 'As Needed'];
const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Overdue', 'Blocked'];
const roles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director', 'Wellness Nurse', 'Housekeeping Supervisor', 'QMAP Supervisor'];
const staffNames = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Davis', 'Frank Wilson', 'Grace Lee', 'Henry Miller', 'Ivy Garcia', 'Jack Robinson', 'Kate Young'];

const taskVerbs = ['Review', 'Update', 'Perform Check on', 'Document', 'Verify', 'Conduct Drill for', 'Audit'];
const taskSubjectsAndFullNames = [
  'Patient Medication Chart', 
  'Kitchen Sanitization Log', 
  'Fire Extinguisher Status', 
  'Resident Admission Forms', 
  'Staff Training Records', 
  'Emergency Contact List', 
  'Pest Control Measures',
  'Perform Resident Room Safety Compliance Check',
  'Medication Administration Record (MAR) logs',
  'ECP audit files',
  'Food temperature logs/photos',
  'Fire drill checklists',
  'Weekly medication audit summaries',
  'QMAP audit tracking sheets',
  'Staff training certificates',
  'Caregiver daily activity logs',
  'Resident file updates'
];

const complianceChapters = ["Ch. 2.15", "Ch. 7.03", "Ch. 14.31", "Ch. 9.11", "Ch. 22.01", null, null, null]; // Some tasks might not have a chapter

export const mockTasks: Task[] = Array.from({ length: 35 }, (_, i) => {
  const startDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 6, 1));
  const endDate = Math.random() > 0.3 ? new Date(startDate.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000) : null;
  const status = getRandomElement(statuses);
  const assignedStaff = getRandomElement(staffNames);
  const responsibleRole = getRandomElement(roles);
  const validatorRole = getRandomElement(roles.filter(r => r !== responsibleRole));
  
  const chosenSubjectOrFullName = getRandomElement(taskSubjectsAndFullNames);
  let descriptiveNamePart: string;

  const fullNamesDirectly = [
    'Perform Resident Room Safety Compliance Check',
    'Medication Administration Record (MAR) logs',
    'ECP audit files',
    'Food temperature logs/photos',
    'Fire drill checklists',
    'Weekly medication audit summaries',
    'QMAP audit tracking sheets',
    'Staff training certificates',
    'Caregiver daily activity logs',
    'Resident file updates'
  ];

  if (fullNamesDirectly.includes(chosenSubjectOrFullName)) {
    descriptiveNamePart = chosenSubjectOrFullName;
  } else {
    const chosenVerb = getRandomElement(taskVerbs);
    descriptiveNamePart = `${chosenVerb} ${chosenSubjectOrFullName}`;
  }
  
  const taskName = `Task ${i + 1}: ${descriptiveNamePart}`;
  const hasEvidence = Math.random() > 0.6;

  let lastCompletedOn: Date | null = null;
  let completedBy: string | null = null;
  let validatorApproval: string | null = null;

  if (status === 'Completed') {
    lastCompletedOn = endDate || new Date(startDate.getTime() + (Math.floor(Math.random() * 10) + 1) * 24 * 60 * 60 * 1000);
    if (lastCompletedOn > new Date()) lastCompletedOn = new Date(new Date().getTime() - Math.random() * 1000 * 3600 * 24 * 5); // ensure it's in the past
    completedBy = assignedStaff;
    if (Math.random() > 0.4) {
      validatorApproval = `Approved by ${getRandomElement(staffNames.filter(s => s !== assignedStaff))}`;
    }
  }


  return {
    id: `task_${i + 1}`,
    name: taskName,
    category: getRandomElement(categories),
    frequency: getRandomElement(frequencies),
    responsibleRole,
    status,
    progress: status === 'Completed' ? 100 : (status === 'In Progress' ? Math.floor(Math.random() * 80) + 10 : (status === 'Blocked' || status === 'Overdue' ? Math.floor(Math.random()*30) : 0)),
    assignedStaff,
    validator: validatorRole,
    startDate,
    endDate,
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    deliverables: `Completed and signed ${getRandomElement(['checklist', 'logbook', 'report', 'form'])} for ${categories[i % categories.length]}.`,
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
    complianceChapterTag: getRandomElement(complianceChapters) || undefined,
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
    .slice(0, Math.floor(Math.random() * 3) + 2) // Show 2-4 tasks per role
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
    } else { // No expiry, e.g., Orientation
      status = 'Compliant';
    }
  }
  return { completionDate, expiryDate, status };
};

export const mockStaffTrainingData: StaffTrainingRecord[] = staffNames.flatMap((staffName, staffIndex) => 
  trainingTypes.map((trainingType, trainingTypeIndex) => {
    const { completionDate, expiryDate, status } = generateTrainingDates();
    const staffRole = roles[staffIndex % roles.length]; // Assign roles cyclically for variety
    return {
      id: `training_${staffIndex + 1}_${trainingTypeIndex + 1}`,
      staffMemberName: staffName,
      staffRole,
      trainingType,
      completionDate,
      expiryDate,
      status: expiryDate ? status : (completionDate ? 'Compliant' : 'Pending Documentation'), // Override status if no expiry
      documentationLink: Math.random() > 0.5 ? `https://docs.google.com/document/d/training_cert_${staffIndex+1}_${trainingTypeIndex+1}` : undefined,
      notes: Math.random() > 0.7 ? getRandomElement(['Attended refresher course.', 'Submitted via email.', 'To be updated next week.']) : undefined,
    };
  })
);

export const allMockRoles = roles; // Export all roles for use in filters etc.
export const allMockComplianceChapters = Array.from(new Set(mockTasks.map(t => t.complianceChapterTag).filter(Boolean))) as string[];
export const allMockStaffNames = staffNames;
export const allTrainingTypes = trainingTypes;
export const allTrainingStatuses = trainingStatuses;
export const allTaskCategories = categories; // Export all categories for compliance summary
