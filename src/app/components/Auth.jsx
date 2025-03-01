"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import signIn from "../utils/signIn";
import user from "../utils/signIn";

export const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    await signIn(email, password);
    if (user) {
      router.push("/Dashboard");
    } else {
      alert("wrong password or email");
    }
  };
  return (
    <div>
      <p className="text-3xl font-bold">SF Hacks Dashboard</p>
    </div>
  );
};
