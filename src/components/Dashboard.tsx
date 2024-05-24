import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { brandId, accessToken } = useAuth();
  const [stats, setStats] = useState({
    likes: 0,
    savedItems: 0,
    totalVisits: 0,
    last7DaysVisits: [],
    last30DaysVisits: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!brandId) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/brand/${brandId}/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [brandId, accessToken]);

  const visits7DaysData = {
    labels: stats.last7DaysVisits?.map((visit: any) => visit.date) || [],
    datasets: [
      {
        label: 'Visitas en los últimos 7 días',
        data: stats.last7DaysVisits?.map((visit: any) => visit.count) || [],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.5)',
        fill: true,
      },
    ],
  };

  const visits30DaysData = {
    labels: stats.last30DaysVisits?.map((visit: any) => visit.date) || [],
    datasets: [
      {
        label: 'Visitas en los últimos 30 días',
        data: stats.last30DaysVisits?.map((visit: any) => visit.count) || [],
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
          <h3 className="text-xl font-bold">Likes</h3>
          <p className="text-3xl">{stats.likes?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center w-1/3">
          <h3 className="text-xl font-bold">Productos Guardados</h3>
          <p className="text-3xl">{stats.savedItems?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center w-1/3">
          <h3 className="text-xl font-bold">Visitas Totales</h3>
          <p className="text-3xl">{stats.totalVisits?.toLocaleString() || 0}</p>
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

export default Dashboard;
