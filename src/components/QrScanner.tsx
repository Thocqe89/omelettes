import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

interface ScanQRProps {
  onScan: (id: string) => void; // Callback function to pass the scanned ID
}

const ScanQR: React.FC<ScanQRProps> = ({ onScan }) => {
  const { t } = useTranslation();
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanResult, setScanResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Add error state

  // Handle QR code scanning from camera
  const handleQrScan = useCallback((result: any) => {
    if (result) {
      const id = result.getText();
      console.log("Scanned ID (Camera):", id);
      setScanResult(id);
      onScan(id); // Pass the ID to the parent component
      setUseCamera(false); // Turn off camera after successful scan
      setError(null); // Clear any previous error
    }
  }, [onScan]);

  // Handle image upload for QR code extraction
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        setError(t('canvas_context_error') || 'Could not get canvas context.');
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode?.data) {
        const scannedId = qrCode.data;
        console.log('Scanned ID (Image):', scannedId);
        onScan(scannedId); // Pass the ID to the parent component
        setError(null); // Clear any previous error
      } else {
        const errorMessage = t('no_qr_code_found') || '❌ No QR code found in the uploaded image.';
        setError(errorMessage);
        alert(errorMessage); // Keep the alert for user feedback
      }

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      const errorMessage = t('failed_to_load_image') || '⚠️ Failed to load image. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
      URL.revokeObjectURL(objectUrl);
    };
  }, [onScan, t]);

//   const handleCameraError = useCallback((err: any) => {
//     console.error('QR Reader Error:', err);
//     const errorMessage = t('camera_error', { error: err.message }) || `Camera error: ${err.message}`;
//     setError(errorMessage);
//     alert(errorMessage); // Show error to user
//     setUseCamera(false);
//   }, [t]);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setUseCamera(true);
            setError(null); // Clear error when opening camera
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📷 {t('use_camera') || 'Use Camera'}
        </button>
        <button
          onClick={() => {
            fileInputRef.current?.click();
            setError(null); // Clear error when opening file input
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🖼️ {t('upload_image') || 'Import Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Camera Scanner */}
      {useCamera && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%' }}
            onResult={handleQrScan}
           
          />
          <div className="text-center text-sm font-medium text-gray-500">
            {t('scanned_result')}: {scanResult || 'N/A'}
          </div>
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ScanQR;
