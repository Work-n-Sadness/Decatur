
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// =======================================================================================
// !! CRITICAL: TROUBLESHOOTING "FirebaseError: auth/invalid-api-key" ERRORS !!
//
// This error is very common and almost ALWAYS means there's an issue with how your
// Firebase project credentials are configured in your local `.env.local` file, or
// an issue with the API key settings in your Firebase project console.
//
// THE CODE IN THIS FILE IS CORRECTLY TRYING TO USE THE ENVIRONMENT VARIABLES.
// THE PROBLEM IS LIKELY THE *VALUES* OF THOSE VARIABLES OR YOUR PROJECT SETUP.
//
// PLEASE FOLLOW THESE STEPS METICULOUSLY:
//
// 1. CHECK YOUR `.env.local` FILE (PROJECT ROOT DIRECTORY):
//    - It MUST be named EXACTLY `.env.local`.
//    - It MUST be in your project's ROOT directory (same level as `package.json`).
//    - Ensure it contains ALL the following variables with `NEXT_PUBLIC_` prefix:
//        NEXT_PUBLIC_FIREBASE_API_KEY=YourActualApiKeyFromFirebaseConsole
//        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
//        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
//        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
//        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
//        NEXT_PUBLIC_FIREBASE_APP_ID=1:your-sender-id:web:your-app-id-hash
//        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX (Optional, for Analytics)
//
//    - **MOST IMPORTANT**: The value for `NEXT_PUBLIC_FIREBASE_API_KEY` must be
//      COPIED *EXACTLY* from your Firebase project's Web App configuration.
//      NO TYPOS. NO EXTRA SPACES. NO QUOTES (unless they are part of the key).
//
// 2. VERIFY FIREBASE CONSOLE CONFIGURATION:
//    - Go to https://console.firebase.google.com/ -> Your Project.
//    - Click the Gear icon (Project settings) -> General tab.
//    - Scroll to "Your apps". Select your web app.
//    - Under "SDK setup and configuration", choose "Config".
//    - COMPARE EVERY VALUE (apiKey, authDomain, projectId, etc.) with your
//      `.env.local` file. They MUST match exactly.
//    - Check "API Key Restrictions": In Google Cloud Console (APIs & Services > Credentials),
//      ensure the API key has no restrictions preventing its use (e.g., HTTP referrers).
//
// 3. **!!! RESTART YOUR NEXT.JS DEVELOPMENT SERVER !!!**
//    - After creating or modifying `.env.local`, YOU *MUST* STOP AND RESTART
//      your Next.js development server (e.g., `npm run dev`). Next.js only loads
//      environment variables on startup. THIS IS A VERY COMMON OVERSIGHT.
//
// 4. ENSURE FIREBASE AUTHENTICATION IS ENABLED:
//    - In the Firebase Console, go to the "Authentication" section.
//    - If it's your first time, click "Get started".
//    - Ensure desired sign-in methods are enabled.
//    - Under "Settings" > "Authorized domains", ensure `localhost` is listed for development.
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
  // Check if window is defined (i.e., we are on the client side)
  // and if emulators haven't been connected yet to avoid multiple connections.
  if (typeof window !== 'undefined' && !(window as any).__FIREBASE_EMULATOR_CONNECTED) {
    console.log('Connecting to Firebase Emulators...');
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099'); // Ensure URL scheme is http for emulator
      connectStorageEmulator(storage, 'localhost', 9199);
      (window as any).__FIREBASE_EMULATOR_CONNECTED = true; // Flag to prevent reconnecting
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
EXAMPLE .env.local file (MUST BE IN YOUR PROJECT ROOT):

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyYourActualApiKeyFromFirebaseConsole
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-number
NEXT_PUBLIC_FIREBASE_APP_ID=1:your-sender-id-number:web:your-app-id-hash
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX (Optional, for Analytics)

# Optional: To use Firebase Emulators for local development
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
*/
