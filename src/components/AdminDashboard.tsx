import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface AdminStats {
  totalUsers: number;
  totalVisits: number;
  last7DaysVisits: { date: string, count: number }[];
  last30DaysVisits: { date: string, count: number }[];
}

const AdminDashboard: React.FC = () => {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVisits: 0,
    last7DaysVisits: [],
    last30DaysVisits: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/admin/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [accessToken]);

  const visits7DaysData = {
    labels: stats.last7DaysVisits.map(visit => visit.date),
    datasets: [
      {
        label: 'Visitas en los últimos 7 días',
        data: stats.last7DaysVisits.map(visit => visit.count),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.5)',
        fill: true,
      },
    ],
  };

  const visits30DaysData = {
    labels: stats.last30DaysVisits.map(visit => visit.date),
    datasets: [
      {
        label: 'Visitas en los últimos 30 días',
        data: stats.last30DaysVisits.map(visit => visit.count),
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.5)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 text-center w-1/3">
          <h3 className="text-xl font-bold">Total Usuarios</h3>
          <p className="text-3xl">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center w-1/3">
          <h3 className="text-xl font-bold">Visitas Totales</h3>
          <p className="text-3xl">{stats.totalVisits.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Visitas en los últimos 30 días</h3>
          <Bar data={visits30DaysData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Visitas en los últimos 7 días</h3>
          <Line data={visits7DaysData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
