import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { ref, get, update } from "firebase/database";
import UserModal from "../../components/UserModal";
import axios from "axios";

export default function ApprovedTabContent() {
  const [approvedUsers, setApprovedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [roleCounts, setRoleCounts] = useState({
    hackers: 0,
    mentors: 0,
    judges: 0,
    volunteers: 0,
    spectators: 0,
  });
  const [sfsuCount, setSFSUCount] = useState(0);
  const [genderCounts, setGenderCounts] = useState({
    male: 0,
    female: 0,
    spectrum: 0 

  });

  const [raceCounts, setRaceCounts] = useState({
    black: 0,
    hispanic: 0,
    middleEastern: 0,
    nativeAmerican: 0,
    white: 0,
    pacificIslander: 0,
    other: 0,
    preferNotToAnswer: 0,
    centralAsian: 0,
    eastAsian: 0,
    southAsian: 0,
    southeastAsian: 0,
  });

  const [shirts, setShirts] = useState({
    sm: 0,

  })

  
  

  

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        setLoading(true);
        const approvedRef = ref(db, "approved");
        const approvedSnapshot = await get(approvedRef);
        const approvedData = approvedSnapshot.exists() ? approvedSnapshot.val() : {};
  
        let hackers = 0;
        let mentors = 0;
        let judges = 0;
        let volunteers = 0;
        let spectators = 0;
  
        let males = 0;
        let females = 0;
        let genderSpectrums = 0;
        
        let sfsuCountTemp = 0;
        
        let raceCountsTemp = {
          black: 0,
          hispanic: 0,
          middleEastern: 0,
          nativeAmerican: 0,
          white: 0,
          pacificIslander: 0,
          other: 0,
          preferNotToAnswer: 0,
          centralAsian: 0,
          eastAsian: 0,
          southAsian: 0,
          southeastAsian: 0,
        };
  
        const raceMap = {
          "9ce9565b-cd7a-47a5-8ac4-e01b4d10e498": "black",
          "1d2efc8e-d243-411d-ace7-09e8593dd932": "hispanic",
          "75c3af77-d5b8-4697-a8ed-0d1f4927b7f5": "middleEastern",
          "f28a46ec-9db0-4b6a-9929-2a709dd4559f": "nativeAmerican",
          "a47fdfbc-1ba2-465a-a325-0eaeeb6f5a57": "white",
          "d706fe01-23dd-46fa-8f1f-f58703569e3b": "pacificIslander",
          "a7376e6f-9887-4549-9ce9-d6944394d61f": "other",
          "2d553f7e-d0e5-40f6-b98b-b4b72c0ac5b3": "preferNotToAnswer",
          "2c326656-49ef-488b-9e82-76f09e910834": "centralAsian",
          "354404fe-4100-41f9-89a3-884fe479bf9b": "eastAsian",
          "61b929c2-47df-42f3-85c9-fd82b1a239a5": "southAsian",
          "2007c8ac-6799-40be-99e9-e2dd988fe3e4": "southeastAsian",
        };
  
        Object.values(approvedData).forEach((user) => {
          const roleKey = user.data?.fields[3]?.value?.[0];
          const schoolKey = user.data?.fields[10]?.value?.[0];
          const genderKey = user.data?.fields[20]?.value?.[0] || null;
          const raceKey = user.data?.fields.find((f) => f.key === "question_EKKLvA")?.value?.[0] || null;
          
          // Count SFSU participants
          if (schoolKey === "100de79c-70c1-4630-9797-044e19191ba9") {
            sfsuCountTemp++;
          }
          
          let roleColor = "bg-white"

    if (roleKey === "8f029033-3da1-486d-a30b-21b89f521ae1") roleColor = "bg-blue-200"; // Hacker
  else if (roleKey === "6d765c6b-14f3-480e-9620-8daa7b4472e8") roleColor = "bg-green-200"; // Mentor
  else if (roleKey === "8af8acda-7038-4781-86e8-1303ad345f71") roleColor = "bg-yellow-200"; // Judge
  else if (roleKey === "f40e3753-e01e-4f46-b1f8-ebc2b8b28e01") roleColor = "bg-gray-200"; // Spectator
  else if (roleKey === "76d197ad-8799-40ee-a737-ea8e2c607be5") roleColor = "bg-red-200"; // Vol
          // Count roles
          if (roleKey === "8f029033-3da1-486d-a30b-21b89f521ae1") hackers++;
          else if (roleKey === "6d765c6b-14f3-480e-9620-8daa7b4472e8") mentors++;
          else if (roleKey === "8af8acda-7038-4781-86e8-1303ad345f71") judges++;
          else if (roleKey === "76d197ad-8799-40ee-a737-ea8e2c607be5") volunteers++;
          else if (roleKey === "f40e3753-e01e-4f46-b1f8-ebc2b8b28e01") spectators++;
  
          // Count gender
          if (genderKey === "0b5515fe-f761-42bd-94fd-d65a601140c9") males++;
          else if (genderKey === "c877e4e8-6e38-4a9f-88b4-0015ee59cfdf") females++;
          else if (genderKey === "32090d06-4d17-4c4c-9211-fd234b412194") genderSpectrums++;
  
          // Count race
          if (raceKey && raceMap[raceKey]) {
            raceCountsTemp[raceMap[raceKey]]++;
          }
        });
  
        setSFSUCount(sfsuCountTemp);
        setRoleCounts({ hackers, mentors, judges, volunteers, spectators });
        setGenderCounts({ male: males, female: females, spectrum: genderSpectrums });
        setApprovedUsers(approvedData);
        setRaceCounts(raceCountsTemp);
      } catch (error) {
        console.error("Error fetching approved users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApprovedUsers();
  }, []);
  

  const handleSelectUser = (id, user) => {
    setSelectedUsers((prev) => {
      const newSelected = { ...prev };
      if (newSelected[id]) {
        delete newSelected[id];
      } else if (Object.keys(newSelected).length < 10) {
        newSelected[id] = user;
      }
      return newSelected;
    });
  };

  const handleSendEmails = async () => {
    const requestData = Object.entries(selectedUsers).map(([id, user]) => ({
      key: id,
      email: user.data?.fields?.find((f) => f.key === "question_gaaLYM")?.value || "N/A",
    }));
  
    try {
      const response = await axios.post(`https://tallyserver-mpmt.onrender.com/generate-qrcodes`, { users: requestData });
      console.log("API Base URL:", process.env.API_URL);
      const updatedUsers = { ...approvedUsers };
  
      const updates = {}; // Object to store Firebase updates
  
      response.data.forEach(({ key, emailSucceeded }) => {
        if (updatedUsers[key]) {
          updatedUsers[key] = { ...updatedUsers[key], emailSucceeded };
          updates[`approved/${key}/emailSucceeded`] = emailSucceeded; // Prepare Firebase update
        }
      });
  
      // Update Firebase with emailSucceeded status for all users
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
  
      setApprovedUsers((prev) => ({ ...prev, ...updatedUsers }));
      setSelectedUsers({});
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading approved users...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Approved Participants</h1>
      
      {/* Role Counters */}
      <div className="text-lg text-center mb-4">
        <p><strong>Total Approved:</strong> {Object.keys(approvedUsers).length}</p>
        <p><strong>Hackers:</strong> {roleCounts.hackers}</p>
        <p><strong>Mentors:</strong> {roleCounts.mentors}</p>
        <p><strong>Judges:</strong> {roleCounts.judges}</p>
        <p><strong>Volunteers:</strong> {roleCounts.volunteers}</p>
        <p><strong>Spectators:</strong> {roleCounts.spectators}</p>
        <p><strong>SFSU:</strong> {sfsuCount}</p>
        <p><strong>Male:</strong> {genderCounts.male}</p>
        <p><strong>Female:</strong> {genderCounts.female}</p>
        <p><strong>Gender Spectrum:</strong> {genderCounts.spectrum}</p>
        <h2 className="text-xl font-semibold mt-4">Race Breakdown</h2>
  <p><strong>Black or African:</strong> {raceCounts.black}</p>
  <p><strong>Hispanic / Latino / Spanish Origin:</strong> {raceCounts.hispanic}</p>
  <p><strong>Middle Eastern or North African:</strong> {raceCounts.middleEastern}</p>
  <p><strong>American Indian or Alaskan Native:</strong> {raceCounts.nativeAmerican}</p>
  <p><strong>White:</strong> {raceCounts.white}</p>
  <p><strong>Pacific Islander:</strong> {raceCounts.pacificIslander}</p>
  <p><strong>Other (Please Specify):</strong> {raceCounts.other}</p>
  <p><strong>Prefer Not to Answer:</strong> {raceCounts.preferNotToAnswer}</p>
  <p><strong>Central Asian (e.g., Kazakhstan, Uzbekistan):</strong> {raceCounts.centralAsian}</p>
  <p><strong>East Asian (e.g., Chinese, Japanese, Korean):</strong> {raceCounts.eastAsian}</p>
  <p><strong>South Asian (e.g., Indian, Pakistani, Bangladeshi):</strong> {raceCounts.southAsian}</p>
  <p><strong>Southeast Asian (e.g., Filipino, Vietnamese, Indonesian):</strong> {raceCounts.southeastAsian}</p>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(approvedUsers).length === 0 ? (
          <p className="text-center text-gray-500">No approved participants found.</p>
        ) : (
          Object.entries(approvedUsers).map(([id, user]) => {
            const fullName =
              `${user.data?.fields?.find((f) => f.key === "question_1XXMD4")?.value || "Unknown"} ` +
              `${user.data?.fields?.find((f) => f.key === "question_MXXLvE")?.value || ""}`;
            const email = user.data?.fields?.find((f) => f.key === "question_gaaLYM")?.value || "N/A";
            const emailStatus = user.emailSucceeded;
            const roleee = user.data?.fields[3]?.value?.[0];
            let roleColor = "bg-white"
            if (roleee === "8f029033-3da1-486d-a30b-21b89f521ae1") roleColor = "bg-blue-500"; // Hacker
            else if (roleee === "6d765c6b-14f3-480e-9620-8daa7b4472e8") roleColor = "bg-green-500"; // Mentor
            else if (roleee === "8af8acda-7038-4781-86e8-1303ad345f71") roleColor = "bg-yellow-500"; // Judge
            else if (roleee === "f40e3753-e01e-4f46-b1f8-ebc2b8b28e01") roleColor = "bg-gray-500"; // Spectator
            else if (roleee === "76d197ad-8799-40ee-a737-ea8e2c607be5") roleColor = "bg-red-500"; // Vol
            let cardColor = "bg-white";

            if (emailStatus === false) cardColor = "bg-red-200";
            else if (emailStatus === true) cardColor = "bg-green-200";

            return (
              <div key={id} className={`${cardColor} shadow-lg p-4 rounded-lg flex items-center gap-4`}>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={!!selectedUsers[id]}
                  onChange={() => handleSelectUser(id, user)}
                  disabled={!selectedUsers[id] && Object.keys(selectedUsers).length >= 10}
                />
                
                <div>
                  <p><strong>Name:</strong> {fullName}</p>
                  <p><strong>Email:</strong> {email}</p>
                  
                  <button className={`mt-2 px-3 py-1 ${roleColor} text-white rounded-md`} onClick={() => setSelectedUser(user)}>
                    View Details
                  </button>
                  
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <button
        className="fixed bottom-5 right-5 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-lg disabled:bg-gray-300"
        onClick={handleSendEmails}
        disabled={Object.keys(selectedUsers).length === 0}
      >
        Send QR Codes
      </button>

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
