import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmailCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`http://localhost:3001/verify?token=${token}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo verificar el correo. Intenta nuevamente.');
          }
          return response.url;
        })
        .then(redirectUrl => {
          const url = new URL(redirectUrl);
          const accessToken = url.searchParams.get('accessToken');
          const refreshToken = url.searchParams.get('refreshToken');
          if (accessToken && refreshToken) {
            login(accessToken, refreshToken);
            navigate('/home');
          } else {
            alert('No se pudo verificar el correo. Intenta nuevamente.');
          }
        })
        .catch(error => {
          alert(error.message);
        });
    } else {
      alert('No se proporcionó token.');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800">
          Verificando correo...
        </h1>
      </div>
    </div>
  );
};

export default VerifyEmailCallbackPage;
