
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Emulator support
// Note: Run emulators locally before enabling these lines.
// Command: firebase emulators:start
const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
  // Ensure this is only run once
  if (typeof window !== 'undefined' && !(window as any).__FIREBASE_EMULATOR_CONNECTED) {
    console.log('Connecting to Firebase Emulators...');
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectStorageEmulator(storage, 'localhost', 9199);
      (window as any).__FIREBASE_EMULATOR_CONNECTED = true;
      console.log('Successfully connected to Firebase Emulators.');
    } catch (error) {
      console.error('Error connecting to Firebase Emulators:', error);
    }
  } else if (typeof window !== 'undefined' && (window as any).__FIREBASE_EMULATOR_CONNECTED) {
    console.log('Firebase Emulators already connected.');
  }
}


export { app, auth, db, storage };

/*
Create a .env.local file in your project root with your Firebase config:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: To use Firebase Emulators
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true # or false
*/
