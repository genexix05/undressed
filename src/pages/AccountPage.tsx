import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getAccessToken, getRefreshToken, removeTokens } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { logout, isAuthenticated, userRole } = useAuthContext();
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
    <div className="max-w-lg mx-auto my-10 p-5 border rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Mi Cuenta</h2>
      <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Apellido</label>
        <input
          type="text"
          name="surname"
          value={userInfo.surname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Fecha de Nacimiento</label>
        <input
          type="date"
          name="date"
          value={userInfo.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Nombre de Usuario</label>
        <input
          type="text"
          name="username"
          value={userInfo.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
          <p>Role: {userRole}</p>
          <p>You are logged in.</p>
        </div>
      <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mr-2">
        Actualizar Información
      </button>
      <button onClick={handleLogout} className="bg-yellow-500 text-white p-2 rounded mr-2">
        Cerrar Sesión
      </button>
      <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-2 rounded">
        Eliminar Cuenta
      </button>
    </div>
  );
};

export default AccountPage;
