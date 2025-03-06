import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";
import axios from "axios";

export default function ApprovedTabContent() {
  const [approvedUsers, setApprovedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        setLoading(true);
        const approvedRef = ref(db, "approved");
        const approvedSnapshot = await get(approvedRef);
        const approvedData = approvedSnapshot.exists() ? approvedSnapshot.val() : {};
        setApprovedUsers(approvedData);
      } catch (error) {
        console.error("Error fetching approved users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedUsers();
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
      const response = await axios.post(`https://tallyserver-1.onrender.com/generate-qrcodes`, { users: requestData });
      console.log("API Base URL:", process.env.API_URL);
      const updatedUsers = { ...approvedUsers };
  
      const updates = {}; // Object to store Firebase updates
  
      response.data.forEach(({ key, emailSucceeded }) => {
        if (updatedUsers[key]) {
          updatedUsers[key] = { ...updatedUsers[key], emailSucceeded };
          updates[`approved/${key}/emailSucceeded`] = emailSucceeded; // Prepare Firebase update
        }
      });
  
      // Update Firebase with emailSucceeded status for all users
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
  
      setApprovedUsers((prev) => ({ ...prev, ...updatedUsers }));
      setSelectedUsers({});
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading approved users...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Approved Participants</h1>
      <p className="text-lg text-center mb-4">Total Approved: {Object.keys(approvedUsers).length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(approvedUsers).length === 0 ? (
          <p className="text-center text-gray-500">No approved participants found.</p>
        ) : (
          Object.entries(approvedUsers).map(([id, user]) => {
            const fullName =
              `${user.data?.fields?.find((f) => f.key === "question_1XXMD4")?.value || "Unknown"} ` +
              `${user.data?.fields?.find((f) => f.key === "question_MXXLvE")?.value || ""}`;
            const email = user.data?.fields?.find((f) => f.key === "question_gaaLYM")?.value || "N/A";
            const emailStatus = user.emailSucceeded;
            let cardColor = "bg-white";
            if (emailStatus === false) cardColor = "bg-red-200";
            else if (emailStatus === true) cardColor = "bg-green-200";

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
                  <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md" onClick={() => setSelectedUser(user)}>
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
        Send QR Codes
      </button>
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
