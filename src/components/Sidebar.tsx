import React from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaBell, FaBookmark } from 'react-icons/fa';

const Sidebar: React.FC = () => {
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
        <li className="flex items-center space-x-2">
          <FaBell size={20} />
          <Link to="/home/notifications">Notificaciones</Link>
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
