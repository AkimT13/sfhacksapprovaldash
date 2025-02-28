import { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get } from "firebase/database";

export default function IndividualAppsTabContent() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("individuals");

  useEffect(() => {
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

    fetchResponses();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading responses...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {responses.map((user) => (
        <div key={user.id} className="bg-white shadow-lg p-4 rounded-lg">
          <p>
            <strong>Name:</strong>{" "}
            {user.data.fields.find((f) => f.key === "question_1XXMD4")?.value}{" "}
            {user.data.fields.find((f) => f.key === "question_MXXLvE")?.value}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {user.data.fields.find((f) => f.key === "question_gaaLYM")?.value}
          </p>
        </div>
      ))}
    </div>
  );
}
