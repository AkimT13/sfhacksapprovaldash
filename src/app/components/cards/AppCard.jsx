import React, { useEffect, useState, useCallback } from "react";
import UserModal from "../../components/modals/UserModal";

export default function ApplicationCard({
  application,
  updateCallBack = () => {},
}) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`border p-3 rounded-md mb-2 transition-colors duration-300 ${
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
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
        onClick={() => setIsSelected(true)}
      >
        View Details
      </button>
      {isSelected && (
        <UserModal user={application} onClose={() => setIsSelected(false)} />
      )}
    </div>
  );
}
