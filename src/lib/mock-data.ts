
import type { Task, TaskCategory, TaskFrequency, TaskStatus, Role, AuditCategory, AuditItem } from '@/types';

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
const frequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'As Needed'];
const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Overdue', 'Blocked'];
const roles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director'];
const staffNames = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Davis', 'Frank Wilson', 'Grace Lee'];

export const mockTasks: Task[] = Array.from({ length: 25 }, (_, i) => {
  const startDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 6, 1));
  const endDate = Math.random() > 0.3 ? new Date(startDate.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000) : null;
  const status = getRandomElement(statuses);
  const assignedStaff = getRandomElement(staffNames);
  return {
    id: `task_${i + 1}`,
    name: `Task ${i + 1}: ${getRandomElement(['Review', 'Update', 'Perform Check', 'Document', 'Verify', 'Conduct Drill'])} ${getRandomElement(['Patient Medication Chart', 'Kitchen Sanitization Log', 'Fire Extinguisher Status', 'Resident Admission Forms', 'Staff Training Records', 'Emergency Contact List', 'Pest Control Measures', 'General Safety Walkthrough'])}`,
    category: getRandomElement(categories),
    frequency: getRandomElement(frequencies),
    responsibleRole: getRandomElement(roles),
    status,
    progress: status === 'Completed' ? 100 : (status === 'In Progress' ? Math.floor(Math.random() * 80) + 10 : (status === 'Blocked' || status === 'Overdue' ? Math.floor(Math.random()*30) : 0)),
    assignedStaff,
    validator: getRandomElement(roles.filter(r => r !== roles[i % roles.length])), // Ensure validator is different
    startDate,
    endDate,
    time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random()*4)]} ${getRandomElement(['AM', 'PM'])}` : null,
    deliverables: `Completed and signed ${getRandomElement(['checklist', 'logbook', 'report', 'form'])} for ${categories[i % categories.length]}.`,
    notes: `Ensure all items are thoroughly checked. Last audit on ${new Date(startDate.getTime() - (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}. ${getRandomElement(['Follow up with maintenance.', 'Verify new staff understanding.', 'Report any discrepancies immediately.',''])}`,
    activities: [
      { timestamp: new Date(startDate.getTime() - (Math.floor(Math.random() * 5) + 1) * 24 * 60 * 60 * 1000), user: 'System', action: 'Task Auto-Generated', details: 'Task created based on schedule.' },
      ...(status !== 'Pending' ? [{ timestamp: startDate, user: assignedStaff, action: 'Task Started', details: 'Commenced work on task.' }] : []),
      ...(status === 'Completed' ? [{ timestamp: endDate || new Date(), user: assignedStaff, action: 'Task Completed', details: 'Task marked as complete.' }] : []),
      ...(status === 'Blocked' ? [{ timestamp: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), user: assignedStaff, action: 'Task Blocked', details: 'Issue preventing progress.' }] : []),
    ],
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
