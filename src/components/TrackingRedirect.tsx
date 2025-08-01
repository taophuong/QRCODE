import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQRCodes, updateQRCode } from '../utils/storage';
import { ScanData } from '../types';

export const TrackingRedirect: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();

  useEffect(() => {
    if (!qrCodeId) return;

    const qrCodes = getQRCodes();
    const qrCode = qrCodes.find(qr => qr.id === qrCodeId);

    if (qrCode) {
      // Add scan data
      const newScan: ScanData = {
        id: Date.now().toString(),
        timestamp: new Date(),
        userAgent: navigator.userAgent,
      };

      const updatedQRCode = {
        ...qrCode,
        totalScans: qrCode.totalScans + 1,
        scans: [...qrCode.scans, newScan]
      };

      updateQRCode(updatedQRCode);

      // Redirect to target URL
      window.location.href = qrCode.targetUrl;
    } else {
      // QR Code not found, redirect to main app
      window.location.href = '/';
    }
  }, [qrCodeId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang chuyển hướng...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};