import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";
import axios from "axios";

export default function WaitlistTabContent() {
  const [waitlistedUsers, setWaitlistedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    const fetchWaitlistedUsers = async () => {
      try {
        setLoading(true);
        const [responsesSnap, approvedSnap] = await Promise.all([
          get(ref(db, "responses")),
          get(ref(db, "approved")),
        ]);

        const responses = responsesSnap.exists() ? responsesSnap.val() : {};
        const approved = approvedSnap.exists() ? approvedSnap.val() : {};

        const waitlisted = {};
        for (const [id, user] of Object.entries(responses)) {
          if (!(id in approved)) {
            waitlisted[id] = user;
          }
        }

        setWaitlistedUsers(waitlisted);
      } catch (error) {
        console.error("Error fetching waitlisted users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistedUsers();
  }, []);

  const handleSelectUser = (id, user) => {
    setSelectedUsers((prev) => {
      const newSelected = { ...prev };
      if (newSelected[id]) {
        delete newSelected[id];
      } else if (Object.keys(newSelected).length < 10) {
        newSelected[id] = user;
      }
      return newSelected;
    });
  };

  const handleSendEmails = async () => {
    const requestData = Object.entries(selectedUsers).map(([id, user]) => ({
      key: id,
      email: user.data?.fields?.find((f) => f.key === "question_gaaLYM")?.value || "N/A",
    }));

    try {
      const response = await axios.post(`https://tallyserver-mpmt.onrender.com/sendWaitlist`, {
        users: requestData,
      });

      const updatedUsers = { ...waitlistedUsers };
      const updates = {};

      response.data.forEach(({ key, emailSucceeded }) => {
        if (updatedUsers[key]) {
          updatedUsers[key] = { ...updatedUsers[key], waitListEmailSucceeded: emailSucceeded };
          updates[`responses/${key}/waitListEmailSucceeded`] = emailSucceeded;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }

      setWaitlistedUsers((prev) => ({ ...prev, ...updatedUsers }));
      setSelectedUsers({});
    } catch (error) {
      console.error("Error sending waitlist emails:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading waitlisted users...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Waitlisted Participants</h1>

      <p className="text-center text-lg mb-4">
        <strong>Total Waitlisted:</strong> {Object.keys(waitlistedUsers).length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(waitlistedUsers).length === 0 ? (
          <p className="text-center text-gray-500">No waitlisted participants found.</p>
        ) : (
          Object.entries(waitlistedUsers).map(([id, user]) => {
            const fullName =
              `${user.data?.fields?.find((f) => f.key === "question_1XXMD4")?.value || "Unknown"} ` +
              `${user.data?.fields?.find((f) => f.key === "question_MXXLvE")?.value || ""}`;
            const email = user.data?.fields?.find((f) => f.key === "question_gaaLYM")?.value || "N/A";

            let cardColor = "bg-white";
            if (user.waitListEmailSucceeded === false) cardColor = "bg-red-200";
            else if (user.waitListEmailSucceeded === true) cardColor = "bg-green-200";

            return (
              <div key={id} className={`${cardColor} shadow-lg p-4 rounded-lg flex items-center gap-4`}>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={!!selectedUsers[id]}
                  onChange={() => handleSelectUser(id, user)}
                  disabled={!selectedUsers[id] && Object.keys(selectedUsers).length >= 10}
                />

                <div>
                  <p><strong>Name:</strong> {fullName}</p>
                  <p><strong>Email:</strong> {email}</p>

                  <button
                    className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded-md"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="fixed bottom-5 right-5 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-lg disabled:bg-gray-300"
        onClick={handleSendEmails}
        disabled={Object.keys(selectedUsers).length === 0}
      >
        Send Waitlist Email
      </button>

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
