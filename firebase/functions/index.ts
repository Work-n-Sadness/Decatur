
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
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday", "Tuesday", etc.
    
    // Calculate the start of today (00:00:00) as a JS Date
    const startOfTodayDate = new Date(today);
    startOfTodayDate.setHours(0, 0, 0, 0);
    
    // Convert to Firestore Timestamp
    const dueTimestamp = admin.firestore.Timestamp.fromDate(startOfTodayDate);
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

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
        if (taskData.recurrenceDays && taskData.recurrenceDays.includes(todayDayName)) {
          shouldGenerate = true;
        }
      } else if (taskData.frequency === 'monthly') {
        if (taskData.recurrenceDayOfMonth && today.getDate() === taskData.recurrenceDayOfMonth) {
            shouldGenerate = true;
        }
      }

      if (shouldGenerate) {
        // Check if a checklist item for this task on this day (using Timestamp) already exists
        const checklistQuery = await db.collection('checklists')
          .where('taskId', '==', taskId)
          .where('dueDate', '==', dueTimestamp) 
          .limit(1)
          .get();

        if (checklistQuery.empty) {
          const newChecklistItemRef = db.collection('checklists').doc(); // Auto-generate ID
          batch.set(newChecklistItemRef, {
            taskName: taskData.taskName,
            assignedStaff: taskData.assignedStaff || null,
            validator: taskData.validator || null,
            dueDate: dueTimestamp, // Store as Firestore Timestamp (start of day)
            status: 'Pending',
            createdAt: serverTimestamp,
            statusUpdatedAt: serverTimestamp, 
            taskId: taskId,
            notes: '', 
            evidenceLink: '', 
            lastCompletedOn: null, 
            completedBy: null, 
            category: taskData.category || null,
            backfilled: false,
          });
          tasksCreated++;
          console.log(`Scheduled to create checklist item for task: ${taskData.taskName} (ID: ${taskId}) for dueDate: ${startOfTodayDate.toISOString()}`);
        } else {
          console.log(`Checklist item for task ${taskData.taskName} (ID: ${taskId}) with dueDate ${startOfTodayDate.toISOString()} already exists. Skipping.`);
        }
      }
    }

    if (tasksCreated > 0) {
      await batch.commit();
      console.log(`Successfully created ${tasksCreated} new checklist items.`);
    } else {
      console.log('No new checklist items were due to be created today.');
    }
    console.log("Checklist tasks generation finished at:", new Date().toISOString());
    return null;
  });

