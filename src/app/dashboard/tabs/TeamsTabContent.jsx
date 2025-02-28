import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";

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

                const [teamsSnapshot, responsesSnapshot, approvedSnapshot] = await Promise.all([
                    get(teamsRef),
                    get(responsesRef),
                    get(approvedRef)
                ]);

                const teamsData = teamsSnapshot.exists() ? teamsSnapshot.val() : {};
                const responsesData = responsesSnapshot.exists() ? responsesSnapshot.val() : {};
                const approvedData = approvedSnapshot.exists() ? approvedSnapshot.val() : {};

                console.log("Teams Data:", teamsData);
                console.log("Responses Data:", responsesData);
                console.log("Approved Users:", approvedData);

                const teamMembersMap = {};
                Object.entries(teamsData).forEach(([teamID, memberIDs]) => {
                    teamMembersMap[teamID] = memberIDs
                        .map(id => responsesData[id] ? { id, ...responsesData[id] } : null)
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

    const handleApprove = async (teamID) => {
        try {
            const updates = {};
            const newApprovedUsers = { ...approvedUsers }; // Clone current approved users

            teamMembers[teamID].forEach(member => {
                updates[`/approved/${member.id}`] = member;
                updates[`/responses/${member.id}/accepted`] = true;
                newApprovedUsers[member.id] = member; // Update local state
            });

            setApprovedUsers(newApprovedUsers); // Update UI immediately
            await update(ref(db), updates); // Update Firebase
        } catch (error) {
            console.error("Error approving team:", error);
        }
    };

    const handleUnapprove = async (teamID) => {
        try {
            const updates = {};
            const newApprovedUsers = { ...approvedUsers }; // Clone current approved users

            teamMembers[teamID].forEach(member => {
                updates[`/approved/${member.id}`] = null;
                updates[`/responses/${member.id}/accepted`] = false;
                delete newApprovedUsers[member.id]; // Remove from local state
            });

            setApprovedUsers(newApprovedUsers); // Update UI immediately
            await update(ref(db), updates); // Update Firebase
        } catch (error) {
            console.error("Error unapproving team:", error);
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading teams...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Teams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(teamMembers).length === 0 ? (
                    <p className="text-center text-gray-500">No teams found.</p>
                ) : (
                    Object.entries(teamMembers).map(([teamID, members]) => (
                        <div key={teamID} className="bg-white shadow-lg p-4 rounded-lg">
                            <h2 className="text-md font-semibold mb-3">Team {teamID}</h2>
                            <button
                                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md"
                                onClick={() => handleApprove(teamID)}
                            >
                                Approve Team
                            </button>
                            <button
                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md ml-2"
                                onClick={() => handleUnapprove(teamID)}
                            >
                                Unapprove Team
                            </button>
                            {members.map(user => (
                                <div 
                                    key={user.id} 
                                    className={`border p-3 rounded-md mb-2 transition-colors duration-300 ${approvedUsers[user.id] ? 'bg-green-200' : 'bg-white'}`}
                                >
                                    <p><strong>Name:</strong> {user.data?.fields?.find(f => f.key === "question_1XXMD4")?.value || "Unknown"} {user.data?.fields?.find(f => f.key === "question_MXXLvE")?.value || ""}</p>
                                    <button
                                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
