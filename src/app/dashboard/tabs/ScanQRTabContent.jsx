import Modal from "@/app/components/Modal";
import { checkInAcceptedUser, fetchAcceptedUser } from "@/app/utils/checkIn";
import { ref, onValue } from "firebase/database";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import { db } from "../../../../config";

export default function ScanQRCodeTabContent() {
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [scannedApp, setScannedApp] = useState(null);
  const [scannedUserId, setScannedUserId] = useState(null);

  const [buttonMessage, setButtonMessage] = useState("Check-In");
  const [isCheckInButtonDisabled, setCheckInButtonDisabled] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [checkInCount, setCheckInCount] = useState(0);

  const qrScannerRef = useRef(null);

  // Initialize scanner
  useEffect(() => {
    if (!qrScannerRef.current) {
      qrScannerRef.current = new Html5QrcodeScanner("reader", {
        fps: 5,
        qrbox: { width: 250, height: 250 }
      });
    }

    return () => {
      if (qrScannerRef.current) {
        console.log("Stopping scanner and releasing camera...");
        qrScannerRef.current.clear();
      }
    };
  }, []);

  // Pause scanner while modal is open
  useEffect(() => {
    if (!qrScannerRef.current) return;

    if (isModalVisible && !qrScannerRef.current.isPaused) {
      qrScannerRef.current.pause();
      qrScannerRef.current.isPaused = true;
    } else if (!isModalVisible && qrScannerRef.current.isPaused) {
      qrScannerRef.current.resume();
      qrScannerRef.current.isPaused = false;
    }
  }, [isModalVisible]);

  // Listen for check-in count
  useEffect(() => {
    const countRef = ref(db, "checkInCount");

    const unsubscribe = onValue(countRef, (snapshot) => {
      const value = snapshot.val();
      setCheckInCount(value || 0);
    });

    return () => unsubscribe();
  }, []);

  // QR scan handler
  useEffect(() => {
    if (!qrScannerRef.current) return;

    qrScannerRef.current.render(onScanSuccess, onScanFailure);

    async function onScanSuccess(decodedText, decodedResult) {
      // 🔥 sanitize QR value
      const cleanUserId = String(decodedText).trim();

      console.log(`Scan success`, {
        raw: decodedText,
        cleaned: cleanUserId,
        rawLength: String(decodedText).length,
        trimmedLength: cleanUserId.length,
        decodedResult
      });

      setScannedCodes(prev =>
        prev.concat([{ decodedText: cleanUserId, decodedResult }])
      );

      setScannedUserId(cleanUserId);

      const response = await fetchAcceptedUser(cleanUserId);

      if (response === 2) {
        setButtonMessage("Error fetching applicant.");
        setCheckInButtonDisabled(true);
        setErrorType(2);
        setModalVisible(true);
        return;
      }

      if (response === -1) {
        setButtonMessage("Applicant not found.");
        setCheckInButtonDisabled(true);
        setErrorType(-1);
        setModalVisible(true);
        return;
      }

      setScannedApp(response);
      setErrorType(null);

      if (response.checkedIn === true) {
        setButtonMessage("Already Checked-In");
        setCheckInButtonDisabled(true);
        setModalVisible(true);
        return;
      }

      setButtonMessage("Check-In");
      setCheckInButtonDisabled(false);
      setModalVisible(true);
    }

    function onScanFailure(error) {
      console.warn("Scan error:", error);
    }
  }, []);

  // Check-in action
  const checkInApp = async () => {
    if (!scannedUserId) return;

    const cleanUserId = String(scannedUserId).trim();

    setCheckInButtonDisabled(true);
    setButtonMessage("Checking in...");

    const response = await checkInAcceptedUser(cleanUserId);

    if (response === 2) {
      setButtonMessage("Error checking in.");
      return;
    }

    if (response === 1) {
      setButtonMessage("Already Checked-In");
      return;
    }

    if (response === -1) {
      setButtonMessage("Applicant not found.");
      return;
    }

    setButtonMessage("Checked-In");
  };

  const firstName = scannedApp?.first_name || "Unknown";
  const lastName = scannedApp?.last_name || "";
  const email = scannedApp?.email || "N/A";

  return (
    <div className="flex flex-col items-center h-full-s">
      <div id="reader" className="w-96"></div>

      <p className="text-lg font-semibold mt-4">
        {checkInCount} people checked in
      </p>

      {isModalVisible && (
        <Modal onCloseCallBack={() => setModalVisible(false)}>
          {errorType === -1 ? (
            <div className="flex justify-center">Applicant not found</div>
          ) : errorType === 2 ? (
            <div className="flex justify-center">Error fetching applicant</div>
          ) : (
            <div className="min-w-72">
              <h2 className="text-2xl font-bold mb-2">
                {firstName} {lastName}
              </h2>

              <p className="mb-4">
                <strong>Email:</strong> {email}
              </p>

              <p className="mb-4 break-all text-xs text-gray-500">
                <strong>User ID:</strong> {scannedUserId || "N/A"}
              </p>

              <div className="w-full mt-4 space-y-2">
                <button
                  disabled={isCheckInButtonDisabled}
                  onClick={() => void checkInApp()}
                  className={
                    !isCheckInButtonDisabled
                      ? "flex w-full justify-center bg-green-500 text-white py-4 rounded-md hover:bg-green-600 mr-2"
                      : "flex w-full justify-center bg-gray-100 text-gray-400 py-4 rounded-md mr-2"
                  }
                >
                  {buttonMessage}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}