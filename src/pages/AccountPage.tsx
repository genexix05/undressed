import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccessToken, getRefreshToken, removeTokens } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { logout, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    date: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    fetch('http://localhost:3001/me', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setUserInfo(data))
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch('http://localhost:3001/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Error updating user info'); });
        }
        return response.json();
      })
      .then(data => {
        alert('Información actualizada correctamente');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleLogout = () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      alert('No refresh token available');
      return;
    }

    fetch('http://localhost:3001/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cerrar la sesión');
        }
        removeTokens();
        logout();
        navigate('/login');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleDeleteAccount = () => {
    fetch('http://localhost:3001/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la cuenta');
        }
        removeTokens();
        logout();
        navigate('/register');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div className="bg-white h-3/5 max-w-lg mx-auto mt-4 p-6 shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Mi Cuenta</h2>
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Apellido</label>
        <input
          type="text"
          name="surname"
          value={userInfo.surname}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Nombre de Usuario</label>
        <input
          type="text"
          name="username"
          value={userInfo.username}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex space-x-3">
        <button onClick={handleUpdate} className="bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Actualizar
        </button>
        <button onClick={handleLogout} className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Cerrar Sesión
        </button>
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
