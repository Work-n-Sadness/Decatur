
import * as functions from 'firebase-functions';
import *อนadmin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

interface RecurringTaskData {
  taskName: string;
  frequency: 'daily' | 'weekly';
  recurrenceDays?: string[]; // e.g., ["Monday", "Tuesday"]
  assignedStaff: string;
  validator?: string;
  autoGenerateChecklist: boolean;
  // Add any other fields from your recurringTasks documents
}

const daysMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const generateRecurringTasks = functions.pubsub
  .schedule('every 24 hours') // Runs daily
  // .schedule('every 1 minutes') // For testing
  .onRun(async (context) => {
    console.log('generateRecurringTasks function triggered');
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday", "Tuesday", etc.
    const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD for due date

    const recurringTasksSnapshot = await db.collection('recurringTasks').where('autoGenerateChecklist', '==', true).get();

    if (recurringTasksSnapshot.empty) {
      console.log('No recurring tasks found with autoGenerateChecklist set to true.');
      return null;
    }

    const batch = db.batch();
    let tasksCreated = 0;

    for (const doc of recurringTasksSnapshot.docs) {
      const taskData = doc.data() as RecurringTaskData;
      const taskId = doc.id;

      let shouldGenerate = false;

      if (taskData.frequency === 'daily') {
        shouldGenerate = true;
      } else if (taskData.frequency === 'weekly') {
        if (taskData.recurrenceDays && taskData.recurrenceDays.includes(currentDayName)) {
          shouldGenerate = true;
        }
      }

      if (shouldGenerate) {
        // Optional: Check if a checklist item for this task on this day already exists to prevent duplicates if function runs multiple times a day
        const checklistQuery = await db.collection('checklists')
          .where('taskId', '==', taskId)
          .where('dueDate', '==', todayDateString)
          .limit(1)
          .get();

        if (checklistQuery.empty) {
          const newChecklistItemRef = db.collection('checklists').doc(); // Auto-generate ID
          batch.set(newChecklistItemRef, {
            taskName: taskData.taskName,
            assignedStaff: taskData.assignedStaff,
            validator: taskData.validator || null,
            dueDate: todayDateString, // Store as YYYY-MM-DD string or Firestore Timestamp
            status: 'Pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            taskId: taskId,
            notes: '',
            evidenceLink: '',
            lastCompletedOn: null,
            completedBy: null,
            // any other default fields
          });
          tasksCreated++;
          console.log(`Scheduled to create checklist item for task: ${taskData.taskName} (ID: ${taskId})`);
        } else {
          console.log(`Checklist item for task ${taskData.taskName} (ID: ${taskId}) on ${todayDateString} already exists. Skipping.`);
        }
      }
    }

    if (tasksCreated > 0) {
      await batch.commit();
      console.log(`Successfully created ${tasksCreated} new checklist items.`);
    } else {
      console.log('No new checklist items were due to be created today.');
    }

    return null;
  });

// To deploy, you would typically run `firebase deploy --only functions`
// Ensure you have firebase-admin and firebase-functions in your functions/package.json
// And configure the schedule in firebase.json or via Google Cloud Console.
//
// Example of functions/package.json dependencies:
// "dependencies": {
//   "firebase-admin": "^12.0.0",
//   "firebase-functions": "^5.0.0"
// },
// "devDependencies": {
//   "typescript": "^5.0.0",
//   "firebase-functions-test": "^0.2.0"
// }
//
// Configure environment variables for Firebase if needed.
// Set up Firestore rules for 'recurringTasks' (e.g., read-only for functions)
// and 'checklists' (e.g., write by functions, read/write by authenticated users based on roles).
