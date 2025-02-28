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

      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setScannedCodes(scannedCodes.concat([{ decodedText, decodedResult }]));
      // check if the code is a valid user id
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
      <ol>
        {scannedCodes.map((scannedCode, index) => (
          <li key={index}>{scannedCode.decodedText}</li>
        ))}
      </ol>

      {/* <button onClick={activateLasers}>Activate Lasers</button>
      {scannedUser && (
        <UserModal user={scannedUser} onClose={() => setSelectedUser(null)} />
      )} */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
