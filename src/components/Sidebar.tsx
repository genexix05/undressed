import React from 'react';
import { FaList, FaBell, FaBookmark } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <FaList size={20} />
          <span>Posts</span>
        </li>
        <li className="flex items-center space-x-2">
          <FaBell size={20} />
          <span>Notificaciones</span>
        </li>
        <li className="flex items-center space-x-2">
          <FaBookmark size={20} />
          <span>Guardados</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
