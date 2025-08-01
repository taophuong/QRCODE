import React from 'react';
import { QRCodeData } from '../types';
import { Eye, Trash2, ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface QRCodeListProps {
  qrCodes: QRCodeData[];
  onViewAnalytics: (qrCode: QRCodeData) => void;
  onDelete: (id: string) => void;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({ qrCodes, onViewAnalytics, onDelete }) => {
  if (qrCodes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có QR Code nào</h3>
        <p className="text-gray-500">Tạo QR Code đầu tiên để bắt đầu theo dõi analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Danh sách QR Code</h2>
        <p className="text-gray-600 mt-1">Quản lý và theo dõi các QR Code của bạn</p>
      </div>

      <div className="divide-y divide-gray-100">
        {qrCodes.map((qrCode) => (
          <div key={qrCode.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{qrCode.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {qrCode.totalScans} lượt quét
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate max-w-xs">{qrCode.targetUrl}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(qrCode.createdAt, 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewAnalytics(qrCode)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  Xem analytics
                </button>
                <button
                  onClick={() => onDelete(qrCode.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};