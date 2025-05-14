
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

interface RecurringTaskData {
  taskName: string;
  frequency: 'daily' | 'weekly' | 'monthly'; // Added 'monthly' for flexibility, function currently handles daily/weekly
  recurrenceDays?: string[]; // e.g., ["Monday", "Tuesday"] for weekly
  recurrenceDayOfMonth?: number; // For monthly tasks
  assignedStaff: string;
  validator?: string;
  autoGenerateChecklist: boolean;
  category?: string;
  // Add any other fields from your recurringTasks documents
}

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
      // Placeholder for monthly task generation logic if needed in the future
      // else if (taskData.frequency === 'monthly') {
      //   if (taskData.recurrenceDayOfMonth && today.getDate() === taskData.recurrenceDayOfMonth) {
      //     shouldGenerate = true;
      //   }
      // }

      if (shouldGenerate) {
        // Check if a checklist item for this task on this day already exists to prevent duplicates
        const checklistQuery = await db.collection('checklists')
          .where('taskId', '==', taskId)
          .where('dueDate', '==', todayDateString)
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
            taskId: taskId,
            notes: '', // Default empty notes
            evidenceLink: '', // Default empty evidence link
            lastCompletedOn: null, // Default null
            completedBy: null, // Default null
            category: taskData.category || null, // Carry over category if present
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
// from your project's root or your functions directory.
// Ensure you have firebase-admin and firebase-functions in your functions/package.json
// (Typically located at `your-project/functions/package.json`)
//
// Example of functions/package.json dependencies:
// "dependencies": {
//   "firebase-admin": "^12.0.0", // Or your current version
//   "firebase-functions": "^5.0.0" // Or your current version
// },
// "devDependencies": {
//   "typescript": "^5.0.0", // Or your current version
//   "firebase-functions-test": "^0.2.0" // Or your current version
// }
//
// Configure environment variables for Firebase if needed.
// Set up Firestore rules for 'recurringTasks' (e.g., read-only for functions)
// and 'checklists' (e.g., write by functions, read/write by authenticated users based on roles).
//
// You will also need to ensure your Firebase project is on the Blaze (pay-as-you-go) plan
// to use scheduled functions outside of the Firebase free tier limits for invoking external services.
// The schedule can be configured in firebase.json or via Google Cloud Console.
// Example firebase.json entry (though functions.pubsub.schedule in code is often preferred):
// {
//   "functions": [
//     {
//       "source": "functions", // or your functions directory
//       "codebase": "default", // or your codebase name
//       "ignore": [
//         "node_modules",
//         ".git",
//         "firebase-debug.log",
//         "firebase-debug.*.log"
//       ],
//       "predeploy": [
//         "npm --prefix \"$RESOURCE_DIR\" run lint", // Example
//         "npm --prefix \"$RESOURCE_DIR\" run build" // If using TypeScript
//       ]
//     }
//   ],
//   "hosting": { /* ... */ },
//   "firestore": { /* ... */ },
//   // "emulators": { /* ... */ } // For local testing
// }
// To deploy this function specifically, if you have multiple:
// firebase deploy --only functions:generateRecurringTasks
//
// Make sure your `functions/package.json` has "main": "lib/index.js" (if your TS output is to lib)
// and your `functions/tsconfig.json` has "outDir": "lib".
// Build your TypeScript to JavaScript before deploying (e.g., `npm run build` in functions dir).
