export interface QRCodeData {
  id: string;
  name: string;
  targetUrl: string;
  trackingUrl: string;
  createdAt: Date;
  totalScans: number;
  scans: ScanData[];
}

export interface ScanData {
  id: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

export interface AnalyticsData {
  totalScans: number;
  todayScans: number;
  weeklyScans: number;
  monthlyScans: number;
  scansByDate: { [date: string]: number };
  scansByHour: { [hour: string]: number };
}