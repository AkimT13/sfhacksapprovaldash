import { auth } from "../../../config";
import { ref, get, update, userRef } from "firebase/database";
import { db } from "../../../config";

const fetchResponses = async () => {
  try {
    const responsesRef = ref(db, "responses");
    const responsesSnapshot = await get(responsesRef);
    const responsesData = responsesSnapshot.exists()
      ? responsesSnapshot.val()
      : {};

    const allApplicants = Object.entries(responsesData).map(
      ([id, response]) => ({ id, ...response })
    );
    setResponses(allApplicants);
  } catch (error) {
    console.error("Error fetching responses:", error);
  } finally {
    setLoading(false);
  }
};

export const fetchApprovedApplication = async (id) => {
  try {
    const appRef = ref(db, `approved/${id}`);
    const appSnapshot = await get(appRef);
    if (appSnapshot.exists()) {
      const appData = appSnapshot.val();
      return appData;
    }

    // If the data doesn't exist
    console.error("No data found for this application ID.");
    return -1;
  } catch (error) {
    console.error("Error fetching user information:", error);
    return 2;
  }
};

/**
 *
 * @param {string} id
 * @returns {Promise<number>} 0 if successful, 1 if user has already been checked in, 2 if error.
 */
export const checkInApprovedApplication = async (id) => {
  try {
    const appData = await fetchApprovedApplication(id);
    if (appData === -1 || appData === 2) {
      return appData;
    }

    const updates = {};

    if (appData.checkedIn) {
      console.error("User has already been checked in.");
      return 1;
    }

    updates[`/approved/${id}/checkedIn`] = true;
    await update(ref(db), updates);
    return 0;
  } catch (error) {
    console.error("Error checking in user:", error);
    return 2;
  }
};
