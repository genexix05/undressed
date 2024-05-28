import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaBell, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { accessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/notifications/unread/count', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUnreadCount(response.data.unreadCount);
      } catch (err) {
        console.error('Error fetching unread notifications count:', err);
      }
    };

    fetchUnreadCount();
  }, [accessToken]);

  const displayUnreadCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="bg-white shadow-md rounded-lg justify-center items-center mt-12 p-6">
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <FaList size={20} />
          <Link to="/home">Publicaciones</Link>
        </li>
        <span className="block border-t w-full"></span>
        <li className="flex items-center space-x-2">
          <FaList size={20} />
          <Link to="/home/following">Siguiendo</Link>
        </li>
        <span className="block border-t w-full"></span>
        <li className="flex items-center space-x-2 relative">
          <FaBell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {displayUnreadCount}
            </span>
          )}
          <Link to="/home/notifications" className="ml-6">Notificaciones</Link>
        </li>
        <span className="block border-t w-full"></span>
        <li className="flex items-center space-x-2">
          <FaBookmark size={20} />
          <Link to="/home/saved">Guardados</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
