import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";

export default function IndividualAppsTabContent() {
  const [responses, setResponses] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responsesRef = ref(db, "responses");
        const approvedRef = ref(db, "approved");

        const [responsesSnapshot, approvedSnapshot] = await Promise.all([
          get(responsesRef),
          get(approvedRef),
        ]);

        const responsesData = responsesSnapshot.exists()
          ? responsesSnapshot.val()
          : {};
        const approvedData = approvedSnapshot.exists() ? approvedSnapshot.val() : {};

        const allApplicants = Object.entries(responsesData)
          .map(([id, response]) => ({ id, ...response }))
          .filter((user) => !user.isTeam); // Skip users who signed up as a team

        setResponses(allApplicants);
        setApprovedUsers(approvedData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const handleApprove = async (userID, user) => {
    try {
      const updates = {
        [`/approved/${userID}`]: user,
      };

      setApprovedUsers((prev) => ({ ...prev, [userID]: user }));
      await update(ref(db), updates);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleUnapprove = async (userID) => {
    try {
      const updates = {
        [`/approved/${userID}`]: null,
      };

      setApprovedUsers((prev) => {
        const newApprovedUsers = { ...prev };
        delete newApprovedUsers[userID];
        return newApprovedUsers;
      });

      await update(ref(db), updates);
    } catch (error) {
      console.error("Error unapproving user:", error);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading responses...</p>;

  return (
    <div className="p-4">
      <div className="mb-4 p-2 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">Color Legend:</h2>
        <p className="bg-blue-200 p-1 inline-block rounded">Hacker</p>
        <p className="bg-green-200 p-1 inline-block rounded ml-2">Mentor</p>
        <p className="bg-yellow-200 p-1 inline-block rounded ml-2">Judge</p>
        <p className="bg-gray-200 p-1 inline-block rounded ml-2">Spectator</p>
        <p className="bg-red-200 p-1 inline-block rounded ml-2">Volunteer</p>
      </div>
      <p className="text-lg font-semibold mb-2">
        Applicants (individual not team): {responses.length}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {responses.map((user) => {
          const roleKey = user.data.fields[3]?.value?.[0];
          let cardColor = "bg-white";

          if (roleKey === "8f029033-3da1-486d-a30b-21b89f521ae1") cardColor = "bg-blue-200"; // Hacker
          else if (roleKey === "6d765c6b-14f3-480e-9620-8daa7b4472e8") cardColor = "bg-green-200"; // Mentor
          else if (roleKey === "8af8acda-7038-4781-86e8-1303ad345f71") cardColor = "bg-yellow-200"; // Judge
          else if (roleKey === "f40e3753-e01e-4f46-b1f8-ebc2b8b28e01") cardColor = "bg-gray-200"; // Spectator
          else if (roleKey === "76d197ad-8799-40ee-a737-ea8e2c607be5") cardColor = "bg-red-200"; // Volunteer

          return (
            <div key={user.id} className={`${cardColor} shadow-lg p-4 rounded-lg`}>
              <p className="text-xl">
                <strong>Name:</strong>{" "}
                {user.data.fields.find((f) => f.key === "question_1XXMD4")?.value}{" "}
                {user.data.fields.find((f) => f.key === "question_MXXLvE")?.value}
              </p>
              <p className="text-xl">
                <strong>Email (school):</strong>{" "}
                {user.data.fields.find((f) => f.key === "question_yMMxj6")?.value}
              </p>
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                onClick={() => setSelectedUser(user)}
              >
                View Details
              </button>
              <button
                className={`mt-2 px-3 py-1 rounded-md ml-2 ${
                  approvedUsers[user.id] ? "bg-red-500" : "bg-green-500"
                } text-white`}
                onClick={() =>
                  approvedUsers[user.id]
                    ? handleUnapprove(user.id)
                    : handleApprove(user.id, user)
                }
              >
                {approvedUsers[user.id] ? "Unapprove" : "Approve"}
              </button>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
