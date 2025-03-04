import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/modals/UserModal";
import TeamCard from "@/app/components/cards/TeamCard";

export default function TeamsTabContent() {
  const [teams, setTeams] = useState({});
  const [teamMembers, setTeamMembers] = useState({});
  const [approvedUsers, setApprovedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const teamsRef = ref(db, "teams");
        const responsesRef = ref(db, "responses");
        const approvedRef = ref(db, "approved");

        const [teamsSnapshot, responsesSnapshot, approvedSnapshot] =
          await Promise.all([
            get(teamsRef),
            get(responsesRef),
            get(approvedRef),
          ]);

        const teamsData = teamsSnapshot.exists() ? teamsSnapshot.val() : {};
        const responsesData = responsesSnapshot.exists()
          ? responsesSnapshot.val()
          : {};
        const approvedData = approvedSnapshot.exists()
          ? approvedSnapshot.val()
          : {};

        console.log("Teams Data:", teamsData);
        console.log("Responses Data:", responsesData);
        console.log("Approved Users:", approvedData);

        const teamMembersMap = {};
        Object.entries(teamsData).forEach(([teamID, memberIDs]) => {
          teamMembersMap[teamID] = memberIDs
            .map((id) =>
              responsesData[id] ? { id, ...responsesData[id] } : null
            )
            .filter(Boolean);
        });

        setTeams(teamsData);
        setTeamMembers(teamMembersMap);
        setApprovedUsers(approvedData);
      } catch (error) {
        console.error("Error fetching teams and members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading teams...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(teamMembers).length === 0 ? (
          <p className="text-center text-gray-500">No teams found.</p>
        ) : (
          Object.entries(teamMembers).map(([teamID, applications]) => (
            <div key={teamID}>
              <TeamCard teamID={teamID} initApplications={applications} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
