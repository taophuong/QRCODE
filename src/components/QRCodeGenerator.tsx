import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Plus, Download, Link } from 'lucide-react';
import { QRCodeData } from '../types';

interface QRCodeGeneratorProps {
  onQRCodeCreated: (qrCode: QRCodeData) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodeCreated }) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!name.trim() || !targetUrl.trim()) return;

    setIsGenerating(true);
    
    try {
      const qrCodeId = Date.now().toString();
      const trackingUrl = `${window.location.origin}/track/${qrCodeId}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        }
      });

      const newQRCode: QRCodeData = {
        id: qrCodeId,
        name: name.trim(),
        targetUrl: targetUrl.trim(),
        trackingUrl,
        createdAt: new Date(),
        totalScans: 0,
        scans: []
      };

      setQrDataUrl(qrCodeDataUrl);
      onQRCodeCreated(newQRCode);
      
      // Reset form
      setName('');
      setTargetUrl('');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${name || 'download'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const copyTrackingUrl = () => {
    if (!qrDataUrl) return;
    
    const qrCodeId = Date.now().toString();
    const trackingUrl = `${window.location.origin}/track/${qrCodeId}`;
    navigator.clipboard.writeText(trackingUrl);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tạo QR Code Mới</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Tên QR Code
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Website chính thức"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              URL đích
            </label>
            <input
              type="url"
              id="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={generateQRCode}
            disabled={!name.trim() || !targetUrl.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {isGenerating ? 'Đang tạo...' : 'Tạo QR Code'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          {qrDataUrl ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <img src={qrDataUrl} alt="Generated QR Code" className="mx-auto rounded-lg" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
                <button
                  onClick={copyTrackingUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                  Copy URL
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <p>QR Code sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};