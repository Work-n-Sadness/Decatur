
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

interface RecurringTaskData {
  taskName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recurrenceDays?: string[]; // e.g., ["Monday", "Tuesday"] for weekly
  recurrenceDayOfMonth?: number; // For monthly tasks
  assignedStaff: string;
  validator?: string;
  autoGenerateChecklist: boolean;
  category?: string;
  startDateForHistory?: string; // YYYY-MM-DD
  generateHistory?: boolean;
}

export const generateRecurringTasks = functions.pubsub
  .schedule('every 24 hours') // Runs daily
  // .schedule('every 1 minutes') // For testing
  .onRun(async (context) => {
    console.log('generateRecurringTasks function triggered');
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday", "Tuesday", etc.
    const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD for dueDate

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
      } else if (taskData.frequency === 'monthly') {
        // Check if the task specified a day of the month for recurrence
        if (taskData.recurrenceDayOfMonth && today.getDate() === taskData.recurrenceDayOfMonth) {
            shouldGenerate = true;
        }
      }


      if (shouldGenerate) {
        // Check if a checklist item for this task on this day already exists to prevent duplicates
        const checklistQuery = await db.collection('checklists')
          .where('taskId', '==', taskId)
          .where('dueDate', '==', todayDateString) // Query by YYYY-MM-DD string
          .limit(1)
          .get();

        if (checklistQuery.empty) {
          const newChecklistItemRef = db.collection('checklists').doc(); // Auto-generate ID
          batch.set(newChecklistItemRef, {
            taskName: taskData.taskName,
            assignedStaff: taskData.assignedStaff || null,
            validator: taskData.validator || null,
            dueDate: todayDateString, // Store as YYYY-MM-DD string
            status: 'Pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp(), // Initialize
            taskId: taskId,
            notes: '', // Default empty notes
            evidenceLink: '', // Default empty evidence link
            lastCompletedOn: null, // Default null
            completedBy: null, // Default null
            category: taskData.category || null,
            backfilled: false,
          });
          tasksCreated++;
          console.log(`Scheduled to create checklist item for task: ${taskData.taskName} (ID: ${taskId}) for dueDate: ${todayDateString}`);
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
