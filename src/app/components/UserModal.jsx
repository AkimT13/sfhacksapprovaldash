// UserModal.js - A reusable modal component for displaying user details
import React, { use } from "react";
import Modal from "./Modal";

export default function UserModal({ user, onClose }) {
  if (!user || !user.data || !user.data.fields) {
    return null; // Return nothing if user data is invalid
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">
        {user.data.fields.find((f) => f.key === "question_1XXMD4")?.value ||
          "Unknown"}{" "}
        {user.data.fields.find((f) => f.key === "question_MXXLvE")?.value || ""}
      </h2>
      <p>
        <strong>Email:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_gaaLYM")?.value ||
          "N/A"}
      </p>
      <p>
        <strong>School:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_8qqGAk")?.value ||
          "N/A"}
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_XLLE1e")?.value ||
          "N/A"}
      </p>
      <p>
        <strong>Age:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_JqqLXz")?.value ||
          "N/A"}
      </p>
      <p>
        <strong>Role:</strong>{" "}
        {user.data.fields
          .find((f) => f.key === "question_prrGRy")
          ?.options?.find(
            (option) =>
              option.id ===
              user.data.fields.find((f) => f.key === "question_prrGRy")
                ?.value?.[0]
          )?.text || "N/A"}
      </p>
      <p>
        <strong>Why Attend:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_5bbL8v")?.value ||
          "N/A"}
      </p>

      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
