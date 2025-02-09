import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ProfileViewsStatsProps {
  brandId: string;
}

interface ProfileViewsResponse {
  views: number;
}

const ProfileViewsStats: React.FC<ProfileViewsStatsProps> = ({ brandId }) => {
  const { accessToken } = useAuth();
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfileViews = async () => {
      try {
        const response = await axios.get<ProfileViewsResponse>(`http://localhost:3001/api/profile-views/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setViews(response.data.views);
      } catch (error) {
        console.error('Error fetching profile views:', error);
      }
    };

    fetchProfileViews();
  }, [brandId, accessToken]);

  if (views === null) {
    return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">Visitas al Perfil en los Últimos 7 Días</h3>
      <p>{views} visitas</p>
    </div>
  );
};

export default ProfileViewsStats;
