import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccessToken, logout } from '../utils/auth';

const DeleteAccount: React.FC = () => {
  const { logout } = useAuth();

  const handleDeleteAccount = () => {
    fetch(`http://localhost:3001/deleteAccount`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la cuenta.');
        }
        logout();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-2 rounded">
      Eliminar Cuenta
    </button>
  );
};

export default DeleteAccount;
