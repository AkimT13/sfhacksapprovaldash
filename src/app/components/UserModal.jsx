import React from "react";
import Modal from "./Modal";
import schools from "../data/schools.json"; // Import the schools JSON file

export default function UserModal({ user, onClose }) {
  if (!user || !user.data || !user.data.fields) {
    return null; // Return nothing if user data is invalid
  }

  // Extract the school code from user data
  const schoolCode = user.data.fields.find((f) => f.key === "question_8qqGAk")?.value;

  const genderMap = {
    "0b5515fe-f761-42bd-94fd-d65a601140c9": "Male",
    "c877e4e8-6e38-4a9f-88b4-0015ee59cfdf": "Female",
    "32090d06-4d17-4c4c-9211-fd234b412194": "Gender Spectrum",
  };

  

  const raceMap = {
    "9ce9565b-cd7a-47a5-8ac4-e01b4d10e498": "Black or African",
    "1d2efc8e-d243-411d-ace7-09e8593dd932": "Hispanic / Latino / Spanish Origin",
    "75c3af77-d5b8-4697-a8ed-0d1f4927b7f5": "Middle Eastern or North African",
    "f28a46ec-9db0-4b6a-9929-2a709dd4559f": "American Indian or Alaskan Native",
    "a47fdfbc-1ba2-465a-a325-0eaeeb6f5a57": "White",
    "d706fe01-23dd-46fa-8f1f-f58703569e3b": "Pacific Islander",
    "a7376e6f-9887-4549-9ce9-d6944394d61f": "Other (Please Specify)",
    "2d553f7e-d0e5-40f6-b98b-b4b72c0ac5b3": "Prefer Not to Answer",
    "2c326656-49ef-488b-9e82-76f09e910834": "Central Asian (e.g., Kazakhstan, Uzbekistan)",
    "354404fe-4100-41f9-89a3-884fe479bf9b": "East Asian (e.g., Chinese, Japanese, Korean)",
    "61b929c2-47df-42f3-85c9-fd82b1a239a5": "South Asian (e.g., Indian, Pakistani, Bangladeshi)",
    "2007c8ac-6799-40be-99e9-e2dd988fe3e4": "Southeast Asian (e.g., Filipino, Vietnamese, Indonesian)",
  };

  const majorsMap = {
    "717b9b25-16cd-4c2e-94bc-aecdd4aa82bf": "Computer Science, Computer Engineering, or Software Engineering",
    "9aebb2e6-7adf-4a74-833b-a4cd697b3a72": "Another Engineering discipline (such as Civil, Electrical, Mechanical, etc.)",
    "67fad239-220c-43c9-89c2-8423c47b31f4": "Information Systems, Information Technology, or System Administration",
    "6b4ec753-06c0-4585-aed1-a1a1cfd34baa": "Natural Sciences (such as Biology, Chemistry, Physics, etc.)",
    "db80f000-f2ad-4b9f-8167-f2f9e105efb3": "Mathematics or Statistics",
    "634a234d-577e-479d-95e0-ed48f86eda55": "Web Development or Web Design",
    "3be72344-4aca-4e9b-854d-5c6a0b5bc766": "Business discipline (such as accounting, finance, marketing, etc.)",
    "5dd53606-ee8b-4e97-9220-c0a7289c444b": "Humanities discipline (such as literature, history, philosophy, etc.)",
    "5e4de481-360c-435a-b68f-4f700b5c0e51": "Social Science (such as anthropology, psychology, political science, etc.)",
    "656f6304-1429-4d18-8c72-556a45e3d42b": "Fine Arts or Performing Arts (such as graphic design, music, studio art, etc.)",
    "1b8108d5-4f3c-433d-8159-110e4917fc7a": "Health Science (such as nursing, pharmacy, radiology, etc.)",
    "97e227a6-6dae-459e-9505-f4f3bf0f791f": "Other (please specify)",
    "eb0173d2-e774-4ec5-a04a-cb0231eb2643": "Undecided / Undeclared Major",
    "45cdba80-1f45-4833-8d98-ece868c20720": "My school does not offer majors / primary areas of study",
    "ea2bfbde-08b7-433d-a85c-b5a56d8923e0": "Prefer not to answer",
  };

  const identifiesAsMap = {
    "e962f4ba-9506-4034-8b07-0671b1eca1b8": "Veteran",
    "04b5cfa1-79a3-47e1-b03c-d8d75942b8bd": "International Student",
    "08ddd183-1750-4aa2-b3e3-f7f1dd8f3763": "First Generation Student",
    "cb2bf716-5fff-4b98-86da-c16f771621fc": "LGBTQ",
  };

  const majorKey = user.data.fields.find((f) => f.key === "question_jZZL5Y")?.value?.[0] || null;
  let major = "Not selected";
  if (majorKey && majorsMap[majorKey]) {
    major = majorsMap[majorKey];
  }

  // Find the corresponding school name, defaulting to "Some other school" if not found
  const schoolName = schools[schoolCode] || "Some other school";

  // Check if the user is in the US
  const isInUS =
    user.data.fields.find((f) => f.key === "question_0ddL1P")?.value?.[0] ===
    "bec3ef4f-6cb3-4366-a043-e29d77ac25cf";

  // Extract Gender
  const genderKey = user.data.fields[20]?.value?.[0] || null;
  let gender = "Not selected";
  if (genderKey && genderMap[genderKey]) {
    gender = genderMap[genderKey];
  }

  // Extract Race
  const raceKey = user.data.fields.find((f) => f.key === "question_race")?.value?.[0] || null;
  let race = "Not selected";
  if (raceKey && raceMap[raceKey]) {
    race = raceMap[raceKey];
  }

  // Extract Identifies As
  const identifiesAsKeys = user.data.fields.find((f) => f.key === "question_4QQLAd")?.value || [];
  let identifiesAs = identifiesAsKeys.map((key) => identifiesAsMap[key]).filter(Boolean);
  if (identifiesAs.length === 0) {
    identifiesAs = ["Not selected"];
  }

  return (
    <Modal onCloseCallBack={onClose}>
      <p>
        <strong>id:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_JqqLXz")?.value || "N/A"}
      </p>
      <h2 className="text-2xl font-bold mb-4">
        {user.data.fields.find((f) => f.key === "question_1XXMD4")?.value || "Unknown"}{" "}
        {user.data.fields.find((f) => f.key === "question_MXXLvE")?.value || ""}
      </h2>
      <p>
        <strong>US?:</strong> {isInUS ? "Yes" : "No"}
      </p>
      <p>
        <strong>Email:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_gaaLYM")?.value || "N/A"}
      </p>
      <p>
        <strong>School:</strong> {schoolName}
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_XLLE1e")?.value || "N/A"}
      </p>
      <p>
        <strong>Age:</strong>{" "}
        {user.data.fields.find((f) => f.key === "question_JqqLXz")?.value || "N/A"}
      </p>
      <p>
        <strong>Gender:</strong> {gender}
      </p>
      <p>
        <strong>Race:</strong> {race}
      </p>
      <p>
        <strong>Identifies as:</strong> {identifiesAs.join(", ")}
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
        {user.data.fields.find((f) => f.key === "question_5bbL8v")?.value || "N/A"}
      </p>
      <p>
        <strong>Major:</strong> {major}
      </p>
    </Modal>
  );
}
