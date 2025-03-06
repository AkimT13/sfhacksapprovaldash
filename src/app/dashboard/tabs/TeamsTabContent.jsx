import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/modals/UserModal";
import TeamCard from "@/app/components/cards/TeamCard";

export default function TeamsTabContent() {
  const [teams, setTeams] = useState({});
  const [teamMembers, setTeamMembers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const [teamsSnapshot, responsesSnapshot] = await Promise.all([
          get(ref(db, "teams")),
          get(ref(db, "responses")),
        ]);

        const teamsData = teamsSnapshot.exists() ? teamsSnapshot.val() : {};
        const responsesData = responsesSnapshot.exists()
          ? responsesSnapshot.val()
          : {};

        const teamMembersMap = {};
        Object.entries(teamsData).forEach(([teamID, memberIDs]) => {
          teamMembersMap[teamID] = memberIDs
            .map((id) => responsesData[id] && { id, ...responsesData[id] })
            .filter(Boolean);
        });

        setTeams(teamsData);
        setTeamMembers(teamMembersMap);
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
        {Object.keys(teamMembers).length === 0 ? (
          <p className="text-center text-gray-500">No teams found.</p>
        ) : (
          Object.entries(teamMembers).map(([teamID, applications]) => (
            <TeamCard
              key={teamID}
              teamID={teamID}
              initApplications={applications}
            />
          ))
        )}
      </div>
    </div>
  );
}
