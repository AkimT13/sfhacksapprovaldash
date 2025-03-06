import React, { useEffect, useState, useCallback } from "react";
import UserModal from "../../components/modals/UserModal";
import { update, ref, } from "firebase/database";
import { db } from "../../../../config";

export default function ApplicationCard({
  application,
  updateCallBack = (id, application) => {},
}) {
  const [isSelected, setIsSelected] = useState(false);

  const handleApprove = async () => {
    try {
      const updatedApplication = { ...application, approved: true };

      const updates = {
        [`/responses/${application.id}/approved`]: true,
        [`/approved/${application.id}`]: updatedApplication,
      };
      updateCallBack(application.id, updatedApplication);
      await update(ref(db), updates);
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleUnapprove = async () => {
    try {
      const updatedApplication = { ...application, approved: false };

      const updates = {
        [`/responses/${application.id}/approved`]: false,
        [`/approved/${application.id}`]: null,
      };
      updateCallBack(application.id, updatedApplication);
      await update(ref(db), updates);
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  return (
    <div
      className={`h-full border p-3 rounded-md mb-2 transition-colors duration-300 ${
        application.approved ? "bg-green-200" : "bg-white"
      }`}
    >
      <p>
        <strong>Name:</strong>{" "}
        {application.data?.fields?.find((f) => f.key === "question_1XXMD4")
          ?.value || "Unknown"}{" "}
        {application.data?.fields?.find((f) => f.key === "question_MXXLvE")
          ?.value || ""}
      </p>
      <div className="flex justify-between">
        <button
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
          onClick={() => setIsSelected(true)}
        >
          View Details
        </button>
        <div className="w-1/2">
          <button
            className="mt-2 px-3 py-1 bg-black text-white rounded-md"
            onClick={() => handleApprove()}
          >
            Approve
          </button>
          <button
            className="mt-2 px-3 py-1 bg-gray-400 text-white rounded-md"
            onClick={() => handleUnapprove()}
          >
            Deny
          </button>
        </div>
      </div>
      {isSelected && (
        <UserModal user={application} onClose={() => setIsSelected(false)} />
      )}
    </div>
  );
}
