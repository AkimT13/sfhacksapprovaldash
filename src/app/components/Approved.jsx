// Approved.js - Displays a counter and list of approved users
import React, { useEffect, useState } from "react";
import { db } from "../../../config";
import { ref, get } from "firebase/database";
import UserModal from "../components/UserModal";

export default function Approved() {
    const [approvedUsers, setApprovedUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedUsers = async () => {
            try {
                setLoading(true);
                const approvedRef = ref(db, "approved");
                const approvedSnapshot = await get(approvedRef);
                const approvedData = approvedSnapshot.exists() ? approvedSnapshot.val() : {};

                console.log("Approved Users:", approvedData);
                setApprovedUsers(approvedData);
            } catch (error) {
                console.error("Error fetching approved users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedUsers();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading approved users...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Approved Participants</h1>
            <p className="text-lg text-center mb-4">Total Approved: {Object.keys(approvedUsers).length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(approvedUsers).length === 0 ? (
                    <p className="text-center text-gray-500">No approved participants found.</p>
                ) : (
                    Object.entries(approvedUsers).map(([id, user]) => (
                        <div key={id} className="bg-white shadow-lg p-4 rounded-lg">
                            <p><strong>Name:</strong> {user.data?.fields?.find(f => f.key === "question_1XXMD4")?.value || "Unknown"} {user.data?.fields?.find(f => f.key === "question_MXXLvE")?.value || ""}</p>
                            <p><strong>Email:</strong> {user.data?.fields?.find(f => f.key === "question_gaaLYM")?.value || "N/A"}</p>
                            <button
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                                onClick={() => setSelectedUser(user)}
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
            {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
