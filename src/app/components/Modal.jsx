// UserModal.js - A reusable modal component for displaying user details
import React, { use, useState } from "react";

export default function Modal({ children, onCloseCallBack = () => {} }) {
  // State to manage visibility of the container
  const [isVisible, setIsVisible] = useState(true);

  // Handle close button click
  const handleClose = () => {
    onCloseCallBack();
    setIsVisible(false); // Hide the container when clicked
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className=" justify-end text-5xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
