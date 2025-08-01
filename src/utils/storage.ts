import { QRCodeData } from '../types';

const STORAGE_KEY = 'qr_codes_data';

export const getQRCodes = (): QRCodeData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  return JSON.parse(data).map((qr: any) => ({
    ...qr,
    createdAt: new Date(qr.createdAt),
    scans: qr.scans.map((scan: any) => ({
      ...scan,
      timestamp: new Date(scan.timestamp)
    }))
  }));
};

export const saveQRCodes = (qrCodes: QRCodeData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qrCodes));
};

export const addQRCode = (qrCode: QRCodeData): void => {
  const qrCodes = getQRCodes();
  qrCodes.push(qrCode);
  saveQRCodes(qrCodes);
};

export const updateQRCode = (updatedQRCode: QRCodeData): void => {
  const qrCodes = getQRCodes();
  const index = qrCodes.findIndex(qr => qr.id === updatedQRCode.id);
  if (index !== -1) {
    qrCodes[index] = updatedQRCode;
    saveQRCodes(qrCodes);
  }
};

export const deleteQRCode = (id: string): void => {
  const qrCodes = getQRCodes();
  const filtered = qrCodes.filter(qr => qr.id !== id);
  saveQRCodes(filtered);
};