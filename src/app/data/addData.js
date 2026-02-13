// addData.js

const fs = require('fs');
const path = require('path');

// Your config file is ESM (uses import/export). Node can't require it reliably in CJS.
// So: create a tiny Node-specific Firebase init in this file using the SAME config.
// (This uses the Web SDK, which is fine for a one-off script.)

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update } = require('firebase/database');

const firebaseConfig = {
  apiKey: 'AIzaSyBQUfVZ4at7SL4g7w6S5p7wHh9kFzPToKQ',
  authDomain: 'sfhacks2025.firebaseapp.com',
  databaseURL: 'https://sfhacks2025-default-rtdb.firebaseio.com',
  projectId: 'sfhacks2025',
  storageBucket: 'sfhacks2025.firebasestorage.app',
  messagingSenderId: '201532170161',
  appId: '1:201532170161:web:570328cf135db796036790'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function main() {
  try {
    const filePath = path.join(__dirname, 'accepted2026.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error('accepted2026.json must be an array');
    }

    const upload = {};
    for (const entry of data) {
      const { user_id, ...rest } = entry;

      if (typeof user_id !== 'string' || user_id.trim().length === 0) {
        console.warn('Skipping entry with invalid user_id:', entry);
        continue;
      }

      upload[user_id] = rest;
    }

    // ✅ merge into accepted2026 without overwriting other top-level nodes
    await update(ref(db, 'accepted2026'), upload);

    console.log(`✅ Uploaded ${Object.keys(upload).length} users to accepted2026`);
  } catch (err) {
    console.error('❌ Upload failed:', err);
    process.exitCode = 1;
  }
}

main();