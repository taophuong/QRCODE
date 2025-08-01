import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { QRCodeData, AnalyticsData } from '../types';
import { generateAnalytics } from '../utils/analytics';
import { ArrowLeft, TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsDashboardProps {
  qrCode: QRCodeData;
  onBack: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ qrCode, onBack }) => {
  const analytics = generateAnalytics(qrCode);

  const dailyChartData = {
    labels: Object.keys(analytics.scansByDate).map(date => format(new Date(date), 'dd/MM')),
    datasets: [
      {
        label: 'Lượt quét theo ngày',
        data: Object.values(analytics.scansByDate),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const hourlyChartData = {
    labels: Object.keys(analytics.scansByHour).map(hour => `${hour}:00`),
    datasets: [
      {
        label: 'Lượt quét theo giờ',
        data: Object.values(analytics.scansByHour),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const recentScans = qrCode.scans
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{qrCode.name}</h1>
              <p className="text-gray-600">{qrCode.targetUrl}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{analytics.totalScans}</div>
            <div className="text-sm text-gray-500">Tổng lượt quét</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.todayScans}</div>
              <div className="text-sm text-gray-500">Hôm nay</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.weeklyScans}</div>
              <div className="text-sm text-gray-500">Tuần này</div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.monthlyScans}</div>
              <div className="text-sm text-gray-500">Tháng này</div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {qrCode.scans.length > 0 ? format(qrCode.scans[qrCode.scans.length - 1].timestamp, 'HH:mm') : '--:--'}
              </div>
              <div className="text-sm text-gray-500">Quét gần nhất</div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lượt quét theo ngày (30 ngày gần nhất)</h3>
          <Bar data={dailyChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lượt quét theo giờ trong ngày</h3>
          <Line data={hourlyChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử quét gần đây</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentScans.length > 0 ? (
            recentScans.map((scan) => (
              <div key={scan.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {format(scan.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                    </div>
                    <div className="text-sm text-gray-500">ID: {scan.id}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Chưa có lịch sử quét
            </div>
          )}
        </div>
      </div>
    </div>
  );
};