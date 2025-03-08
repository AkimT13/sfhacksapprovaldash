// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Added Firebase Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQUfVZ4at7SL4g7w6S5p7wHh9kFzPToKQ",
  authDomain: "sfhacks2025.firebaseapp.com",
  databaseURL: "https://sfhacks2025-default-rtdb.firebaseio.com",
  projectId: "sfhacks2025",
  storageBucket: "sfhacks2025.firebasestorage.app",
  messagingSenderId: "201532170161",
  appId: "1:201532170161:web:570328cf135db796036790"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getDatabase(app); // Added Realtime Database

// Export Firebase services
export { auth, db };
