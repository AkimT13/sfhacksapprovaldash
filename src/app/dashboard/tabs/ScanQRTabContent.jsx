import Modal from "@/app/components/Modal";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function ScanQRCodeTabContent() {
  const [scannedCodes, setScannedCodes] = useState([]);

  function activateLasers() {
    var decodedText = "asdf";
    var decodedResult = "asdfasdfasdf";
    console.log(scannedCodes);

    setScannedCodes(scannedCodes.concat([{ decodedText, decodedResult }]));
  }

  useEffect(() => {
    let html5QrcodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    async function onScanSuccess(decodedText, decodedResult) {
      html5QrcodeScanner.pause();
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setScannedCodes(scannedCodes.concat([{ decodedText, decodedResult }]));

      // TODO check if the code is a valid user id
    }

    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      console.warn(`Code scan error = ${error}`);
    }
  });

  return (
    <div className="flex flex-col items-center h-full-s">
      <div id="reader" className="w-96"></div>

      <Modal>
        <div className="flex justify-center"></div>
        <h2 className="text-2xl font-bold mb-4">Odera Nwosu</h2>
        <p>
          <strong>Judge</strong>
        </p>
        <div className="w-full mt-4 space-y-2">
          <button className="flex w-full justify-center bg-green-500 text-white py-4 rounded-md hover:bg-green-600 mr-2">
            Check-In
          </button>
        </div>
      </Modal>
    </div>
  );
}
