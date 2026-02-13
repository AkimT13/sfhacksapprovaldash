// checkIn.js

import { ref, get, update, runTransaction } from 'firebase/database';
import { db } from '../../../config';

/**
 * Fetch accepted user info from accepted2026/{userId}
 * @param {string} userId
 * @returns {Promise<object|number>} object if found, -1 if not found, 2 if error
 */
export const fetchAcceptedUser = async (userId) => {
  try {
    const userSnap = await get(ref(db, `accepted2026/${userId}`));
    if (!userSnap.exists()) return -1;
    return userSnap.val();
  } catch (error) {
    console.error('Error fetching accepted user:', error);
    return 2;
  }
};

/**
 * Check-in an accepted user by setting accepted2026/{userId}/checkedIn = true
 * and incrementing checkInCount.
 *
 * Return codes:
 *  0 = success
 *  1 = already checked in
 * -1 = not found in accepted2026
 *  2 = error
 *
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const checkInAcceptedUser = async (userId) => {
  try {
    const user = await fetchAcceptedUser(userId);
    if (user === -1 || user === 2) return user;

    if (user.checkedIn === true) {
      console.error('User has already been checked in.');
      return 1;
    }

    const updates = {};
    updates[`/accepted2026/${userId}/checkedIn`] = true;
    updates[`/accepted2026/${userId}/checkedInAt`] = Date.now();

    await update(ref(db), updates);

    const countRef = ref(db, 'checkInCount');
    await runTransaction(countRef, (currentValue) => (currentValue || 0) + 1);

    return 0;
  } catch (error) {
    console.error('Error checking in user:', error);
    return 2;
  }
};