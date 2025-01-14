// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Added Firebase Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdsm2Pdu7ao_y-iaY6Caws8FeZLfXfCyM",
  authDomain: "sfhacks2025dev.firebaseapp.com",
  databaseURL: "https://sfhacks2025dev-default-rtdb.firebaseio.com", // Ensure correct database URL
  projectId: "sfhacks2025dev",
  storageBucket: "sfhacks2025dev.firebasestorage.app",
  messagingSenderId: "382680714846",
  appId: "1:382680714846:web:9a143298eaac7575d6eecf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getDatabase(app); // Added Realtime Database

// Export Firebase services
export { auth, db };
