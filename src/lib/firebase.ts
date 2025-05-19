
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// =======================================================================================
// !! IMPORTANT: TROUBLESHOOTING "FirebaseError: auth/invalid-api-key" ERRORS !!
//
// This error means the API key Firebase is trying to use is incorrect or not recognized
// by your Firebase project. The code below is correctly trying to USE these keys from
// your environment variables. The problem is almost certainly in YOUR `.env.local` file
// or your Firebase project's settings.
//
// TO FIX THIS - YOU MUST DO THESE STEPS:
//
// 1. CHECK YOUR `.env.local` FILE:
//    - It MUST be in your project's ROOT directory (same level as `package.json`).
//    - Ensure it contains:
//        NEXT_PUBLIC_FIREBASE_API_KEY=YourActualApiKeyFromFirebaseConsole
//        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
//        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
//        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
//        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
//        NEXT_PUBLIC_FIREBASE_APP_ID=1:your-sender-id:web:your-app-id-hash
//    - **TRIPLE-CHECK** that `YourActualApiKeyFromFirebaseConsole` is COPIED EXACTLY from
//      your Firebase project settings (see step 2). NO TYPOS.
//
// 2. CHECK YOUR FIREBASE CONSOLE:
//    - Go to https://console.firebase.google.com/ -> Your Project
//    - Project Settings (Gear icon) -> General tab.
//    - Scroll to "Your apps". Select your web app.
//    - Under "SDK setup and configuration", choose "Config".
//    - The `apiKey` value shown there MUST MATCH what's in your `.env.local`.
//
// 3. RESTART YOUR NEXT.JS DEVELOPMENT SERVER:
//    - After creating or changing `.env.local`, YOU MUST STOP AND RESTART your server
//      (e.g., `npm run dev`). Next.js only loads these variables on startup.
// =======================================================================================

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
const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
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
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id // Optional

# Optional: To use Firebase Emulators
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true # or false
*/
