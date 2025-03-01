// UserModal.js - A reusable modal component for displaying user details
import React, { use } from "react";
import Modal from "./Modal";

export default function UserModal({ user, onClose }) {
  if (!user || !user.data || !user.data.fields) {
    return null; // Return nothing if user data is invalid
  }

  return (
    <Modal onCloseCallBack={onClose}>
      <p>
        <strong>id:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_JqqLXz")?.value ||
          "N/A"}
      </p>
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
    </Modal>
  );
}
