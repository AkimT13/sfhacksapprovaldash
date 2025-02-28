// UserModal.js - A reusable modal component for displaying user details
import React, { use } from "react";

export default function Modal({ children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
