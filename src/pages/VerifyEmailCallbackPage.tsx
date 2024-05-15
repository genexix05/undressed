import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAccessToken, setRefreshToken } from '../utils/auth';

const VerifyEmailCallbackPage: React.FC = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`http://localhost:3001/verify?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.accessToken && data.refreshToken) {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            navigate('/home'); // Redirigir a la página de inicio
          } else {
            alert('No se pudo verificar el correo. Intenta nuevamente.');
          }
        })
        .catch(() => {
          alert('Error al verificar el correo.');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Verificando correo...</h2>
    </div>
  );
}

export default VerifyEmailCallbackPage;
