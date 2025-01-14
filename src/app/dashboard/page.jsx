"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../config";
import { ref, get } from "firebase/database";

export default function DashboardPage() {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const router = useRouter();

    // Fetch applications from Firebase
    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const responsesRef = ref(db, "responses");
                const snapshot = await get(responsesRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const filteredResponses = Object.entries(data)
                        .map(([id, response]) => ({ id, ...response }))
                        .filter(response => !response.isTeam); // Filter users not in a team
                    
                    setResponses(filteredResponses);
                }
            } catch (error) {
                console.error("Error fetching responses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading responses...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Hackathon Applications</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">School</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Role</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="py-2 px-6">{user.data.fields.find(f => f.key === "question_1XXMD4")?.value} {user.data.fields.find(f => f.key === "question_MXXLvE")?.value}</td>
                                <td className="py-2 px-6">{user.data.fields.find(f => f.key === "question_8qqGAk")?.value}</td>
                                <td className="py-2 px-6">{user.data.fields.find(f => f.key === "question_gaaLYM")?.value}</td>
                                <td className="py-2 px-6">
                                    {user.data.fields.find(f => f.key === "question_prrGRy")?.options.find(option => option.id === user.data.fields.find(f => f.key === "question_prrGRy")?.value[0])?.text}
                                </td>
                                <td className="py-2 px-6">
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}

// Modal for displaying user details
function UserModal({ user, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{user.data.fields.find(f => f.key === "question_1XXMD4")?.value} {user.data.fields.find(f => f.key === "question_MXXLvE")?.value}</h2>
                <p><strong>Email:</strong> {user.data.fields.find(f => f.key === "question_gaaLYM")?.value}</p>
                <p><strong>School:</strong> {user.data.fields.find(f => f.key === "question_8qqGAk")?.value}</p>
                <p><strong>Phone:</strong> {user.data.fields.find(f => f.key === "question_XLLE1e")?.value}</p>
                <p><strong>Age:</strong> {user.data.fields.find(f => f.key === "question_JqqLXz")?.value}</p>
                <p><strong>Role:</strong> {user.data.fields.find(f => f.key === "question_prrGRy")?.options.find(option => option.id === user.data.fields.find(f => f.key === "question_prrGRy")?.value[0])?.text}</p>
                <p><strong>Why Attend:</strong> {user.data.fields.find(f => f.key === "question_5bbL8v")?.value}</p>

                <div className="flex justify-end mt-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
