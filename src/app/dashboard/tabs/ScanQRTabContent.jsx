import Modal from "@/app/components/Modal";
import {
  checkInApprovedApplication,
  fetchApprovedApplication,
} from "@/app/utils/checkIn";
import { set } from "firebase/database";
import { Html5QrcodeScanner } from "html5-qrcode";
import { use, useEffect, useState, useRef } from "react";

export default function ScanQRCodeTabContent() {
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [scannedApp, setScannedApp] = useState(null);
  const [buttonMessage, setButtonMessage] = useState("Check-In");
  const [isCheckInButtonDisabled, setCheckInButtonDisabled] = useState(false);
  const [isLoadingAppData, setLoadingAppData] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (!qrScannerRef.current) {
      qrScannerRef.current = new Html5QrcodeScanner("reader", {
        fps: 5,
        qrbox: { width: 250, height: 250 },
      });
    }

    return () => {
      if (qrScannerRef.current) {
        console.log("Stopping scanner and releasing camera...");
        qrScannerRef.current.clear();
      }
    };
  }, []);

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

  useEffect(() => {
    qrScannerRef.current.render(onScanSuccess, onScanFailure);

    async function onScanSuccess(decodedText, decodedResult) {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setScannedCodes(scannedCodes.concat([{ decodedText, decodedResult }]));

      const response = await fetchApprovedApplication(decodedText);
      if (response === 2) {
        setButtonMessage("There was an error getting application details.");
        setCheckInButtonDisabled(true);
        setErrorType(response);
        setModalVisible(true);
        return;
      } else if (response === -1) {
        setButtonMessage("Application not found.");
        setCheckInButtonDisabled(true);
        setErrorType(response);
        setModalVisible(true);
        return;
      }

      setScannedApp(response);
      setErrorType(null);

      if (response.checkedIn) {
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
      console.warn(`Code scan error = ${error}`);
    }
  }, []);

  const checkInApp = async () => {
    setCheckInButtonDisabled(true);
    setButtonMessage("Checking in...");

    const response = await checkInApprovedApplication(scannedApp.id);
    if (response === 2) {
      setButtonMessage("Error checking in.");
      setCheckInButtonDisabled(true);
      return;
    }

    if (response === 1) {
      setButtonMessage("Already Checked-In");
      setCheckInButtonDisabled(true);
      return;
    }

    if (response === -1) {
      setButtonMessage("No application found.");
      setCheckInButtonDisabled(true);
      return;
    }

    setButtonMessage("Checked-In");
    setCheckInButtonDisabled(true);
  };

  return (
    <div className="flex flex-col items-center h-full-s">
      <div id="reader" className="w-96"></div>

      {isModalVisible && (
        <Modal onCloseCallBack={() => setModalVisible(false)}>
          {errorType == -1 ? (
            <div className="flex justify-center">Application not found</div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {scannedApp.data.fields.find((f) => f.key === "question_1XXMD4")
                  ?.value || "Unknown"}{" "}
                {scannedApp.data.fields.find((f) => f.key === "question_MXXLvE")
                  ?.value || ""}
              </h2>
              <p>
                <strong>Role:</strong>{" "}
                {scannedApp.data.fields
                  .find((f) => f.key === "question_prrGRy")
                  ?.options?.find(
                    (option) =>
                      option.id ===
                      scannedApp.data.fields.find(
                        (f) => f.key === "question_prrGRy"
                      )?.value?.[0]
                  )?.text || "N/A"}
              </p>
              <div className="w-full mt-4 space-y-2">
                <button
                  disabled={isCheckInButtonDisabled}
                  onClick={async () => {
                    checkInApp();
                  }}
                  className={
                    !isCheckInButtonDisabled
                      ? "flex w-full justify-center bg-green-500 text-white py-4 rounded-md hover:bg-green-600 mr-2"
                      : "flex w-full justify-center bg-gray-100 text-gray-400 py-4 rounded-md  mr-2"
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
