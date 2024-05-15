// src/pages/VerifyEmailPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`http://localhost:3001/verify?token=${token}`)
        .then((response) => {
          if (response.ok) {
            navigate('/email-verified');
          }
        })
        .catch(() => {
          alert('Error al verificar el correo.');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Correo enviado.Verificando correo...</h2>
    </div>
  );
}

export default VerifyEmailPage;
