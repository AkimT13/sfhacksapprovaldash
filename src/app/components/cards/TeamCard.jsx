import React, { useState, useCallback } from "react";
import { db } from "../../../../config";
import { ref, set, update } from "firebase/database";
import ApplicationCard from "./AppCard";

export default function TeamCard({ teamID, initApplications }) {
  const [applications, setApplications] = useState(initApplications);

  const handleApprove = async () => {
    const updates = {};

    try {
      for (let [key, application] of applications.entries()) {
        updates[`/responses/${application.id}/approved`] = true;
        updates[`/approved/${application.id}`] = application;

        setApplications((prevApplications) => {
          const updatedApplications = [...prevApplications];
          updatedApplications[key].approved = true;
          return updatedApplications;
        });
      }

      await update(ref(db), updates); // Update Firebase
    } catch (error) {
      console.error("Error approving team:", error);
    }
  };

  const handleUnapprove = async () => {
    const updates = {};

    try {
      for (let [key, application] of applications.entries()) {
        updates[`/responses/${application.id}/approved`] = false;
        updates[`/approved/${application.id}`] = null;
        console.log(application);

        setApplications((prevApplications) => {
          const updatedApplications = [...prevApplications];
          updatedApplications[key].approved = false;
          return updatedApplications;
        });
      }

      await update(ref(db), updates); // Update Firebase
    } catch (error) {
      console.error("Error approving team:", error);
    }
  };

  const updateApplication = useCallback((id, newApp) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) => (app.id === id ? newApp : app))
    );
  }, []);

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <h2 className="text-md font-semibold mb-3">Team {teamID}</h2>
      <button
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md"
        onClick={() => handleApprove()}
      >
        Approve Team
      </button>
      <button
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md ml-2"
        onClick={() => handleUnapprove()}
      >
        Unapprove Team
      </button>

      {applications.map((application) => (
        <div key={application.id}>
          <ApplicationCard
            application={application}
            updateCallBack={updateApplication}
          />
        </div>
      ))}
    </div>
  );
}
