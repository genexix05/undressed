import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BrandProfile: React.FC = () => {
  const { brandId, accessToken } = useAuth();
  const [brandData, setBrandData] = useState<any>(null);
  const [followers, setFollowers] = useState<number>(0);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/brand/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBrandData(response.data);

        // Fetch followers
        const followersResponse = await axios.get(`http://localhost:3001/api/brand/${brandId}/followers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setFollowers(followersResponse.data.followers);
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
    <div className="p-10">
      <div className="p-8 bg-white shadow mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">{followers}</p>
              <p className="text-gray-400">Seguidores</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{brandData.postsCount}</p>
              <p className="text-gray-400">Publicaciones</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{brandData.likesCount}</p>
              <p className="text-gray-400">Likes</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <img src={`http://localhost:3001${brandData.logo}`} alt="Brand Logo" className="w-48 h-48 rounded-full" />
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Follow
            </button>
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Compartir
            </button>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">{brandData.name}</h1>
          <p className="font-light text-gray-600 mt-3">{brandData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
