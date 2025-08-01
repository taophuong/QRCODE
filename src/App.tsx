import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { QRCodeList } from './components/QRCodeList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TrackingRedirect } from './components/TrackingRedirect';
import { QRCodeData } from './types';
import { getQRCodes, addQRCode, deleteQRCode, updateQRCode } from './utils/storage';
import { QrCode, BarChart3, Settings } from 'lucide-react';

type View = 'main' | 'analytics';

function MainApp() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [currentView, setCurrentView] = useState<View>('main');
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeData | null>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  useEffect(() => {
    // Listen for scan events
    const handleScan = (event: CustomEvent) => {
      const { qrCodeId, timestamp } = event.detail;
      const qrCode = qrCodes.find(qr => qr.id === qrCodeId);
      
      if (qrCode) {
        const newScan = {
          id: Date.now().toString(),
          timestamp,
          userAgent: navigator.userAgent,
        };

        const updatedQRCode = {
          ...qrCode,
          totalScans: qrCode.totalScans + 1,
          scans: [...qrCode.scans, newScan]
        };

        updateQRCode(updatedQRCode);
        loadQRCodes(); // Refresh the list
      }
    };

    window.addEventListener('qr-scan', handleScan as EventListener);
    return () => window.removeEventListener('qr-scan', handleScan as EventListener);
  }, [qrCodes]);

  const loadQRCodes = () => {
    const codes = getQRCodes();
    setQRCodes(codes);
  };

  const handleQRCodeCreated = (qrCode: QRCodeData) => {
    addQRCode(qrCode);
    loadQRCodes();
  };

  const handleViewAnalytics = (qrCode: QRCodeData) => {
    setSelectedQRCode(qrCode);
    setCurrentView('analytics');
  };

  const handleBack = () => {
    setCurrentView('main');
    setSelectedQRCode(null);
    loadQRCodes(); // Refresh data when returning
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa QR Code này?')) {
      deleteQRCode(id);
      loadQRCodes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'main' && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-2xl">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">QR Analytics Pro</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tạo QR code động với tính năng theo dõi chi tiết số lượt quét và phân tích thời gian thực
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{qrCodes.length}</div>
                    <div className="text-sm text-gray-500">QR Codes</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {qrCodes.reduce((total, qr) => total + qr.totalScans, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Tổng lượt quét</div>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {qrCodes.reduce((total, qr) => total + qr.totalScans, 0) > 0 
                        ? Math.round(qrCodes.reduce((total, qr) => total + qr.totalScans, 0) / qrCodes.length)
                        : 0}
                    </div>
                    <div className="text-sm text-gray-500">Trung bình/QR</div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <QRCodeGenerator onQRCodeCreated={handleQRCodeCreated} />
              <QRCodeList 
                qrCodes={qrCodes} 
                onViewAnalytics={handleViewAnalytics}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}

        {currentView === 'analytics' && selectedQRCode && (
          <AnalyticsDashboard 
            qrCode={selectedQRCode} 
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/track/:qrCodeId" element={<TrackingRedirect />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

export default App;