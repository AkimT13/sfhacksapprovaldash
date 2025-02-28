import { db } from "../../../../config";
import { ref, get } from "firebase/database";

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

const fetchApprovedApplication = async (id) => {
  try {
    const appRef = ref(db, `approved/${id}`);
    const appSnapshot = await get(userRef);
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

const checkInApprovedApplication = async (id) => {
  try {
    const appData = await fetchApprovedApplication(id);
    if (appData === -1 || appData === 2) {
      return appData;
    }

    const updates = {};
    updates[`/approved/${id}/checkedIn`] = true;
    await update(ref(db), updates);
    return 1;
  } catch (error) {
    console.error("Error checking in user:", error);
    return 2;
  }
};
