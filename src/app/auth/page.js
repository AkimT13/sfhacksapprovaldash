"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config"; // Ensure correct Firebase path

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard"); // Redirect to dashboard after login
        } catch (error) {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-200">
			<p className=" text-black text-3xl p-3 font-bold ">SF Hacks 2025 Dashboard</p>
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>
                <form onSubmit={handleSignIn} className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-3 mb-4 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-blue-500 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}
