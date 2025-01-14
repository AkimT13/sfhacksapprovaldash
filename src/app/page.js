"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config.js";

export default function HomePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className=" flex flex-col items-center w-full h-screen bg-gradient-to-br from-pink-100 to-blue-200">
            <h1 className="text-black text-center text-5xl pt-40 pb-16">Welcome</h1>
            {user ? (
                <p>
                    Signed in as {user.email}. <Link href="/dashboard">Go to Dashboard</Link>
                </p>
            ) : (
                <div className="flex cursor-pointer justify-center items-center bg-[#ffc2e2] w-auto h-auto p-3 rounded-xl">

                  <div classname = 'w-auto bg-slate-700 h-auto rounded-xl self-center'>
                    <p className="text-black"> <Link href="/auth">Sign In</Link></p>
                  </div>
                
               

                </div>
               
            )}
        </div>
    );
}
