import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecentPosts from './RecentPosts';
import BrandInfo from './BrandInfo';
import ProfileViewsStats from './ProfileViewsStats';

const Dashboard: React.FC = () => {
  const { brandId, accessToken } = useAuth();
  const [brandData, setBrandData] = useState<any>(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/brand/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBrandData(response.data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
      }
    };

    fetchBrandData();
  }, [brandId, accessToken]);

  if (!brandData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <BrandInfo brandData={brandData} />
      {brandId && <RecentPosts brandId={brandId} />}
      {brandId && <ProfileViewsStats brandId={brandId} />}
    </div>
  );
};

export default Dashboard;
