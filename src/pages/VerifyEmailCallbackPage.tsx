import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAccessToken, setRefreshToken } from '../utils/auth';

const VerifyEmailCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`http://localhost:3001/verify?token=${token}`)
        .then(async response => {
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.error || 'No se pudo verificar el correo. Intenta nuevamente.');
          }
          return responseData;
        })
        .then(data => {
          if (data.accessToken && data.refreshToken) {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            navigate('/home'); // Redirigir a la página de inicio
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
  }, [searchParams, navigate]);


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
