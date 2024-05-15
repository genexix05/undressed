import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [auth, setAuth] = useState<{ accessToken: string | null }>({ accessToken: localStorage.getItem('accessToken') });
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token available');
      
      const response = await fetch('http://localhost:3001/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        setAuth({ accessToken: data.accessToken });
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000); // Renueva el token cada 15 minutos
    return () => clearInterval(interval);
  }, [refreshToken]);

  return { auth, setAuth, refreshToken };
};

export default useAuth;
