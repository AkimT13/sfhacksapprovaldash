import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";

export default function IndividualAppsTabContent() {
  const [responses, setResponses] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const majorsMap = {
    "717b9b25-16cd-4c2e-94bc-aecdd4aa82bf": "Computer Science, Computer Engineering, or Software Engineering",
    "9aebb2e6-7adf-4a74-833b-a4cd697b3a72": "Another Engineering discipline (such as Civil, Electrical, Mechanical, etc.)",
    "67fad239-220c-43c9-89c2-8423c47b31f4": "Information Systems, Information Technology, or System Administration",
    "6b4ec753-06c0-4585-aed1-a1a1cfd34baa": "Natural Sciences (such as Biology, Chemistry, Physics, etc.)",
    "db80f000-f2ad-4b9f-8167-f2f9e105efb3": "Mathematics or Statistics",
    "634a234d-577e-479d-95e0-ed48f86eda55": "Web Development or Web Design",
    "3be72344-4aca-4e9b-854d-5c6a0b5bc766": "Business discipline (such as accounting, finance, marketing, etc.)",
    "5dd53606-ee8b-4e97-9220-c0a7289c444b": "Humanities discipline (such as literature, history, philosophy, etc.)",
    "5e4de481-360c-435a-b68f-4f700b5c0e51": "Social Science (such as anthropology, psychology, political science, etc.)",
    "656f6304-1429-4d18-8c72-556a45e3d42b": "Fine Arts or Performing Arts (such as graphic design, music, studio art, etc.)",
    "1b8108d5-4f3c-433d-8159-110e4917fc7a": "Health Science (such as nursing, pharmacy, radiology, etc.)",
    "97e227a6-6dae-459e-9505-f4f3bf0f791f": "Other (please specify)",
    "eb0173d2-e774-4ec5-a04a-cb0231eb2643": "Undecided / Undeclared Major",
    "45cdba80-1f45-4833-8d98-ece868c20720": "My school does not offer majors / primary areas of study",
    "ea2bfbde-08b7-433d-a85c-b5a56d8923e0": "Prefer not to answer",
  };

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
              <p className="text-xl">
                <strong>Major :</strong>{" "}
                {majorsMap[user.data.fields.find((f) => f.key === "question_jZZL5Y")?.value]}
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
