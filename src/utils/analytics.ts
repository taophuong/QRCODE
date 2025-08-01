import { QRCodeData, AnalyticsData, ScanData } from '../types';
import { format, startOfDay, startOfWeek, startOfMonth, isAfter, subDays } from 'date-fns';

export const generateAnalytics = (qrCode: QRCodeData): AnalyticsData => {
  const now = new Date();
  const today = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const todayScans = qrCode.scans.filter(scan => 
    isAfter(scan.timestamp, today)
  ).length;

  const weeklyScans = qrCode.scans.filter(scan => 
    isAfter(scan.timestamp, weekStart)
  ).length;

  const monthlyScans = qrCode.scans.filter(scan => 
    isAfter(scan.timestamp, monthStart)
  ).length;

  // Group scans by date (last 30 days)
  const scansByDate: { [date: string]: number } = {};
  for (let i = 29; i >= 0; i--) {
    const date = subDays(now, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    scansByDate[dateKey] = qrCode.scans.filter(scan => 
      format(scan.timestamp, 'yyyy-MM-dd') === dateKey
    ).length;
  }

  // Group scans by hour (24 hours)
  const scansByHour: { [hour: string]: number } = {};
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    scansByHour[hour] = qrCode.scans.filter(scan => 
      scan.timestamp.getHours() === i
    ).length;
  }

  return {
    totalScans: qrCode.totalScans,
    todayScans,
    weeklyScans,
    monthlyScans,
    scansByDate,
    scansByHour
  };
};

export const addScanToQRCode = (qrCodeId: string): void => {
  // This would be called from the tracking URL
  const event = new CustomEvent('qr-scan', { 
    detail: { qrCodeId, timestamp: new Date() }
  });
  window.dispatchEvent(event);
};